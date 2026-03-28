import { parseError } from "next-vibe/shared/utils/parse-error";

import { enableDebugLogger, mcpSilentMode } from "@/config/debug";

import type { CountryLanguage } from "@/i18n/core/config";
import type { ErrorResponseType } from "../../../../shared/types/response.schema";
import { colors, maybeColorize, semantic } from "./colors";
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
 * Log level for error persistence
 */
export type ErrorLogLevel = "error" | "warn";

/**
 * Global error sink - set once on server startup to persist errors/warnings.
 * Client-side this stays null (no DB access).
 */
let globalErrorSink:
  | ((
      level: ErrorLogLevel,
      message: string,
      error: LoggerMetadata | undefined,
      metadata: LoggerMetadata[],
    ) => void)
  | null = null;

/**
 * Register a global error persistence sink.
 * Called once from server-side initialization (e.g. launchpad).
 * All subsequent logger.error() and logger.warn() calls will fire this sink.
 */
export function registerErrorSink(
  sink: (
    level: ErrorLogLevel,
    message: string,
    error: LoggerMetadata | undefined,
    metadata: LoggerMetadata[],
  ) => void,
): void {
  globalErrorSink = sink;
}

/**
 * Creates a logger instance for endpoint handlers
 * Provides pretty formatted logging with running time in seconds
 */
/** Serialize debug metadata to a compact inline string */
function serializeDebugMeta(meta: LoggerMetadata[]): string {
  if (meta.length === 0) {
    return "";
  }
  return ` ${meta
    .map((m) => {
      if (m === null || m === undefined) {
        return "";
      }
      if (typeof m === "string") {
        return m;
      }
      if (typeof m === "number" || typeof m === "boolean") {
        return String(m);
      }
      try {
        return JSON.stringify(m);
      } catch {
        return String(m);
      }
    })
    .filter(Boolean)
    .join(" ")}`;
}

export function createEndpointLogger(
  debugEnabled = false,
  startTime: number = Date.now(),
  locale: CountryLanguage,
): EndpointLogger {
  const isProduction = process.env["NODE_ENV"] === "production";
  // Next.js server runtime prefixes timestamps to piped output already
  const noTimePrefix = !!process.env["NEXT_RUNTIME"];

  const getTimePrefix = (): string => {
    if (isProduction) {
      return new Date().toISOString().slice(11, 23);
    }
    const elapsed = (Date.now() - startTime) / 1000;
    return `${elapsed.toFixed(3)}s`;
  };

  const formatMessage = (message: string): string => {
    return noTimePrefix ? message : `[${getTimePrefix()}] ${message}`;
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
      // Fire global error sink if registered (server-only persistence)
      globalErrorSink?.("error", message, error, metadata);

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
        console.error(formatMessage(message), error, ...metadata, locale);
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
        writeToFile(`[VIBE] [${getTimePrefix()}] ${message}`, metadataObj);
      } else {
        // Special vibe formatting - messages are plain strings
        const vibePrefix = noTimePrefix ? "" : `[${getTimePrefix()}] `;
        // oxlint-disable-next-line no-console
        console.log(`${vibePrefix}${message}`, ...metadata);
      }
    },

    debug(message: string, ...metadata: LoggerMetadata[]): void {
      if (debugEnabled || enableDebugLogger) {
        if (mcpSilentMode) {
          // In MCP mode, dynamically import and log to file instead of console
          const metadataObj = metadata.length > 0 ? { metadata } : undefined;
          writeToFile(`[DEBUG] ${formatMessage(message)}`, metadataObj);
        } else {
          const meta = serializeDebugMeta(metadata);
          const text = `${message}${meta}`;
          const timeTag = noTimePrefix
            ? ""
            : `${colors.dim}[${getTimePrefix()}]${colors.reset} `;
          const line = `${timeTag}${maybeColorize(text, semantic.debug)}`;
          // oxlint-disable-next-line no-console
          console.log(line);
        }
      }
    },
    warn(message: string, ...metadata: LoggerMetadata[]): void {
      // Fire global error sink for warnings too
      globalErrorSink?.("warn", message, undefined, metadata);

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
        console.warn(formatMessage(message), ...metadata, locale);
      }
    },
    isDebugEnabled: debugEnabled || enableDebugLogger,
  };
}
