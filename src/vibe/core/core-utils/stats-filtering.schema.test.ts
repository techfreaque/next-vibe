/**
 * resolveStatsDateRange: a custom from/to must actually drive the window
 * (leads/stats used to ignore it and always return the last 30 days).
 */

import { describe, expect, it } from "vitest";

import {
  DateRangePreset,
  dateSchema,
  getDateRangeFromPreset,
  resolveStatsDateRange,
} from "./stats-filtering.schema";

describe("resolveStatsDateRange", () => {
  it("uses the preset when no dates are given", () => {
    const resolved = resolveStatsDateRange(
      DateRangePreset.LAST_7_DAYS,
      undefined,
      undefined,
    );
    const preset = getDateRangeFromPreset(DateRangePreset.LAST_7_DAYS);
    expect(resolved.from.getTime()).toBe(preset.from.getTime());
  });

  it("custom range spans whole UTC days, inclusive of the end day", () => {
    const { from, to } = resolveStatsDateRange(
      DateRangePreset.CUSTOM,
      new Date("2026-01-01"),
      new Date("2026-01-31"),
    );
    expect(from.toISOString()).toBe("2026-01-01T00:00:00.000Z");
    expect(to.toISOString()).toBe("2026-01-31T23:59:59.999Z");
  });

  it("explicit dates win over a non-custom preset", () => {
    const { from, to } = resolveStatsDateRange(
      DateRangePreset.TODAY,
      new Date("2025-06-10"),
      new Date("2025-06-12"),
    );
    expect(from.toISOString()).toBe("2025-06-10T00:00:00.000Z");
    expect(to.toISOString()).toBe("2025-06-12T23:59:59.999Z");
  });

  it("swaps an inverted range", () => {
    const { from, to } = resolveStatsDateRange(
      DateRangePreset.CUSTOM,
      new Date("2026-03-20"),
      new Date("2026-03-01"),
    );
    expect(from.toISOString()).toBe("2026-03-01T00:00:00.000Z");
    expect(to.toISOString()).toBe("2026-03-20T23:59:59.999Z");
  });

  it("ignores invalid dates and falls back to the preset", () => {
    const resolved = resolveStatsDateRange(
      DateRangePreset.LAST_30_DAYS,
      new Date("not a date"),
      undefined,
    );
    const preset = getDateRangeFromPreset(DateRangePreset.LAST_30_DAYS);
    expect(resolved.from.getTime()).toBe(preset.from.getTime());
  });

  it("a single bound fills the other end", () => {
    const { from, to } = resolveStatsDateRange(
      DateRangePreset.CUSTOM,
      undefined,
      new Date("2026-02-15"),
    );
    expect(to.toISOString()).toBe("2026-02-15T23:59:59.999Z");
    expect(from.getTime()).toBeLessThanOrEqual(to.getTime());
  });
});

describe("dateSchema", () => {
  it("parses a JSON-quoted ISO string from a GET query param", () => {
    const parsed = dateSchema.parse('"2026-01-05T00:00:00.000Z"');
    expect(parsed.toISOString()).toBe("2026-01-05T00:00:00.000Z");
  });

  it("parses a bare ISO string", () => {
    expect(dateSchema.parse("2026-01-05").toISOString()).toBe(
      "2026-01-05T00:00:00.000Z",
    );
  });
});
