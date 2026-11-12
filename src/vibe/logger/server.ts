/**
 * Server-side Logger
 * Wraps logger-core and injects file logging + DB persistence.
 * Import this in all server code: repositories, route handlers, cron tasks, etc.
 */

import "server-only";

import type { CountryLanguage } from "../core/i18n/core/config";
import { createLogger } from "./create-logger";
import { persistErrorLog } from "./db-persist";
import { serverFileLog } from "./file";
import type { EndpointLogger } from "./types";

/** Per-request context stamped on every persisted/file log row. */
export interface ServerLogContext {
  /** Correlation id from the client's x-request-id header (or minted here). */
  requestId: string;
}

/**
 * Per-request metadata keys that must not split one recurring server error
 * into one error_logs row per request (the row still stores the latest).
 */
export const SERVER_LOG_FINGERPRINT_IGNORE_KEYS: ReadonlySet<string> = new Set([
  "requestId",
]);

export function createEndpointLogger(
  debugEnabled = false,
  locale: CountryLanguage,
  context?: ServerLogContext,
): EndpointLogger {
  // Read at call time so loadEnvironment() has already set VIBE_LOG_TARGET.
  const persistToDb = process.env["VIBE_LOG_TARGET"] === "db";
  const requestId = context?.requestId;
  return createLogger(
    debugEnabled,
    locale,
    persistToDb
      ? (level, message, error, metadata, loc) => {
          persistErrorLog(
            level,
            message,
            error,
            requestId ? [...metadata, { requestId }] : metadata,
            loc,
            requestId
              ? { fingerprintIgnoreKeys: SERVER_LOG_FINGERPRINT_IGNORE_KEYS }
              : undefined,
          );
        }
      : undefined,
    requestId
      ? (message, data): void =>
          serverFileLog(message, data ? { ...data, requestId } : { requestId })
      : serverFileLog,
  );
}
