import { describe, expect, it } from "vitest";

import { monthRange, reportDay, reportPeriodRange } from "./report-period";

describe("ERP report calendar periods", () => {
  it("uses inclusive UTC dates and starts the quarter in the correct month", () => {
    const now = new Date("2024-05-17T23:12:54Z");
    const dates = (preset: Parameters<typeof reportPeriodRange>[0]): string[] => {
      const { from, to } = reportPeriodRange(preset, now);
      return [reportDay(from), reportDay(to)];
    };
    expect(dates("thisMonth")).toEqual(["2024-05-01", "2024-05-17"]);
    expect(dates("lastMonth")).toEqual(["2024-04-01", "2024-04-30"]);
    expect(dates("thisQuarter")).toEqual(["2024-04-01", "2024-05-17"]);
    expect(dates("yearToDate")).toEqual(["2024-01-01", "2024-05-17"]);
    expect(dates("lastYear")).toEqual(["2023-01-01", "2023-12-31"]);
  });

  it("crosses the year boundary and supports a complete leap month", () => {
    const { from, to } = reportPeriodRange("lastMonth", new Date("2024-01-02"));
    expect([reportDay(from), reportDay(to)]).toEqual(["2023-12-01", "2023-12-31"]);
    const bounds = monthRange("2024-02");
    expect([reportDay(bounds.start), reportDay(bounds.end)])
      .toEqual(["2024-02-01", "2024-03-01"]);
  });
});
