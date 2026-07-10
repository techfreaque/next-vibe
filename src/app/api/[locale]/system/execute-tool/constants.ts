export const EXECUTE_TOOL_ALIAS = "execute-tool" as const;

/**
 * Controls how the stream and thread behave after a tool call.
 * All values are mutually exclusive. See ai-stream/spec.md for full details.
 */
export const CallbackMode = {
  /** (default) Execute inline, result returned to AI, loop continues. Remote: same via /report. */
  WAIT: "wait",
  /** Fire and forget. AI gets { taskId, hint } only. Result in task history, never injected into thread. Use await-task to upgrade to wakeUp. */
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

/** DB-safe tuple for text() enum constraint */
export const CallbackModeDB = [
  CallbackMode.WAIT,
  CallbackMode.DETACH,
  CallbackMode.WAKE_UP,
  CallbackMode.END_LOOP,
  CallbackMode.APPROVE,
] as const;

/**
 * Dispatch hint texts — the AI-facing steering strings returned with async
 * dispatch results. ONE definition per hint: local and remote dispatches must
 * steer the model identically (same mode = same hint on every transport).
 *
 * The wakeUp hint is the dispatch's only per-turn steer against a re-call: the
 * tool stays available for the rest of the turn, and a tool-primed model
 * (notably a relay receiver whose system prompt carries the execute-tool
 * tool-catalog) will otherwise re-dispatch it in a loop. Be explicit —
 * acknowledge the taskId and STOP; the result arrives via the automatic
 * wake-up revival.
 */
export const DISPATCH_HINTS = {
  /** DETACH: fire-and-forget; result retrievable via await-task. */
  detach:
    'Task detached. To fetch the result, call await-task with taskId="<the taskId returned above>".',
  /** WAKE_UP: result injected automatically; model must acknowledge and stop. */
  wakeUp:
    "Dispatched — taskId returned. The result will be injected automatically when ready and will wake up this thread. No need to call await-task.",
  /** Remote WAIT that timed out inline and auto-upgraded to wakeUp semantics. */
  waitUpgradedToWakeUp:
    "Tool is taking longer than expected. The result will be injected automatically when ready and will wake up this thread. No need to call await-task.",
} as const;
