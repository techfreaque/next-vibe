/**
 * Database Migration Enums
 * Enums for database migration functionality
 */

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

import { scopedTranslation } from "./i18n";

/**
 * Migration Status
 */
export const { enum: MigrationStatus, options: MigrationStatusOptions } =
  createEnumOptions(scopedTranslation, {
    PENDING: "status.pending",
    RUNNING: "status.running",
    SUCCESS: "status.success",
    FAILED: "status.failed",
    ROLLED_BACK: "status.rolledBack",
  });

/**
 * Migration Direction
 */
export const { enum: MigrationDirection, options: MigrationDirectionOptions } =
  createEnumOptions(scopedTranslation, {
    UP: "direction.up",
    DOWN: "direction.down",
  });

/**
 * Migration Environment
 */
export const {
  enum: MigrationEnvironment,
  options: MigrationEnvironmentOptions,
} = createEnumOptions(scopedTranslation, {
  DEVELOPMENT: "environment.development",
  STAGING: "environment.staging",
  PRODUCTION: "environment.production",
});
