/**
 * Database Ping Enums
 * Enums for database ping functionality
 */

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

import { scopedTranslation } from "./i18n";

/**
 * Database Ping Status
 */
export const { enum: DbPingStatus, options: DbPingStatusOptions } =
  createEnumOptions(scopedTranslation, {
    SUCCESS: "status.success",
    FAILED: "status.failed",
    TIMEOUT: "status.timeout",
    ERROR: "status.error",
  });

/**
 * Database Connection Type
 */
export const { enum: DbConnectionType, options: DbConnectionTypeOptions } =
  createEnumOptions(scopedTranslation, {
    PRIMARY: "connectionType.primary",
    REPLICA: "connectionType.replica",
    CACHE: "connectionType.cache",
  });
