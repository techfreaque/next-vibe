/**
 * Typecheck Enums
 * Enums for TypeScript type checking functionality
 */

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

/**
 * Typecheck Status
 */
export const { enum: TypecheckStatus, options: TypecheckStatusOptions } = createEnumOptions({
  PASSED: "app.api.system.check.typecheck.status.passed" as const,
  FAILED: "app.api.system.check.typecheck.status.failed" as const,
  RUNNING: "app.api.system.check.typecheck.status.running" as const,
  SKIPPED: "app.api.system.check.typecheck.status.skipped" as const,
});

/**
 * Typecheck Severity
 */
export const { enum: TypecheckSeverity, options: TypecheckSeverityOptions } = createEnumOptions({
  ERROR: "app.api.system.check.typecheck.severity.error" as const,
  WARNING: "app.api.system.check.typecheck.severity.warning" as const,
  INFO: "app.api.system.check.typecheck.severity.info" as const,
});

/**
 * Typecheck Mode
 */
export const { enum: TypecheckMode, options: TypecheckModeOptions } = createEnumOptions({
  FULL: "app.api.system.check.typecheck.mode.full" as const,
  INCREMENTAL: "app.api.system.check.typecheck.mode.incremental" as const,
  WATCH: "app.api.system.check.typecheck.mode.watch" as const,
});
