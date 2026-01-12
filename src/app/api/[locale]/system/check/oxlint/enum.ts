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
    PASSED: "app.api.system.check.oxlint.status.passed" as const,
    FAILED: "app.api.system.check.oxlint.status.failed" as const,
    RUNNING: "app.api.system.check.oxlint.status.running" as const,
    SKIPPED: "app.api.system.check.oxlint.status.skipped" as const,
  });

/**
 * Lint Severity
 */
export const { enum: LintSeverity, options: LintSeverityOptions } =
  createEnumOptions({
    ERROR: "app.api.system.check.oxlint.severity.error" as const,
    WARNING: "app.api.system.check.oxlint.severity.warning" as const,
    INFO: "app.api.system.check.oxlint.severity.info" as const,
  });

/**
 * Lint Fix Action
 */
export const { enum: LintFixAction, options: LintFixActionOptions } =
  createEnumOptions({
    AUTO_FIX: "app.api.system.check.oxlint.fixAction.autoFix" as const,
    MANUAL_FIX: "app.api.system.check.oxlint.fixAction.manualFix" as const,
    IGNORE: "app.api.system.check.oxlint.fixAction.ignore" as const,
  });
