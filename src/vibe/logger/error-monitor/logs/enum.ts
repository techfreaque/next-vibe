/**
 * Error Log Status Filter Enum
 * Using createEnumOptions pattern for i18n-friendly select options
 */

import { createEnumOptions } from "../../../unified-ui/_shared/enum";
import { scopedTranslation } from "./i18n";

/**
 * Status filter for error logs
 * All = show all logs, Active = unresolved, Resolved = resolved
 */
export const {
  enum: ErrorLogStatusFilter,
  options: ErrorLogStatusFilterOptions,
  Value: ErrorLogStatusFilterValue,
} = createEnumOptions(scopedTranslation, {
  ALL: "statusFilter.all" as const,
  ACTIVE: "statusFilter.active" as const,
  RESOLVED: "statusFilter.resolved" as const,
});

export const ErrorLogStatusFilterDB = [
  ErrorLogStatusFilter.ALL,
  ErrorLogStatusFilter.ACTIVE,
  ErrorLogStatusFilter.RESOLVED,
] as const;

/** Log level filter */
export const {
  enum: ErrorLogLevelFilter,
  options: ErrorLogLevelFilterOptions,
  Value: ErrorLogLevelFilterValue,
} = createEnumOptions(scopedTranslation, {
  ALL: "levelFilter.all" as const,
  ERROR: "levelFilter.error" as const,
  WARN: "levelFilter.warn" as const,
});

export const ErrorLogLevelFilterDB = [
  ErrorLogLevelFilter.ALL,
  ErrorLogLevelFilter.ERROR,
  ErrorLogLevelFilter.WARN,
] as const;

/** Where the error was raised: browser (client-log) or server */
export const {
  enum: ErrorLogSourceFilter,
  options: ErrorLogSourceFilterOptions,
  Value: ErrorLogSourceFilterValue,
} = createEnumOptions(scopedTranslation, {
  ALL: "sourceFilter.all" as const,
  CLIENT: "sourceFilter.client" as const,
  SERVER: "sourceFilter.server" as const,
});

export const ErrorLogSourceFilterDB = [
  ErrorLogSourceFilter.ALL,
  ErrorLogSourceFilter.CLIENT,
  ErrorLogSourceFilter.SERVER,
] as const;

/** How the occurrences chart splits its stacks */
export const {
  enum: ErrorLogTrendSplit,
  options: ErrorLogTrendSplitOptions,
  Value: ErrorLogTrendSplitValue,
} = createEnumOptions(scopedTranslation, {
  NEW_VS_RECURRING: "trendSplit.newVsRecurring" as const,
  LEVEL: "trendSplit.level" as const,
  SOURCE: "trendSplit.source" as const,
});

export const ErrorLogTrendSplitDB = [
  ErrorLogTrendSplit.NEW_VS_RECURRING,
  ErrorLogTrendSplit.LEVEL,
  ErrorLogTrendSplit.SOURCE,
] as const;

/** List order */
export const {
  enum: ErrorLogSort,
  options: ErrorLogSortOptions,
  Value: ErrorLogSortValue,
} = createEnumOptions(scopedTranslation, {
  WINDOW_OCCURRENCES: "sort.windowOccurrences" as const,
  LAST_SEEN: "sort.lastSeen" as const,
  FIRST_SEEN: "sort.firstSeen" as const,
  TOTAL_OCCURRENCES: "sort.totalOccurrences" as const,
});

export const ErrorLogSortDB = [
  ErrorLogSort.WINDOW_OCCURRENCES,
  ErrorLogSort.LAST_SEEN,
  ErrorLogSort.FIRST_SEEN,
  ErrorLogSort.TOTAL_OCCURRENCES,
] as const;

/** Series keys of the occurrences chart */
export const ERROR_LOG_TREND_SERIES = {
  NEW: "new",
  RECURRING: "recurring",
  ERROR: "error",
  WARN: "warn",
  CLIENT: "client",
  SERVER: "server",
} as const;
