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
    public readonly code?: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
    // Maintains proper stack trace for where error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * API-related errors (network, HTTP status, etc.)
 */
export class APIError extends ChatError {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly statusText?: string,
    details?: unknown
  ) {
    super(message, `API_ERROR_${status || 'UNKNOWN'}`, details);
  }
}

/**
 * Validation errors (invalid input, schema validation, etc.)
 */
export class ValidationError extends ChatError {
  constructor(
    message: string,
    public readonly field?: string,
    details?: unknown
  ) {
    super(message, 'VALIDATION_ERROR', details);
  }
}

/**
 * Streaming errors (stream interruption, parsing, etc.)
 */
export class StreamError extends ChatError {
  constructor(
    message: string,
    public readonly streamPhase?: 'init' | 'reading' | 'parsing' | 'complete',
    details?: unknown
  ) {
    super(message, 'STREAM_ERROR', details);
  }
}

/**
 * Storage errors (localStorage, persistence, etc.)
 */
export class StorageError extends ChatError {
  constructor(
    message: string,
    public readonly operation?: 'read' | 'write' | 'delete',
    details?: unknown
  ) {
    super(message, 'STORAGE_ERROR', details);
  }
}

/**
 * Message tree errors (invalid operations on message tree)
 */
export class MessageTreeError extends ChatError {
  constructor(
    message: string,
    public readonly operation?: string,
    details?: unknown
  ) {
    super(message, 'MESSAGE_TREE_ERROR', details);
  }
}

/**
 * Type guard to check if error is a ChatError
 */
export function isChatError(error: unknown): error is ChatError {
  return error instanceof ChatError;
}

/**
 * Type guard to check if error is an APIError
 */
export function isAPIError(error: unknown): error is APIError {
  return error instanceof APIError;
}

/**
 * Type guard to check if error is a ValidationError
 */
export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}

/**
 * Type guard to check if error is a StreamError
 */
export function isStreamError(error: unknown): error is StreamError {
  return error instanceof StreamError;
}

/**
 * Type guard to check if error is a StorageError
 */
export function isStorageError(error: unknown): error is StorageError {
  return error instanceof StorageError;
}

/**
 * Type guard to check if error is a MessageTreeError
 */
export function isMessageTreeError(error: unknown): error is MessageTreeError {
  return error instanceof MessageTreeError;
}

/**
 * Extract user-friendly error message from any error type
 */
export function getErrorMessage(error: unknown): string {
  if (isChatError(error)) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An unknown error occurred';
}

/**
 * Extract error details for logging/debugging
 */
export function getErrorDetails(error: unknown): {
  message: string;
  code?: string;
  details?: unknown;
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

