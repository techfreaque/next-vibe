/**
 * Task watchdog policy - pure decisions: failure classification, retry with
 * backoff, run limits, error loops, budget caps. No DB, no network.
 */

import { ErrorResponseTypes } from "next-vibe/core/route/response.schema";
import { describe, expect, it } from "vitest";

import { TASK_WATCHDOG_CONFIG } from "./config";
import { BudgetScope } from "./enum";
import {
  backoffDelayMs,
  type BudgetCap,
  decideRetry,
  detectErrorLoop,
  evaluateBudget,
  evaluateRunLimits,
  isTransientFailure,
  normalizeErrorMessage,
  resolveApplicableCaps,
  type TaskFailure,
} from "./policy";

const NO_JITTER = 0.5;

function failure(
  errorType: (typeof ErrorResponseTypes)[keyof typeof ErrorResponseTypes],
  message: string,
  timedOut = false,
): TaskFailure {
  return { errorKey: errorType.errorKey, message, timedOut };
}

describe("isTransientFailure", () => {
  it("treats provider 5xx, rate limits and external service errors as transient", () => {
    expect(
      isTransientFailure(
        failure(ErrorResponseTypes.INTERNAL_ERROR, "Provider returned 503"),
      ),
    ).toBe(true);
    expect(
      isTransientFailure(
        failure(ErrorResponseTypes.INTERNAL_ERROR, "429 rate limit exceeded"),
      ),
    ).toBe(true);
    expect(
      isTransientFailure(
        failure(ErrorResponseTypes.EXTERNAL_SERVICE_ERROR, "upstream"),
      ),
    ).toBe(true);
    expect(
      isTransientFailure({
        errorKey: null,
        message: "read ECONNRESET",
        timedOut: false,
      }),
    ).toBe(true);
  });

  it("never retries validation, permission or credit failures", () => {
    expect(
      isTransientFailure(
        failure(ErrorResponseTypes.VALIDATION_ERROR, "bad input"),
      ),
    ).toBe(false);
    expect(
      isTransientFailure(
        failure(ErrorResponseTypes.FORBIDDEN, "no access"),
      ),
    ).toBe(false);
    expect(
      isTransientFailure(
        failure(ErrorResponseTypes.PAYMENT_REQUIRED, "insufficient credits"),
      ),
    ).toBe(false);
    // a permanent key wins even when the text looks transient
    expect(
      isTransientFailure(
        failure(ErrorResponseTypes.VALIDATION_ERROR, "field timed out 503"),
      ),
    ).toBe(false);
  });

  it("never retries a wall-clock timeout", () => {
    expect(
      isTransientFailure(
        failure(ErrorResponseTypes.INTERNAL_ERROR, "TASK_TIMEOUT", true),
      ),
    ).toBe(false);
  });
});

