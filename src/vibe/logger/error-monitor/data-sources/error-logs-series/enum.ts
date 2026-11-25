/**
 * Error Logs Series - Enums
 */

import { createEnumOptions } from "../../../../unified-ui/_shared/enum";
import { scopedTranslation } from "./i18n";

/** What an error log series node counts. */
export const {
  enum: ErrorLogsMetric,
  options: ErrorLogsMetricOptions,
  Value: ErrorLogsMetricValue,
} = createEnumOptions(scopedTranslation, {
  OCCURRENCES: "enums.metric.occurrences",
  DISTINCT: "enums.metric.distinct",
  NEW: "enums.metric.new",
  OPEN_BACKLOG: "enums.metric.openBacklog",
});

/** Log level filter: errors, warnings or both. */
export const {
  enum: ErrorLogsLevelFilter,
  options: ErrorLogsLevelFilterOptions,
  Value: ErrorLogsLevelFilterValue,
} = createEnumOptions(scopedTranslation, {
  ALL: "enums.level.all",
  ERROR: "enums.level.error",
  WARN: "enums.level.warn",
});
