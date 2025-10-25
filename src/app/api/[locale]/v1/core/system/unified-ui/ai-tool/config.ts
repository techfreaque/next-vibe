/**
 * AI Tool Handler Configuration
 *
 * @deprecated This file is deprecated. Use the unified platform configuration instead:
 * import { AI_CONFIG, getPlatformConfig, Platform } from "../shared/config/platform-config";
 *
 * This file is kept for backward compatibility only.
 */

import "server-only";

import { AI_CONFIG } from "../shared/config/platform-config";
import type { ToolDiscoveryOptions } from "./types";

/**
 * Check if running in development mode
 */
const isDevelopment = (): boolean => {
  return process.env.NODE_ENV === "development";
};

/**
 * Check if running in production mode
 */
const isProduction = (): boolean => {
  return process.env.NODE_ENV === "production";
};

/**
 * Check if running in test mode
 */
const isTest = (): boolean => {
  return process.env.NODE_ENV === "test";
};

/**
 * AI Tool System Configuration
 * @deprecated Use AI_CONFIG from unified platform instead
 */
export const aiToolConfig = {
  /**
   * Enable or disable the AI tool system
   */
  enabled: true,

  /**
   * Root directory for endpoint discovery
   * @deprecated Use AI_CONFIG.rootDir instead
   */
  rootDir: AI_CONFIG.rootDir,

  /**
   * Paths to exclude from discovery
   * @deprecated Use AI_CONFIG.excludePaths instead
   */
  excludePaths: AI_CONFIG.excludePaths,

  /**
   * Include only specific HTTP methods
   * @deprecated Use AI_CONFIG.includeMethods instead
   */
  includeMethods: AI_CONFIG.includeMethods,

  /**
   * Cache configuration
   * @deprecated Use AI_CONFIG.cache instead
   */
  cache: {
    enabled: AI_CONFIG.cache.enabled,
    ttl: AI_CONFIG.cache.ttl,
    maxSize: AI_CONFIG.cache.maxSize,
  },

  /**
   * Tool execution limits
   * @deprecated Use AI_CONFIG.platformSpecific.maxToolsPerRequest instead
   */
  execution: {
    maxCallsPerMessage:
      typeof AI_CONFIG.platformSpecific?.maxToolsPerRequest === "number"
        ? AI_CONFIG.platformSpecific.maxToolsPerRequest
        : 10,
    maxCallsPerMinute: AI_CONFIG.rateLimit?.maxRequests || 100,
    defaultTimeout: 30000,
    maxTimeout: 120000,
  },

  /**
   * Tool naming configuration
   */
  naming: {
    prefix: "",
    separator: "_",
    includeMethod: false,
  },

  /**
   * Tool description configuration
   */
  descriptions: {
    includeExamples: true,
    includeParameters: true,
    maxLength: 500,
    fallbackToEnglish: true,
  },

  /**
   * Permission configuration
   */
  permissions: {
    requireAuth: true,
    allowPublicTools: true,
    strictMode: true,
  },

  /**
   * Logging configuration
   */
  logging: {
    logDiscovery: true,
    logExecution: true,
    logParameters: false,
    logTiming: true,
  },

  /**
   * Development configuration
   */
  development: {
    enableWatch: isDevelopment(),
    hotReload: isDevelopment(),
    debug: isDevelopment(),
  },

  /**
   * Feature flags
   * @deprecated Use AI_CONFIG.features instead
   */
  features: {
    parallelExecution: AI_CONFIG.features.parallelExecution,
    streaming: AI_CONFIG.features.streaming,
    composition: AI_CONFIG.features.composition,
    resultCaching: AI_CONFIG.features.resultCaching,
  },
};

/**
 * Get discovery options from config
 */
export function getDiscoveryOptions(): ToolDiscoveryOptions {
  return {
    rootDir: aiToolConfig.rootDir,
    excludePaths: aiToolConfig.excludePaths,
    includeMethods: aiToolConfig.includeMethods,
    cache: aiToolConfig.cache.enabled,
    cacheTTL: aiToolConfig.cache.ttl,
    followSymlinks: false,
  };
}

/**
 * Check if AI tool system is enabled
 */
export function isAIToolSystemEnabled(): boolean {
  return aiToolConfig.enabled && process.env.AI_TOOLS_ENABLED !== "false";
}

/**
 * Get environment-specific config overrides
 */
export function getEnvironmentConfig(): {
  logging?: typeof aiToolConfig.logging;
  development?: typeof aiToolConfig.development;
  cache?: typeof aiToolConfig.cache;
} {
  const overrides: {
    logging?: typeof aiToolConfig.logging;
    development?: typeof aiToolConfig.development;
    cache?: typeof aiToolConfig.cache;
  } = {};

  // Production overrides
  if (isProduction()) {
    overrides.logging = {
      ...aiToolConfig.logging,
      logParameters: false,
      logDiscovery: false,
    };
    overrides.development = {
      enableWatch: false,
      hotReload: false,
      debug: false,
    };
  }

  // Test environment overrides
  if (isTest()) {
    overrides.cache = {
      ...aiToolConfig.cache,
      enabled: false, // Disable cache in tests
    };
  }

  return overrides;
}

/**
 * Merge config with environment overrides
 */
export function getFinalConfig(): typeof aiToolConfig {
  return {
    ...aiToolConfig,
    ...getEnvironmentConfig(),
  };
}
