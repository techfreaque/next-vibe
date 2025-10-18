/**
 * Custom Error Types for Chat Application
 * Provides typed errors for better error handling and debugging
 */

/**
 * Base error class for all chat-related errors
 */
export class ChatError extends Error {
  constructor(
    message: string,
    readonly code?: string,
    // eslint-disable-next-line no-restricted-syntax -- Error details can be any type
    readonly details?: Error | Record<string, unknown> | null,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

/**
 * API-related errors (network, HTTP status, etc.)
 */
export class APIError extends ChatError {
  constructor(
    message: string,
    readonly status?: number,
    readonly statusText?: string,
    // eslint-disable-next-line no-restricted-syntax -- Error details can be any type
    details?: Error | Record<string, unknown> | null,
  ) {
    // eslint-disable-next-line i18next/no-literal-string -- Error code is technical identifier
    super(message, `API_ERROR_${status || "UNKNOWN"}`, details);
  }
}

/**
 * Validation errors (invalid input, schema validation, etc.)
 */
export class ValidationError extends ChatError {
  constructor(
    message: string,
    readonly field?: string,
    // eslint-disable-next-line no-restricted-syntax -- Error details can be any type
    details?: Error | Record<string, unknown> | null,
  ) {
    super(message, "VALIDATION_ERROR", details);
  }
}

/**
 * Streaming errors (stream interruption, parsing, etc.)
 */
export class StreamError extends ChatError {
  constructor(
    message: string,
    readonly streamPhase?: "init" | "reading" | "parsing" | "complete",
    // eslint-disable-next-line no-restricted-syntax -- Error details can be any type
    details?: Error | Record<string, unknown> | null,
  ) {
    super(message, "STREAM_ERROR", details);
  }
}

/**
 * Storage errors (localStorage, persistence, etc.)
 */
export class StorageError extends ChatError {
  constructor(
    message: string,
    readonly operation?: "read" | "write" | "delete",
    // eslint-disable-next-line no-restricted-syntax -- Error details can be any type
    details?: Error | Record<string, unknown> | null,
  ) {
    super(message, "STORAGE_ERROR", details);
  }
}

/**
 * Message tree errors (invalid operations on message tree)
 */
export class MessageTreeError extends ChatError {
  constructor(
    message: string,
    readonly operation?: string,
    // eslint-disable-next-line no-restricted-syntax -- Error details can be any type
    details?: Error | Record<string, unknown> | null,
  ) {
    super(message, "MESSAGE_TREE_ERROR", details);
  }
}

/**
 * Type guard to check if error is a ChatError
 */
// eslint-disable-next-line no-restricted-syntax -- Type guards require unknown parameter
export function isChatError(error: unknown): error is ChatError {
  return error instanceof ChatError;
}

/**
 * Type guard to check if error is an APIError
 */
// eslint-disable-next-line no-restricted-syntax -- Type guards require unknown parameter
export function isAPIError(error: unknown): error is APIError {
  return error instanceof APIError;
}

/**
 * Type guard to check if error is a ValidationError
 */
// eslint-disable-next-line no-restricted-syntax -- Type guards require unknown parameter
export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}

/**
 * Type guard to check if error is a StreamError
 */
// eslint-disable-next-line no-restricted-syntax -- Type guards require unknown parameter
export function isStreamError(error: unknown): error is StreamError {
  return error instanceof StreamError;
}

/**
 * Type guard to check if error is a StorageError
 */
// eslint-disable-next-line no-restricted-syntax -- Type guards require unknown parameter
export function isStorageError(error: unknown): error is StorageError {
  return error instanceof StorageError;
}

/**
 * Type guard to check if error is a MessageTreeError
 */
// eslint-disable-next-line no-restricted-syntax -- Type guards require unknown parameter
export function isMessageTreeError(error: unknown): error is MessageTreeError {
  return error instanceof MessageTreeError;
}

/**
 * Extract user-friendly error message from any error type
 * @param error - The error to extract message from (unknown type for type guard usage)
 */
// eslint-disable-next-line no-restricted-syntax -- Type guards require unknown parameter
export function getErrorMessage(error: unknown): string {
  if (isChatError(error)) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  // eslint-disable-next-line i18next/no-literal-string -- Fallback error message for unknown error types
  return "An unknown error occurred";
}

/**
 * Extract error details for logging/debugging
 * @param error - The error to extract details from (unknown type for type guard usage)
 */
// eslint-disable-next-line no-restricted-syntax -- Type guards require unknown parameter and return type with unknown
export function getErrorDetails(error: unknown): {
  message: string;
  code?: string;
  // eslint-disable-next-line no-restricted-syntax -- Error details can be any type
  details?: Error | Record<string, unknown> | null;
  stack?: string;
} {
  if (isChatError(error)) {
    return {
      message: error.message,
      code: error.code,
      details: error.details,
      stack: error.stack,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      stack: error.stack,
    };
  }

  return {
    message: String(error),
  };
}
