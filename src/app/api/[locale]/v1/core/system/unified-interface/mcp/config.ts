/**
 * MCP Platform Configuration
 */

import "server-only";

import {
  type Methods,
  ALL_METHODS,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import { Platform } from "../shared/types/platform";

/**
 * MCP-specific configuration
 */
export interface MCPPlatformSpecific {
  protocolVersion: string;
  capabilities: {
    tools: boolean;
    prompts: boolean;
    resources: boolean;
  };
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
export interface PlatformConfig<T = MCPPlatformSpecific>
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
 * MCP configuration
 */
export const MCP_CONFIG: PlatformConfig<MCPPlatformSpecific> = {
  ...DEFAULT_CONFIG,
  platform: Platform.MCP,
  excludePaths: [
    ...DEFAULT_CONFIG.excludePaths,
    "system/db",
    "system/server",
  ],
  cache: {
    ...DEFAULT_CONFIG.cache,
    ttl: 20 * 60 * 1000,
  },
  rateLimit: {
    enabled: true,
    maxRequests: 50,
    windowMs: 60 * 1000,
  },
  features: {
    ...DEFAULT_CONFIG.features,
    composition: false,
  },
  platformSpecific: {
    protocolVersion: "2024-11-05",
    capabilities: {
      tools: true,
      prompts: false,
      resources: false,
    },
  },
};

/**
 * Check if MCP server is enabled
 */
export function isMCPServerEnabled(): boolean {
  return MCP_CONFIG.platformSpecific?.capabilities.tools ?? false;
}
