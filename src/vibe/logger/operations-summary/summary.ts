import {
  type CategorySummary,
  categorySummarySchema,
} from "next-vibe/unified-ui/_shared/category-summary";
import { AnalyticsRange } from "next-vibe/unified-ui/analytics/enum";
import { z } from "zod";

import {
  ErrorLogLevelFilter,
  ErrorLogStatusFilter,
} from "../error-monitor/logs/enum";

const openErrors = {
  alias: "error-logs",
  args: {
    level: ErrorLogLevelFilter.ERROR,
    status: ErrorLogStatusFilter.ACTIVE,
    range: AnalyticsRange.ALL_TIME,
  },
};

const labels = z.enum([
  "errors",
  "tasks",
  "connections",
  "errorAlert",
  "taskAlert",
  "connectionAlert",
]);
export const operationSummarySchema = categorySummarySchema(labels);
export type OperationsSummary = CategorySummary<z.infer<typeof labels>>;

interface Counts {
  errors: number | null;
  tasks: number | null;
  connections: number | null;
}

export function summarizeOperations(
  day: string,
  counts: Counts,
): OperationsSummary {
  const { errors, tasks, connections } = counts;
  return {
    from: day,
    to: day,
    kpis: [
      {
        label: "errors",
        value: errors,
        format: "number",
        drill: openErrors,
      },
      {
        label: "tasks",
        value: tasks,
        format: "number",
        drill: { alias: "task-health" },
      },
      {
        label: "connections",
        value: connections,
        format: "number",
        drill: { alias: "remote-connections" },
      },
    ],
    attentionAvailable:
      errors !== null && tasks !== null && connections !== null,
    attention: [
      ...(errors
        ? [
            {
              label: "errorAlert",
              count: errors,
              severity: "danger",
              drill: openErrors,
            } as const,
          ]
        : []),
      ...(tasks
        ? [
            {
              label: "taskAlert",
              count: tasks,
              severity: "warning",
              drill: { alias: "task-health" },
            } as const,
          ]
        : []),
      ...(connections
        ? [
            {
              label: "connectionAlert",
              count: connections,
              severity: "warning",
              drill: { alias: "remote-connections" },
            } as const,
          ]
        : []),
    ],
    recent: [],
  };
}
