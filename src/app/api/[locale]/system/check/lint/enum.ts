/**
 * Lint Enums
 * Enums for ESLint code linting functionality
 */

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

/**
 * Lint Status
 */
export const { enum: LintStatus, options: LintStatusOptions } =
  createEnumOptions({
    PASSED: "app.api.system.check.lint.status.passed" as const,
    FAILED: "app.api.system.check.lint.status.failed" as const,
    RUNNING: "app.api.system.check.lint.status.running" as const,
    SKIPPED: "app.api.system.check.lint.status.skipped" as const,
  });

/**
 * Lint Severity
 */
export const { enum: LintSeverity, options: LintSeverityOptions } =
  createEnumOptions({
    ERROR: "app.api.system.check.lint.severity.error" as const,
    WARNING: "app.api.system.check.lint.severity.warning" as const,
    INFO: "app.api.system.check.lint.severity.info" as const,
  });

/**
 * Lint Fix Action
 */
export const { enum: LintFixAction, options: LintFixActionOptions } =
  createEnumOptions({
    AUTO_FIX: "app.api.system.check.lint.fixAction.autoFix" as const,
    MANUAL_FIX: "app.api.system.check.lint.fixAction.manualFix" as const,
    IGNORE: "app.api.system.check.lint.fixAction.ignore" as const,
  });
