import { AnalyticsRange } from "next-vibe/unified-ui/analytics/enum";
import { expect, test } from "vitest";

import { ErrorLogLevelFilter, ErrorLogStatusFilter } from "../error-monitor/logs/enum";
import { operationSummarySchema, summarizeOperations } from "./summary";

test("distinguishes a failed health source from a verified zero", () => {
  const summary = summarizeOperations("2026-11-25", { errors: null, tasks: 0, connections: 0 });
  expect(operationSummarySchema.safeParse(summary).success).toBe(true);
  expect(summary.attentionAvailable).toBe(false);
  expect(summary.kpis.map(({ value }) => value)).toEqual([null, 0, 0]);
  expect(summary.attention).toEqual([]);
});

test("links independent health issues to the owning reports", () => {
  const summary = summarizeOperations("2026-11-25", { errors: 3, tasks: 1, connections: 2 });
  expect(summary.attentionAvailable).toBe(true);
  expect(summary.attention.map(({ severity, drill }) => [severity, drill.alias])).toEqual([
    ["danger", "error-logs"], ["warning", "task-health"], ["warning", "remote-connections"],
  ]);
  expect(summary.attention[0]?.drill.args).toEqual({
    level: ErrorLogLevelFilter.ERROR,
    status: ErrorLogStatusFilter.ACTIVE,
    range: AnalyticsRange.ALL_TIME,
  });
});
