/**
 * Task Watchdog Config
 *
 * ONE place for every threshold the watchdog, the retry policy and the budget
 * guard use. Change a number here, nowhere else. Budget CAPS (credits) are
 * admin-editable rows in task_budget_caps; the values here are the safe
 * defaults used until a row exists.
 *
 * Client+server safe. No server imports.
 */

const MINUTE_MS = 60_000;

/** cron_tasks.id of the sweep itself (see task.ts). */
export const TASK_WATCHDOG_SELF_ID = "task-watchdog";

export const TASK_WATCHDOG_CONFIG = {
  /**
   * Max wall-clock time one run may take. The effective limit is
   * max(default, task.timeout + grace): the pulse enforces task.timeout, the
   * watchdog is the backstop for runs that ignore it (or whose process died).
   * Per-route overrides win over both.
   */
  maxDurationMs: {
    default: 15 * MINUTE_MS,
    graceMs: 2 * MINUTE_MS,
    byRouteId: {} as Readonly<Record<string, number>>,
  },

  /** Agent-loop ceilings per run, counted from the spend ledger. */
  loopCeilings: {
    /** Billed model turns (one per step) */
    maxTurns: 60,
    /** Billed tool calls */
    maxToolCalls: 200,
  },

  /** Same error on N consecutive executions of one task = a retry loop. */
  errorLoop: {
    consecutiveSameError: 5,
    /** Only the most recent executions inside this window are compared */
    windowMs: 60 * MINUTE_MS,
  },

  /** Retry policy for TRANSIENT failures only. */
  retry: {
    /** Hard ceiling on retries, whatever the task row says */
    maxAttempts: 4,
    /** Used when the task row has no retryDelay */
    baseDelayMs: 30_000,
    maxDelayMs: 10 * MINUTE_MS,
    /** +/- jitter fraction applied to each delay */
    jitter: 0.2,
  },

  /** Safe fallback caps (credits) when task_budget_caps has no matching row. */
  budgetDefaults: {
    /** One run of one task */
    perTaskCredits: 100,
    /** Everything background tasks spend in one UTC day */
    perDayCredits: 1000,
    /** One goal group in one UTC day */
    perGoalCredits: 500,
  },

  /** Wildcard cap key: applies to every task / goal without its own row. */
  wildcardKey: "*",
  /** Day cap key. */
  globalKey: "global",
  /** Tag prefix on cron_tasks.tags that groups tasks under one goal. */
  goalTagPrefix: "goal:",

  /** Ledger / resolved-incident retention. */
  retentionDays: 45,
} as const;

export function maxDurationFor(
  routeId: string,
  taskTimeoutMs: number | null,
): number {
  const {
    default: base,
    graceMs,
    byRouteId,
  } = TASK_WATCHDOG_CONFIG.maxDurationMs;
  const override = byRouteId[routeId];
  if (override !== undefined) {
    return override;
  }
  return Math.max(base, (taskTimeoutMs ?? 0) + graceMs);
}
