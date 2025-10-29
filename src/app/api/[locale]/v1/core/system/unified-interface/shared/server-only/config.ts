/**
 * Unified Platform Configuration
 * Single configuration system for all platforms (CLI, AI, MCP, Web)
 * Replaces separate ai-tool/config.ts, mcp/config.ts, etc.
 */

import "server-only";

import type { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import type { AuthPlatform } from "@/app/api/[locale]/v1/core/user/auth/repository";

/**
 * Platform type
 */
export enum Platform {
  CLI = "cli",
  AI = "ai",
  MCP = "mcp",
  WEB = "web",
  MOBILE = "mobile",
  EMAIL = "email",
}

/**
 * Platform-specific configuration
 */
export interface PlatformConfig {
  /** Platform identifier */
  platform: Platform;

  /** Root directory for endpoint discovery */
  rootDir: string;

  /** Paths to exclude from discovery */
  excludePaths: string[];

  /** HTTP methods to include */
  includeMethods: Methods[];

  /** Cache configuration */
  cache: {
    enabled: boolean;
    ttl: number; // milliseconds
    maxSize: number; // max cache entries
  };

  /** Rate limiting */
  rateLimit?: {
    enabled: boolean;
    maxRequests: number;
    windowMs: number;
  };

  /** Feature flags */
  features: {
    /** Enable parallel execution */
    parallelExecution: boolean;

    /** Enable streaming responses */
    streaming: boolean;

    /** Enable result caching */
    resultCaching: boolean;

    /** Enable tool composition (tools calling tools) */
    composition: boolean;
  };

  /** Platform-specific settings */
  // eslint-disable-next-line no-restricted-syntax
  platformSpecific?: Record<string, unknown>;
}

/**
 * Default configuration for all platforms
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
  includeMethods: ["GET", "POST", "PUT", "PATCH", "DELETE"] as Methods[],
  cache: {
    enabled: true,
    ttl: 5 * 60 * 1000, // 5 minutes
    maxSize: 1000,
  });
  features: {
    parallelExecution: true,
    streaming: true,
    resultCaching: true,
    composition: false, // Disabled by default for safety
  });
};

/**
 * CLI-specific configuration
 */
export const CLI_CONFIG: PlatformConfig = {
  ...DEFAULT_CONFIG,
  platform: Platform.CLI,
  cache: {
    ...DEFAULT_CONFIG.cache,
    ttl: 10 * 60 * 1000, // 10 minutes for CLI
  });
  features: {
    ...DEFAULT_CONFIG.features,
    streaming: false, // CLI doesn't need streaming
  });
  platformSpecific: {
    colorOutput: true,
    verboseErrors: true,
    interactiveMode: true,
  });
};

/**
 * AI Tools configuration
 */
export const AI_CONFIG: PlatformConfig = {
  ...DEFAULT_CONFIG,
  platform: Platform.AI,
  excludePaths: [
    ...DEFAULT_CONFIG.excludePaths,
    "system/db", // Exclude dangerous DB operations from AI
    "system/server", // Exclude server control from AI
  ],
  cache: {
    ...DEFAULT_CONFIG.cache,
    ttl: 15 * 60 * 1000, // 15 minutes for AI
  });
  rateLimit: {
    enabled: true,
    maxRequests: 100,
    windowMs: 60 * 1000, // 100 requests per minute
  });
  features: {
    ...DEFAULT_CONFIG.features,
    composition: false, // Disabled for safety
  });
  platformSpecific: {
    maxToolsPerRequest: 10,
    enableConfirmation: true,
    dangerousOperations: false,
  });
};

/**
 * MCP configuration
 */
export const MCP_CONFIG: PlatformConfig = {
  ...DEFAULT_CONFIG,
  platform: Platform.MCP,
  excludePaths: [
    ...DEFAULT_CONFIG.excludePaths,
    "system/db", // Exclude dangerous DB operations
    "system/server", // Exclude server control
  ],
  cache: {
    ...DEFAULT_CONFIG.cache,
    ttl: 20 * 60 * 1000, // 20 minutes for MCP
  });
  rateLimit: {
    enabled: true,
    maxRequests: 50,
    windowMs: 60 * 1000, // 50 requests per minute
  });
  features: {
    ...DEFAULT_CONFIG.features,
    composition: false,
  });
  platformSpecific: {
    protocolVersion: "2024-11-05",
    capabilities: {
      tools: true,
      prompts: false,
      resources: false,
    });
  });
};

