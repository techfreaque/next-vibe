/**
 * The user-facing message for an upstream error part.
 *
 * When a provider's stream fails, the AI SDK only throws a generic
 * "No output generated" (or the stream ends empty); the real cause is the
 * error part that arrived before it (ctx.lastProviderErrorText). Without this
 * mapping every such turn showed "The AI did not generate a response" -
 * no hint whether to wait, retry, or switch model (prod 2026-11-17: 56 turns).
 */

import type { AiStreamTranslationKey } from "../../stream/i18n";

const CONTENT_FILTER_PATTERN =
  /inappropriate content|content.?filter|content.?policy|moderation|flagged/i;

const BUSY_PATTERN =
  /\b(429|502|503|504|529)\b|overloaded|rate.?limit|temporarily unavailable|provider_unavailable|try again (later|after)/i;

/** Our provider account, the provider's edge, or the model itself refused. */
const UNAVAILABLE_PATTERN =
  /requires more credits|can only afford|insufficient (balance|quota|funds)|\b403\b|forbidden|cloudflare|model.{0,40}(not found|unavailable|does not exist)/i;

/**
 * The provider could not parse the model's tool call (NanoGPT: "Partial
 * response received, but the final tool call was malformed and was not
 * executed.", prod 2026-11-20, GLM 5.3 Uncensored writing a large cortex
 * file). The partial reply is saved and a Continue usually succeeds.
 */
const MALFORMED_TOOL_CALL_PATTERN =
  /tool.?call.{0,40}(malformed|invalid|could not be parsed|failed to parse)|(malformed|invalid) tool.?call/i;

export function providerErrorTranslationKey(
  providerErrorText: string | null,
): AiStreamTranslationKey | null {
  if (!providerErrorText) {
    return null;
  }
  if (MALFORMED_TOOL_CALL_PATTERN.test(providerErrorText)) {
    return "errors.malformedToolCall";
  }
  if (CONTENT_FILTER_PATTERN.test(providerErrorText)) {
    return "errors.contentFiltered";
  }
  if (UNAVAILABLE_PATTERN.test(providerErrorText)) {
    return "errors.modelUnavailable";
  }
  if (BUSY_PATTERN.test(providerErrorText)) {
    return "errors.providerBusy";
  }
  return null;
}
