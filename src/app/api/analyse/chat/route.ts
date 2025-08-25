import {
  AnalysisEntities,
  ChatAnalysisResult,
  ChatExtractedSignals,
  ProviderConfigSchema,
  callLLMWithFallback,
  handleApiError,
  mergeAnalysisResults,
} from '@/lib/api/analyser-utils';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export const runtime = 'nodejs';
export const maxDuration = 20;

/* ----------------------------- Input Schema ---------------------------- */

const InputSchema = z.object({
  text: z.string().min(10),
  useLlm: z.boolean().optional().default(false),
  providerConfig: ProviderConfigSchema.optional(),
});

/* ------------------------- Entities (básico regex) --------------------- */

function extractEntities(text: string): AnalysisEntities {
  const urls = [...text.matchAll(/\bhttps?:\/\/[^\s)]+/gi)].map((m) => m[0]);
  const emails = [
    ...text.matchAll(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi),
  ].map((m) => m[0].toLowerCase());
  return { emails, urls, wallets: [] };
}

/* ---------------------- Señales extra (preFlags) ----------------------- */
/** Pistas rápidas por regex que NO reemplazan al LLM; le dan contexto. */

function extractChatSignals(text: string): ChatExtractedSignals {
  const entities = extractEntities(text);
  const preFlags = new Set<string>();

  if (
    /\b(clone|git clone|npm\s+install|yarn\s+install|run\s+(the)?\s*repo)\b/i.test(
      text
    )
  ) {
    preFlags.add('asks_to_run_code');
  }
  if (
    /send (me )?(your )?(github|gitlab).*(invite|invitation)|i will send you an invitation/i.test(
      text
    )
  ) {
    preFlags.add('repo_invite_before_screening');
  }
  if (
    /deployed|demo|landing/i.test(text) &&
    /(wasn'?t deployed|no demo)/i.test(text)
  ) {
    preFlags.add('no_deployed_demo');
  }
  if (/(gmail\.com|outlook\.com|proton\.me|yahoo\.com)/i.test(text)) {
    preFlags.add('non_corporate_email');
  }
  if (
    /salary|rate/i.test(text) &&
    /what is your salary expectation\??/i.test(text)
  ) {
    preFlags.add('salary_upfront_unstructured');
  }
  if (/skip|no need|we can bypass.*(interview|process)/i.test(text)) {
    preFlags.add('skips_interview_steps');
  }
  if (/seed|mnemonic|private\s*key|wallet/i.test(text)) {
    preFlags.add('web3_targeting');
  }
  if (/send.*(api|ssh|token|key|password)/i.test(text)) {
    preFlags.add('requests_secrets');
  }
  if (/\b(asap|immediately|right now|urgent)\b/i.test(text)) {
    preFlags.add('urgency_pressure');
  }
  if (
    /we'?ve already developed the mvp/i.test(text) &&
    /(wasn'?t deployed|not deployed)/i.test(text)
  ) {
    preFlags.add('inconsistent_story');
  }
  if (/base64|atob|new Function|eval/i.test(text)) {
    preFlags.add('rce_pattern_reference');
  }
  // Faltan pruebas mínimas (dominio u org pública)
  if (
    /domain|github/i.test(text) &&
    /(no domain|no org|no repo|no history)/i.test(text)
  ) {
    preFlags.add('no_public_org_or_domain');
  }

  return { entities, preFlags: Array.from(preFlags) };
}

/* ---------------------------- Heurística base -------------------------- */

function heuristicAnalyze(text: string): ChatAnalysisResult {
  const flags: string[] = [];

  if (/run.*(code|repo)|clon(e|ar)|npm\s+install|yarn\s+install/i.test(text)) {
    flags.push('asks_to_run_code');
  }
  if (/seed|wallet|private\s*key/i.test(text)) {
    flags.push('web3_targeting');
  }
  if (/urgent|immediately|right\s*now|asap/i.test(text)) {
    flags.push('urgency_pressure');
  }
  if (/(gmail\.com|outlook\.com|proton\.me|yahoo\.com)/i.test(text)) {
    flags.push('non_corporate_email');
  }

  const entities = extractEntities(text);
  const riskScore = Math.min(100, flags.length * 25);

  return {
    riskScore,
    flags,
    entities,
    summary:
      riskScore >= 70
        ? 'High risk conversation.'
        : 'Potentially risky. Review carefully.',
    guidance: [
      "Don't run untrusted code locally.",
      'Verify company domain and presence.',
      'Ask for live coding or reputable platforms.',
      'Check links in a sandbox/VM.',
    ],
    evidence: entities.urls.slice(0, 3),
  };
}

/* ------------------------- Prompt robusto (LLM) ------------------------ */

function chatPrompt(
  transcript: string,
  heuristicScore: number,
  extractedSignals: ChatExtractedSignals
) {
  return `You are a senior security reviewer auditing a RECRUITING CHAT for scam patterns.

RULES:
- Think first, then output ONLY one JSON object (no extra text).
- Valid JSON, camelCase keys, no trailing commas.
- Use ONLY the taxonomy slugs below. If none apply, use [].

FLAG TAXONOMY:
["asks_to_run_code","repo_invite_before_screening","no_deployed_demo","off_platform_contact","non_corporate_email","salary_upfront_unstructured","skips_interview_steps","inconsistent_story","web3_targeting","requests_secrets","urgency_pressure","suspicious_repo_claims","no_public_org_or_domain","base64_decode_reference","rce_pattern_reference"]

SCORING (0–100):
- Start from heuristicScore (ceil).
- Add:
  +25 if asks_to_run_code OR repo_invite_before_screening
  +20 if no_deployed_demo AND no_public_org_or_domain
  +15 if off_platform_contact OR non_corporate_email
  +15 if requests_secrets OR web3_targeting
  +10 if urgency_pressure OR skips_interview_steps
  +10 if inconsistent_story OR suspicious_repo_claims
  +10 if base64_decode_reference OR rce_pattern_reference
- Cap at 100. >=70 High risk, 40–69 Medium, <40 Low.

OUTPUT (JSON only):
{
  "riskScore": number,
  "flags": string[],
  "entities": { "emails": string[], "urls": string[], "wallets": string[] },
  "summary": string,
  "guidance": string[],
  "evidence": string[]
}

EVIDENCE RULES:
- Use verbatim quotes strictly from the transcript.
- Max 120 chars each. Pick the most indicative lines.

INPUT_TRANSCRIPT:
<<<
${transcript}
>>>

EXTRACTED_SIGNALS: (regex/heuristics already computed by the system)
${JSON.stringify(extractedSignals, null, 2)}

HEURISTIC_SCORE:
${Math.ceil(heuristicScore)}
`;
}

/* ------------------------------ Main Handler --------------------------- */

export async function POST(req: Request) {
  try {
    const { text, useLlm, providerConfig } = InputSchema.parse(
      await req.json()
    );

    const base = heuristicAnalyze(text);

    const signals = extractChatSignals(text);
    const heuristicFloor = Math.min(100, signals.preFlags.length * 15);
    const heuristicForPrompt = Math.max(base.riskScore, heuristicFloor);

    const prompt = chatPrompt(text, heuristicForPrompt, signals);

    const llmResult = await callLLMWithFallback(
      [{ role: 'user', content: prompt }],
      providerConfig,
      base,
      useLlm
    );

    const merged = mergeAnalysisResults(base, llmResult);
    return NextResponse.json(merged);
  } catch (e: unknown) {
    const error = handleApiError(e);
    return NextResponse.json({ error: error.error }, { status: error.status });
  }
}
