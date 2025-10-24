/**
 * AI Tool Handler Configuration
 */

import "server-only";

import { Methods } from "../cli/vibe/endpoints/endpoint-types/core/enums";

import type { ToolDiscoveryOptions } from "./types";

/**
 * Check if running in development mode
 */
const isDevelopment = (): boolean => {
  // eslint-disable-next-line node/no-process-env
  return process.env.NODE_ENV === "development";
};

/**
 * Check if running in production mode
 */
const isProduction = (): boolean => {
  // eslint-disable-next-line node/no-process-env
  return process.env.NODE_ENV === "production";
};

/**
 * Check if running in test mode
 */
const isTest = (): boolean => {
  // eslint-disable-next-line node/no-process-env
  return process.env.NODE_ENV === "test";
};

/**
 * AI Tool System Configuration
 */
export const aiToolConfig = {
  /**
   * Enable or disable the AI tool system
   * Uses static registry (generated at build time) for Next.js compatibility
   */
  enabled: true,

  /**
   * Root directory for endpoint discovery
   */
  rootDir: "src/app/api/[locale]/v1" as string,

  /**
   * Paths to exclude from discovery
   * These endpoints will never be exposed as AI tools
   */
  excludePaths: [
    // System-critical operations
    "v1/core/system/db/reset/**",
    "v1/core/system/db/migrate/**",
    "v1/core/system/db/seed/**",

    // Authentication internals
    "v1/core/user/auth/**",
    "v1/core/user/session/**",

    // Dangerous batch operations
    "v1/core/user/delete-all/**",
    "v1/core/leads/delete-all/**",

    // Internal AI system (prevent recursion)
    "v1/core/agent/**",
    "v1/core/system/unified-ui/ai-tool/**",
  ] as string[],

  /**
   * Include only specific HTTP methods
   * Prevents AI from using destructive operations
   */
  includeMethods: [
    Methods.GET,
    Methods.POST,
    // Uncomment to allow updates/deletes (not recommended)
    // Methods.PUT,
    // Methods.PATCH,
    // Methods.DELETE,
  ] as Methods[],

  /**
   * Cache configuration
   */
  cache: {
    /** Enable caching for discovery */
    enabled: true,

    /** Cache TTL in milliseconds (1 hour) */
    ttl: 3600000,

    /** Maximum cache size (entries) */
    maxSize: 500,
  },

  /**
   * Tool execution limits
   */
  execution: {
    /** Maximum tool calls per message */
    maxCallsPerMessage: 10,

    /** Maximum tool calls per minute per user */
    maxCallsPerMinute: 100,

    /** Default timeout for tool execution (ms) */
    defaultTimeout: 30000,

    /** Maximum timeout for tool execution (ms) */
    maxTimeout: 120000,
  },

  /**
   * Tool naming configuration
   */
  naming: {
    /** Prefix for dynamic tools */
    prefix: "",

    /** Separator for path segments */
    separator: "_",

    /** Whether to include HTTP method in name */
    includeMethod: false,
  },

  /**
   * Tool description configuration
   */
  descriptions: {
    /** Include endpoint examples in descriptions */
    includeExamples: true,

    /** Include parameter descriptions */
    includeParameters: true,

    /** Maximum description length */
    maxLength: 500,

    /** Fallback to English if translation missing */
    fallbackToEnglish: true,
  },

  /**
   * Permission configuration
   */
  permissions: {
    /** Require authentication for all tools */
    requireAuth: true,

    /** Allow public tools (tools with PUBLIC role) */
    allowPublicTools: true,

    /** Strict mode: double-check permissions at execution */
    strictMode: true,
  },

  /**
   * Logging configuration
   */
  logging: {
    /** Log all tool discoveries */
    logDiscovery: true,

    /** Log all tool executions */
    logExecution: true,

    /** Log tool execution parameters */
    logParameters: false, // Set to true for debugging

    /** Log execution timing */
    logTiming: true,
  },

  /**
   * Development configuration
   */
  development: {
    /** Enable file watching in development */
    enableWatch: isDevelopment(),

    /** Reload tools on file change */
    hotReload: isDevelopment(),

    /** Show debug information */
    debug: isDevelopment(),
  },

  /**
   * Feature flags
   */
  features: {
    /** Enable parallel tool execution */
    parallelExecution: true,

    /** Enable tool result streaming */
    streaming: true,

    /** Enable tool composition (tools calling tools) */
    composition: false, // Disabled for safety

    /** Enable tool result caching */
    resultCaching: true,
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
  // eslint-disable-next-line node/no-process-env
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
