import { execSync } from "node:child_process";
import { existsSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { pathToFileURL } from "node:url";

import type { ReleaseTarget } from "../types/types.js";
import { logger, loggerError } from "./logger.js";

// Type for release config structure
interface ReleaseConfig {
  packages: Array<{
    release?: {
      tagPrefix: string;
    };
  }>;
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
        const fullPath = join(dir, entry);

        try {
          const stat = statSync(fullPath);

          if (stat.isDirectory()) {
            // Skip node_modules, .git, and other common directories
            if (
              entry === "node_modules" ||
              entry === ".git" ||
              entry === ".dist" ||
              entry.startsWith(".")
            ) {
              continue;
            }

            // Check if this directory has a release.config.ts
            const releaseConfigPath = join(fullPath, "release.config.ts");
            if (existsSync(releaseConfigPath)) {
              const relativeDir = relative(rootDir, fullPath);
              targets.push({
                directory: relativeDir || ".",
                configPath: releaseConfigPath,
                hasReleaseConfig: true,
              });
            }

            // Recursively search subdirectories
            searchDirectory(fullPath);
          }
        } catch (statError) {
          // Skip files/directories we can't stat (like broken symlinks, sockets, etc.)
          // Only log if it's not a common issue
          const error = statError as Error & { code?: string };
          if (error.code !== "ENOENT" && !fullPath.includes("mysql")) {
            loggerError(`Failed to stat ${fullPath}:`, statError);
          }
        }
      }
    } catch (error) {
      // Skip directories we can't read
      // Only log if it's not a permission issue
      const fsError = error as Error & { code?: string };
      if (fsError.code !== "EACCES") {
        loggerError(`Failed to read directory ${dir}:`, error);
      }
    }
  }

  logger("Discovering release targets...");
  searchDirectory(rootDir);

  // Sort targets by directory path for consistent ordering
  targets.sort((a, b) => a.directory.localeCompare(b.directory));

  logger(`Found ${targets.length} release targets`);
  return targets;
}

/**
 * Validates that a release target is properly configured
 */
export function validateReleaseTarget(
  rootDir: string,
  target: ReleaseTarget,
): boolean {
  const fullPath = join(rootDir, target.directory);

  // Check if directory exists
  if (!existsSync(fullPath)) {
    loggerError(
      `Directory does not exist: ${fullPath}`,
      new Error("Directory not found"),
    );
    return false;
  }

  // Check if release config exists
  if (!existsSync(target.configPath)) {
    loggerError(
      `Release config does not exist: ${target.configPath}`,
      new Error("Config not found"),
    );
    return false;
  }

  // Check if package.json exists (most packages should have one)
  const packageJsonPath = join(fullPath, "package.json");
  if (!existsSync(packageJsonPath)) {
    logger(`Warning: No package.json found in ${target.directory}`);
  }

  return true;
}

/**
 * Gets the current git tag to determine which package to release in CI mode
 */
export function getCurrentGitTag(): string | null {
  try {
    const tag = execSync("git describe --exact-match --tags HEAD", {
      encoding: "utf-8",
      stdio: "pipe",
    }).trim();
    return tag;
  } catch {
    // No tag on current commit
    return null;
  }
}

/**
 * Determines which release target matches the current git tag
 */
export async function findTargetByGitTag(
  targets: ReleaseTarget[],
  tag: string,
): Promise<ReleaseTarget | null> {
  logger(`Looking for target matching git tag: ${tag}`);

  // Load each target's release config and check if the tag matches its tagPrefix
  for (const target of targets) {
    try {
      const configPath = target.configPath;
      if (!existsSync(configPath)) {
        continue;
      }

      // Dynamically import the release config using dynamic import
      const configFileUrl = pathToFileURL(configPath).href;
      const configModule = (await import(configFileUrl)) as {
        default?: ReleaseConfig;
      } & ReleaseConfig;
      const config: ReleaseConfig = configModule.default || configModule;

      // Check each package in the config
      for (const pkg of config.packages || []) {
        const tagPrefix = pkg.release?.tagPrefix;
        if (tagPrefix && tag.startsWith(tagPrefix)) {
          logger(
            `Found matching target: ${target.directory} (tagPrefix: ${tagPrefix})`,
          );
          return target;
        }
      }
    } catch (error) {
      // Skip targets with invalid configs
      logger(
        `Failed to load config for ${target.directory}: ${(error as Error).message}`,
      );
    }
  }

  logger(`No release target found for git tag: ${tag}`);
  logger(`Available targets: ${targets.map((t) => t.directory).join(", ")}`);

  // Show available tag prefixes for debugging
  const availablePrefixes: string[] = [];
  for (const target of targets) {
    try {
      const configFileUrl = pathToFileURL(target.configPath).href;
      const configModule = (await import(configFileUrl)) as {
        default?: ReleaseConfig;
      } & ReleaseConfig;
      const config: ReleaseConfig = configModule.default || configModule;
      for (const pkg of config.packages || []) {
        if (pkg.release?.tagPrefix) {
          availablePrefixes.push(
            `${pkg.release.tagPrefix} (${target.directory})`,
          );
        }
      }
    } catch {
      // Ignore
    }
  }

  if (availablePrefixes.length > 0) {
    logger(`Available tag prefixes: ${availablePrefixes.join(", ")}`);
  }

  return null;
}

/**
 * Filters targets based on criteria
 */
export function filterTargets(
  targets: ReleaseTarget[],
  filter?: {
    includePatterns?: string[];
    excludePatterns?: string[];
    onlyWithPackageJson?: boolean;
  },
): ReleaseTarget[] {
  if (!filter) {
    return targets;
  }

  let filtered = targets;

  // Apply include patterns
  if (filter.includePatterns && filter.includePatterns.length > 0) {
    filtered = filtered.filter((target) =>
      filter.includePatterns!.some((pattern) =>
        target.directory.includes(pattern),
      ),
    );
  }

  // Apply exclude patterns
  if (filter.excludePatterns && filter.excludePatterns.length > 0) {
    filtered = filtered.filter(
      (target) =>
        !filter.excludePatterns!.some((pattern) =>
          target.directory.includes(pattern),
        ),
    );
  }

  // Filter by package.json existence
  if (filter.onlyWithPackageJson) {
    filtered = filtered.filter((target) => {
      const packageJsonPath = join(target.directory, "package.json");
      return existsSync(packageJsonPath);
    });
  }

  return filtered;
}
