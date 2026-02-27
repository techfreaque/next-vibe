/**
 * Error Log Persistence
 * Fire-and-forget write of truncated error logs to the database.
 *
 * IMPORTANT: This module must never throw — logging persistence is best-effort.
 * All errors during persistence are silently swallowed to avoid cascading failures.
 *
 * Auto-registers itself as the global error sink when imported.
 * Only import this module from server-only code (seeds, server startup, etc.).
 */

import "server-only";

import {
  errorLogs,
  MAX_MESSAGE_LENGTH,
  MAX_STACK_LENGTH,
  type NewErrorLog,
} from "@/app/api/[locale]/system/unified-interface/tasks/error-monitor/db";

import { type LoggerMetadata, registerErrorSink } from "./endpoint";

/** Truncate a string to maxLen, appending "..." if truncated */
function truncate(str: string | undefined | null, maxLen: number): string {
  if (!str) {
    return "";
  }
  if (str.length <= maxLen) {
    return str;
  }
  return `${str.slice(0, maxLen - 3)}...`;
}

/** Extract a short stack trace (first few frames) */
function extractStack(error: LoggerMetadata | undefined): string | undefined {
  if (error instanceof Error && error.stack) {
    return truncate(error.stack, MAX_STACK_LENGTH);
  }
  return undefined;
}

/** Extract error type from metadata */
function extractErrorType(
  error: LoggerMetadata | undefined,
): string | undefined {
  if (error instanceof Error) {
    return error.constructor.name;
  }
  if (
    typeof error === "object" &&
    error !== null &&
    !(error instanceof Date) &&
    !Array.isArray(error) &&
    "errorType" in error &&
    typeof error.errorType === "string"
  ) {
    return error.errorType;
  }
  return undefined;
}

/** Extract error message from various error shapes */
function extractMessage(
  message: string,
  error: LoggerMetadata | undefined,
): string {
  let fullMessage = message;
  if (error instanceof Error && error.message) {
    fullMessage = `${message}: ${error.message}`;
  } else if (typeof error === "string") {
    fullMessage = `${message}: ${error}`;
  }
  return truncate(fullMessage, MAX_MESSAGE_LENGTH);
}

/**
 * Persist an error log to the database (fire-and-forget).
 * Never throws — all errors are silently caught.
 */
export function persistErrorLog(
  source: NewErrorLog["source"],
  message: string,
  error?: LoggerMetadata,
  context?: {
    endpoint?: string;
    level?: "error" | "warn";
  },
): void {
  // Fire-and-forget — do not await
  void (async (): Promise<void> => {
    try {
      // Dynamic import to avoid circular dependencies and module-level DB init
      const { db } = await import("@/app/api/[locale]/system/db");

      const row: NewErrorLog = {
        source,
        level: context?.level ?? "error",
        message: extractMessage(message, error),
        endpoint: context?.endpoint ?? null,
        errorType: extractErrorType(error) ?? null,
        errorCode: null,
        stackTrace: extractStack(error) ?? null,
        metadata: {},
      };

      await db.insert(errorLogs).values(row);
    } catch {
      // Silently swallow — logging persistence must never cascade
    }
  })();
}

/**
 * Auto-register as the global error sink (preview + production only).
 * Dev environments skip persistence to avoid spamming the local DB.
 *
 * Production: NODE_ENV=production
 * Preview: NODE_ENV=development + IS_PREVIEW_MODE=true
 */
const isProduction = process.env["NODE_ENV"] === "production";
const isPreview = process.env["IS_PREVIEW_MODE"] === "true";

if (isProduction || isPreview) {
  registerErrorSink((message, error) => {
    persistErrorLog("backend", message, error);
  });
}
