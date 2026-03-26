/**
 * Server System Enums
 * Defines enumeration values for server management operations
 */

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

import { scopedTranslation } from "./i18n";

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
  { value: ServerFramework.NEXT, label: "Next.js" },
  { value: ServerFramework.TANSTACK, label: "TanStack/Vite" },
];
