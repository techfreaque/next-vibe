/// <reference types="node" />
/* eslint-disable no-restricted-syntax */
import { existsSync } from "node:fs";
import { dirname, join, parse, resolve } from "node:path";

import type { TFunction } from "@/i18n/core/static-types";

import type { LaunchpadConfig } from "../types/types";

export const DEFAULT_CONFIG_PATH = "launchpad.config.ts";

// Store the config directory once found for reference
let configRootDir: string | null = null;

// Get the root directory from the config file location
export function getRootDirectory(t: TFunction): string {
  if (!configRootDir) {
    // eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax -- Build/CLI tool error handling requires throwing to exit with error status
    throw new Error(t("app.api.system.launchpad.errors.configNotLoaded"));
  }
  return configRootDir;
}

/**
 * Finds the config file by searching from the current directory up to the root.
 * @param configFileName The name of the config file to find
 * @returns The absolute path of the config file if found, null otherwise
 */
function findConfigUp(configFileName: string): string | null {
  let currentDir = process.cwd();
  const { root } = parse(currentDir);

  // Search up to the root directory
  while (currentDir !== root) {
    const filePath = join(currentDir, configFileName);
    if (existsSync(filePath)) {
      return filePath;
    }
    // Move up one directory
    const parentDir = dirname(currentDir);
    // If we're already at the root, break to avoid infinite loop
    if (parentDir === currentDir) {
      break;
    }
    currentDir = parentDir;
  }

  // Check the root directory
  const rootConfigPath = join(root, configFileName);
  if (existsSync(rootConfigPath)) {
    return rootConfigPath;
  }

  return null;
}

/**
 * Loads and returns the configuration.
 * @param explicitConfigPath Optional path to the config file
 */
/**
 * Type guard to validate that an imported module has the expected LaunchpadConfig structure
 */
function isLaunchpadConfigModule(
  // eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax -- Build Infrastructure: Type guard requires 'unknown' for runtime module validation
  module: unknown,
): module is { default: LaunchpadConfig } {
  if (typeof module !== "object" || module === null) {
    return false;
  }
  if (!("default" in module)) {
    return false;
  }
  const defaultExport = module.default as Record<
    string,
    Record<string, string>
  > | null;
  if (typeof defaultExport !== "object" || defaultExport === null) {
    return false;
  }
  if (!("packages" in defaultExport)) {
    return false;
  }
  const packages = defaultExport.packages as Record<string, string> | null;
  return typeof packages === "object" && packages !== null;
}

export async function loadConfig(
  t: TFunction,
  explicitConfigPath?: string,
): Promise<LaunchpadConfig> {
  const configPath = explicitConfigPath || DEFAULT_CONFIG_PATH;
  let resolvedConfigPath: string;

  if (explicitConfigPath) {
    // If explicit path is provided, use it directly
    resolvedConfigPath = resolve(process.cwd(), configPath);
    if (!existsSync(resolvedConfigPath)) {
      // eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax -- Build/CLI tool error handling requires throwing to exit with error status
      throw new Error(
        t("app.api.system.launchpad.errors.configFileNotFound" as const, {
          path: resolvedConfigPath,
        }),
      );
    }
  } else {
    // Otherwise search up from cwd
    const foundConfigPath = findConfigUp(configPath);
    if (!foundConfigPath) {
      // eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax -- Build/CLI tool error handling requires throwing to exit with error status
      throw new Error(
        t(
          "app.api.system.launchpad.errors.configFileNotFoundInParents" as const,
          {
            filename: configPath,
          },
        ),
      );
    }
    resolvedConfigPath = foundConfigPath;
  }

  // Store the config directory as the root directory for the application
  configRootDir = dirname(resolvedConfigPath);

  try {
    // const compiledConfigPath = await getCompiledConfigPath(resolvedConfigPath);
    // eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax -- Build Infrastructure: Dynamic config import requires 'unknown' for runtime type validation
    const importedModule: unknown = await import(
      `file://${resolvedConfigPath}`
    );

    if (!isLaunchpadConfigModule(importedModule)) {
      // eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax -- Build/CLI tool error handling requires throwing to exit with error status
      throw new Error(
        t("app.api.system.launchpad.errors.invalidConfigFormat" as const),
      );
    }

    const config = importedModule.default;
    // cleanCompiledConfig(compiledConfigPath);

    return config;
  } catch (error) {
    // Re-throw the error with additional context
    const errorMessage = error instanceof Error ? error.message : String(error);
    const contextMessage = t(
      "app.api.system.launchpad.errors.errorLoadingConfig" as const,
    );
    // eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax -- Build/CLI tool error handling requires throwing to exit with error status
    throw new Error(`${contextMessage} ${errorMessage}`, { cause: error });
  }
}
