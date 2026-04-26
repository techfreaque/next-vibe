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
  | LoggerMetadata[]
  | readonly LoggerMetadata[];

/**
 * Logger interface for endpoint handlers
 * Provides structured logging with timing information
 */
export interface EndpointLogger {
  /** Log an info message - always runs */
  info(message: string, ...metadata: LoggerMetadata[]): void;

  /** Log an error message - always runs */
  error(
    message: string,
    error?: LoggerMetadata,
    ...metadata: LoggerMetadata[]
  ): void;

  /** Log a warning message - always runs */
  warn(message: string, ...metadata: LoggerMetadata[]): void;

  /** Log a vibe message (special formatted info) - always runs */
  vibe(message: string, ...metadata: LoggerMetadata[]): void;

  /** Log a debug message - only runs when debug flag is enabled */
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

/** Get the registered error sink (server-logger reads this to fire persistence) */
export function getErrorSink():
  | ((
      level: ErrorLogLevel,
      message: string,
      error: LoggerMetadata | undefined,
      metadata: LoggerMetadata[],
    ) => void)
  | null {
  return globalErrorSink;
}

/**
 * Register a global error persistence sink.
 * Called once from server-side initialization via error-persist.ts.
 * All subsequent server logger.error() and logger.warn() calls will fire this sink.
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
