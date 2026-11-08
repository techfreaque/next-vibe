/**
 * Growth funnel aggregation - conversion, cost per unit, spend distribution.
 * Pure: no DB, no network.
 */

import { GraphResolution } from "next-vibe/dataflow/enum";
import { describe, expect, it } from "vitest";

import { FunnelStep } from "./enum";
import {
  costPer,
  dayBucket,
  distributeSpend,
  rate,
  summarizeFunnel,
} from "./funnel";

const day = (iso: string): Date => new Date(`${iso}T00:00:00Z`);

describe("rate / costPer", () => {
  it("guards division by zero", () => {
    expect(rate(1, 0)).toBe(null);
    expect(rate(1, 4)).toBe(0.25);
    expect(costPer(10_000, 0)).toBe(null);
    expect(costPer(10_000, 3)).toBe(3333);
  });
});

describe("summarizeFunnel", () => {
  it("converts each step from the previous one and from visits", () => {
    const summary = summarizeFunnel({
      [FunnelStep.VISIT]: 1000,
      [FunnelStep.CHAT]: 400,
      [FunnelStep.SIGNUP]: 100,
      [FunnelStep.NEWSLETTER]: 50,
      [FunnelStep.PAID]: 10,
      [FunnelStep.RETAINED]: 5,
    });
    expect(summary.map((s) => s.step)).toEqual([
      FunnelStep.VISIT,
      FunnelStep.CHAT,
      FunnelStep.SIGNUP,
      FunnelStep.NEWSLETTER,
      FunnelStep.PAID,
      FunnelStep.RETAINED,
    ]);
    expect(summary[0]).toEqual({
      step: FunnelStep.VISIT,
      count: 1000,
      fromPrevious: null,
      fromVisit: null,
    });
    expect(summary[2]?.fromPrevious).toBe(0.25);
    expect(summary[4]?.fromPrevious).toBe(0.2);
    expect(summary[4]?.fromVisit).toBe(0.01);
    expect(summary[5]?.fromPrevious).toBe(0.5);
  });

  it("treats missing steps as zero and never divides by zero", () => {
    const summary = summarizeFunnel({ [FunnelStep.SIGNUP]: 3 });
    expect(summary[1]?.count).toBe(0);
    expect(summary[2]?.fromPrevious).toBe(null);
    expect(summary[2]?.fromVisit).toBe(null);
  });
});

describe("dayBucket", () => {
  it("aligns to Monday for weeks and the 1st for months", () => {
    const thursday = day("2026-11-05").getTime();
    expect(new Date(dayBucket(thursday, GraphResolution.ONE_WEEK))).toEqual(
      day("2026-11-02"),
    );
    expect(new Date(dayBucket(thursday, GraphResolution.ONE_MONTH))).toEqual(
      day("2026-11-01"),
    );
    expect(dayBucket(thursday, GraphResolution.ONE_DAY)).toBe(thursday);
  });
});

describe("distributeSpend", () => {
  it("spreads a period evenly over its days, both ends inclusive", () => {
    const points = distributeSpend(
      [
        {
          periodStart: day("2026-10-01"),
          periodEnd: day("2026-10-10"),
          amountCents: 10_000,
        },
      ],
      { from: day("2026-10-01"), to: day("2026-10-31") },
      GraphResolution.ONE_DAY,
    );
    expect(points).toHaveLength(10);
    expect(points.every((p) => p.value === 10)).toBe(true);
    expect(points.reduce((s, p) => s + p.value, 0)).toBe(100);
  });

  it("keeps only the part of a period inside the range", () => {
    const points = distributeSpend(
      [
        {
          periodStart: day("2026-09-21"),
          periodEnd: day("2026-10-10"),
          amountCents: 20_000,
        },
      ],
      { from: day("2026-10-01"), to: day("2026-10-05") },
      GraphResolution.ONE_DAY,
    );
    expect(points).toHaveLength(5);
    expect(points.reduce((s, p) => s + p.value, 0)).toBe(50);
  });

  it("sums overlapping periods into weekly buckets", () => {
    const points = distributeSpend(
      [
        {
          periodStart: day("2026-11-02"),
          periodEnd: day("2026-11-08"),
          amountCents: 7_000,
        },
        {
          periodStart: day("2026-11-02"),
          periodEnd: day("2026-11-02"),
          amountCents: 500,
        },
      ],
      { from: day("2026-11-01"), to: day("2026-11-30") },
      GraphResolution.ONE_WEEK,
    );
    expect(points).toEqual([{ timestamp: day("2026-11-02"), value: 75 }]);
  });

  it("ignores inverted periods", () => {
    expect(
      distributeSpend(
        [
          {
            periodStart: day("2026-11-10"),
            periodEnd: day("2026-11-01"),
            amountCents: 100,
          },
        ],
        { from: day("2026-11-01"), to: day("2026-11-30") },
        GraphResolution.ONE_DAY,
      ),
    ).toEqual([]);
  });
});
