/**
 * Lint Enums
 * Enums for ESLint code linting functionality
 */

import { createEnumOptions } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/field/enum";

/**
 * Lint Status
 */
export const { enum: LintStatus, options: LintStatusOptions } =
  createEnumOptions({
    PASSED: "app.api.v1.core.system.check.lint.status.passed" as const,
    FAILED: "app.api.v1.core.system.check.lint.status.failed" as const,
    RUNNING: "app.api.v1.core.system.check.lint.status.running" as const,
    SKIPPED: "app.api.v1.core.system.check.lint.status.skipped" as const,
  });

/**
 * Lint Severity
 */
export const { enum: LintSeverity, options: LintSeverityOptions } =
  createEnumOptions({
    ERROR: "app.api.v1.core.system.check.lint.severity.error" as const,
    WARNING: "app.api.v1.core.system.check.lint.severity.warning" as const,
    INFO: "app.api.v1.core.system.check.lint.severity.info" as const,
  });

/**
 * Lint Fix Action
 */
export const { enum: LintFixAction, options: LintFixActionOptions } =
  createEnumOptions({
    AUTO_FIX: "app.api.v1.core.system.check.lint.fixAction.autoFix" as const,
    MANUAL_FIX:
      "app.api.v1.core.system.check.lint.fixAction.manualFix" as const,
    IGNORE: "app.api.v1.core.system.check.lint.fixAction.ignore" as const,
  });
