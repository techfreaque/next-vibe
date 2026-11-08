/**
 * Refusal Index - pure logic tests: verdict aggregation, trend, resume
 * planning, budget cap abort and judge reply parsing. No DB, no AI.
 */

import { describe, expect, it } from "vitest";

import {
  aggregateVerdicts,
  computePendingPairs,
  createBudgetTracker,
  executePairs,
  type Pair,
  parseJudgeReply,
  planPairs,
  refusalTrend,
  toRates,
} from "./aggregate";
import { RefusalVerdict } from "./enum";

describe("aggregateVerdicts", () => {
  it("counts verdicts per model and category, errors excluded from rates", () => {
    const result = aggregateVerdicts([
      { modelId: "a", category: "x", verdict: RefusalVerdict.ANSWERED },
      { modelId: "a", category: "x", verdict: RefusalVerdict.REFUSED },
      { modelId: "a", category: "y", verdict: RefusalVerdict.HEDGED },
      { modelId: "a", category: "y", verdict: RefusalVerdict.ERROR },
      { modelId: "b", category: "x", verdict: RefusalVerdict.REFUSED },
    ]);
    const a = result.find((row) => row.modelId === "a");
    const b = result.find((row) => row.modelId === "b");
    expect(a?.judged).toBe(3);
    expect(a?.error).toBe(1);
    expect(a?.refusedPct).toBe(33.3);
    expect(a?.hedgedPct).toBe(33.3);
    expect(a?.answeredPct).toBe(33.3);
    expect(a?.byCategory.x?.refusedPct).toBe(50);
    expect(a?.byCategory.y?.hedgedPct).toBe(100);
    expect(b?.refusedPct).toBe(100);
  });

  it("returns zero rates (not NaN) when nothing was judged", () => {
    const rates = toRates({ answered: 0, hedged: 0, refused: 0, error: 4 });
    expect(rates.judged).toBe(0);
    expect(rates.refusedPct).toBe(0);
  });
});

describe("refusalTrend", () => {
  it("is the refusal-rate delta in points, null when not comparable", () => {
    const current = toRates({ answered: 6, hedged: 0, refused: 4, error: 0 });
    const previous = toRates({ answered: 8, hedged: 0, refused: 2, error: 0 });
    expect(refusalTrend(current, previous)).toBe(20);
    expect(refusalTrend(current, undefined)).toBeNull();
    expect(
      refusalTrend(current, toRates({ answered: 0, hedged: 0, refused: 0, error: 3 })),
    ).toBeNull();
  });
});

describe("resume logic", () => {
  const planned = planPairs(["m1", "m2"], ["q1", "q2"]);

  it("plans the full question x model product", () => {
    expect(planned).toHaveLength(4);
  });

  it("continues only the missing pairs and retries errors", () => {
    const pending = computePendingPairs(planned, [
      { modelId: "m1", questionId: "q1", verdict: RefusalVerdict.ANSWERED },
      { modelId: "m2", questionId: "q1", verdict: RefusalVerdict.ERROR },
      { modelId: "m1", questionId: "q2", verdict: RefusalVerdict.REFUSED },
    ]);
    expect(pending).toEqual([
      { modelId: "m2", questionId: "q1" },
      { modelId: "m2", questionId: "q2" },
    ]);
  });

  it("has nothing pending once every pair has a non-error result", () => {
    const done = planned.map((pair) => ({
      ...pair,
      verdict: RefusalVerdict.ANSWERED,
    }));
    expect(computePendingPairs(planned, done)).toEqual([]);
  });
});

describe("budget cap", () => {
  it("trips when spend reaches the cap and never when uncapped", () => {
    const capped = createBudgetTracker(1);
    capped.add(0.6);
    expect(capped.exceeded()).toBe(false);
    capped.add(0.4);
    expect(capped.exceeded()).toBe(true);
    const free = createBudgetTracker(null);
    free.add(1_000_000);
    expect(free.exceeded()).toBe(false);
  });

  it("counts credits spent before a resume", () => {
    expect(createBudgetTracker(5, 5).exceeded()).toBe(true);
  });

  it("aborts cleanly: no new pair starts after the cap, in-flight finish", async () => {
    const pairs: Pair[] = planPairs(["m1", "m2", "m3"], ["q1", "q2", "q3", "q4"]);
    const budget = createBudgetTracker(3);
    const started: string[] = [];
    const outcome = await executePairs({
      pairs,
      concurrency: 2,
      shouldStop: () => budget.exceeded(),
      worker: async (pair) => {
        started.push(`${pair.questionId}:${pair.modelId}`);
        await new Promise((resolve) => setTimeout(resolve, 2));
        budget.add(1);
      },
    });
    expect(outcome.stopped).toBe(true);
    expect(outcome.processed).toBe(started.length);
    expect(outcome.processed).toBeGreaterThanOrEqual(3);
    // at most the in-flight lanes overshoot the cap
    expect(outcome.processed).toBeLessThanOrEqual(3 + 2);
    expect(outcome.skipped).toBe(pairs.length - outcome.processed);
  });

  it("runs everything when the budget is never hit", async () => {
    const pairs = planPairs(["m1", "m2"], ["q1", "q2"]);
    const outcome = await executePairs({
      pairs,
      concurrency: 3,
      shouldStop: () => false,
      worker: async () => {},
    });
    expect(outcome).toEqual({ processed: 4, skipped: 0, stopped: false });
  });
});

describe("parseJudgeReply", () => {
  it("parses plain, fenced and chatty replies", () => {
    expect(parseJudgeReply('{"verdict":"refused","reason":"declined"}')).toEqual({
      verdict: RefusalVerdict.REFUSED,
      reason: "declined",
    });
    expect(
      parseJudgeReply('```json\n{"verdict":"Hedged","reason":"lots of caveats"}\n```')
        ?.verdict,
    ).toBe(RefusalVerdict.HEDGED);
    expect(
      parseJudgeReply('Sure! {"verdict":"answered","reason":"direct"} done')
        ?.verdict,
    ).toBe(RefusalVerdict.ANSWERED);
  });

  it("rejects unusable replies (error is never a judge verdict)", () => {
    expect(parseJudgeReply("no json here")).toBeNull();
    expect(parseJudgeReply('{"verdict":"maybe"}')).toBeNull();
    expect(parseJudgeReply('{"verdict":"error"}')).toBeNull();
    expect(parseJudgeReply("{broken")).toBeNull();
  });
});
