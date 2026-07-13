/**
 * AI Stream Constants
 * Shared constants for AI streaming functionality
 */

/**
 * Maximum number of tool calls allowed in a single streaming session
 * Used internally by the streaming system, not exposed to the model
 */
export const MAX_TOOL_CALLS = 150;

/**
 * Default token threshold for triggering history compacting.
 * When estimated input tokens exceed this, older messages are summarized before the next AI call.
 * Overridable per skill or favorite (cascade: favorite → skill → this default).
 * The effective trigger is Math.min(COMPACT_TRIGGER, floor(contextWindow * COMPACT_TRIGGER_PERCENTAGE))
 * so the percentage cap always wins for small-context models.
 */
export const COMPACT_TRIGGER = 32_000;

/**
 * Maximum fraction of the model's context window allowed before compacting is forced.
 * Acts as a ceiling on the effective trigger: even if COMPACT_TRIGGER is set higher,
 * compacting will fire once input tokens reach this fraction of the model's context window.
 * Ensures at least (1 - COMPACT_TRIGGER_PERCENTAGE) of the window is reserved for the response.
 */
export const COMPACT_TRIGGER_PERCENTAGE = 0.7;

/**
 * Error type strings written to chatMessages.errorType for stream-generated error messages.
 * Used server-side (emitErrorMessage) and client-side (ErrorMessageBubble) to determine rendering.
 */
export enum StreamErrorType {
  /** Unhandled/unexpected stream failure - shown as a bug-reportable error */
  STREAM_ERROR = "STREAM_ERROR",
  /** Stream timed out waiting for a response */
  TIMEOUT_ERROR = "TIMEOUT_ERROR",
  /** User explicitly cancelled the generation - shown as a neutral "stopped" indicator */
  STREAM_INTERRUPTED = "STREAM_INTERRUPTED",
}

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
