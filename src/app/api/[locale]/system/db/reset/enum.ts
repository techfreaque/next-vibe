/**
 * Database Reset Enums
 * Enums for database reset functionality
 */

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

import { scopedTranslation } from "./i18n";

/**
 * Reset Type
 */
export const { enum: ResetType, options: ResetTypeOptions } = createEnumOptions(
  scopedTranslation,
  {
    TRUNCATE: "fields.mode.truncate" as const,
    DROP: "fields.mode.drop" as const,
    INITIALIZE: "fields.mode.initialize" as const,
  },
);

/**
 * Reset Status
 */
export const { enum: ResetStatus, options: ResetStatusOptions } =
  createEnumOptions(scopedTranslation, {
    PENDING: "status.pending" as const,
    RUNNING: "status.running" as const,
    SUCCESS: "status.success" as const,
    FAILED: "status.failed" as const,
    CANCELLED: "status.cancelled" as const,
  });
