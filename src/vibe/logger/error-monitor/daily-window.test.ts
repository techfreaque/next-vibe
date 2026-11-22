/**
 * Live daily error history starts 2026-11-22; the backfilled rows before it
 * hold each class's lifetime total on its last-seen day and must never count
 * as "in period", and an untracked previous period is no data, not zero.
 */

import { expect, test } from "bun:test";

import { AnalyticsRange } from "../../unified-ui/analytics/enum";
import { resolveAnalyticsWindow } from "../../unified-ui/analytics/window";
import { dailyHistoryWindow, ERROR_LOG_DAILY_SINCE } from "./daily";

test("a window reaching back before live history is clamped, no previous", () => {
  const win = resolveAnalyticsWindow(
    { range: AnalyticsRange.LAST_30_DAYS },
    new Date("2026-11-22T13:00:00Z"),
  );
  const daily = dailyHistoryWindow(win);
  expect(daily.from.toISOString()).toBe(ERROR_LOG_DAILY_SINCE.toISOString());
  expect(daily.to.toISOString()).toBe(win.to.toISOString());
  expect(daily.previousFrom).toBeNull();
  expect(daily.previousTo).toBeNull();
});

test("a window fully inside live history keeps its comparison", () => {
  const win = resolveAnalyticsWindow(
    { range: AnalyticsRange.LAST_7_DAYS },
    new Date("2026-12-20T13:00:00Z"),
  );
  const daily = dailyHistoryWindow(win);
  expect(daily.from.toISOString()).toBe(win.from.toISOString());
  expect(daily.previousFrom?.toISOString()).toBe(
    win.previousFrom?.toISOString(),
  );
});

test("a window that ends before live history is empty", () => {
  const win = resolveAnalyticsWindow(
    { range: AnalyticsRange.CUSTOM, from: "2026-10-01", to: "2026-10-07" },
    new Date("2026-11-22T13:00:00Z"),
  );
  const daily = dailyHistoryWindow(win);
  expect(daily.from.getTime()).toBe(daily.to.getTime());
});
