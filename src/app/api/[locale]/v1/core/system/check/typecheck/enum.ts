/**
 * Typecheck Enums
 * Enums for TypeScript type checking functionality
 */

import { createEnumOptions } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enum-helpers";

/**
 * Typecheck Status
 */
export const { enum: TypecheckStatus, options: TypecheckStatusOptions } =
  createEnumOptions({
    PASSED: "app.api.v1.core.system.check.typecheck.status.passed" as const,
    FAILED: "app.api.v1.core.system.check.typecheck.status.failed" as const,
    RUNNING: "app.api.v1.core.system.check.typecheck.status.running" as const,
    SKIPPED: "app.api.v1.core.system.check.typecheck.status.skipped" as const,
  });

/**
 * Typecheck Severity
 */
export const { enum: TypecheckSeverity, options: TypecheckSeverityOptions } =
  createEnumOptions({
    ERROR: "app.api.v1.core.system.check.typecheck.severity.error" as const,
    WARNING: "app.api.v1.core.system.check.typecheck.severity.warning" as const,
    INFO: "app.api.v1.core.system.check.typecheck.severity.info" as const,
  });

/**
 * Typecheck Mode
 */
export const { enum: TypecheckMode, options: TypecheckModeOptions } =
  createEnumOptions({
    FULL: "app.api.v1.core.system.check.typecheck.mode.full" as const,
    INCREMENTAL:
      "app.api.v1.core.system.check.typecheck.mode.incremental" as const,
    WATCH: "app.api.v1.core.system.check.typecheck.mode.watch" as const,
  });
