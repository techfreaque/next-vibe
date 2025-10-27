/* eslint-disable no-console */
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import type { TranslationKey } from "@/i18n/core/static-types";

import type { EndpointLogger, LoggerMetadata } from "./logger-types";

// Re-export types for convenience
export type { EndpointLogger, LoggerMetadata };

/**
 * Creates a logger instance for endpoint handlers
 * Provides pretty formatted logging with running time in seconds
 */
export function createEndpointLogger(
  debugEnabled = false,
  startTime: number = Date.now(),
  locale: CountryLanguage,
): EndpointLogger {
  const { t } = simpleT(locale);

  const getElapsedTime = (): string => {
    const elapsed = (Date.now() - startTime) / 1000;
    return `${elapsed.toFixed(3)}s`;
  };

  const formatMessage = (level: string, message: string): string => {
    // Messages are plain strings, not translation keys
    // Translation keys should be handled by the caller if needed
    return `[${getElapsedTime()}] ${message}`;
  };

  return {
    info(message: string, ...metadata: LoggerMetadata[]): void {
      console.log(formatMessage("INFO", message), ...metadata);
    },

    error(
      message: string,
      error?: LoggerMetadata,
      ...metadata: LoggerMetadata[]
    ): void {
      const typedError = error ? parseError(error) : undefined;
      console.error(formatMessage("ERROR", message), typedError, ...metadata);
    },

    vibe(message: string, ...metadata: LoggerMetadata[]): void {
      // Special vibe formatting - messages are plain strings
      console.log(`[${getElapsedTime()}] ${message}`, ...metadata);
    },

    debug(message: string, ...metadata: LoggerMetadata[]): void {
      if (debugEnabled) {
        console.log(formatMessage("DEBUG", message), ...metadata);
      }
    },
    warn(message: string, ...metadata: LoggerMetadata[]): void {
      console.warn(formatMessage("WARN", message), ...metadata);
    },
    isDebugEnabled: debugEnabled,
  };
}