/**
 * Web configuration
 */
export const WEB_CONFIG: PlatformConfig = {
  ...DEFAULT_CONFIG,
  platform: Platform.WEB,
  cache: {
    ...DEFAULT_CONFIG.cache,
    ttl: 2 * 60 * 1000, // 2 minutes for web (shorter for freshness)
  });
  features: {
    ...DEFAULT_CONFIG.features,
    streaming: true,
  });
  platformSpecific: {
    enableWebSockets: true,
    enableSSE: true,
  });
};

/**
 * Mobile configuration
 */
export const MOBILE_CONFIG: PlatformConfig = {
  ...DEFAULT_CONFIG,
  platform: Platform.MOBILE,
  cache: {
    ...DEFAULT_CONFIG.cache,
    ttl: 10 * 60 * 1000, // 10 minutes for mobile
    maxSize: 500, // Smaller cache for mobile
  });
  features: {
    ...DEFAULT_CONFIG.features,
    streaming: true,
  });
  platformSpecific: {
    offlineMode: true,
    reducedPayloads: true,
  });
};

/**
 * Get configuration for platform
 */
export function getPlatformConfig(platform: Platform): PlatformConfig {
  switch (platform) {
    case Platform.CLI:
      return CLI_CONFIG;
    case Platform.AI:
      return AI_CONFIG;
    case Platform.MCP:
      return MCP_CONFIG;
    case Platform.WEB:
      return WEB_CONFIG;
    case Platform.MOBILE:
      return MOBILE_CONFIG;
    default:
      return { ...DEFAULT_CONFIG, platform };
  }
}

/**
 * Merge custom config with platform defaults
 */
export function mergePlatformConfig(
  platform: Platform,
  customConfig: Partial<PlatformConfig>,
): PlatformConfig {
  const baseConfig = getPlatformConfig(platform);

  return {
    ...baseConfig,
    ...customConfig,
    cache: {
      ...baseConfig.cache,
      ...(customConfig.cache || {}),
    });
    features: {
      ...baseConfig.features,
      ...(customConfig.features || {}),
    });
    platformSpecific: {
      ...baseConfig.platformSpecific,
      ...(customConfig.platformSpecific || {}),
    });
  };
}

/**
 * Map Platform enum to AuthPlatform type for auth system
 */
export function platformToAuthPlatform(platform: Platform): AuthPlatform {
  switch (platform) {
    case Platform.CLI:
      return "cli";
    case Platform.AI:
      return "ai";
    case Platform.MCP:
      return "mcp";
    case Platform.WEB:
      return "web";
    case Platform.MOBILE:
      return "mobile";
    case Platform.EMAIL:
      // Email uses web auth
      return "web";
    default: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _exhaustiveCheck: never = platform;
      return "web";
    }
  }
}

/**
 * Validate platform configuration
 */
export function validatePlatformConfig(config: PlatformConfig): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!config.platform) {
    errors.push("PLATFORM_REQUIRED");
  }

  if (!config.rootDir) {
    errors.push("ROOT_DIR_REQUIRED");
  }

  if (config.cache.ttl < 0) {
    errors.push("CACHE_TTL_POSITIVE");
  }

  if (config.cache.maxSize < 1) {
    errors.push("CACHE_SIZE_MIN_ONE");
  }

  if (config.rateLimit) {
    if (config.rateLimit.maxRequests < 1) {
      errors.push("RATE_LIMIT_MIN_ONE");
    }
    if (config.rateLimit.windowMs < 1000) {
      // eslint-disable-next-line i18next/no-literal-string
      errors.push("RATE_LIMIT_WINDOW_MIN_1S");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
