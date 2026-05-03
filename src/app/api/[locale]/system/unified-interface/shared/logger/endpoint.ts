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
