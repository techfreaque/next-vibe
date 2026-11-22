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

/**
 * Continue hook-up for error bubbles: a turn that broke off after writing
 * part of its answer (time limit, malformed tool call, server restart) is
 * picked up by a short "continue" user message under the error row, the
 * same thing users typed by hand. Retry would regenerate the whole answer
 * and hit the same wall.
 */
export type ErrorContinueFn = (errorMessageId: string) => Promise<void>;

export interface ErrorActions {
  retryMessage: ErrorRetryFn;
  continueAfterError: ErrorContinueFn;
}

export const ErrorRetryContext = createContext<ErrorActions | null>(null);

export function useErrorRetry(): ErrorRetryFn | null {
  return useContext(ErrorRetryContext)?.retryMessage ?? null;
}

export function useErrorContinue(): ErrorContinueFn | null {
  return useContext(ErrorRetryContext)?.continueAfterError ?? null;
}
