/**
 * Server System Enums
 * Defines enumeration values for server management operations
 */

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

/**
 * Process Status Enum
 * Represents the status of server processes
 */
export const { enum: ProcessStatus, options: ProcessStatusOptions } = createEnumOptions({
  RUNNING: "app.api.system.server.enum.processStatus.running",
  STOPPED: "app.api.system.server.enum.processStatus.stopped",
  ERROR: "app.api.system.server.enum.processStatus.error",
});

/**
 * Server Environment Enum
 * Represents different server environments
 */
export const { enum: ServerEnvironment, options: ServerEnvironmentOptions } = createEnumOptions({
  DEVELOPMENT: "app.api.system.server.enum.environment.development",
  PRODUCTION: "app.api.system.server.enum.environment.production",
  TESTING: "app.api.system.server.enum.environment.testing",
  STAGING: "app.api.system.server.enum.environment.staging",
});

/**
 * Server Mode Enum
 * Represents different server running modes
 */
export const { enum: ServerMode, options: ServerModeOptions } = createEnumOptions({
  DEVELOPMENT: "app.api.system.server.enum.mode.development",
  PRODUCTION: "app.api.system.server.enum.mode.production",
});