describe("retry with exponential backoff", () => {
  const transient = failure(
    ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    "Provider returned 503",
  );

  it("doubles the delay per retry and caps it", () => {
    expect(backoffDelayMs(1, 1000, NO_JITTER)).toBe(1000);
    expect(backoffDelayMs(2, 1000, NO_JITTER)).toBe(2000);
    expect(backoffDelayMs(3, 1000, NO_JITTER)).toBe(4000);
    expect(backoffDelayMs(30, 1000, NO_JITTER)).toBe(
      TASK_WATCHDOG_CONFIG.retry.maxDelayMs,
    );
  });

  it("jitter stays inside the configured band", () => {
    const { jitter } = TASK_WATCHDOG_CONFIG.retry;
    expect(backoffDelayMs(1, 1000, 0)).toBe(Math.round(1000 * (1 - jitter)));
    expect(backoffDelayMs(1, 1000, 1)).toBe(Math.round(1000 * (1 + jitter)));
  });

  it("retries a transient failure with growing delays, then exhausts", () => {
    const delays: number[] = [];
    let exhausted = false;
    for (let attempt = 0; attempt < 20; attempt++) {
      const decision = decideRetry({
        attempt,
        taskMaxRetries: 10, // the task row asks for more than the global cap
        baseDelayMs: 1000,
        failure: transient,
        random: NO_JITTER,
      });
      if (!decision.retry) {
        exhausted = decision.exhausted;
        break;
      }
      delays.push(decision.delayMs);
    }
    expect(delays).toEqual([1000, 2000, 4000, 8000]);
    expect(delays).toHaveLength(TASK_WATCHDOG_CONFIG.retry.maxAttempts);
    expect(exhausted).toBe(true);
  });

  it("honours a task row that allows fewer retries than the cap", () => {
    const first = decideRetry({
      attempt: 0,
      taskMaxRetries: 1,
      baseDelayMs: 500,
      failure: transient,
      random: NO_JITTER,
    });
    expect(first).toEqual({ retry: true, delayMs: 500 });
    const second = decideRetry({
      attempt: 1,
      taskMaxRetries: 1,
      baseDelayMs: 500,
      failure: transient,
      random: NO_JITTER,
    });
    expect(second).toEqual({ retry: false, exhausted: true });
  });

  it("does not retry a non-transient failure, and does not call it exhausted", () => {
    const decision = decideRetry({
      attempt: 0,
      taskMaxRetries: 5,
      baseDelayMs: 1000,
      failure: failure(ErrorResponseTypes.VALIDATION_ERROR, "bad input"),
    });
    expect(decision).toEqual({ retry: false, exhausted: false });
  });
});

describe("evaluateRunLimits", () => {
  const { maxTurns, maxToolCalls } = TASK_WATCHDOG_CONFIG.loopCeilings;
  const base = { ageMs: 1000, maxDurationMs: 60_000, turns: 1, toolCalls: 1 };

  it("passes a healthy run", () => {
    expect(evaluateRunLimits(base)).toEqual({ ok: true });
  });

  it("flags a run past its wall-clock limit", () => {
    const verdict = evaluateRunLimits({ ...base, ageMs: 61_000 });
    expect(verdict.ok).toBe(false);
    if (!verdict.ok) {
      expect(verdict.kind).toBe("duration");
      expect(verdict.reason).toContain("61s");
    }
  });

  it("flags a loop over the turn ceiling", () => {
    const verdict = evaluateRunLimits({ ...base, turns: maxTurns + 1 });
    expect(verdict.ok).toBe(false);
    if (!verdict.ok) {
      expect(verdict.kind).toBe("turns");
    }
    expect(evaluateRunLimits({ ...base, turns: maxTurns })).toEqual({
      ok: true,
    });
  });

  it("flags a loop over the tool-call ceiling", () => {
    const verdict = evaluateRunLimits({
      ...base,
      toolCalls: maxToolCalls + 1,
    });
    expect(verdict.ok).toBe(false);
    if (!verdict.ok) {
      expect(verdict.kind).toBe("toolCalls");
    }
  });
});

