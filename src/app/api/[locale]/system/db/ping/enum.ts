/**
 * Database Ping Enums
 * Enums for database ping functionality
 */

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

/**
 * Database Ping Status
 */
export const { enum: DbPingStatus, options: DbPingStatusOptions } =
  createEnumOptions({
    SUCCESS: "app.api.system.db.ping.status.success",
    FAILED: "app.api.system.db.ping.status.failed",
    TIMEOUT: "app.api.system.db.ping.status.timeout",
    ERROR: "app.api.system.db.ping.status.error",
  });

/**
 * Database Connection Type
 */
export const { enum: DbConnectionType, options: DbConnectionTypeOptions } =
  createEnumOptions({
    PRIMARY: "app.api.system.db.ping.connectionType.primary",
    REPLICA: "app.api.system.db.ping.connectionType.replica",
    CACHE: "app.api.system.db.ping.connectionType.cache",
  });
