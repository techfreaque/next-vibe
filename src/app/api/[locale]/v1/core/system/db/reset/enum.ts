/**
 * Database Reset Enums
 * Enums for database reset functionality
 */

import { createEnumOptions } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enum-helpers";

/**
 * Reset Type
 */
export const { enum: ResetType, options: ResetTypeOptions } = createEnumOptions(
  {
    TRUNCATE: "app.api.v1.core.system.db.reset.fields.mode.truncate" as const,
    DROP: "app.api.v1.core.system.db.reset.fields.mode.drop" as const,
    INITIALIZE:
      "app.api.v1.core.system.db.reset.fields.mode.initialize" as const,
  },
);

/**
 * Reset Status
 */
export const { enum: ResetStatus, options: ResetStatusOptions } =
  createEnumOptions({
    PENDING: "app.api.v1.core.system.db.reset.status.pending" as const,
    RUNNING: "app.api.v1.core.system.db.reset.status.running" as const,
    SUCCESS: "app.api.v1.core.system.db.reset.status.success" as const,
    FAILED: "app.api.v1.core.system.db.reset.status.failed" as const,
    CANCELLED: "app.api.v1.core.system.db.reset.status.cancelled" as const,
  });
