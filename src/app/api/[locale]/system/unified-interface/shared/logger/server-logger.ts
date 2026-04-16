/**
 * Server-side Logger
 * Thin wrapper around logger-core that wires up DB persistence via error-persist.
 * Import this in all server code: repositories, route handlers, cron tasks, etc.
 */

import "server-only";

// Side-effect: registers the global error sink so all logger.error()/warn() calls
// persist to the error_logs table. Runs once per server process on first import.
import "./error-persist";

import type { CountryLanguage } from "@/i18n/core/config";

import type { EndpointLogger } from "./endpoint";
import { getErrorSink } from "./endpoint";
import { createLogger } from "./logger-core";

export function createEndpointLogger(
  debugEnabled = false,
  startTime: number = Date.now(),
  locale: CountryLanguage,
): EndpointLogger {
  return createLogger(
    debugEnabled,
    startTime,
    locale,
    (level, message, error, metadata) => {
      getErrorSink()?.(level, message, error, metadata);
    },
  );
}
