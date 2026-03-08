export const EXECUTE_TOOL_ALIAS = "execute-tool" as const;

/**
 * Controls how the stream and thread behave after a tool call.
 * All values are mutually exclusive. See ai-stream/spec.md for full details.
 */
export const CallbackMode = {
  /** (default) Execute inline, result returned to AI, loop continues. Remote: same via /report. */
  WAIT: "wait",
  /** Fire and forget. AI gets { taskId, hint } only. Result in task history, never injected into thread. Use wait-for-task to upgrade to wakeUp. */
  DETACH: "detach",
  /** Like detach but always revives AI with result. Stream continues; resume-stream intercepts live loop or revives dead one. Args suppressed from AI context on revival. */
  WAKE_UP: "wakeUp",
  /** Execute inline, result returned to AI, loop stops after this batch. Remote: result backfilled, no AI continuation. */
  END_LOOP: "endLoop",
  /** Human sign-off required before this tool runs. Other parallel tools execute. Loop stops after batch. AI can opt in; tool settings can force it. */
  APPROVE: "approve",
} as const;

export type CallbackModeValue =
  (typeof CallbackMode)[keyof typeof CallbackMode];

/**
 * Routing metadata stored in taskInput for remote tasks.
 * Read by handleTaskCompletion and /report to backfill results
 * and schedule resume-stream.
 */
export interface TaskRoutingContext {
  callbackMode: CallbackModeValue;
  threadId?: string;
  toolMessageId?: string;
  modelId?: string;
  characterId?: string;
  favoriteId?: string;
}

/** DB-safe tuple for text() enum constraint */
export const CallbackModeDB = [
  CallbackMode.WAIT,
  CallbackMode.DETACH,
  CallbackMode.WAKE_UP,
  CallbackMode.END_LOOP,
  CallbackMode.APPROVE,
] as const;
