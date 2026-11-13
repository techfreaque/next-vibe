/**
 * Client storage failure reporting.
 *
 * Shared by every platform's storage + cookie adapter (web localStorage /
 * sessionStorage / document.cookie, native AsyncStorage, CLI file store) so a
 * full quota, a privacy-mode SecurityError or a corrupt file never fails
 * silently. Reports the KEY NAME only - never the value (drafts, tokens).
 */

import type { EndpointLogger } from "./types";

export type StoragePlatform = "web" | "native" | "cli";

export type StorageArea =
  | "localStorage"
  | "sessionStorage"
  | "cookie"
  | "asyncStorage"
  | "indexedDB"
  | "file";

export type StorageOperation =
  | "get"
  | "set"
  | "remove"
  | "list"
  | "parse"
  | "open"
  | "migrate";

/** What already fills the storage area when a write fails (quota diagnosis). */
export interface StorageUsage {
  /** Total characters (keys + values) currently stored in the area. */
  usedChars?: number;
  /** Number of keys in the area. */
  keyCount?: number;
  /** Largest stored key and its value length - the usual quota hog. */
  largestKey?: string | null;
  largestChars?: number;
  /** navigator.storage.estimate() numbers (origin-wide, bytes). */
  originUsageBytes?: number;
  originQuotaBytes?: number;
}

export interface StorageFailure {
  platform: StoragePlatform;
  area: StorageArea;
  operation: StorageOperation;
  /** Key / cookie name. Never the stored value. */
  key: string | null;
  error: Error | string | number | boolean | null | undefined;
  /** Length of the value being written (quota diagnosis) - never the value. */
  valueLength?: number;
  /** Area usage at failure time (never values). */
  usage?: StorageUsage;
}

/** Error class name: QuotaExceededError, SecurityError, ENOENT, SyntaxError ... */
function errorName(error: StorageFailure["error"]): string {
  if (error instanceof Error) {
    // Node fs errors carry an errno code (ENOENT, EACCES, ENOSPC)
    if (
      "code" in error &&
      typeof error.code === "string" &&
      error.code.length > 0
    ) {
      return `${error.name}:${error.code}`;
    }
    return error.name;
  }
  return "UnknownError";
}

function errorMessage(error: StorageFailure["error"]): string {
  if (error instanceof Error) {
    return error.message.slice(0, 300);
  }
  return String(error).slice(0, 300);
}

/**
 * Writes losing data (quota, disabled storage) are errors; failed reads and
 * removes are warnings - the caller falls back to a default either way.
 */
export function reportStorageFailure(
  logger: EndpointLogger,
  failure: StorageFailure,
): void {
  try {
    const name = errorName(failure.error);
    const context = {
      platform: failure.platform,
      storageArea: failure.area,
      operation: failure.operation,
      key: failure.key,
      errorName: name,
      errorMessage: errorMessage(failure.error),
      valueLength: failure.valueLength ?? null,
      ...failure.usage,
      quotaExceeded:
        /quota/i.test(name) || /quota/i.test(String(failure.error)),
      securityBlocked: name === "SecurityError",
    };
    const message = `[storage] ${failure.area}.${failure.operation} failed`;
    if (failure.operation === "set") {
      logger.error(message, context);
      return;
    }
    logger.warn(message, context);
  } catch {
    // Reporting a storage failure must never become a second failure
  }
}
