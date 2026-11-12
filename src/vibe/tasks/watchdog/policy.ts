/**
 * Task Watchdog Policy - PURE decisions, no DB, no clock, no logger.
 * Everything the watchdog, the retry loop and the budget guard decide is
 * decided here so it can be tested without a database.
 */

import { isTransientErrorText } from "../../agent/ai-stream/repository/errors/transient";
import { ErrorResponseTypes } from "../../core/route/response.schema";
import { TASK_WATCHDOG_CONFIG } from "./config";
import { BudgetScope as BudgetScopeEnum, type BudgetScopeValue } from "./enum";

// ─── Failure classification ─────────────────────────────────────────────────

/** Error keys that can NEVER be fixed by trying again. */
const PERMANENT_ERROR_KEYS: ReadonlySet<string> = new Set([
  "errorTypes.payment_required",
  "errorTypes.payment_failed",
  "errorTypes.validation_error",
  "errorTypes.bad_request",
  "errorTypes.auth_error",
  "errorTypes.unauthorized",
  "errorTypes.forbidden",
  "errorTypes.not_found",
  "errorTypes.token_expired_error",
  "errorTypes.permission_error",
  "errorTypes.permission_denied",
  "errorTypes.invalid_token_error",
  "errorTypes.invalid_credentials_error",
  "errorTypes.invalid_request_error",
  "errorTypes.invalid_data_error",
  "errorTypes.invalid_input_error",
  "errorTypes.invalid_payload_error",
  "errorTypes.invalid_format_error",
  "errorTypes.invalid_parameter_error",
  "errorTypes.invalid_query_error",
  "errorTypes.invalid_url_error",
  "errorTypes.invalid_path_error",
  "errorTypes.invalid_method_error",
  "errorTypes.invalid_status_error",
  "errorTypes.invalid_response_error",
]);

/** Error keys that point at an upstream / infrastructure hiccup. */
const TRANSIENT_ERROR_KEYS: ReadonlySet<string> = new Set([
  "errorTypes.external_service_error",
  "errorTypes.database_error",
  "errorTypes.http_error",
  "errorTypes.no_response_data",
]);

export interface TaskFailure {
  /** ErrorResponseType.errorType.errorKey, null for a thrown exception */
  errorKey: string | null;
  message: string;
  /** The attempt hit its wall-clock timeout (always final - see decideRetry) */
  timedOut: boolean;
}

/**
 * Transient = worth retrying. Permanent keys win over message matching so a
 * validation error that merely mentions "timeout" is not retried.
 */
export function isTransientFailure(failure: TaskFailure): boolean {
  if (failure.timedOut) {
    return false;
  }
  if (failure.errorKey !== null && PERMANENT_ERROR_KEYS.has(failure.errorKey)) {
    return false;
  }
  if (failure.errorKey !== null && TRANSIENT_ERROR_KEYS.has(failure.errorKey)) {
    return true;
  }
  return isTransientErrorText(failure.message);
}

/**
 * The run cannot be paid for (owner's wallet empty, or a task budget cap from
 * TaskGuard, which also answers 402). Not a task failure: the
 * scheduler records the run as SKIPPED, keeps the failure streak untouched and
 * picks the task up again by itself once the owner tops up.
 */
export function isInsufficientCreditsFailure(errorKey: string | null): boolean {
  return errorKey === ErrorResponseTypes.PAYMENT_REQUIRED.errorKey;
}

// ─── Retry with exponential backoff ─────────────────────────────────────────

/**
 * Delay before retry number `retryNumber` (1 = first retry): base * 2^(n-1),
 * capped, with symmetric jitter. `random` is injectable (0..1) for tests.
 */
export function backoffDelayMs(
  retryNumber: number,
  baseDelayMs: number,
  random: number = Math.random(),
): number {
  const { maxDelayMs, jitter } = TASK_WATCHDOG_CONFIG.retry;
  const exponential = Math.min(
    baseDelayMs * 2 ** Math.max(0, retryNumber - 1),
    maxDelayMs,
  );
  const spread = exponential * jitter * (random * 2 - 1);
  return Math.max(0, Math.round(exponential + spread));
}

export type RetryDecision =
  | { retry: true; delayMs: number }
  | {
      retry: false;
      /** Transient failure that ran out of attempts - record an incident */
      exhausted: boolean;
    };

/**
 * Decide what happens after a failed attempt.
 * `attempt` is 0-based (0 = the first run). `taskMaxRetries` is the task row's
 * own `retries`; the global cap always wins.
 */
export function decideRetry(params: {
  attempt: number;
  taskMaxRetries: number;
  baseDelayMs: number | null;
  failure: TaskFailure;
  random?: number;
}): RetryDecision {
  const { attempt, failure } = params;
  if (!isTransientFailure(failure)) {
    return { retry: false, exhausted: false };
  }
  const cap = Math.min(
    Math.max(0, params.taskMaxRetries),
    TASK_WATCHDOG_CONFIG.retry.maxAttempts,
  );
  if (attempt >= cap) {
    return { retry: false, exhausted: true };
  }
  return {
    retry: true,
    delayMs: backoffDelayMs(
      attempt + 1,
      params.baseDelayMs ?? TASK_WATCHDOG_CONFIG.retry.baseDelayMs,
      params.random,
    ),
  };
}

// ─── Run limits ─────────────────────────────────────────────────────────────

export type RunLimitVerdict =
  | { ok: true }
  | { ok: false; kind: "duration" | "turns" | "toolCalls"; reason: string };

