/**
 * Shared Plugin Configuration Loader
 *
 * Provides typesafe configuration loading for Oxlint JS plugins.
 * Handles all runtime scenarios:
 * - Bun runtime (direct TypeScript support)
 * - Node.js runtime (requires compiled JS or ts-node)
 * - Source directory (development)
 * - NPM package (installed in node_modules)
 * - Compiled output (dist folder)
 */

import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";

import type {
  CheckConfig,
  I18nPluginConfig,
  JsxCapitalizationPluginConfig,
  LintConfigValue,
  RestrictedSyntaxPluginConfig,
} from "../../../config/types";

// ============================================================
// Types
// ============================================================

/** Plugin names for type-safe config loading */
export type PluginName =
  | "oxlint-plugin-i18n/no-literal-string"
  | "oxlint-plugin-jsx-capitalization/jsx-capitalization"
  | "oxlint-plugin-restricted/restricted-syntax";

/** Map plugin names to their config types */
export interface PluginConfigMap {
  "oxlint-plugin-i18n/no-literal-string": I18nPluginConfig;
  "oxlint-plugin-jsx-capitalization/jsx-capitalization": JsxCapitalizationPluginConfig;
  "oxlint-plugin-restricted/restricted-syntax": RestrictedSyntaxPluginConfig;
}

/** Result of loading config */
export interface ConfigLoadResult<T> {
  success: boolean;
  config: T | null;
  source: "rule-config" | "direct-export" | "default" | "error";
  error?: string;
}

/** Error messages for plugin rules (can be customized) */
export interface PluginMessages {
  [key: string]: string;
}

// ============================================================
// Singleton Cache
// ============================================================

/** Cached check config (singleton across all plugins) */
let cachedCheckConfig: CheckConfig | null = null;
let configLoadAttempted = false;

/** Plugin-specific config caches */
const pluginConfigCache = new Map<string, ConfigLoadResult<LintConfigValue>>();

// ============================================================
// Config File Discovery
// ============================================================

/**
 * Find the project root by looking for check.config.ts
 * Searches upward from current working directory
 */
function findProjectRoot(): string {
  const cwd = process.cwd();
  let currentDir = cwd;
  const root = resolve("/");

  while (currentDir !== root) {
    const configPath = resolve(currentDir, "check.config.ts");
    if (existsSync(configPath)) {
      return currentDir;
    }

    const jsConfigPath = resolve(currentDir, "check.config.js");
    if (existsSync(jsConfigPath)) {
      return currentDir;
    }

    currentDir = dirname(currentDir);
  }

  return cwd;
}

/**
 * Get all possible config file paths to try
 */
function getConfigPaths(): string[] {
  const projectRoot = findProjectRoot();

  return [
    // TypeScript source (Bun runtime, development)
    resolve(projectRoot, "check.config.ts"),
    // JavaScript compiled (Node.js runtime, production)
    resolve(projectRoot, "check.config.js"),
    // NPM package scenarios
    resolve(projectRoot, "node_modules", "next-vibe", "check.config.js"),
    resolve(
      projectRoot,
      "node_modules",
      "next-vibe",
      "dist",
      "check.config.js",
    ),
  ];
}

// ============================================================
// Config Loading
// ============================================================

/**
 * Load check.config.ts/js using require (works in Bun and Node)
 * Handles both object and function exports
 */
function loadCheckConfigSync(): CheckConfig | null {
  if (configLoadAttempted) {
    return cachedCheckConfig;
  }

  configLoadAttempted = true;

  const configPaths = getConfigPaths();

  for (const configPath of configPaths) {
    if (!existsSync(configPath)) {
      continue;
    }

    try {
      // Use require for synchronous loading (needed for plugin create() functions)
      // eslint-disable-next-line @typescript-eslint/no-require-imports -- Plugin context requires sync loading
      const configModule = require(configPath) as {
        default?: CheckConfig | (() => CheckConfig);
        config?: CheckConfig | (() => CheckConfig);
      };

      const exportedValue = configModule.default ?? configModule.config;

      if (!exportedValue) {
        continue;
      }

      // Support both direct object exports and factory functions
      const config =
        typeof exportedValue === "function" ? exportedValue() : exportedValue;

      cachedCheckConfig = config;
      return config;
    } catch {
      // Try next path
      continue;
    }
  }

  return null;
}

