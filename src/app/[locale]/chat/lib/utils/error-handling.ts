/**
 * Error Handling Utilities
 * 
 * Centralized error handling and user-friendly error messages.
 */

/**
 * Error types for chat operations
 */
export enum ChatErrorType {
  NETWORK_ERROR = "network_error",
  API_ERROR = "api_error",
  VALIDATION_ERROR = "validation_error",
  STORAGE_ERROR = "storage_error",
  STREAM_ERROR = "stream_error",
  TIMEOUT_ERROR = "timeout_error",
  ABORT_ERROR = "abort_error",
  UNKNOWN_ERROR = "unknown_error",
}

/**
 * Structured error object
 */
export interface ChatError {
  type: ChatErrorType;
  message: string;
  userMessage: string;
  code?: string;
  details?: unknown;
}

/**
 * Convert unknown error to ChatError
 * 
 * @param error - Error object
 * @param context - Context for the error
 * @returns Structured ChatError
 */
export function toChatError(error: unknown, context?: string): ChatError {
  // Handle AbortError
  if (error instanceof Error && error.name === "AbortError") {
    return {
      type: ChatErrorType.ABORT_ERROR,
      message: "Request was aborted",
      userMessage: "Request was cancelled",
      details: error,
    };
  }

  // Handle timeout
  if (error instanceof Error && error.message.includes("timeout")) {
    return {
      type: ChatErrorType.TIMEOUT_ERROR,
      message: error.message,
      userMessage: "Request timed out. Please try again.",
      details: error,
    };
  }

  // Handle network errors
  if (error instanceof TypeError && error.message.includes("fetch")) {
    return {
      type: ChatErrorType.NETWORK_ERROR,
      message: error.message,
      userMessage: "Network error. Please check your connection and try again.",
      details: error,
    };
  }

  // Handle API errors
  if (error instanceof Error && error.message.includes("API")) {
    return {
      type: ChatErrorType.API_ERROR,
      message: error.message,
      userMessage: "API error. Please try again later.",
      details: error,
    };
  }

  // Handle storage errors
  if (error instanceof Error && error.message.includes("storage")) {
    return {
      type: ChatErrorType.STORAGE_ERROR,
      message: error.message,
      userMessage: "Storage error. Your browser storage may be full.",
      details: error,
    };
  }

  // Handle generic errors
  if (error instanceof Error) {
    return {
      type: ChatErrorType.UNKNOWN_ERROR,
      message: error.message,
      userMessage: context
        ? `Error in ${context}: ${error.message}`
        : error.message,
      details: error,
    };
  }

  // Handle non-Error objects
  return {
    type: ChatErrorType.UNKNOWN_ERROR,
    message: String(error),
    userMessage: "An unexpected error occurred. Please try again.",
    details: error,
  };
}

/**
 * Get user-friendly error message
 * 
 * @param error - Error object
 * @returns User-friendly message
 */
export function getUserErrorMessage(error: unknown): string {
  const chatError = toChatError(error);
  return chatError.userMessage;
}

/**
 * Check if error should be retried
 * 
 * @param error - Error object
 * @returns true if error is retryable
 */
export function isRetryableError(error: unknown): boolean {
  const chatError = toChatError(error);
  
  // Don't retry aborts or validation errors
  if (
    chatError.type === ChatErrorType.ABORT_ERROR ||
    chatError.type === ChatErrorType.VALIDATION_ERROR
  ) {
    return false;
  }

  // Retry network, timeout, and API errors
  return [
    ChatErrorType.NETWORK_ERROR,
    ChatErrorType.TIMEOUT_ERROR,
    ChatErrorType.API_ERROR,
    ChatErrorType.STREAM_ERROR,
  ].includes(chatError.type);
}

/**
 * Log error with context
 * 
 * @param error - Error object
 * @param context - Context for the error
 */
export function logError(error: unknown, context?: string): void {
  const chatError = toChatError(error, context);
  
  console.error(
    `[Chat Error] ${chatError.type}${context ? ` in ${context}` : ""}:`,
    chatError.message,
    chatError.details
  );
}

/**
 * Create error message for display
 * 
 * @param error - Error object
 * @param context - Context for the error
 * @returns Formatted error message
 */
export function formatErrorMessage(error: unknown, context?: string): string {
  const chatError = toChatError(error, context);
  return chatError.userMessage;
}

