/**
 * Provider request/job/generation ID extraction and normalization.
 *
 * Stored on credit_transactions, studio_generations and v1_media_jobs so
 * provider dashboard charges (OpenRouter, ModelsLab, Venice, NanoGPT, fal.ai,
 * Replicate, OpenAI, ElevenLabs, Deepgram, Eden AI) can be matched back to
 * our requests.
 */

const DEFAULT_REQUEST_ID_HEADERS = [
  "x-generation-id",
  "x-venice-request-id",
  "x-request-id",
  "request-id",
  "dg-request-id",
] as const;

/** AI SDK synthesizes local `aitxt-*` response IDs when a provider omits one. */
const SYNTHETIC_AI_SDK_ID_PREFIX = "aitxt-";

/** Trim and coerce a provider job/request ID; returns undefined when empty. */
export function normalizeProviderJobId(
  value: string | number | null | undefined,
): string | undefined {
  if (typeof value === "number") {
    return Number.isFinite(value) ? String(value) : undefined;
  }
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

/** Read the first non-empty provider request/generation ID from response headers. */
export function extractHeaderRequestId(
  headers: Headers | Readonly<Record<string, string>> | undefined,
  names: readonly string[] = DEFAULT_REQUEST_ID_HEADERS,
): string | undefined {
  if (!headers) {
    return undefined;
  }
  if (headers instanceof Headers) {
    for (const name of names) {
      const value = normalizeProviderJobId(headers.get(name));
      if (value) {
        return value;
      }
    }
    return undefined;
  }
  const lower = new Map<string, string>();
  for (const [key, value] of Object.entries(headers)) {
    lower.set(key.toLowerCase(), value);
  }
  for (const name of names) {
    const value = normalizeProviderJobId(lower.get(name.toLowerCase()));
    if (value) {
      return value;
    }
  }
  return undefined;
}

/**
 * Extract a ModelsLab job ID from the response body `id`, the trailing segment
 * of `fetch_result` (e.g. `.../fetch/4284667`), or a response header fallback.
 */
export function extractModelsLabJobId(
  id: string | number | null | undefined,
  fetchResult?: string | null,
  headers?: Headers,
): string | undefined {
  const direct = normalizeProviderJobId(id);
  if (direct) {
    return direct;
  }
  if (fetchResult) {
    const match = /\/fetch\/([^/?#]+)/.exec(fetchResult);
    const fromUrl = normalizeProviderJobId(match?.[1]);
    if (fromUrl) {
      return fromUrl;
    }
  }
  return extractHeaderRequestId(headers);
}

/**
 * Extract a real provider generation/request ID from an AI SDK language model
 * response metadata object. Prefers OpenRouter's `x-generation-id` header,
 * then the provider's response `id` (skipping AI SDK's local `aitxt-*`
 * fallback), then standard `x-request-id` headers.
 */
export function extractLanguageModelRequestId(
  response:
    | {
        id?: string;
        headers?: Readonly<Record<string, string>>;
      }
    | undefined,
): string | undefined {
  if (!response) {
    return undefined;
  }
  const generationHeader = extractHeaderRequestId(response.headers, [
    "x-generation-id",
  ]);
  if (generationHeader) {
    return generationHeader;
  }
  const responseId = normalizeProviderJobId(response.id);
  if (responseId && !responseId.startsWith(SYNTHETIC_AI_SDK_ID_PREFIX)) {
    return responseId;
  }
  return extractHeaderRequestId(response.headers);
}

/** Deduplicate a list of provider job IDs while preserving first-seen order. */
export function mergeProviderJobIds(ids: readonly (string | undefined)[]): {
  providerJobId?: string;
  providerJobIds?: string[];
} {
  const unique: string[] = [];
  for (const raw of ids) {
    const id = normalizeProviderJobId(raw);
    if (id && !unique.includes(id)) {
      unique.push(id);
    }
  }
  if (unique.length === 0) {
    return {};
  }
  return unique.length === 1
    ? { providerJobId: unique[0] }
    : { providerJobId: unique[0], providerJobIds: unique };
}
