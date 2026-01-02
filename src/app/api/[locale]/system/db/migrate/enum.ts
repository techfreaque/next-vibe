/**
 * Database Migration Enums
 * Enums for database migration functionality
 */

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

/**
 * Migration Status
 */
export const { enum: MigrationStatus, options: MigrationStatusOptions } = createEnumOptions({
  PENDING: "app.api.system.db.migrate.status.pending",
  RUNNING: "app.api.system.db.migrate.status.running",
  SUCCESS: "app.api.system.db.migrate.status.success",
  FAILED: "app.api.system.db.migrate.status.failed",
  ROLLED_BACK: "app.api.system.db.migrate.status.rolledBack",
});

/**
 * Migration Direction
 */
export const { enum: MigrationDirection, options: MigrationDirectionOptions } = createEnumOptions({
  UP: "app.api.system.db.migrate.direction.up",
  DOWN: "app.api.system.db.migrate.direction.down",
});

/**
 * Migration Environment
 */
export const { enum: MigrationEnvironment, options: MigrationEnvironmentOptions } =
  createEnumOptions({
    DEVELOPMENT: "app.api.system.db.migrate.environment.development",
    STAGING: "app.api.system.db.migrate.environment.staging",
    PRODUCTION: "app.api.system.db.migrate.environment.production",
  });
