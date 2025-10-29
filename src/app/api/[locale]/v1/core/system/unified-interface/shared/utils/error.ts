"use client";

/**
 * Shared Error Handling Utilities
 * Generic error handling functions used across all platforms (AI, CLI, MCP, React)
 */

/**
 * Error details type
 */
export type ErrorDetails = Record<string, string | number | boolean | null>;

/**
 * Extract error message from unknown error
 * Handles all error types safely
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return String(error);
}

/**
 * Check if error is an instance of Error
 */
export function isError(error: Error | string): error is Error {
  return error instanceof Error;
}

/**
 * Create a standardized error object
 */
export function createStandardError(
  message: string,
  code?: string,
  details?: ErrorDetails,
): Error & { code?: string; details?: ErrorDetails } {
  const error = new Error(message) as Error & {
    code?: string;
    details?: ErrorDetails;
  };
  if (code) {
    error.code = code;
  }
  if (details) {
    error.details = details;
  }
  return error;
}

/**
 * Extract stack trace from error
 */
export function extractStackTrace(error: Error | string): string | undefined {
  if (error instanceof Error) {
    return error.stack;
  }
  return undefined;
}

/**
 * Format error for logging
 */
export function formatErrorForLogging(error: Error | string): {
  message: string;
  stack?: string;
  code?: string;
  details?: ErrorDetails;
} {
  const message = getErrorMessage(error);
  const stack = extractStackTrace(error);

  if (
    error instanceof Error &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    return {
      message,
      stack,
      code: error.code,
      details:
        "details" in error &&
        typeof error.details === "object" &&
        error.details !== null
          ? (error.details as ErrorDetails)
          : undefined,
    };
  }

  return { message, stack };
}

/**
 * Logger interface for error handling
 */
export interface ErrorLogger {
  error: (message: string, context?: ErrorDetails) => void;
}

/**
 * Create an error result for AI tool execution
 * Used when tool execution fails with an exception
 */
export function createErrorResult(
  error: Error | string,
  startTime: number,
  toolName: string,
  logger: ErrorLogger,
): {
  success: false;
  error: string;
  metadata: {
    executionTime: number;
    endpointPath: string;
    method: string;
  };
} {
  const errorMessage = getErrorMessage(error);
  const executionTime = Date.now() - startTime;

  logger.error(`[AI Tool Executor] Tool execution failed: ${toolName}`, {
    toolName,
    error: errorMessage,
    executionTime,
  });

  return {
    success: false,
    error: errorMessage,
    metadata: {
      executionTime,
      endpointPath: "",
      method: "",
    },
  };
}
