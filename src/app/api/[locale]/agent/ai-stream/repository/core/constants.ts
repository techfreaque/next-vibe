/**
 * AI Stream Constants
 * Shared constants for AI streaming functionality
 */

/**
 * Maximum number of tool calls allowed in a single streaming session
 * Used internally by the streaming system, not exposed to the model
 */
export const MAX_TOOL_CALLS = 50;

/**
 * Token threshold for triggering history compacting
 * When conversation history exceeds this, older messages are automatically summarized
 * This is the absolute cap - we also enforce 60% of model's max context (whichever is lower)
 */
export const COMPACT_TRIGGER = 32_000;

/**
 * Maximum percentage of model's context window to use before triggering compacting
 * Set to 60% to keep costs manageable and ensure efficient cache reuse
 */
export const COMPACT_TRIGGER_PERCENTAGE = 0.6;

/**
 * Stream abort reasons - typed enum for control flow.
 * Used as the `reason` property on StreamAbortError.
 */
export enum AbortReason {
  CLIENT_DISCONNECTED = "client_disconnected",
  TOOL_CONFIRMATION = "tool_confirmation",
  REMOTE_TOOL_WAIT = "remote_tool_wait",
  LOOP_STOP = "loop_stop",
  USER_CANCELLED = "user_cancelled",
  SUPERSEDED = "superseded",
  STREAM_TIMEOUT = "stream_timeout",
  CONTEXT_WINDOW_GUARD = "context_window_guard",
}

/**
 * Typed error for stream aborts - no string matching needed.
 * Use `instanceof StreamAbortError` to check, then `.reason` for the enum.
 */
export class StreamAbortError extends Error {
  readonly reason: AbortReason;

  constructor(reason: AbortReason) {
    super(reason);
    this.name = "StreamAbortError";
    this.reason = reason;
  }

  get isToolPause(): boolean {
    return (
      this.reason === AbortReason.TOOL_CONFIRMATION ||
      this.reason === AbortReason.REMOTE_TOOL_WAIT
    );
  }

  get isLoopStop(): boolean {
    return this.reason === AbortReason.LOOP_STOP;
  }
}

/**
 * Check if an error is a graceful stream abort.
 */
export function isStreamAbort(error: Error): error is StreamAbortError {
  return error instanceof StreamAbortError;
}
