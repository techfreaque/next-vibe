/**
 * Release Tool Utilities
 * Type guards, retry logic, and helper functions
 */

import type { WidgetData } from "../../../core/utils/json";
import type { PackageJson, ParsedVersion, ReleaseConfig } from "../definition";

// ============================================================================
// Type Definitions for Type Guards
// ============================================================================

/**
 * Error type from catch blocks - can be any value
 */
type CatchError =
  | Error
  | {
      stdout?: string | Buffer;
      stderr?: string | Buffer;
      status?: number;
      message?: string;
    };

/**
 * Exec sync error type with stdout/stderr
 */
interface ExecSyncError {
  stdout?: string | Buffer;
  stderr?: string | Buffer;
  status?: number;
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Check if a parsed JSON value is a valid PackageJson
 * Returns the value typed as PackageJson if valid, otherwise undefined
 */
export function parsePackageJson(
  value: WidgetData | undefined,
): PackageJson | undefined {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return undefined;
  }
  const obj = value as Record<string, WidgetData>;
  if (typeof obj.name === "string" && typeof obj.version === "string") {
    // Build a properly typed PackageJson object
    return {
      name: obj.name,
      version: obj.version,
      scripts: obj.scripts as PackageJson["scripts"],
      dependencies: obj.dependencies as PackageJson["dependencies"],
      devDependencies: obj.devDependencies as PackageJson["devDependencies"],
      peerDependencies: obj.peerDependencies as PackageJson["peerDependencies"],
      optionalDependencies:
        obj.optionalDependencies as PackageJson["optionalDependencies"],
      updateIgnoreDependencies:
        obj.updateIgnoreDependencies as PackageJson["updateIgnoreDependencies"],
    };
  }
  return undefined;
}

/**
 * Safe JSON parse that returns WidgetData type
 */
export function safeJsonParse(text: string): WidgetData | undefined {
  try {
    return JSON.parse(text) as WidgetData;
  } catch {
    return undefined;
  }
}

/**
 * Type guard for ReleaseConfig modules
 */
export function isReleaseConfigModule(
  module: { default?: ReleaseConfig } | null | undefined,
): module is { default: ReleaseConfig } {
  if (typeof module !== "object" || module === null) {
    return false;
  }
  if (!("default" in module) || module.default === undefined) {
    return false;
  }
  const defaultExport = module.default;
  if (typeof defaultExport !== "object" || defaultExport === null) {
    return false;
  }
  if (!("packages" in defaultExport)) {
    return false;
  }
  return Array.isArray(defaultExport.packages);
}

/**
 * Convert catch error to typed error
 * Accepts any value from catch block and converts to CatchError
 */
export function toCatchError(
  err: Error | ExecSyncError | string | null | undefined,
): CatchError {
  if (err instanceof Error) {
    return err;
  }
  if (typeof err === "string") {
    return new Error(err);
  }
  if (typeof err === "object" && err !== null) {
    return err as CatchError;
  }
  return new Error(String(err));
}

/**
 * Type guard for errors with stdout
 */
export function hasStdout(
  error: CatchError,
): error is CatchError & { stdout: string | Buffer } {
  if (typeof error !== "object" || error === null) {
    return false;
  }
  return (
    "stdout" in error &&
    error.stdout !== undefined &&
    (typeof error.stdout === "string" || Buffer.isBuffer(error.stdout))
  );
}

/**
 * Type guard for errors with stderr
 */
export function hasStderr(
  error: CatchError,
): error is CatchError & { stderr: string | Buffer } {
  if (typeof error !== "object" || error === null) {
    return false;
  }
  return (
    "stderr" in error &&
    error.stderr !== undefined &&
    (typeof error.stderr === "string" || Buffer.isBuffer(error.stderr))
  );
}

// ============================================================================
// Time and Duration Helpers
// ============================================================================

/**
 * Sleep for a specified duration
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * Format a duration in milliseconds to a human-readable string
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`;
  }

  const seconds = Math.floor(ms / 1000);
  const remainingMs = ms % 1000;

  if (seconds < 60) {
    return remainingMs > 0
      ? `${seconds}.${Math.floor(remainingMs / 100)}s`
      : `${seconds}s`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes < 60) {
    return remainingSeconds > 0
      ? `${minutes}m ${remainingSeconds}s`
      : `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}

// ============================================================================
// String Helpers
// ============================================================================

/**
 * Truncate a string to a maximum length with ellipsis
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) {
    return str;
  }
  return `${str.slice(0, maxLength - 3)}...`;
}

// ============================================================================
// Version Helpers
// ============================================================================

/**
 * Parse a semantic version string into components
 */
function parseVersion(version: string): ParsedVersion {
  const regex =
    /^(\d+)\.(\d+)\.(\d+)(?:-([a-zA-Z0-9.-]+))?(?:\+([a-zA-Z0-9.-]+))?$/;
  const match = version.match(regex);

  if (!match) {
    return {
      major: 0,
      minor: 0,
      patch: 0,
      prerelease: null,
      prereleaseNumber: null,
      buildMetadata: null,
    };
  }

  const prerelease = match[4] ?? null;
  let prereleaseNumber: number | null = null;

  if (prerelease) {
    const preMatch = prerelease.match(/\.(\d+)$/);
    if (preMatch) {
      prereleaseNumber = parseInt(preMatch[1] ?? "0", 10);
    }
  }

  return {
    major: parseInt(match[1] ?? "0", 10),
    minor: parseInt(match[2] ?? "0", 10),
    patch: parseInt(match[3] ?? "0", 10),
    prerelease,
    prereleaseNumber,
    buildMetadata: match[5] ?? null,
  };
}

/**
 * Compare two semantic version strings
 * Returns: -1 if a < b, 0 if a == b, 1 if a > b
 */
export function compareVersions(a: string, b: string): -1 | 0 | 1 {
  const va = parseVersion(a);
  const vb = parseVersion(b);

  // Compare major.minor.patch
  if (va.major !== vb.major) {
    return va.major > vb.major ? 1 : -1;
  }
  if (va.minor !== vb.minor) {
    return va.minor > vb.minor ? 1 : -1;
  }
  if (va.patch !== vb.patch) {
    return va.patch > vb.patch ? 1 : -1;
  }

  // Handle prerelease comparison
  if (va.prerelease === null && vb.prerelease === null) {
    return 0;
  }
  if (va.prerelease === null) {
    return 1; // Release > prerelease
  }
  if (vb.prerelease === null) {
    return -1;
  }

  // Compare prerelease identifiers
  const comparison = va.prerelease.localeCompare(vb.prerelease);
  return comparison === 0 ? 0 : comparison > 0 ? 1 : -1;
}

// ============================================================================
// Array Helpers
// ============================================================================

/**
 * Chunk an array into smaller arrays of specified size
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Remove duplicate items from an array
 */
export function unique<T>(array: T[]): T[] {
  return [...new Set(array)];
}

// ============================================================================
// Object Helpers
// ============================================================================

/**
 * Pick specific keys from an object
 */
export function pick<T extends Record<string, WidgetData>, K extends keyof T>(
  obj: T,
  keys: K[],
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
}

/**
 * Omit specific keys from an object
 */
export function omit<T extends Record<string, WidgetData>, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K> {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result as Omit<T, K>;
}

// ============================================================================
// Path Helpers
// ============================================================================

/**
 * Normalize path separators to forward slashes
 */
export function normalizePath(path: string): string {
  return path.replaceAll("\\", "/");
}
