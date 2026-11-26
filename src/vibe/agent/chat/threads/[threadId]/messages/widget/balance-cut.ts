import { ErrorResponseTypes } from "next-vibe/core/route/response.schema";

import type { ChatMessage } from "../../../../db";

/**
 * A reply the remaining balance ended mid-stream (finalize's budget cut).
 * Its content is plain text; the 402 lives in metadata.streamError. It is a
 * credit outcome like a structured 402, so it gets the top-up card, not a red
 * "auto-reported" error bubble (prod 2026-11-26).
 */
export function isBalanceCutStreamError(
  message: Pick<ChatMessage, "metadata">,
): boolean {
  const streamError = message.metadata?.streamError;
  return (
    streamError?.status === ErrorResponseTypes.PAYMENT_REQUIRED.errorCode ||
    streamError?.key === ErrorResponseTypes.PAYMENT_REQUIRED.errorKey
  );
}