export function evaluateRunLimits(params: {
  ageMs: number;
  maxDurationMs: number;
  turns: number;
  toolCalls: number;
}): RunLimitVerdict {
  const { maxTurns, maxToolCalls } = TASK_WATCHDOG_CONFIG.loopCeilings;
  if (params.ageMs > params.maxDurationMs) {
    return {
      ok: false,
      kind: "duration",
      reason: `Ran ${Math.round(params.ageMs / 1000)}s, limit ${Math.round(params.maxDurationMs / 1000)}s`,
    };
  }
  if (params.turns > maxTurns) {
    return {
      ok: false,
      kind: "turns",
      reason: `${params.turns} turns, ceiling ${maxTurns}`,
    };
  }
  if (params.toolCalls > maxToolCalls) {
    return {
      ok: false,
      kind: "toolCalls",
      reason: `${params.toolCalls} tool calls, ceiling ${maxToolCalls}`,
    };
  }
  return { ok: true };
}

// ─── Error loop ─────────────────────────────────────────────────────────────

export interface ExecutionSample {
  status: string;
  /** Normalised error message of a failed execution, null otherwise */
  errorMessage: string | null;
  startedAt: Date;
}

/** Strip ids / numbers so "failed for 123" and "failed for 456" compare equal. */
export function normalizeErrorMessage(message: string): string {
  return message
    .toLowerCase()
    .replace(
      /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g,
      "#",
    )
    .replace(/\d+/g, "#")
    .trim()
    .slice(0, 200);
}

/**
 * Newest-first executions. A loop = the N most recent executions all failed
 * with the SAME normalised error, all inside the window.
 */
export function detectErrorLoop(
  executions: ExecutionSample[],
  now: Date,
): { loop: false } | { loop: true; message: string; count: number } {
  const { consecutiveSameError, windowMs } = TASK_WATCHDOG_CONFIG.errorLoop;
  const recent = executions.slice(0, consecutiveSameError);
  if (recent.length < consecutiveSameError) {
    return { loop: false };
  }
  const first = recent[0].errorMessage;
  if (first === null || first.length === 0) {
    return { loop: false };
  }
  const oldest = recent[recent.length - 1];
  if (now.getTime() - oldest.startedAt.getTime() > windowMs) {
    return { loop: false };
  }
  const allSame = recent.every((e) => e.errorMessage === first);
  return allSame
    ? { loop: true, message: first, count: recent.length }
    : { loop: false };
}

// ─── Budget ─────────────────────────────────────────────────────────────────

export interface BudgetCap {
  scope: typeof BudgetScopeValue;
  key: string;
  maxCredits: number;
}

export interface BudgetSpend {
  /** Credits this task spent in its current run */
  task: number;
  /** Credits all background tasks spent today (UTC) */
  day: number;
  /** Credits the task's goal group spent today, null when it has no goal */
  goal: number | null;
}

export type BudgetVerdict =
  | { ok: true }
  | {
      ok: false;
      scope: typeof BudgetScopeValue;
      key: string;
      spent: number;
      cap: number;
      reason: string;
    };

/**
 * Check spend against caps. Tightest breach first: task, then goal, then day.
 * A cap of 0 blocks everything (an explicit kill switch).
 */
export function evaluateBudget(
  caps: readonly BudgetCap[],
  spend: BudgetSpend,
): BudgetVerdict {
  const order = [
    BudgetScopeEnum.TASK,
    BudgetScopeEnum.GOAL,
    BudgetScopeEnum.DAY,
  ] as const;
  for (const scope of order) {
    const spent =
      scope === BudgetScopeEnum.TASK
        ? spend.task
        : scope === BudgetScopeEnum.GOAL
          ? spend.goal
          : spend.day;
    if (spent === null) {
      continue;
    }
    for (const cap of caps) {
      if (cap.scope === scope && spent >= cap.maxCredits) {
        return {
          ok: false,
          scope,
          key: cap.key,
          spent,
          cap: cap.maxCredits,
          reason: `${SCOPE_WORD[scope]} cap "${cap.key}" reached: ${round(spent)} of ${round(cap.maxCredits)} credits`,
        };
      }
    }
  }
  return { ok: true };
}

const SCOPE_WORD: Record<typeof BudgetScopeValue, string> = {
  [BudgetScopeEnum.TASK]: "task",
  [BudgetScopeEnum.DAY]: "day",
  [BudgetScopeEnum.GOAL]: "goal",
};

function round(value: number): number {
  return Math.round(value * 10) / 10;
}

/**
 * Pick the caps that apply: an exact-key row beats the wildcard row of the
 * same scope; no row at all falls back to the config default.
 */
export function resolveApplicableCaps(
  rows: readonly BudgetCap[],
  taskId: string,
  goal: string | null,
): BudgetCap[] {
  const { wildcardKey, globalKey, budgetDefaults } = TASK_WATCHDOG_CONFIG;
  const pick = (
    scope: typeof BudgetScopeValue,
    exactKey: string,
    wildcard: string | null,
    fallback: number,
  ): BudgetCap => {
    const exact = rows.find((r) => r.scope === scope && r.key === exactKey);
    if (exact) {
      return exact;
    }
    const wild =
      wildcard === null
        ? undefined
        : rows.find((r) => r.scope === scope && r.key === wildcard);
    return wild ?? { scope, key: wildcard ?? exactKey, maxCredits: fallback };
  };
  const caps: BudgetCap[] = [
    pick(
      BudgetScopeEnum.TASK,
      taskId,
      wildcardKey,
      budgetDefaults.perTaskCredits,
    ),
    pick(BudgetScopeEnum.DAY, globalKey, null, budgetDefaults.perDayCredits),
  ];
  if (goal !== null) {
    caps.push(
      pick(
        BudgetScopeEnum.GOAL,
        goal,
        wildcardKey,
        budgetDefaults.perGoalCredits,
      ),
    );
  }
  return caps;
}
