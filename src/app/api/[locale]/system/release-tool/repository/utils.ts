/**
 * Release Tool Utilities
 * Type guards, retry logic, and helper functions
 */

import type { EndpointLogger } from "../../unified-interface/shared/logger/endpoint";
import type { PackageJson, ParsedVersion, ReleaseConfig, RetryConfig } from "../definition";
import { MESSAGES, RETRY_DEFAULTS } from "./constants";

// ============================================================================
// Type Definitions for Type Guards
// ============================================================================

/**
 * Parsed JSON value type (result of JSON.parse)
 */
type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
interface JsonObject {
  [key: string]: JsonValue;
}
type JsonArray = JsonValue[];

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
export function parsePackageJson(value: JsonValue | undefined): PackageJson | undefined {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return undefined;
  }
  const obj = value as JsonObject;
  if (typeof obj.name === "string" && typeof obj.version === "string") {
    // Build a properly typed PackageJson object
    return {
      name: obj.name,
      version: obj.version,
      scripts: obj.scripts as PackageJson["scripts"],
      dependencies: obj.dependencies as PackageJson["dependencies"],
      devDependencies: obj.devDependencies as PackageJson["devDependencies"],
      peerDependencies: obj.peerDependencies as PackageJson["peerDependencies"],
      optionalDependencies: obj.optionalDependencies as PackageJson["optionalDependencies"],
      updateIgnoreDependencies:
        obj.updateIgnoreDependencies as PackageJson["updateIgnoreDependencies"],
    };
  }
  return undefined;
}

/**
 * Safe JSON parse that returns JsonValue type
 */
