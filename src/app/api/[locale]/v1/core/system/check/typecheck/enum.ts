/**
 * Typecheck Enums
 * Enums for TypeScript type checking functionality
 */

import { createEnumOptions } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/enum-helpers";

/**
 * Typecheck Status
 */
export const { enum: TypecheckStatus, options: TypecheckStatusOptions } =
  createEnumOptions({
    PASSED: "core.system.dev.typecheck.status.passed" as const,
    FAILED: "core.system.dev.typecheck.status.failed" as const,
    RUNNING: "core.system.dev.typecheck.status.running" as const,
    SKIPPED: "core.system.dev.typecheck.status.skipped" as const,
  });

/**
 * Typecheck Severity
 */
export const { enum: TypecheckSeverity, options: TypecheckSeverityOptions } =
  createEnumOptions({
    ERROR: "core.system.dev.typecheck.severity.error" as const,
    WARNING: "core.system.dev.typecheck.severity.warning" as const,
    INFO: "core.system.dev.typecheck.severity.info" as const,
  });

/**
 * Typecheck Mode
 */
export const { enum: TypecheckMode, options: TypecheckModeOptions } =
  createEnumOptions({
    FULL: "core.system.dev.typecheck.mode.full" as const,
    INCREMENTAL: "core.system.dev.typecheck.mode.incremental" as const,
    WATCH: "core.system.dev.typecheck.mode.watch" as const,
  });
