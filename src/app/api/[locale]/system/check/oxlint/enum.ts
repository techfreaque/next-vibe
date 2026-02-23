/**
 * Lint Enums
 * Enums for ESLint code linting functionality
 */

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

import { scopedTranslation } from "./i18n";

/**
 * Lint Status
 */
export const { enum: LintStatus, options: LintStatusOptions } =
  createEnumOptions(scopedTranslation, {
    PASSED: "status.passed" as const,
    FAILED: "status.failed" as const,
    RUNNING: "status.running" as const,
    SKIPPED: "status.skipped" as const,
  });

/**
 * Lint Severity
 */
export const { enum: LintSeverity, options: LintSeverityOptions } =
  createEnumOptions(scopedTranslation, {
    ERROR: "severity.error" as const,
    WARNING: "severity.warning" as const,
    INFO: "severity.info" as const,
  });

/**
 * Lint Fix Action
 */
export const { enum: LintFixAction, options: LintFixActionOptions } =
  createEnumOptions(scopedTranslation, {
    AUTO_FIX: "fixAction.autoFix" as const,
    MANUAL_FIX: "fixAction.manualFix" as const,
    IGNORE: "fixAction.ignore" as const,
  });