export function safeJsonParse(text: string): JsonValue | undefined {
  try {
    return JSON.parse(text) as JsonValue;
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
export function toCatchError(err: Error | ExecSyncError | string | null | undefined): CatchError {
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
export function hasStdout(error: CatchError): error is CatchError & { stdout: string | Buffer } {
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
export function hasStderr(error: CatchError): error is CatchError & { stderr: string | Buffer } {
  if (typeof error !== "object" || error === null) {
    return false;
  }
  return (
    "stderr" in error &&
    error.stderr !== undefined &&
    (typeof error.stderr === "string" || Buffer.isBuffer(error.stderr))
  );
}

/**
 * Type guard for errors with exit code
 */
export function hasExitCode(error: CatchError): error is CatchError & { status: number } {
  if (typeof error !== "object" || error === null) {
    return false;
  }
  return "status" in error && typeof error.status === "number";
}

/**
 * Check if a value is a non-empty string
 */
export function isNonEmptyString(value: string | undefined | null): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * Check if a value is a valid semver string
 */
export function isValidSemver(value: string): boolean {
  const semverRegex = /^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?(\+[a-zA-Z0-9.-]+)?$/;
  return semverRegex.test(value);
}

// ============================================================================
// Retry Logic
// ============================================================================

/**
 * Result type for retry operations
 */
export type RetryResult<T> = { success: true; data: T } | { success: false; message: string };

/**
 * Handler for retrying failed operations with exponential backoff
 */
export class RetryHandler {
  private readonly maxAttempts: number;
  private readonly delayMs: number;
  private readonly backoffMultiplier: number;
  private readonly maxDelayMs: number;

  constructor(config?: RetryConfig) {
    this.maxAttempts = config?.maxAttempts ?? RETRY_DEFAULTS.MAX_ATTEMPTS;
    this.delayMs = config?.delayMs ?? RETRY_DEFAULTS.INITIAL_DELAY;
    this.backoffMultiplier = config?.backoffMultiplier ?? RETRY_DEFAULTS.BACKOFF_MULTIPLIER;
    this.maxDelayMs = config?.maxDelayMs ?? RETRY_DEFAULTS.MAX_DELAY;
  }

  /**
   * Execute an operation with retry logic
   * Returns a result type instead of throwing
   */
  async withRetry<T>(
    operation: () => Promise<T>,
    logger: EndpointLogger,
    operationName: string,
  ): Promise<RetryResult<T>> {
    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= this.maxAttempts; attempt++) {
      try {
        const data = await operation();
        return { success: true, data };
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        if (attempt < this.maxAttempts) {
          const delay = this.calculateDelay(attempt);
          logger.warn(MESSAGES.RETRY_ATTEMPT, {
            operation: operationName,
            attempt,
            maxAttempts: this.maxAttempts,
            nextRetryIn: formatDuration(delay),
            error: lastError.message,
          });
          await sleep(delay);
        }
      }
    }

    logger.error(MESSAGES.RETRY_FAILED, {
      operation: operationName,
      attempts: this.maxAttempts,
      lastError: lastError?.message,
    });

    return {
      success: false,
      message: lastError?.message ?? `${operationName} failed after ${this.maxAttempts} attempts`,
    };
  }

  /**
   * Calculate delay for a given attempt using exponential backoff
   */
  private calculateDelay(attempt: number): number {
    const delay = this.delayMs * Math.pow(this.backoffMultiplier, attempt - 1);
    return Math.min(delay, this.maxDelayMs);
  }
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
    return remainingMs > 0 ? `${seconds}.${Math.floor(remainingMs / 100)}s` : `${seconds}s`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes < 60) {
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}

/**
 * Create a stopwatch for measuring operation duration
 */
export function createStopwatch(): {
  stop: () => number;
  elapsed: () => number;
} {
  const start = Date.now();
  return {
    stop: () => Date.now() - start,
    elapsed: () => Date.now() - start,
  };
}

// ============================================================================
// String Helpers
// ============================================================================

/**
 * Escape shell special characters in a string
 */
export function sanitizeForShell(value: string): string {
  return value.replaceAll(/[`$\\!"']/g, "\\$&");
}

/**
 * Escape double quotes in a string for shell commands
 */
export function escapeDoubleQuotes(value: string): string {
  return value.replaceAll('"', '\\"');
}

/**
 * Truncate a string to a maximum length with ellipsis
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) {
    return str;
  }
  return `${str.slice(0, maxLength - 3)}...`;
}

/**
 * Convert a string to kebab-case
 */
export function toKebabCase(str: string): string {
  return str
    .replaceAll(/([a-z])([A-Z])/g, "$1-$2")
    .replaceAll(/[\s_]+/g, "-")
    .toLowerCase();
}

/**
 * Pluralize a word based on count
 */
export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : (plural ?? `${singular}s`);
}

// ============================================================================
// Version Helpers
// ============================================================================

/**
 * Parse a semantic version string into components
 */
export function parseVersion(version: string): ParsedVersion {
  const regex = /^(\d+)\.(\d+)\.(\d+)(?:-([a-zA-Z0-9.-]+))?(?:\+([a-zA-Z0-9.-]+))?$/;
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

/**
 * Execute async operations with a concurrency limit
 * Uses Promise.allSettled for cleaner implementation without type casts
 */
export async function asyncPool<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = [];

  // Process items in batches of concurrency size
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    const batchResults = await Promise.allSettled(batch.map(fn));

    for (const result of batchResults) {
      if (result.status === "fulfilled") {
        results.push(result.value);
      }
    }
  }

  return results;
}

// ============================================================================
// Object Helpers
// ============================================================================

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Pick specific keys from an object
 */
export function pick<T extends Record<string, JsonValue>, K extends keyof T>(
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
export function omit<T extends Record<string, JsonValue>, K extends keyof T>(
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
// Environment Helpers
// ============================================================================

/**
 * Result type for environment variable retrieval
 */
export type EnvResult = { success: true; value: string } | { success: false; message: string };

/**
 * Get an environment variable with a default value
 */
export function getEnv(key: string, defaultValue?: string): string | undefined {
  return process.env[key] ?? defaultValue;
}

/**
 * Get a required environment variable
 * Returns a result type instead of throwing
 */
export function requireEnv(key: string): EnvResult {
  const value = process.env[key];
  if (value === undefined || value === "") {
    return {
      success: false,
      message: `Required environment variable ${key} is not set`,
    };
  }
  return { success: true, value };
}

/**
 * Check if running in production
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

/**
 * Check if running in development
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === "development" || !process.env.NODE_ENV;
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

/**
 * Get file extension from path (without dot)
 */
export function getExtension(path: string): string {
  const lastDot = path.lastIndexOf(".");
  if (lastDot === -1 || lastDot === 0) {
    return "";
  }
  return path.slice(lastDot + 1).toLowerCase();
}

// ============================================================================
// Date Helpers
// ============================================================================

/**
 * Get current date in ISO format (YYYY-MM-DD)
 */
export function getISODate(): string {
  return new Date().toISOString().split("T")[0] ?? "";
}

/**
 * Get current timestamp suitable for filenames
 */
export function getFileTimestamp(): string {
  return new Date().toISOString().replaceAll(/[:.T]/g, "-").split("-").slice(0, 6).join("-");
}
