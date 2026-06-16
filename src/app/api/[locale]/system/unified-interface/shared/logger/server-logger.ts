/**
 * Server-side Logger
 * Wraps logger-core and injects file logging + DB persistence.
 * Import this in all server code: repositories, route handlers, cron tasks, etc.
 */

import "server-only";

import type { CountryLanguage } from "@/i18n/core/config";

import type { EndpointLogger } from "./endpoint";
import { persistErrorLog } from "./error-persist";
import { serverFileLog } from "./file-logger";
import { createLogger } from "./logger-core";

export function createEndpointLogger(
  debugEnabled = false,
  startTime: number = Date.now(),
  locale: CountryLanguage,
): EndpointLogger {
  // Read at call time so loadEnvironment() has already set VIBE_LOG_TARGET.
  const persistToDb = process.env["VIBE_LOG_TARGET"] === "db";
  return createLogger(
    debugEnabled,
    startTime,
    locale,
    persistToDb
      ? (level, message, error, metadata, loc) => {
          persistErrorLog(level, message, error, metadata, loc);
        }
      : undefined,
    serverFileLog,
  );
}
