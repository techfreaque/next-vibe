import { parseError } from "next-vibe/shared/utils/parse-error";

import { enableDebugLogger, mcpSilentMode } from "@/config/debug";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import type { TranslationKey } from "@/i18n/core/static-types";

import type { ErrorResponseType } from "../../../../shared/types/response.schema";
import { fileLog } from "./file-logger";

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
 * Write to file for MCP mode
 */
function writeToFile(
  message: string,
  data?: Record<string, LoggerMetadata>,
): void {
  try {
    fileLog(message, data);
  } catch {
    // Ignore errors - logging is best effort
    // Can't log the error because we're in silent mode
  }
}

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

  const formatMessage = (message: string): string => {
    return `[${getElapsedTime()}] ${t(message as TranslationKey)}`;
  };

  return {
    info(message: string, ...metadata: LoggerMetadata[]): void {
      if (mcpSilentMode) {
        if (!(debugEnabled || enableDebugLogger)) {
          // use --verbose / or set
          return;
        }
        // In MCP mode, dynamically import and log to file instead of console
        const metadataObj = metadata.length > 0 ? { metadata } : undefined;
        writeToFile(`[INFO] ${formatMessage(message)}`, metadataObj);
      } else {
        // oxlint-disable-next-line no-console
        console.log(formatMessage(message), ...metadata);
      }
    },

    error(
      message: string,
      error?: LoggerMetadata,
      ...metadata: LoggerMetadata[]
    ): void {
      if (mcpSilentMode) {
        if (!(debugEnabled || enableDebugLogger)) {
          // use --verbose / or set src/config/debug.ts to true
          return;
        }
        // In MCP mode, dynamically import and log to file instead of console
        const typedError = error ? parseError(error) : undefined;
        const metadataObj = {
          error: typedError,
          ...(metadata.length > 0 && { metadata }),
        };
        writeToFile(`[ERROR] ${formatMessage(message)}`, metadataObj);
      } else {
        // oxlint-disable-next-line no-console
        console.error(formatMessage(message), error, ...metadata);
      }
    },

    vibe(message: string, ...metadata: LoggerMetadata[]): void {
      if (mcpSilentMode) {
        if (!(debugEnabled || enableDebugLogger)) {
          // use --verbose / or set src/config/debug.ts to true
          return;
        }
        // In MCP mode, log to file instead of console
        const metadataObj = metadata.length > 0 ? { metadata } : undefined;
        writeToFile(`[VIBE] [${getElapsedTime()}] ${message}`, metadataObj);
      } else {
        // Special vibe formatting - messages are plain strings
        // oxlint-disable-next-line no-console
        console.log(`[${getElapsedTime()}] ${message}`, ...metadata);
      }
    },

    debug(message: string, ...metadata: LoggerMetadata[]): void {
      if (debugEnabled || enableDebugLogger) {
        if (mcpSilentMode) {
          // In MCP mode, dynamically import and log to file instead of console
          const metadataObj = metadata.length > 0 ? { metadata } : undefined;
          writeToFile(`[DEBUG] ${formatMessage(message)}`, metadataObj);
        } else {
          // oxlint-disable-next-line no-console
          console.log(formatMessage(message), ...metadata);
        }
      }
    },
    warn(message: string, ...metadata: LoggerMetadata[]): void {
      if (mcpSilentMode) {
        if (!(debugEnabled || enableDebugLogger)) {
          // use --verbose / or set src/config/debug.ts to true
          return;
        }
        // In MCP mode, dynamically import and log to file instead of console
        const metadataObj = metadata.length > 0 ? { metadata } : undefined;
        writeToFile(`[WARN] ${formatMessage(message)}`, metadataObj);
      } else {
        // oxlint-disable-next-line no-console
        console.warn(formatMessage(message), ...metadata);
      }
    },
    isDebugEnabled: debugEnabled || enableDebugLogger,
  };
}
