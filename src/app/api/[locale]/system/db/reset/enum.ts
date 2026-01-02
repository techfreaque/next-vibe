/**
 * Database Reset Enums
 * Enums for database reset functionality
 */

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

/**
 * Reset Type
 */
export const { enum: ResetType, options: ResetTypeOptions } = createEnumOptions({
  TRUNCATE: "app.api.system.db.reset.fields.mode.truncate" as const,
  DROP: "app.api.system.db.reset.fields.mode.drop" as const,
  INITIALIZE: "app.api.system.db.reset.fields.mode.initialize" as const,
});

/**
 * Reset Status
 */
export const { enum: ResetStatus, options: ResetStatusOptions } = createEnumOptions({
  PENDING: "app.api.system.db.reset.status.pending" as const,
  RUNNING: "app.api.system.db.reset.status.running" as const,
  SUCCESS: "app.api.system.db.reset.status.success" as const,
  FAILED: "app.api.system.db.reset.status.failed" as const,
  CANCELLED: "app.api.system.db.reset.status.cancelled" as const,
});
