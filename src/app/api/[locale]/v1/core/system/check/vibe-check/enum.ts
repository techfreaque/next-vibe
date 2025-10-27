/**
 * Vibe Check Enums
 * Enums for vibe check system functionality
 */

import { createEnumOptions } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enum-helpers";

/**
 * Check Type
 */
export const { enum: CheckType, options: CheckTypeOptions } = createEnumOptions(
  {
    LINT: "app.api.v1.core.system.check.vibeCheck.checkType.lint" as const,
    TYPECHECK:
      "app.api.v1.core.system.check.vibeCheck.checkType.typecheck" as const,
    TEST: "app.api.v1.core.system.check.vibeCheck.checkType.test" as const,
    STRUCTURE:
      "app.api.v1.core.system.check.vibeCheck.checkType.structure" as const,
    MIGRATION:
      "app.api.v1.core.system.check.vibeCheck.checkType.migration" as const,
    ALL: "app.api.v1.core.system.check.vibeCheck.checkType.all" as const,
  },
);

/**
 * Check Status
 */
export const { enum: CheckStatus, options: CheckStatusOptions } =
  createEnumOptions({
    PENDING: "app.api.v1.core.system.check.vibeCheck.status.pending" as const,
    RUNNING: "app.api.v1.core.system.check.vibeCheck.status.running" as const,
    PASSED: "app.api.v1.core.system.check.vibeCheck.status.passed" as const,
    FAILED: "app.api.v1.core.system.check.vibeCheck.status.failed" as const,
    WARNING: "app.api.v1.core.system.check.vibeCheck.status.warning" as const,
    SKIPPED: "app.api.v1.core.system.check.vibeCheck.status.skipped" as const,
  });

/**
 * Check Severity
 */
export const { enum: CheckSeverity, options: CheckSeverityOptions } =
  createEnumOptions({
    ERROR: "app.api.v1.core.system.check.vibeCheck.severity.error" as const,
    WARNING: "app.api.v1.core.system.check.vibeCheck.severity.warning" as const,
    INFO: "app.api.v1.core.system.check.vibeCheck.severity.info" as const,
    SUGGESTION:
      "app.api.v1.core.system.check.vibeCheck.severity.suggestion" as const,
  });

/**
 * Fix Action
 */
export const { enum: FixAction, options: FixActionOptions } = createEnumOptions(
  {
    AUTO_FIX:
      "app.api.v1.core.system.check.vibeCheck.fixAction.autoFix" as const,
    MANUAL_FIX:
      "app.api.v1.core.system.check.vibeCheck.fixAction.manualFix" as const,
    IGNORE: "app.api.v1.core.system.check.vibeCheck.fixAction.ignore" as const,
    REVIEW: "app.api.v1.core.system.check.vibeCheck.fixAction.review" as const,
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
