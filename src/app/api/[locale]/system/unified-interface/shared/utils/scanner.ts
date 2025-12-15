/**
 * Directory Scanner Utility
 * Consolidated directory scanning logic used across the codebase
 * Eliminates 8+ duplicate implementations
 */

import "server-only";

import { existsSync, readdirSync } from "node:fs";
import { join, relative, resolve } from "node:path";

/**
 * Options for directory scanning
 */
export interface DirectoryScanOptions {
  /**
   * File name pattern to match (e.g., "route.ts", "seed.ts")
   * Can be exact match or regex pattern
   */
  filePattern?: string | RegExp;

  /**
   * File extension patterns to match (e.g., [".ts", ".tsx"])
   */
  extensions?: string[];

  /**
   * Directory names to exclude from scanning
   */
  excludeDirs?: string[];

  /**
   * File names to exclude from results
   */
  excludeFiles?: string[];

  /**
   * Path patterns to exclude (checked against relative path)
   */
  excludePatterns?: string[];

  /**
   * Whether to include the relative path in results
   * If true, returns { fullPath, relativePath }
   * If false, returns just fullPath
   */
  includeRelativePath?: boolean;

  /**
   * Whether to include path segments (directory structure as array)
   */
  includePathSegments?: boolean;

  /**
   * Maximum depth to scan (undefined = unlimited)
   */
  maxDepth?: number;

  /**
   * Whether to follow symbolic links
   */
  followSymlinks?: boolean;

  /**
   * Custom filter function for additional filtering
   */
  customFilter?: (fullPath: string, relativePath: string) => boolean;
}

/**
 * Result of directory scan with full path
 */
export interface ScanResultSimple {
  fullPath: string;
}

/**
 * Result of directory scan with relative path
 */
export interface ScanResultWithRelative extends ScanResultSimple {
  relativePath: string;
}

/**
 * Result of directory scan with path segments
 */
export interface ScanResultWithSegments extends ScanResultWithRelative {
  pathSegments: string[];
}

/**
 * Default directories to exclude
 */
const DEFAULT_EXCLUDE_DIRS = [
  "node_modules",
  ".git",
  ".next",
  ".tmp",
  "dist",
  ".dist",
];

/**
 * Scan directory recursively and find matching files
 */
export function scanDirectory(
  baseDir: string,
  options: DirectoryScanOptions = {},
): ScanResultWithSegments[] {
  const {
    filePattern,
    extensions = [],
    excludeDirs = DEFAULT_EXCLUDE_DIRS,
    excludeFiles = [],
    excludePatterns = [],
    maxDepth,
    followSymlinks = false,
    customFilter,
  } = options;

  const results: ScanResultWithSegments[] = [];
  const resolvedBaseDir = resolve(baseDir);

  if (!existsSync(resolvedBaseDir)) {
    return results;
  }

  /**
   * Recursive scan function
   */
  function scan(
    currentDir: string,
    currentSegments: string[] = [],
    depth = 0,
  ): void {
    // Check max depth
    if (maxDepth !== undefined && depth > maxDepth) {
      return;
    }

    try {
      const entries = readdirSync(currentDir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = join(currentDir, entry.name);
        const relativePath = relative(resolvedBaseDir, fullPath);

        // Skip excluded directories
        if (entry.isDirectory()) {
          if (excludeDirs.includes(entry.name) || entry.name.startsWith(".")) {
            continue;
          }

          // Check exclude patterns
          if (
            excludePatterns.some((pattern) => relativePath.includes(pattern))
          ) {
            continue;
          }

          // Recurse into subdirectory
          const newSegments = [...currentSegments, entry.name];
          scan(fullPath, newSegments, depth + 1);
        } else if (
          entry.isFile() ||
          (followSymlinks && entry.isSymbolicLink())
        ) {
          // Skip excluded files
          if (excludeFiles.includes(entry.name)) {
            continue;
          }

          // Check file pattern
          let matches = false;

          if (filePattern) {
            if (typeof filePattern === "string") {
              matches = entry.name === filePattern;
            } else {
              matches = filePattern.test(entry.name);
            }
          } else if (extensions.length > 0) {
            matches = extensions.some((ext) => entry.name.endsWith(ext));
          } else {
            // No pattern specified, match all files
            matches = true;
          }

          if (!matches) {
            continue;
          }

          // Apply custom filter
          if (customFilter && !customFilter(fullPath, relativePath)) {
            continue;
          }

          // Add to results
          results.push({
            fullPath,
            relativePath,
            pathSegments: currentSegments,
          });
        }
      }
    } catch {
      // Skip directories we can't read
    }
  }

  scan(resolvedBaseDir);
  return results;
}

/**
 * Find files by exact name pattern
 */
export function findFilesByName(
  baseDir: string,
  fileName: string,
  options: Omit<DirectoryScanOptions, "filePattern"> = {},
): ScanResultWithSegments[] {
  return scanDirectory(baseDir, {
    ...options,
    filePattern: fileName,
  });
}

/**
 * Get all route.ts files in a directory
 */
export function findRouteFiles(
  directory: string,
  excludePatterns: string[] = [],
): ScanResultWithSegments[] {
  return scanDirectory(directory, {
    filePattern: "route.ts",
    excludePatterns,
    excludeDirs: [...DEFAULT_EXCLUDE_DIRS, "trpc", "generated"],
  });
}
