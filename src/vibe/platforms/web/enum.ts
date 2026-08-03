/**
 * Server System Enums
 * Defines enumeration values for server management operations
 */

import { scopedTranslation } from "./i18n";
import { createEnumOptions } from "../../unified-ui/_shared/enum";

/**
 * Process Status Enum
 * Represents the status of server processes
 */
export const { enum: ProcessStatus, options: ProcessStatusOptions } =
  createEnumOptions(scopedTranslation, {
    RUNNING: "enum.processStatus.running",
    STOPPED: "enum.processStatus.stopped",
    ERROR: "enum.processStatus.error",
  });

/**
 * Server Mode Enum
 * Represents different server running modes
 */
export const { enum: ServerMode, options: ServerModeOptions } =
  createEnumOptions(scopedTranslation, {
    DEVELOPMENT: "enum.mode.development",
    PRODUCTION: "enum.mode.production",
  });

export enum ServerFramework {
  NEXT = "next",
  TANSTACK = "tanstack",
}

export const ServerFrameworkOptions = [
  {
    value: ServerFramework.NEXT,
    label: "enum.framework.next" as const,
  },
  {
    value: ServerFramework.TANSTACK,
    label: "enum.framework.tanstack" as const,
  },
] as const;
