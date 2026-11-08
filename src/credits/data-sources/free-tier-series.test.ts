/**
 * Pure tests for the free-tier analytics series: day-boundary alignment with the public cap,
 * free-tier-spend reconciliation and tiered utilization. No DB.
 */

import { describe, expect, it } from "vitest";

import { GraphResolution } from "next-vibe/dataflow/enum";

import {
  bucketStart,
  sumIntoBuckets,
  utilizationSeries,
} from "./free-tier-series";

/** Same formula as PublicCapRepository.todayString (server-local day). */
function capDay(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

describe("day boundary", () => {
  it("1d bucket starts at server-local midnight, same day key as the cap", () => {
    const lateEvening = new Date(2026, 10, 7, 23, 59, 59);
    const justAfterMidnight = new Date(2026, 10, 8, 0, 0, 1);
    const b1 = bucketStart(lateEvening, GraphResolution.ONE_DAY);
    const b2 = bucketStart(justAfterMidnight, GraphResolution.ONE_DAY);
    expect(b1.getTime()).toBe(new Date(2026, 10, 7).getTime());
    expect(b2.getTime()).toBe(new Date(2026, 10, 8).getTime());
    expect(capDay(b1)).toBe(capDay(lateEvening));
    expect(capDay(b2)).toBe(capDay(justAfterMidnight));
    expect(capDay(b1)).not.toBe(capDay(b2));
  });

  it("weeks start Monday, months on the 1st (local)", () => {
    const sat = new Date(2026, 10, 7, 12);
    expect(bucketStart(sat, GraphResolution.ONE_WEEK).getTime()).toBe(
      new Date(2026, 10, 2).getTime(),
    );
    expect(bucketStart(sat, GraphResolution.ONE_MONTH).getTime()).toBe(
      new Date(2026, 10, 1).getTime(),
    );
  });
});

describe("free-tier spend reconciles with the cap", () => {
  it("per-day bucket equals the sum of that local day's free deductions", () => {
    // Known deductions (free portion): 3 today, 1 yesterday late, 1 today just after midnight.
    const deductions = [
      { at: new Date(2026, 10, 6, 23, 59), amount: 7 },
      { at: new Date(2026, 10, 7, 0, 0, 5), amount: 2.5 },
      { at: new Date(2026, 10, 7, 9, 0), amount: 10 },
      { at: new Date(2026, 10, 7, 21, 30), amount: 0.1 },
    ];
    const range = {
      from: new Date(2026, 10, 6),
      to: new Date(2026, 10, 7, 23, 0),
    };
    const series = sumIntoBuckets(deductions, range, GraphResolution.ONE_DAY);
    expect(series).toHaveLength(2);
    expect(series[0]?.value).toBeCloseTo(7);
    // == what the cap counter holds for this day (spendToday)
    expect(series[1]?.value).toBeCloseTo(12.6);
    expect(series[1]?.timestamp.getTime()).toBe(new Date(2026, 10, 7).getTime());
  });

  it("gap days are zero-filled", () => {
    const series = sumIntoBuckets(
      [{ at: new Date(2026, 10, 7, 1), amount: 4 }],
      { from: new Date(2026, 10, 5), to: new Date(2026, 10, 7, 12) },
      GraphResolution.ONE_DAY,
    );
    expect(series.map((p) => p.value)).toEqual([0, 0, 4]);
  });
});

describe("free pool utilization (tiered, month-to-date)", () => {
  const day = (d: number, h = 12): Date => new Date(2026, 10, d, h);
  const range = { from: day(10, 0), to: day(12, 23) };

  it("is non-zero when free credits are consumed, even if avg-remaining exceeds any fixed pool", () => {
    // Mixed tiers: 2 guests (20), 1 user (50), 1 newsletter user (70) = 160 granted.
    const granted = [20, 20, 50, 70].map((amount) => ({ at: day(10, 12), amount }));
    const consumed = [
      { at: day(11), amount: 40 },
      { at: day(12), amount: 40 },
    ];
    const s = utilizationSeries({
      consumed,
      granted,
      range,
      resolution: GraphResolution.ONE_DAY,
    });
    expect(s.map((p) => p.value)).toEqual([0, 40 / 160, 80 / 160]);
  });

  it("is 0 with nothing consumed and clamps at 1", () => {
    const s0 = utilizationSeries({
      consumed: [],
      granted: [{ at: day(10), amount: 20 }],
      range,
      resolution: GraphResolution.ONE_DAY,
    });
    expect(s0.every((p) => p.value === 0)).toBe(true);
    const s1 = utilizationSeries({
      consumed: [{ at: day(11), amount: 50 }],
      granted: [{ at: day(10), amount: 20 }],
      range,
      resolution: GraphResolution.ONE_DAY,
    });
    expect(s1[2]?.value).toBe(1);
  });

  it("resets on the 1st of the month", () => {
    const s = utilizationSeries({
      consumed: [{ at: day(29), amount: 10 }],
      granted: [
        { at: day(5), amount: 20 },
        { at: new Date(Date.UTC(2026, 11, 1, 12)), amount: 20 },
      ],
      range: { from: day(29, 0), to: new Date(2026, 11, 2, 12) },
      resolution: GraphResolution.ONE_DAY,
    });
    // Nov 29 -> 0.5; last bucket is in December: 0 used / 20 granted
    expect(s[0]?.value).toBeCloseTo(0.5);
    expect(s[s.length - 1]?.value).toBe(0);
  });
});
