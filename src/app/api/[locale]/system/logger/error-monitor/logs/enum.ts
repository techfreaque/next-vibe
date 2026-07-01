/**
 * Error Log Status Filter Enum
 * Using createEnumOptions pattern for i18n-friendly select options
 */

import { scopedTranslation } from "next-vibe/logger/error-monitor/logs/i18n";
import { createEnumOptions } from "next-vibe/unified-ui/_shared/enum";

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