describe("detectErrorLoop", () => {
  const now = new Date("2026-11-07T12:00:00Z");
  const at = (minutesAgo: number): Date =>
    new Date(now.getTime() - minutesAgo * 60_000);
  const n = TASK_WATCHDOG_CONFIG.errorLoop.consecutiveSameError;
  const failing = (minutesAgo: number, message: string) => ({
    status: "status.failed",
    errorMessage: normalizeErrorMessage(message),
    startedAt: at(minutesAgo),
  });

  it("normalises ids and numbers so the same failure compares equal", () => {
    expect(normalizeErrorMessage("User 123 failed")).toBe(
      normalizeErrorMessage("User 456 failed"),
    );
  });

  it("detects N identical consecutive failures inside the window", () => {
    const runs = Array.from({ length: n }, (_, i) =>
      failing(i * 2, `Mailbox ${i} unreachable`),
    );
    const result = detectErrorLoop(runs, now);
    expect(result.loop).toBe(true);
  });

  it("ignores mixed errors, too few runs and runs spread past the window", () => {
    const mixed = Array.from({ length: n }, (_, i) =>
      failing(i, i === 2 ? "other problem" : "same problem"),
    );
    expect(detectErrorLoop(mixed, now).loop).toBe(false);
    expect(
      detectErrorLoop(
        Array.from({ length: n - 1 }, (_, i) => failing(i, "same")),
        now,
      ).loop,
    ).toBe(false);
    const spread = Array.from({ length: n }, (_, i) => failing(i * 60, "same"));
    expect(detectErrorLoop(spread, now).loop).toBe(false);
  });

  it("a success in the newest runs breaks the loop", () => {
    const runs = [
      { status: "status.completed", errorMessage: null, startedAt: at(0) },
      ...Array.from({ length: n - 1 }, (_, i) => failing(i + 1, "same")),
    ];
    expect(detectErrorLoop(runs, now).loop).toBe(false);
  });
});

describe("budget caps", () => {
  const caps: BudgetCap[] = [
    { scope: BudgetScope.TASK, key: "*", maxCredits: 100 },
    { scope: BudgetScope.DAY, key: "global", maxCredits: 1000 },
    { scope: BudgetScope.GOAL, key: "research", maxCredits: 300 },
  ];

  it("blocks when the per-task cap is reached", () => {
    const verdict = evaluateBudget(caps, { task: 100, day: 100, goal: null });
    expect(verdict.ok).toBe(false);
    if (!verdict.ok) {
      expect(verdict.scope).toBe(BudgetScope.TASK);
    }
  });

  it("blocks at the daily cap even when the task itself is cheap", () => {
    const verdict = evaluateBudget(caps, { task: 1, day: 1000, goal: null });
    expect(verdict.ok).toBe(false);
    if (!verdict.ok) {
      expect(verdict.scope).toBe(BudgetScope.DAY);
    }
  });

  it("blocks a goal group, and skips the goal cap for tasks without one", () => {
    const withGoal = evaluateBudget(caps, { task: 1, day: 10, goal: 300 });
    expect(withGoal.ok).toBe(false);
    if (!withGoal.ok) {
      expect(withGoal.scope).toBe(BudgetScope.GOAL);
    }
    expect(evaluateBudget(caps, { task: 1, day: 10, goal: null }).ok).toBe(
      true,
    );
  });

  it("allows spend under every cap and treats a 0 cap as a kill switch", () => {
    expect(evaluateBudget(caps, { task: 99, day: 999, goal: 299 }).ok).toBe(
      true,
    );
    const killed: BudgetCap[] = [
      { scope: BudgetScope.DAY, key: "global", maxCredits: 0 },
    ];
    expect(evaluateBudget(killed, { task: 0, day: 0, goal: null }).ok).toBe(
      false,
    );
  });

  it("an exact-key cap beats the wildcard; missing rows fall back to defaults", () => {
    const rows: BudgetCap[] = [
      { scope: BudgetScope.TASK, key: "*", maxCredits: 100 },
      { scope: BudgetScope.TASK, key: "big-job", maxCredits: 900 },
    ];
    const applicable = resolveApplicableCaps(rows, "big-job", null);
    expect(
      applicable.find((c) => c.scope === BudgetScope.TASK)?.maxCredits,
    ).toBe(900);

    const defaults = resolveApplicableCaps([], "any", "research");
    expect(
      defaults.find((c) => c.scope === BudgetScope.DAY)?.maxCredits,
    ).toBe(TASK_WATCHDOG_CONFIG.budgetDefaults.perDayCredits);
    expect(
      defaults.find((c) => c.scope === BudgetScope.GOAL)?.maxCredits,
    ).toBe(TASK_WATCHDOG_CONFIG.budgetDefaults.perGoalCredits);
  });
});
