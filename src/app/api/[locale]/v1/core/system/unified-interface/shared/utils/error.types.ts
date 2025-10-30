/**
 * Error Handling Types
 * Shared types for error handling across all platforms
 */

/**
 * Error details type
 */
export type ErrorDetails = Record<string, string | number | boolean | null>;

/**
 * Logger interface for error handling
 */
export interface ErrorLogger {
  error: (message: string, context?: ErrorDetails) => void;
}

