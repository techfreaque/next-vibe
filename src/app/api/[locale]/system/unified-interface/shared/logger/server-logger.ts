/**
 * Server-side Logger
 * Wraps logger-core and directly calls persistErrorLog for DB persistence.
 * Import this in all server code: repositories, route handlers, cron tasks, etc.
 */

import "server-only";

import type { CountryLanguage } from "@/i18n/core/config";

import type { EndpointLogger } from "./endpoint";
import { persistErrorLog } from "./error-persist";
import { createLogger } from "./logger-core";

const isProduction = process.env["NODE_ENV"] === "production";
const isPreview = process.env["IS_PREVIEW_MODE"] === "true";
const shouldPersist = isProduction || isPreview;

export function createEndpointLogger(
  debugEnabled = false,
  startTime: number = Date.now(),
  locale: CountryLanguage,
): EndpointLogger {
  return createLogger(
    debugEnabled,
    startTime,
    locale,
    shouldPersist
      ? (level, message, error, metadata) => {
          persistErrorLog(level, message, error, metadata);
        }
      : undefined,
  );
}
