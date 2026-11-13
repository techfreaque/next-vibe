/** Token estimates for the /v1 surface (pre-flight + providers that report no usage). */

export const CHARS_PER_TOKEN = 3.5;
export const TOKENS_PER_IMAGE = 1_000;

export function estimateTokens(chars: number, images = 0): number {
  return Math.ceil(chars / CHARS_PER_TOKEN) + images * TOKENS_PER_IMAGE;
}
