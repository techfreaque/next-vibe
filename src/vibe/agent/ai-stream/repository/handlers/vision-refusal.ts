/**
 * Vision refusal detection, shared by the gap-fill bridge and the
 * describe-image / describe-video tools.
 *
 * A vision model can decline in three ways, and none of them is a usable
 * description: the provider throws a moderation error (Gemini
 * PROHIBITED_CONTENT / SAFETY, OpenAI content_policy), the call "succeeds"
 * with finishReason "content-filter" and no text, or the model answers with
 * a short refusal sentence. Each one is logged and triggers the fallback
 * model instead of reaching the chat model as if it were the image.
 */

/** Provider error messages that mean "blocked by moderation", not "broken". */
const MODERATION_ERROR_PATTERN =
  /PROHIBITED_CONTENT|\bSAFETY\b|blocked the request|content.?filter|content.?policy|moderation/i;

/** Opening of a refusal reply ("I'm sorry, I can't describe this image"). */
const REFUSAL_REPLY_PATTERN =
  /^\s*(?:I(?:'|’)m sorry|I am sorry|Sorry,|I can(?:'|’)?not\b|I can(?:'|’)t\b|I(?:'|’)m (?:not able|unable)|I am (?:not able|unable)|I won(?:'|’)t\b|I will not\b|Unfortunately,? I (?:can|am|won))/i;

/** Real descriptions are long; a refusal is a sentence or two. */
const REFUSAL_MAX_LENGTH = 600;

/** True when a thrown provider error is a moderation block. */
export function isModerationError(message: string): boolean {
  return MODERATION_ERROR_PATTERN.test(message);
}

/**
 * Why a completed vision call is not a usable description, or null when it is.
 */
export function detectVisionRefusal(
  text: string,
  finishReason: string,
): string | null {
  if (finishReason === "content-filter") {
    return "blocked by provider content filter (finishReason=content-filter)";
  }
  const trimmed = text.trim();
  if (!trimmed) {
    return `empty description (finishReason=${finishReason})`;
  }
  if (
    trimmed.length < REFUSAL_MAX_LENGTH &&
    REFUSAL_REPLY_PATTERN.test(trimmed)
  ) {
    return `model refused: ${trimmed.slice(0, 160)}`;
  }
  return null;
}
