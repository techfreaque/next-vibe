/**
 * Vibe Check Enums
 * Enums for vibe check system functionality
 */

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

import { scopedTranslation } from "./i18n";

/**
 * Check Type
 */
export const { enum: CheckType, options: CheckTypeOptions } = createEnumOptions(
  scopedTranslation,
  {
    LINT: "checkType.lint" as const,
    TYPECHECK: "checkType.typecheck" as const,
    TEST: "checkType.test" as const,
    STRUCTURE: "checkType.structure" as const,
    MIGRATION: "checkType.migration" as const,
    ALL: "checkType.all" as const,
  },
);

/**
 * Check Status
 */
export const { enum: CheckStatus, options: CheckStatusOptions } =
  createEnumOptions(scopedTranslation, {
    PENDING: "status.pending" as const,
    RUNNING: "status.running" as const,
    PASSED: "status.passed" as const,
    FAILED: "status.failed" as const,
    WARNING: "status.warning" as const,
    SKIPPED: "status.skipped" as const,
  });

/**
 * Check Severity
 */
export const { enum: CheckSeverity, options: CheckSeverityOptions } =
  createEnumOptions(scopedTranslation, {
    ERROR: "severity.error" as const,
    WARNING: "severity.warning" as const,
    INFO: "severity.info" as const,
    SUGGESTION: "severity.suggestion" as const,
  });

/**
 * Fix Action
 */
export const { enum: FixAction, options: FixActionOptions } = createEnumOptions(
  scopedTranslation,
  {
    AUTO_FIX: "fixAction.autoFix" as const,
    MANUAL_FIX: "fixAction.manualFix" as const,
    IGNORE: "fixAction.ignore" as const,
    REVIEW: "fixAction.review" as const,
  },
);

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
