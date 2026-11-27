import { describe, expect, it } from "bun:test";

import { GraphResolution } from "next-vibe/dataflow/enum";
import { bucketEnd, onlyClosedBuckets } from "next-vibe/dataflow/shared/range";

import { DropEvaluatorRepository } from "./repository";

const day = (iso: string): Date => new Date(`${iso}T00:00:00Z`);

describe("onlyClosedBuckets", () => {
  it("drops the half-finished current day so a 06:00 run cannot fire a false drop", () => {
    // Steady 100/day, then today's bucket at 06:00 holds only 25.
    const series = [
      { timestamp: day("2026-11-21"), value: 100 },
      { timestamp: day("2026-11-22"), value: 100 },
      { timestamp: day("2026-11-23"), value: 100 },
      { timestamp: day("2026-11-24"), value: 100 },
      { timestamp: day("2026-11-25"), value: 100 },
      { timestamp: day("2026-11-26"), value: 100 },
      { timestamp: day("2026-11-27"), value: 25 },
    ];
    const raw = DropEvaluatorRepository.computeDrop(series, 3, 0.5, 1);
    expect(raw.at(-1)?.fired).toBe(true);

    const now = new Date("2026-11-27T06:00:00Z");
    const scored = onlyClosedBuckets(raw, GraphResolution.ONE_DAY, now);
    expect(scored.some((s) => s.fired)).toBe(false);
    expect(scored.at(-1)?.timestamp).toEqual(day("2026-11-26"));

    // Once the day has closed it is scored (a real drop still fires).
    const nextMorning = new Date("2026-11-28T00:00:00Z");
    const closed = onlyClosedBuckets(raw, GraphResolution.ONE_DAY, nextMorning);
    expect(closed.at(-1)?.fired).toBe(true);
  });

  it("uses the bucket length of the resolution", () => {
    const hour = { timestamp: new Date("2026-11-27T05:00:00Z") };
    expect(
      onlyClosedBuckets([hour], GraphResolution.ONE_HOUR, new Date("2026-11-27T06:00:00Z")),
    ).toHaveLength(1);
    expect(
      onlyClosedBuckets([hour], GraphResolution.ONE_HOUR, new Date("2026-11-27T05:59:59Z")),
    ).toHaveLength(0);
  });

  it("closes monthly buckets on the calendar month end", () => {
    expect(bucketEnd(day("2026-01-01"), GraphResolution.ONE_MONTH)).toEqual(day("2026-02-01"));
    expect(bucketEnd(day("2026-12-01"), GraphResolution.ONE_MONTH)).toEqual(day("2027-01-01"));
    expect(
      onlyClosedBuckets(
        [{ timestamp: day("2026-01-01") }],
        GraphResolution.ONE_MONTH,
        new Date("2026-01-31T12:00:00Z"),
      ),
    ).toHaveLength(0);
  });
});
