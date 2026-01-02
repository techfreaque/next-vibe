/**
 * Vibe Check Enums
 * Enums for vibe check system functionality
 */

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

/**
 * Check Type
 */
export const { enum: CheckType, options: CheckTypeOptions } = createEnumOptions({
  LINT: "app.api.system.check.vibeCheck.checkType.lint" as const,
  TYPECHECK: "app.api.system.check.vibeCheck.checkType.typecheck" as const,
  TEST: "app.api.system.check.vibeCheck.checkType.test" as const,
  STRUCTURE: "app.api.system.check.vibeCheck.checkType.structure" as const,
  MIGRATION: "app.api.system.check.vibeCheck.checkType.migration" as const,
  ALL: "app.api.system.check.vibeCheck.checkType.all" as const,
});

/**
 * Check Status
 */
export const { enum: CheckStatus, options: CheckStatusOptions } = createEnumOptions({
  PENDING: "app.api.system.check.vibeCheck.status.pending" as const,
  RUNNING: "app.api.system.check.vibeCheck.status.running" as const,
  PASSED: "app.api.system.check.vibeCheck.status.passed" as const,
  FAILED: "app.api.system.check.vibeCheck.status.failed" as const,
  WARNING: "app.api.system.check.vibeCheck.status.warning" as const,
  SKIPPED: "app.api.system.check.vibeCheck.status.skipped" as const,
});

/**
 * Check Severity
 */
export const { enum: CheckSeverity, options: CheckSeverityOptions } = createEnumOptions({
  ERROR: "app.api.system.check.vibeCheck.severity.error" as const,
  WARNING: "app.api.system.check.vibeCheck.severity.warning" as const,
  INFO: "app.api.system.check.vibeCheck.severity.info" as const,
  SUGGESTION: "app.api.system.check.vibeCheck.severity.suggestion" as const,
});

/**
 * Fix Action
 */
export const { enum: FixAction, options: FixActionOptions } = createEnumOptions({
  AUTO_FIX: "app.api.system.check.vibeCheck.fixAction.autoFix" as const,
  MANUAL_FIX: "app.api.system.check.vibeCheck.fixAction.manualFix" as const,
  IGNORE: "app.api.system.check.vibeCheck.fixAction.ignore" as const,
  REVIEW: "app.api.system.check.vibeCheck.fixAction.review" as const,
});

const vibeCheckEnums = {
  CheckType,
  CheckTypeOptions,
  CheckStatus,
  CheckStatusOptions,
  CheckSeverity,
  CheckSeverityOptions,
  FixAction,
  FixActionOptions,
};

export default vibeCheckEnums;