/**
 * Extract plugin options from check config rule definition
 * Rule format: ["error", { ...options }]
 */
function extractPluginOptions<T>(
  checkConfig: CheckConfig,
  pluginName: PluginName,
): T | null {
  if (!checkConfig.oxlint.enabled) {
    return null;
  }

  const rules = checkConfig.oxlint.rules;
  if (!rules) {
    return null;
  }

  const ruleConfig = rules[pluginName];

  // Rule config can be:
  // - string: "error" | "warn" | "off"
  // - array: ["error", { ...options }]
  if (Array.isArray(ruleConfig) && ruleConfig.length >= 2) {
    return ruleConfig[1] as T;
  }

  return null;
}

// ============================================================
// Public API
// ============================================================

/**
 * Load plugin configuration with full type safety
 *
 * Priority:
 * 1. Cached config (if already loaded)
 * 2. check.config.ts oxlint.rules[pluginName][1] (rule options)
 * 3. Default config (if provided)
 *
 * @param pluginName - Full plugin rule name (e.g., "oxlint-plugin-i18n/no-literal-string")
 * @param defaultConfig - Optional default configuration
 * @returns Type-safe plugin configuration
 */
export function loadPluginConfig<K extends PluginName>(
  pluginName: K,
  defaultConfig?: PluginConfigMap[K],
): ConfigLoadResult<PluginConfigMap[K]> {
  // Check cache first
  const cached = pluginConfigCache.get(pluginName);
  if (cached) {
    return cached as ConfigLoadResult<PluginConfigMap[K]>;
  }

  // Try to load check config
  const checkConfig = loadCheckConfigSync();

  if (checkConfig) {
    // Try to extract plugin options from rule config
    const pluginOptions = extractPluginOptions<PluginConfigMap[K]>(
      checkConfig,
      pluginName,
    );

    if (pluginOptions) {
      const result: ConfigLoadResult<PluginConfigMap[K]> = {
        success: true,
        config: pluginOptions,
        source: "rule-config",
      };
      pluginConfigCache.set(
        pluginName,
        result as ConfigLoadResult<LintConfigValue>,
      );
      return result;
    }
  }

  // Use default config if provided
  if (defaultConfig) {
    const result: ConfigLoadResult<PluginConfigMap[K]> = {
      success: true,
      config: defaultConfig,
      source: "default",
    };
    pluginConfigCache.set(
      pluginName,
      result as ConfigLoadResult<LintConfigValue>,
    );
    return result;
  }

  // No config available
  const result: ConfigLoadResult<PluginConfigMap[K]> = {
    success: false,
    config: null,
    source: "error",
    error: `No configuration found for ${pluginName}`,
  };
  pluginConfigCache.set(
    pluginName,
    result as ConfigLoadResult<LintConfigValue>,
  );
  return result;
}

/**
 * Get the full CheckConfig (for plugins that need access to all settings)
 */
export function getCheckConfig(): CheckConfig | null {
  return loadCheckConfigSync();
}

/**
 * Clear all cached configurations (useful for testing)
 */
export function clearConfigCache(): void {
  cachedCheckConfig = null;
  configLoadAttempted = false;
  pluginConfigCache.clear();
}

/**
 * Create customizable error messages for a plugin
 * Allows users to override default messages via config
 *
 * @param defaults - Default message templates
 * @param overrides - User-provided message overrides
 * @returns Merged messages object
 */
export function createPluginMessages<T extends PluginMessages>(
  defaults: T,
  overrides?: Partial<T>,
): T {
  return { ...defaults, ...overrides };
}
