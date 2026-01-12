/**
 * Shared Check Utilities
 *
 * Common utilities used by lint, oxlint, and other check repositories:
 * - File discovery and scanning
 * - Glob pattern matching
 * - Worker orchestration
 * - Result processing
 */

import { existsSync, promises as fs } from "node:fs";
import { extname, join, relative, resolve } from "node:path";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { parseError } from "../../../shared/utils/parse-error";

// ============================================================
// Constants
// ============================================================

/** Permission error codes to handle gracefully */
export const PERMISSION_ERROR_CODES = ["EACCES", "permission denied"] as const;

// ============================================================
// Types
// ============================================================

/** Generic worker task for parallel processing */
export interface BaseWorkerTask {
  id: number;
  files: string[];
  timeout: number;
}

/** Generic worker result from parallel processing */
export interface BaseWorkerResult<TIssue> {
  id: number;
  success: boolean;
  issues: TIssue[];
  duration: number;
  error?: string;
}

/** Issue severity levels */
export type IssueSeverity = "error" | "warning" | "info";

/** Base issue structure */
export interface BaseIssue {
  file: string;
  line?: number;
  column?: number;
  rule?: string;
  severity: IssueSeverity;
  message: string;
}

/** Issue summary statistics */
export interface IssueSummary {
  total: number;
  errors: number;
  warnings: number;
  info: number;
  hasIssues: boolean;
}

// ============================================================
// Glob Pattern Matching
// ============================================================

/**
 * Convert a glob pattern to a regex pattern.
 *
 * @param pattern - Glob pattern (e.g., "**\/*.ts", "node_modules")
 * @returns Regex pattern string
 */
export function globToRegex(pattern: string): string {
  return pattern.replaceAll("**", ".*").replaceAll("*", "[^/]*");
}

/**
 * Check if a path matches any glob pattern.
 *
 * @param relativePath - Path relative to project root
 * @param patterns - Array of glob patterns
 * @returns True if path matches any pattern
 */
