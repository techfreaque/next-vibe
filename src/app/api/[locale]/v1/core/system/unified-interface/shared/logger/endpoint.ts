/* eslint-disable no-console */
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { CountryLanguage } from "@/i18n/core/config";

import type { EndpointLogger, LoggerMetadata } from "../types/logger";
import { debugApp } from "@/config/debug";

// Re-export types for convenience
export type { EndpointLogger, LoggerMetadata };

/**
 * Creates a logger instance for endpoint handlers
 * Provides pretty formatted logging with running time in seconds
 */
export function createEndpointLogger(
  debugEnabled = false,
  startTime: number = Date.now(),
  _locale: CountryLanguage,
): EndpointLogger {
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
      if (debugApp || debugEnabled) {
        console.log(formatMessage("DEBUG", message), ...metadata);
      }
    },
    warn(message: string, ...metadata: LoggerMetadata[]): void {
      console.warn(formatMessage("WARN", message), ...metadata);
    },
    isDebugEnabled: debugEnabled,
  };
}
