// src/lib/llm.ts
export type Msg = { role: 'system' | 'user' | 'assistant'; content: string };
export type LLMProvider =
  | 'heuristic'
  | 'openrouter'
  | 'cloudflare'
  | 'deepseek'
  | 'openai';

export interface LLMOverrides {
  provider?: LLMProvider;
  // BYO keys (opcionales). Si no vienen, usamos las env vars del server.
  openRouterKey?: string;
  deepseekKey?: string;
  openaiKey?: string;
  cloudflare?: { token?: string; accountId?: string; model?: string };
}

const envProvider = (
  process.env.LLM_PROVIDER || 'openrouter'
).toLowerCase() as LLMProvider;

export async function callLLM(
  messages: Msg[],
  wantJson = true,
  overrides?: LLMOverrides
): Promise<string> {
  const provider = (overrides?.provider || envProvider) as LLMProvider;

  if (provider === 'heuristic') {
    // El caller decide qué hacer; devolvemos vacío
    return '';
  }

  if (provider === 'deepseek') {
    const key = overrides?.deepseekKey || process.env.DEEPSEEK_API_KEY;
    if (!key) throw new Error('Missing DeepSeek API key');
    const res = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-reasoner', // o 'deepseek-chat'
        messages,
        temperature: 0,
        ...(wantJson ? { response_format: { type: 'json_object' } } : {}),
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error?.message || 'deepseek_error');
    return data.choices?.[0]?.message?.content ?? '';
  }

  if (provider === 'openrouter') {
    const key = overrides?.openRouterKey || process.env.OPENROUTER_API_KEY;
    if (!key) throw new Error('Missing OpenRouter API key');
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.APP_URL ?? 'http://localhost:3000',
        'X-Title': 'Scam Radar',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1:free',
        messages,
        temperature: 0,
        ...(wantJson ? { response_format: { type: 'json_object' } } : {}),
      }),
    });
    const data = await res.json();
    const raw = data?.choices?.[0]?.message?.content ?? '';
    if (!res.ok) throw new Error(data?.error?.message || 'openrouter_error');
    return raw;
  }

  if (provider === 'cloudflare') {
    const token = overrides?.cloudflare?.token || process.env.CF_API_TOKEN;
    const accountId =
      overrides?.cloudflare?.accountId || process.env.CF_ACCOUNT_ID;
    const model =
      overrides?.cloudflare?.model ||
      process.env.CF_MODEL ||
      '@cf/meta/llama-3.1-8b-instruct';
    if (!token || !accountId)
      throw new Error('Missing Cloudflare token/accountId');

    const prompt = messages
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join('\n');
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      }
    );
    const data = await res.json();
    if (!res.ok)
      throw new Error(data?.errors?.[0]?.message || 'cloudflare_error');
    return (data?.result?.response ?? data?.result ?? '') as string;
  }

  // Fallback OpenAI
  if (provider === 'openai') {
    const key = overrides?.openaiKey || process.env.OPENAI_API_KEY;
    if (!key) throw new Error('Missing OpenAI API key');
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0,
        ...(wantJson ? { response_format: { type: 'json_object' } } : {}),
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error?.message || 'openai_error');
    return data.choices?.[0]?.message?.content ?? '';
  }

  throw new Error('LLM_PROVIDER not supported');
}
