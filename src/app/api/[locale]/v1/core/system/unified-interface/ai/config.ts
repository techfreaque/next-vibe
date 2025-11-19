/**
 * AI Platform Configuration
 */

import "server-only";

import {
  type Methods,
  ALL_METHODS,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import { Platform } from "../shared/types/platform";

/**
 * AI-specific configuration
 */
export interface AIPlatformSpecific {
  maxToolsPerRequest: number;
  enableConfirmation: boolean;
  dangerousOperations: boolean;
}

/**
 * Base platform configuration
 */
export interface BasePlatformConfig {
  platform: Platform;
  rootDir: string;
  excludePaths: string[];
  includeMethods: Methods[];
  cache: {
    enabled: boolean;
    ttl: number;
    maxSize: number;
  };
  rateLimit?: {
    enabled: boolean;
    maxRequests: number;
    windowMs: number;
  };
  features: {
    parallelExecution: boolean;
    streaming: boolean;
    resultCaching: boolean;
    composition: boolean;
  };
}

/**
 * Platform configuration with platform-specific settings
 */
export interface PlatformConfig<T = AIPlatformSpecific>
  extends BasePlatformConfig {
  platformSpecific?: T;
}

/**
 * Default configuration
 */
const DEFAULT_CONFIG: Omit<PlatformConfig, "platform"> = {
  rootDir: "src/app/api/[locale]/v1",
  excludePaths: [
    "system/builder",
    "system/launchpad",
    "system/release-tool",
    "system/guard",
    "node_modules",
    ".next",
    "dist",
  ],
  includeMethods: [...ALL_METHODS],
  cache: {
    enabled: true,
    ttl: 5 * 60 * 1000,
    maxSize: 1000,
  },
  features: {
    parallelExecution: true,
    streaming: true,
    resultCaching: true,
    composition: false,
  },
};

/**
 * AI Tools configuration
 */
export const AI_CONFIG: PlatformConfig<AIPlatformSpecific> = {
  ...DEFAULT_CONFIG,
  platform: Platform.AI,
  excludePaths: [
    ...DEFAULT_CONFIG.excludePaths,
    "system/db",
    "system/server",
  ],
  cache: {
    ...DEFAULT_CONFIG.cache,
    ttl: 15 * 60 * 1000,
  },
  rateLimit: {
    enabled: true,
    maxRequests: 100,
    windowMs: 60 * 1000,
  },
  features: {
    ...DEFAULT_CONFIG.features,
    composition: false,
  },
  platformSpecific: {
    maxToolsPerRequest: 10,
    enableConfirmation: true,
    dangerousOperations: false,
  },
};
