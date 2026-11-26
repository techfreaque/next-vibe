/**
 * Classify an image provider failure so the user can tell a refusal from an
 * outage. A refusal ("rejected by the safety system") means: rephrase or pick
 * a less filtered model. An outage (5xx, timeout, network, rate limit) means:
 * try again shortly or pick another provider. Both used to read "Image
 * generation failed".
 *
 * Text based on purpose: providers report moderation in the error message
 * (OpenAI/OpenRouter "safety system", Venice "content policy", ModelsLab
 * "NSFW"), and the remote (unbottled) provider only relays a message.
 */

export const ImageProviderFailureKind = {
  CONTENT_POLICY: "contentPolicy",
  OUTAGE: "outage",
  OTHER: "other",
} as const;

export type ImageProviderFailureKindValue =
  (typeof ImageProviderFailureKind)[keyof typeof ImageProviderFailureKind];

const CONTENT_POLICY_PATTERNS: readonly RegExp[] = [
  /safety (system|filter|checker|policy|reasons?)/i,
  /content[ _-]?(policy|filter|moderation|violation)/i,
  /moderation/i,
  /\bnsfw\b/i,
  /inappropriate/i,
  /violat(e|es|ed|ion|ing)/i,
  /prohibited/i,
  /not allowed/i,
  /\bflagged\b/i,
  /\brefus(e|ed|al)\b/i,
  /sensitive (content|image|prompt)/i,
  /unsafe (content|prompt|image)/i,
  /responsible ai/i,
  /green net check rejected (?:text|image) \(input\)/i,
  /input text ['"]content\[\d+\]['"] may contain sensitive information/i,
];

const OUTAGE_PATTERNS: readonly RegExp[] = [
  /\bHTTP 5\d\d\b/i,
  /\b(error|status|code)[ :=]*5\d\d\b/i,
  /timed? ?out|timeout/i,
  /unavailable/i,
  /overloaded|capacity/i,
  /rate[ -]?limit|too many requests|\b429\b/i,
  /fetch failed|ECONNRESET|ECONNREFUSED|ETIMEDOUT|ENOTFOUND|EAI_AGAIN|socket hang up|network/i,
  /internal (server )?error/i,
  /bad gateway|gateway/i,
  /temporar(y|ily)|try again later/i,
  /no endpoints found for [\w.-]+\/[\w.-]+/i,
  /no (allowed )?providers? (are )?available/i,
];

export function classifyImageProviderError(
  message: string,
): ImageProviderFailureKindValue {
  if (CONTENT_POLICY_PATTERNS.some((pattern) => pattern.test(message))) {
    return ImageProviderFailureKind.CONTENT_POLICY;
  }
  if (OUTAGE_PATTERNS.some((pattern) => pattern.test(message))) {
    return ImageProviderFailureKind.OUTAGE;
  }
  return ImageProviderFailureKind.OTHER;
}
