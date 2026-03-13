/**
 * Error Groups Status Filter Enum
 * Using createEnumOptions pattern for i18n-friendly select options
 */

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

import { scopedTranslation } from "./i18n";

/**
 * Status filter for error groups
 * All = show all groups, Active = unresolved, Resolved = resolved
 */
export const {
  enum: ErrorGroupStatusFilter,
  options: ErrorGroupStatusFilterOptions,
  Value: ErrorGroupStatusFilterValue,
} = createEnumOptions(scopedTranslation, {
  ALL: "statusFilter.all" as const,
  ACTIVE: "statusFilter.active" as const,
  RESOLVED: "statusFilter.resolved" as const,
});

export const ErrorGroupStatusFilterDB = [
  ErrorGroupStatusFilter.ALL,
  ErrorGroupStatusFilter.ACTIVE,
  ErrorGroupStatusFilter.RESOLVED,
] as const;
