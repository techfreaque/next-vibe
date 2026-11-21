import { describe, expect, it } from "bun:test";

import { AnalyticsGranularity, AnalyticsRange } from "./enum";
import { formatAnalyticsValue, niceTicks, sparkline } from "./format";
import {
  bucketKey,
  fillBuckets,
  percentChange,
  resolveAnalyticsWindow,
  serializeWindow,
} from "./window";

const NOW = new Date("2026-11-21T15:30:00.000Z");

describe("resolveAnalyticsWindow", () => {
  it("covers the last 30 full days including today, with a same-length previous window", () => {
    const w = resolveAnalyticsWindow({ range: AnalyticsRange.LAST_30_DAYS }, NOW);
    expect(w.from.toISOString()).toBe("2026-10-23T00:00:00.000Z");
    expect(w.to.toISOString()).toBe("2026-11-22T00:00:00.000Z");
    expect(w.previousFrom?.toISOString()).toBe("2026-09-23T00:00:00.000Z");
    expect(w.previousTo?.toISOString()).toBe("2026-10-23T00:00:00.000Z");
    expect(w.bucket).toBe("day");
    expect(w.buckets).toHaveLength(30);
    expect(w.buckets[0]).toBe("2026-10-23");
    expect(w.buckets.at(-1)).toBe("2026-11-21");
    expect(serializeWindow(w).to).toBe("2026-11-21");
  });

  it("picks weekly buckets for 6-12 months and Monday-start weeks", () => {
    const w = resolveAnalyticsWindow({ range: AnalyticsRange.LAST_12_MONTHS }, NOW);
    expect(w.bucket).toBe("week");
    // 2026-11-21 is a Saturday, its ISO week starts Monday 2026-11-16
    expect(w.buckets.at(-1)).toBe("2026-11-16");
    expect(bucketKey(new Date("2026-11-16T00:00:00Z"), "week")).toBe("2026-11-16");
  });

  it("honors explicit granularity and custom inclusive dates", () => {
    const w = resolveAnalyticsWindow(
      {
        range: AnalyticsRange.CUSTOM,
        from: "2026-09-01",
        to: "2026-10-31",
        granularity: AnalyticsGranularity.MONTH,
      },
      NOW,
    );
    expect(w.from.toISOString()).toBe("2026-09-01T00:00:00.000Z");
    expect(w.to.toISOString()).toBe("2026-11-01T00:00:00.000Z");
    expect(w.buckets).toEqual(["2026-09-01", "2026-10-01"]);
  });

  it("has no previous window for all time and starts at the data floor", () => {
    const w = resolveAnalyticsWindow(
      { range: AnalyticsRange.ALL_TIME },
      NOW,
      new Date("2026-03-05T10:00:00Z"),
    );
    expect(w.previousFrom).toBeNull();
    expect(w.from.toISOString()).toBe("2026-03-05T00:00:00.000Z");
    expect(w.bucket).toBe("week");
  });
});

describe("helpers", () => {
  it("fills missing buckets with zero", () => {
    expect(
      fillBuckets(["a", "b", "c"], [
        { bucket: "c", value: 2 },
        { bucket: "a", value: 1 },
      ]),
    ).toEqual([1, 0, 2]);
  });

  it("computes comparable deltas only", () => {
    expect(percentChange(120, 100)).toBeCloseTo(0.2);
    expect(percentChange(5, 0)).toBeNull();
    expect(percentChange(0, 0)).toBe(0);
    expect(percentChange(5, null)).toBeNull();
  });

  it("formats values and ticks", () => {
    expect(formatAnalyticsValue(0.256, { format: "percent", locale: "en-US" })).toBe("26%");
    expect(formatAnalyticsValue(1234.5, { format: "currency", currency: "USD", locale: "en-US" })).toBe("$1,235");
    expect(niceTicks(87)).toEqual([0, 50, 100]);
    expect(sparkline([0, 1, 2, 3])).toHaveLength(4);
  });
});
