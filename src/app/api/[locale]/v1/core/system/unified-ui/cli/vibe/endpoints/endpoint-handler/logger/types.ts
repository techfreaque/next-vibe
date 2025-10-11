/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Logger interface for endpoint handlers
 * Provides structured logging with timing information
 */
export interface EndpointLogger {
  /**
   * Log an info message - always runs
   */
  info(message: string, ...args: any[]): void;

  /**
   * Log an error message - always runs
   */
  error(message: string, error?: any, ...args: any[]): void;

  /**
   * Log a warning message - always runs
   */
  warn(message: string, ...args: any[]): void;

  /**
   * Log a vibe message (special formatted info) - always runs
   */
  vibe(message: string, ...args: any[]): void;

  /**
   * Log a debug message - only runs when debug flag is enabled
   */
  debug(message: string, ...args: any[]): void;

  isDebugEnabled: boolean;
}
