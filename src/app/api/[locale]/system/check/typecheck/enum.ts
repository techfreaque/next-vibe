/**
 * Typecheck Enums
 * Enums for TypeScript type checking functionality
 */

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

import { scopedTranslation } from "./i18n";

/**
 * Typecheck Status
 */
export const { enum: TypecheckStatus, options: TypecheckStatusOptions } =
  createEnumOptions(scopedTranslation, {
    PASSED: "status.passed" as const,
    FAILED: "status.failed" as const,
    RUNNING: "status.running" as const,
    SKIPPED: "status.skipped" as const,
  });

/**
 * Typecheck Severity
 */
export const { enum: TypecheckSeverity, options: TypecheckSeverityOptions } =
  createEnumOptions(scopedTranslation, {
    ERROR: "severity.error" as const,
    WARNING: "severity.warning" as const,
    INFO: "severity.info" as const,
  });

/**
 * Typecheck Mode
 */
export const { enum: TypecheckMode, options: TypecheckModeOptions } =
  createEnumOptions(scopedTranslation, {
    FULL: "mode.full" as const,
    INCREMENTAL: "mode.incremental" as const,
    WATCH: "mode.watch" as const,
  });
