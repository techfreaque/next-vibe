/* eslint-disable no-console */
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { enableDebugLogger } from "@/config/debug";
import type { TranslationKey } from "@/i18n/core/static-types";
import type { ErrorResponseType } from "../../../../shared/types/response.schema";

/**
 * Logger metadata - structured data for logging
 */
export type LoggerMetadata =
  | string
  | number
  | boolean
  | null
  | undefined
  | Error
  | Date
  | ErrorResponseType
  | { [key: string]: LoggerMetadata }
  | LoggerMetadata[];

/**
 * Logger interface for endpoint handlers
 * Provides structured logging with timing information
 */
export interface EndpointLogger {
  /**
   * Log an info message - always runs
   */
  info(message: string, ...metadata: LoggerMetadata[]): void;

  /**
   * Log an error message - always runs
   */
  error(
    message: string,
    error?: LoggerMetadata,
    ...metadata: LoggerMetadata[]
  ): void;

  /**
   * Log a warning message - always runs
   */
  warn(message: string, ...metadata: LoggerMetadata[]): void;

  /**
   * Log a vibe message (special formatted info) - always runs
   */
  vibe(message: string, ...metadata: LoggerMetadata[]): void;

  /**
   * Log a debug message - only runs when debug flag is enabled
   */
  debug(message: string, ...metadata: LoggerMetadata[]): void;

  isDebugEnabled: boolean;
}

/**
 * Creates a logger instance for endpoint handlers
 * Provides pretty formatted logging with running time in seconds
 */
export function createEndpointLogger(
  debugEnabled = false,
  startTime: number = Date.now(),
  locale: CountryLanguage,
): EndpointLogger {
  const getElapsedTime = (): string => {
    const elapsed = (Date.now() - startTime) / 1000;
    return `${elapsed.toFixed(3)}s`;
  };
  const { t } = simpleT(locale);

  const formatMessage = (level: string, message: string): string => {
    return `[${getElapsedTime()}] ${t(message as TranslationKey)}`;
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
      if (debugEnabled || enableDebugLogger) {
        console.log(formatMessage("DEBUG", message), ...metadata);
      }
    },
    warn(message: string, ...metadata: LoggerMetadata[]): void {
      console.warn(formatMessage("WARN", message), ...metadata);
    },
    isDebugEnabled: debugEnabled || enableDebugLogger,
  };
}
