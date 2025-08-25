import {
  callLLMWithFallback,
  handleApiError,
  mergeAnalysisResults,
  ProviderConfigSchema
} from '@/lib/api/analyser-utils';
import type {
  Finding,
  RepoAnalysisResult,
  RepoSignals,
} from '@/types';
import AdmZip from 'adm-zip';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export const runtime = 'nodejs';
export const maxDuration = 20;

// Input schema using common ProviderConfigSchema
const InputSchema = z.object({
  zipBase64: z.string().min(10),
  useLlm: z.boolean().optional().default(false),
  providerConfig: ProviderConfigSchema.optional(),
});

const EXT = /\.(js|ts|jsx|tsx|mjs|cjs|json)$/i;
const RX = {
  eval: /\beval\s*\(/g,
  newFn: /\bnew\s+Function\s*\(/g,
  fnCtor: /\bFunction\s*\(\s*['"`]/g,
  child: /\bchild_process\b|\bexec\s*\(|\bspawn\s*\(/g,
  b64Call: /\b(atob|Buffer\.from\s*\(\s*[^,]+,\s*['"`]base64['"`]\s*\))/g,
  b64Blob: /['"`]([A-Za-z0-9+/=]{40,})['"`]/g,
  curl: /\b(curl|wget|powershell)\b/gi,
  url: /\bhttps?:\/\/[^\s"'`)]+/gi,
  fsSensitive:
    /\.(ssh|pem|keychain)|([\\/]\.ssh[\\/])|AppData|Keychain|credentials?/i,
  walletWords: /\b(seed|mnemonic|private\s*key|wallet|metamask)\b/i,
  walletDeps:
    /\b(ethers|web3|bitcoin-core|bip39|tronweb|@solana\/web3\.js|near-api-js|algosdk)\b/i,
};

function lineOf(content: string, idx: number) {
  return content.slice(0, idx).split('\n').length;
}

function snippetAt(content: string, start: number, len = 120) {
  return content
    .substring(start, Math.min(content.length, start + len))
    .replace(/\s+/g, ' ')
    .trim();
}

export function scanZip(buffer: Buffer): {
  signals: RepoSignals;
  flags: string[];
  score: number;
} {
  const zip = new AdmZip(buffer);
  const filesWithHits: string[] = [];
  const findings: Finding[] = [];
  const endpointsSet = new Set<string>();
  const decodedBlobs: Array<{ file: string; line: number; preview: string }> =
    [];
  const dynamicExec: RepoSignals['dynamicExec'] = [];
  const childProcess: RepoSignals['childProcess'] = [];
  const obfuscation: RepoSignals['obfuscation'] = [];
  const fsSensitive: RepoSignals['fsSensitive'] = [];
  let walletDeps: string[] = [];
  let scripts: Record<string, string> = {};
  const lifecycle: string[] = [];

  // package.json
  const pkgEntry = zip.getEntry('package.json');
  if (pkgEntry) {
    try {
      const pkg = JSON.parse(pkgEntry.getData().toString('utf-8'));
      scripts = pkg?.scripts || {};
      const s = JSON.stringify(scripts);
      if (/postinstall|preinstall|prepare|install/i.test(s))
        lifecycle.push('npm_lifecycle_install');
      if (RX.curl.test(s))
        findings.push({ type: 'pattern', note: 'remote_cmd' });
      if (
        RX.walletDeps.test(
          JSON.stringify(pkg?.dependencies || {}) +
            JSON.stringify(pkg?.devDependencies || {})
        )
      ) {
        walletDeps = Array.from(
          new Set(
            Object.keys({
              ...(pkg.dependencies || {}),
              ...(pkg.devDependencies || {}),
            }).filter((d) => RX.walletDeps.test(d))
          )
        );
      }
    } catch {}
  }

  // Check code files
  zip.getEntries().forEach((e) => {
    if (e.isDirectory) return;
    const name = e.entryName;
    if (!EXT.test(name)) return;
    const content = e.getData().toString('utf-8');

    // Check for endpoints
    for (const m of content.matchAll(RX.url)) {
      endpointsSet.add(m[0]);
      findings.push({
        type: 'endpoint',
        file: name,
        line: lineOf(content, m.index || 0),
        snippet: snippetAt(content, m.index || 0),
        note: 'exfiltration_endpoint',
      });
    }

    // Check for dynamic execution
    for (const re of [RX.eval, RX.newFn, RX.fnCtor]) {
      re.lastIndex = 0;
      for (const m of content.matchAll(re)) {
        const idx = m.index || 0;
        dynamicExec.push({
          file: name,
          line: lineOf(content, idx),
          snippet: snippetAt(content, idx),
        });
        findings.push({
          type: 'pattern',
          file: name,
          line: lineOf(content, idx),
          snippet: snippetAt(content, idx),
          note:
            re === RX.eval
              ? 'eval_usage'
              : re === RX.newFn
              ? 'new_function'
              : 'function_ctor',
        });
      }
    }

    // Check for child_process
    for (const m of content.matchAll(RX.child)) {
      const idx = m.index || 0;
      childProcess.push({
        file: name,
        line: lineOf(content, idx),
        snippet: snippetAt(content, idx),
      });
      findings.push({
        type: 'pattern',
        file: name,
        line: lineOf(content, idx),
        snippet: snippetAt(content, idx),
        note: 'child_process',
      });
    }

    // Check for base64 calls
    for (const m of content.matchAll(RX.b64Call)) {
      const idx = m.index || 0;
      obfuscation.push({
        file: name,
        line: lineOf(content, idx),
        snippet: snippetAt(content, idx),
      });
      findings.push({
        type: 'pattern',
        file: name,
        line: lineOf(content, idx),
        snippet: snippetAt(content, idx),
        note: 'base64_decode',
      });
    }

    // Check for base64 blobs
    for (const m of content.matchAll(RX.b64Blob)) {
      const blob = m[1];
      try {
        const buf = Buffer.from(blob, 'base64');
        const txt = buf.toString('utf-8');
        if (
          /https?:\/\//.test(txt) ||
          /function|require|eval|new Function/i.test(txt)
        ) {
          decodedBlobs.push({
            file: name,
            line: lineOf(content, m.index || 0),
            preview: txt.slice(0, 160).replace(/\s+/g, ' '),
          });
          findings.push({
            type: 'blob',
            file: name,
            line: lineOf(content, m.index || 0),
            snippet: txt.slice(0, 120),
            note: 'base64_decode',
          });
        }
      } catch {}
    }

    // Check for FS sensitive
    if (RX.fsSensitive.test(content)) {
      fsSensitive.push({
        file: name,
        line: 0,
        snippet: 'fs sensitive pattern',
      });
      findings.push({ type: 'fs', file: name, note: 'fs_sensitive_access' });
    }

    // Check for wallet targeting words
    if (RX.walletWords.test(content)) {
      findings.push({ type: 'pattern', file: name, note: 'wallet_targeting' });
    }

    // Mark file if there were hits
    if (findings.some((f) => f.file === name)) filesWithHits.push(name);
  });

  const endpoints = Array.from(endpointsSet);
  const flags = Array.from(
    new Set(
      findings
        .map((f) => f.note)
        .concat(lifecycle.length ? ['npm_lifecycle_install'] : [])
        .concat(
          scripts && /start|serve/.test(JSON.stringify(scripts))
            ? ['suspicious_build_script']
            : []
        )
    )
  );

  const WEIGHT: Record<string, number> = {
    eval_usage: 25,
    new_function: 20,
    function_ctor: 20,
    child_process: 25,
    base64_decode: 15,
    remote_cmd: 20,
    npm_lifecycle_install: 15,
    suspicious_build_script: 15,
    exfiltration_endpoint: 15,
    wallet_targeting: 15,
    fs_sensitive_access: 10,
    obfuscation: 10,
    one_commit_repo: 10,
    author_anomaly: 10,
  };
  const base = flags.reduce((a, f) => a + (WEIGHT[f] ?? 5), 0);
  const score = Math.min(100, base);

  const signals: RepoSignals = {
    scripts,
    filesWithHits: Array.from(new Set(filesWithHits)),
    endpoints,
    decodedBlobs,
    walletDeps,
    fsSensitive,
    dynamicExec,
    lifecycle,
    childProcess,
    obfuscation,
    findings,
    meta: {}, // ej: { repoHistory: { commits: 1 } } si lo tenés
  };

  return { signals, flags, score };
}

function repoPrompt(signals: RepoSignals, heuristicScore: number) {
  return `You are a senior security reviewer auditing a JS/TS repository for recruiting-malware patterns.

RULES:
- Think through the signals internally, then output ONLY a single JSON object (no prose).
- Use camelCase keys, valid JSON, no trailing commas.
- Do NOT hallucinate files/endpoints that are not in "signals".
- If uncertain, leave arrays empty; never invent data.

KNOWN RED-FLAG TAXONOMY (use these slugs):
- "eval_usage"                  // eval(...)
- "new_function"                // new Function(...) or Function.constructor(...)
- "function_ctor"               // Function("...") variants
- "child_process"               // child_process/exec/spawn
- "base64_decode"               // atob, Buffer.from(...,"base64"), long base64 blobs
- "remote_cmd"                  // curl/wget/powershell in scripts
- "npm_lifecycle_install"       // postinstall/preinstall/prepare/install side-effects
- "suspicious_build_script"     // server/start in build/test
- "exfiltration_endpoint"       // outbound POST/GET to non-corporate domain
- "wallet_targeting"            // seed/mnemonic/privateKey patterns, wallet deps
- "fs_sensitive_access"         // .ssh, keychain, AppData, credential stores
- "obfuscation"                 // nested atob/hex/indirection to hide code
- "one_commit_repo"             // if provided in signals.meta.repoHistory
- "author_anomaly"              // ghost/fresh account (if in signals.meta)
(If none apply, return an empty array.)

SCORING RUBRIC (0–100):
- Start from heuristicScore (ceil).
- Add up to:
  +25 if dynamic code exec ("eval_usage"/"new_function"/"function_ctor")
  +25 if "child_process" OR "remote_cmd"
  +20 if "base64_decode" AND used to build code/URL
  +15 if "npm_lifecycle_install" OR "suspicious_build_script"
  +15 if "exfiltration_endpoint" (non-corporate domain)
  +15 if "wallet_targeting"
  +10 if "fs_sensitive_access" OR "obfuscation"
  +10 if "one_commit_repo" OR "author_anomaly"
- Cap at 100.
- Map: >=70 High risk, 40–69 Moderate, <40 Low.

OUTPUT (JSON only):
{
  "riskScore": number,
  "flags": string[],
  "summary": string,                 // 1–3 sentences, plain
  "guidance": string[],              // 3–5 concrete actions
  "evidence": [                      // 2–5 short quotes (<=120 chars) from provided signals/snippets
    {"file": "path", "snippet": "…", "note": "why it's relevant"},
    ...
  ]
}

INPUT SIGNALS:
${JSON.stringify(signals, null, 2)}

HEURISTIC SCORE:
${heuristicScore}
`;
}

// Base result function
function baseResult(
  signals: RepoSignals,
  flags: string[],
  score: number
): RepoAnalysisResult {
  return {
    riskScore: score,
    flags,
    summary:
      score >= 70
        ? 'High risk: dynamic execution and/or install-time commands detected.'
        : score >= 40
        ? 'Moderate risk: review flagged files and scripts before running anything.'
        : 'Low risk by heuristics; still review before execution.',
    guidance: [
      'Never run untrusted repos locally.',
      'Remove postinstall/preinstall scripts before testing.',
      'Search for eval/new Function & base64 decode sinks.',
      'Check all outbound network calls and domains.',
    ],
    signals,
  };
}

// Main handler
export async function POST(req: Request) {
  try {
    const { zipBase64, useLlm, providerConfig } = InputSchema.parse(
      await req.json()
    );

    const buf = Buffer.from(zipBase64, 'base64');
    const { signals, flags, score } = scanZip(buf);
    const base = baseResult(signals, flags, score);

    // Use common LLM integration with fallback
    const llmResult = await callLLMWithFallback(
      [{ role: 'user', content: repoPrompt(signals, score) }],
      providerConfig,
      base,
      useLlm
    );

    // Merge results using common utility
    const merged = mergeAnalysisResults(base, llmResult);

    return NextResponse.json(merged);
  } catch (e: unknown) {
    const error = handleApiError(e);
    return NextResponse.json({ error: error.error }, { status: error.status });
  }
}
