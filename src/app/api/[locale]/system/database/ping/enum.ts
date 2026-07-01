/**
 * Database Ping Enums
 * Enums for database ping functionality
 */

import { scopedTranslation } from "next-vibe/database/ping/i18n";
import { createEnumOptions } from "next-vibe/unified-ui/_shared/enum";

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
