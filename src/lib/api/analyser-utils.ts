import { callLLM, type LLMOverrides, type Msg } from '@/lib/llm';
import type { ProviderConfig } from '@/types';
import { z } from 'zod';

// Common schemas
export const ProviderConfigSchema = z.object({
  provider: z.enum([
    'heuristic',
    'openrouter',
    'cloudflare',
    'deepseek',
    'openai',
  ]),
  openRouterKey: z.string().optional(),
  deepseekKey: z.string().optional(),
  openaiKey: z.string().optional(),
  cloudflare: z
    .object({
      token: z.string().optional(),
      accountId: z.string().optional(),
      model: z.string().optional(),
    })
    .optional(),
});

// Common types
export interface AnalysisEntities {
  emails: string[];
  urls: string[];
  wallets: string[];
}

export interface ChatAnalysisResult {
  riskScore: number;
  flags: string[];
  entities: AnalysisEntities;
  summary: string;
  guidance: string[];
  evidence: string[];
}

export interface ChatExtractedSignals {
  entities: AnalysisEntities;
  preFlags: string[];
}

// Common utility functions
export const uniq = <T>(arr: T[]) => Array.from(new Set(arr));

// Common error handling
export function createApiError(message: string, status: number = 400) {
  return { error: message, status };
}

export function handleApiError(e: unknown) {
  const msg = e instanceof Error ? e.message : 'bad_request';
  return createApiError(msg);
}

// Common LLM integration
export async function callLLMWithFallback<T>(
  messages: Msg[],
  providerConfig: ProviderConfig | undefined,
  fallbackResult: T,
  useLlm: boolean
): Promise<T> {
  if (!useLlm || providerConfig?.provider === 'heuristic') {
    return fallbackResult;
  }

  try {
    const raw = await callLLM(messages, true, providerConfig as LLMOverrides);
    const parsed = JSON.parse(raw);
    return parsed as T;
  } catch {
    return fallbackResult;
  }
}

// Common response merging
export function mergeAnalysisResults<
  T extends { riskScore: number; flags: string[] }
>(base: T, llm: Partial<T>): T {
  return {
    ...base,
    riskScore: Math.max(base.riskScore, llm.riskScore ?? 0),
    flags: uniq([...base.flags, ...(llm.flags || [])]),
    ...llm,
  };
}

// Common validation helpers
export function validateProviderConfig(
  config: unknown
): ProviderConfig | undefined {
  try {
    return ProviderConfigSchema.parse(config);
  } catch {
    return undefined;
  }
}

// Common response formatting
export function formatApiResponse<T>(data: T, status: number = 200) {
  return {
    data,
    status,
    timestamp: new Date().toISOString(),
  };
}
