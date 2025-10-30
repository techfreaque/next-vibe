/// <reference types="node" />
/* eslint-disable i18next/no-literal-string */
import { execSync } from "node:child_process";
import { existsSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { pathToFileURL } from "node:url";

import type { ReleaseTarget } from "../types/types.js";

// Type for release config structure
interface ReleaseConfig {
  packages: Array<{
    release?: {
      tagPrefix: string;
    };
  }>;
}

interface ModuleWithDefault {
  default: ReleaseConfig;
}

type LoadedModule =
  | { default: ReleaseConfig }
  | ReleaseConfig
  // eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax -- Build Infrastructure: Release metadata extraction requires 'unknown' for flexible data structures
  | Record<string, ReleaseConfig | Array<unknown> | string | number | boolean | null>;

/**
 * Type guard to check if module has a default export with ReleaseConfig
 */
function hasDefaultReleaseConfig(
  module: LoadedModule,
): module is ModuleWithDefault {
  if (!("default" in module)) {
    return false;
  }
  const defaultExport = module.default;
  if (typeof defaultExport !== "object" || defaultExport === null) {
    return false;
  }
  return (
    "packages" in defaultExport &&
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    Array.isArray(defaultExport.packages)
  );
}

/**
 * Type guard to check if module is directly a ReleaseConfig
 */
function isDirectReleaseConfig(module: LoadedModule): module is ReleaseConfig {
  return "packages" in module && Array.isArray(module.packages);
}

/**
 * Discovers all release.config.ts files in the monorepo
 */
export function discoverReleaseTargets(rootDir: string): ReleaseTarget[] {
  const targets: ReleaseTarget[] = [];

  function searchDirectory(dir: string): void {
    try {
      const entries = readdirSync(dir);

      for (const entry of entries) {
        // Skip node_modules and hidden directories
        if (entry === "node_modules" || entry.startsWith(".")) {
          continue;
        }

        const fullPath = join(dir, entry);

        try {
          const stats = statSync(fullPath);

          if (stats.isDirectory()) {
            // Recurse into subdirectory
            searchDirectory(fullPath);
          } else if (entry === "release.config.ts") {
            // Found a release config file
            const directory = relative(rootDir, dir);
            targets.push({
              directory,
              configPath: relative(rootDir, fullPath),
              hasReleaseConfig: true,
            });
          }
        } catch {
          // Skip files we can't stat
          continue;
        }
      }
    } catch {
      // Skip directories we can't read
    }
  }

  searchDirectory(rootDir);

  return targets;
}

/**
 * Validates that a release target has all required files and configuration
 */
export function validateReleaseTarget(
  rootDir: string,
  target: ReleaseTarget,
): boolean {
  const fullPath = join(rootDir, target.directory);

  // Check directory exists
  if (!existsSync(fullPath)) {
    return false;
  }

  // Check release.config.ts exists
  const configPath = join(rootDir, target.configPath);
  if (!existsSync(configPath)) {
    return false;
  }

  // Check package.json exists
  const packageJsonPath = join(fullPath, "package.json");
  if (!existsSync(packageJsonPath)) {
    return false;
  }

  return true;
}

/**
 * Gets the current git tag if on a tagged commit
 */
export function getCurrentGitTag(): string | null {
  try {
    const tag = execSync("git describe --exact-match --tags HEAD", {
      encoding: "utf-8",
      stdio: "pipe",
    }).trim();
    return tag;
  } catch {
    return null;
  }
}

/**
 * Finds a release target that matches the given git tag
 */
export async function findTargetByGitTag(
  targets: ReleaseTarget[],
  tag: string,
): Promise<ReleaseTarget | null> {
  for (const target of targets) {
    try {
      // Load the release config
      const configPath = pathToFileURL(target.configPath).href;
      // eslint-disable-next-line eslint-plugin-next/no-assign-module-variable
      const module = (await import(configPath)) as LoadedModule;

      let config: ReleaseConfig | null = null;

      if (hasDefaultReleaseConfig(module)) {
        config = module.default;
      } else if (isDirectReleaseConfig(module)) {
        config = module;
      }

      if (!config) {
        continue;
      }

      // Check each package in the config
      for (const pkg of config.packages) {
        if (!pkg.release?.tagPrefix) {
          continue;
        }

        const tagPrefix = pkg.release.tagPrefix;
        if (tag.startsWith(tagPrefix)) {
          return target;
        }
      }
    } catch {
      // Skip targets with invalid configs
      continue;
    }
  }

  return null;
}

/**
 * Lists all available tag prefixes from all targets
 */
export async function listAvailableTagPrefixes(
  targets: ReleaseTarget[],
): Promise<string[]> {
  const prefixes: string[] = [];

  for (const target of targets) {
    try {
      const configPath = pathToFileURL(target.configPath).href;
      // eslint-disable-next-line eslint-plugin-next/no-assign-module-variable
      const module = (await import(configPath)) as LoadedModule;

      let config: ReleaseConfig | null = null;

      if (hasDefaultReleaseConfig(module)) {
        config = module.default;
      } else if (isDirectReleaseConfig(module)) {
        config = module;
      }

      if (!config) {
        continue;
      }

      for (const pkg of config.packages) {
        if (pkg.release?.tagPrefix) {
          prefixes.push(`${pkg.release.tagPrefix} (${target.directory})`);
        }
      }
    } catch {
      // Skip targets with errors
      continue;
    }
  }

  return prefixes;
}