export function matchesGlobPattern(
  relativePath: string,
  patterns: string[],
): boolean {
  for (const pattern of patterns) {
    if (pattern.includes("*")) {
      const regexPattern = globToRegex(pattern);
      if (new RegExp(regexPattern).test(relativePath)) {
        return true;
      }
    } else if (
      relativePath.includes(`/${pattern}/`) ||
      relativePath.startsWith(`${pattern}/`)
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Check if a path should be ignored based on ignore patterns.
 * Only evaluates paths relative to cwd - never ignores paths outside/above cwd.
 *
 * @param name - File or directory name
 * @param fullPath - Full absolute path
 * @param ignores - Array of ignore patterns
 * @returns True if path should be ignored
 */
export function shouldIgnorePath(
  name: string,
  fullPath: string,
  ignores: string[],
): boolean {
  // Get relative path from cwd
  const relativePath = relative(process.cwd(), fullPath);

  // Never ignore paths outside/above cwd (they'd have ".." in the relative path or be empty)
  if (!relativePath || relativePath.startsWith("..")) {
    return false;
  }

  // Skip hidden files/dirs (except .d.ts files)
  if (name.startsWith(".") && !name.endsWith(".d.ts")) {
    return true;
  }

  // Check ignore patterns against the relative path
  for (const pattern of ignores) {
    if (pattern.includes("*")) {
      // Glob pattern
      const regexPattern = globToRegex(pattern);
      if (new RegExp(regexPattern).test(relativePath)) {
        return true;
      }
    } else {
      // Simple pattern - check if it matches any path segment or the full relative path
      // Match: "node_modules" matches "node_modules", "node_modules/foo", "foo/node_modules/bar"
      if (
        relativePath === pattern ||
        relativePath.startsWith(`${pattern}/`) ||
        relativePath.includes(`/${pattern}/`) ||
        relativePath.endsWith(`/${pattern}`)
      ) {
        return true;
      }
    }
  }

  return false;
}

// ============================================================
// File Discovery
// ============================================================

/** Options for file discovery */
export interface FileDiscoveryOptions {
  /** File extensions to include (e.g., [".ts", ".tsx"]) */
  extensions: string[];
  /** Patterns to ignore */
  ignores: string[];
}

/**
 * Check if a file has a lintable extension.
 *
 * @param filePath - Path to file
 * @param extensions - Array of allowed extensions
 * @returns True if file extension is in the allowed list
 */
export function hasLintableExtension(
  filePath: string,
  extensions: string[],
): boolean {
  const ext = extname(filePath);
  return extensions.includes(ext);
}

/**
 * Recursively scan a directory for files matching criteria.
 *
 * @param dirPath - Directory path to scan
 * @param files - Array to accumulate found files
 * @param logger - Logger for debug/warning messages
 * @param options - Discovery options (extensions, ignores)
 */
export async function scanDirectory(
  dirPath: string,
  files: string[],
  logger: EndpointLogger,
  options: FileDiscoveryOptions,
): Promise<void> {
  try {
    // Check if directory should be ignored (only applies to paths below cwd)
    const dirName = dirPath.split("/").pop() || "";
    if (shouldIgnorePath(dirName, dirPath, options.ignores)) {
      return;
    }

    const entries = await fs.readdir(dirPath);

    for (const entry of entries) {
      const fullPath = join(dirPath, entry);

      if (shouldIgnorePath(entry, fullPath, options.ignores)) {
        continue;
      }

      try {
        const stats = await fs.stat(fullPath);

        if (stats.isDirectory()) {
          await scanDirectory(fullPath, files, logger, options);
        } else if (
          stats.isFile() &&
          hasLintableExtension(fullPath, options.extensions)
        ) {
          files.push(fullPath);
        }
      } catch (statError) {
        const error = parseError(statError);
        if (
          PERMISSION_ERROR_CODES.some((code) => error.message.includes(code))
        ) {
          logger.debug(`Permission denied accessing: ${fullPath}`);
        } else {
          logger.warn(`Failed to stat path: ${fullPath}`, {
            error: error.message,
          });
        }
      }
    }
  } catch (error) {
    const parsedError = parseError(error);
    if (
      PERMISSION_ERROR_CODES.some((code) => parsedError.message.includes(code))
    ) {
      logger.debug(`Permission denied scanning directory: ${dirPath}`);
    } else {
      logger.warn(`Failed to scan directory: ${dirPath}`, {
        error: parsedError.message,
      });
    }
  }
}

/**
 * Discover files to lint based on input path.
 *
 * @param inputPath - File or directory path to discover
 * @param logger - Logger for debug/warning messages
 * @param options - Discovery options (extensions, ignores)
 * @returns Array of relative file paths
 */
export async function discoverFiles(
  inputPath: string,
  logger: EndpointLogger,
  options: FileDiscoveryOptions,
): Promise<string[]> {
  const files: string[] = [];
  const resolvedPath = resolve(inputPath);

  if (!existsSync(resolvedPath)) {
    logger.warn(`Path does not exist: ${inputPath}`);
    return files;
  }

  const stats = await fs.stat(resolvedPath);

  if (stats.isFile()) {
    if (hasLintableExtension(resolvedPath, options.extensions)) {
      files.push(resolvedPath);
    }
  } else if (stats.isDirectory()) {
    await scanDirectory(resolvedPath, files, logger, options);
  }

  return files.map((file) => relative(process.cwd(), file));
}

// ============================================================
// Worker Orchestration
// ============================================================

/**
 * Distribute files evenly across workers.
 *
 * @param files - Array of files to distribute
 * @param workerCount - Number of workers
 * @returns Array of file arrays, one per worker
 */
export function distributeFilesAcrossWorkers(
  files: string[],
  workerCount: number,
): string[][] {
  const result: string[][] = [];
  const filesPerWorker = Math.ceil(files.length / workerCount);

  for (let i = 0; i < workerCount; i++) {
    const startIndex = i * filesPerWorker;
    const endIndex = Math.min(startIndex + filesPerWorker, files.length);
    const workerFiles = files.slice(startIndex, endIndex);

    if (workerFiles.length > 0) {
      result.push(workerFiles);
    }
  }

  return result;
}

// ============================================================
// Result Processing
// ============================================================

/**
 * Generate summary statistics from issues.
 *
 * @param issues - Array of issues with severity
 * @returns Summary object with counts
 */
export function generateIssueSummary<T extends { severity: IssueSeverity }>(
  issues: T[],
): IssueSummary {
  const errors = issues.filter((i) => i.severity === "error");
  const warnings = issues.filter((i) => i.severity === "warning");
  const info = issues.filter((i) => i.severity === "info");

  return {
    total: issues.length,
    errors: errors.length,
    warnings: warnings.length,
    info: info.length,
    hasIssues: issues.length > 0,
  };
}

/**
 * Sort issues by file path, then by line number.
 *
 * @param issues - Array of issues to sort
 * @returns New sorted array (does not mutate original)
 */
export function sortIssuesByLocation<T extends BaseIssue>(issues: T[]): T[] {
  return issues.toSorted((a, b) => {
    if (a.file !== b.file) {
      return a.file.localeCompare(b.file);
    }
    return (a.line || 0) - (b.line || 0);
  });
}

// ============================================================
// Error Message Helpers
// ============================================================

/**
 * Create a worker failed error message.
 */
export function createWorkerFailedMessage(
  workerId: number,
  reason: string,
): string {
  // eslint-disable-next-line i18next/no-literal-string
  return `Worker ${workerId} failed: ${reason}`;
}

/**
 * Create a worker timeout error message.
 */
export function createWorkerTimeoutMessage(
  workerId: number,
  timeout: number,
): string {
  // eslint-disable-next-line i18next/no-literal-string
  return `Worker ${workerId} timed out after ${timeout}s`;
}

/**
 * Create a worker exit code error message.
 */
export function createWorkerExitCodeMessage(
  workerId: number,
  exitCode: number,
): string {
  // eslint-disable-next-line i18next/no-literal-string
  return `Worker ${workerId} failed with exit code ${exitCode}`;
}
