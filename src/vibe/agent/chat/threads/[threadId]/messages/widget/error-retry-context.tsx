"use client";

import { createContext, useContext } from "react";

/**
 * Retry hook-up for error bubbles. Error bubbles render deep inside three
 * view modes (linear, threaded, grouped); the messages widget provides its
 * existing retry operation here instead of threading it through every view.
 *
 * `retryMessage` takes the USER message to re-send (same op as the retry
 * button on user messages). null outside a messages widget (e.g. embedded
 * read-only renders) - the bubble then hides the retry actions.
 */
export type ErrorRetryFn = (
  userMessageId: string,
  attachments: File[] | undefined,
) => Promise<void>;

export const ErrorRetryContext = createContext<ErrorRetryFn | null>(null);

export function useErrorRetry(): ErrorRetryFn | null {
  return useContext(ErrorRetryContext);
}
