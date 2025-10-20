/**
 * Error Handling Utilities
 *
 * Centralized error handling and user-friendly error messages.
 */

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import type { TParams, TranslationKey } from "@/i18n/core/static-types";

import { APIError } from "./errors";

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
  userMessageKey: string;
  userMessageParams?: Record<string, string>;
  code?: string;
  details?: Error | null;
}

/**
 * Extract translation key and params from API error
 * Handles errors that contain translation keys like "error.errors.invalid_request_data"
 */
function extractTranslationFromError(error: Error): {
  key: TranslationKey | null;
  params?: TParams;
} {
  // Check if error message is a translation key (starts with a known prefix)
  const message = error.message;

  // Check for translation key patterns
  if (
    // eslint-disable-next-line i18next/no-literal-string -- Checking for translation key prefixes, not user-facing strings
    message.startsWith("error.") ||
    // eslint-disable-next-line i18next/no-literal-string -- Checking for translation key prefixes, not user-facing strings
    message.startsWith("app.") ||
    // eslint-disable-next-line i18next/no-literal-string -- Checking for translation key prefixes, not user-facing strings
    message.startsWith("api.")
  ) {
    return { key: message  };
  }

  // Check if it's an APIError with details containing translation info
  if (error instanceof APIError && error.details) {
    // eslint-disable-next-line no-restricted-syntax -- Need to check error details structure
    const details = error.details as Record<string, unknown>;
    if (typeof details.message === "string") {
      // Check if the details.message is a translation key
      if (
        // eslint-disable-next-line i18next/no-literal-string -- Checking for translation key prefixes, not user-facing strings
        details.message.startsWith("error.") ||
        // eslint-disable-next-line i18next/no-literal-string -- Checking for translation key prefixes, not user-facing strings
        details.message.startsWith("app.") ||
        // eslint-disable-next-line i18next/no-literal-string -- Checking for translation key prefixes, not user-facing strings
        details.message.startsWith("api.")
      ) {
        return {
          key: details.message ,
          params: details.messageParams as TParams | undefined,
        };
      }
    }
  }

  return { key: null };
}

/**
 * Convert error to ChatError with translation support
 *
 * @param error - Error object
 * @param locale - Locale for translation
 * @param context - Context for the error
 * @returns Structured ChatError
 */
export function toChatError(
  error: Error,
  locale: CountryLanguage,
  context?: string,
): ChatError {
  const { t } = simpleT(locale);

  // First, check if the error message is a translation key
  const translationInfo = extractTranslationFromError(error);
  if (translationInfo.key) {
    const translatedMessage = t(translationInfo.key, translationInfo.params);
    return {
      type: ChatErrorType.API_ERROR,
      message: error.message,
      userMessage: translatedMessage,
      userMessageKey: translationInfo.key,
      userMessageParams: translationInfo.params as Record<string, string>,
      details: error,
    };
  }

  // Handle AbortError
  if (error.name === "AbortError") {
    return {
      type: ChatErrorType.ABORT_ERROR,
      message: error.message,
      userMessage: t("app.chat.errors.requestCancelled"),
      userMessageKey: "app.chat.errors.requestCancelled",
      details: error,
    };
  }

  // Handle timeout
  if (error.message.includes("timeout")) {
    return {
      type: ChatErrorType.TIMEOUT_ERROR,
      message: error.message,
      userMessage: t("app.chat.errors.requestTimeout"),
      userMessageKey: "app.chat.errors.requestTimeout",
      details: error,
    };
  }

  // Handle network errors
  if (error instanceof TypeError && error.message.includes("fetch")) {
    return {
      type: ChatErrorType.NETWORK_ERROR,
      message: error.message,
      userMessage: t("app.chat.errors.networkError"),
      userMessageKey: "app.chat.errors.networkError",
      details: error,
    };
  }

  // Handle API errors
  if (error instanceof APIError || error.message.includes("API")) {
    return {
      type: ChatErrorType.API_ERROR,
      message: error.message,
      userMessage: t("app.chat.errors.apiError"),
      userMessageKey: "app.chat.errors.apiError",
      details: error,
    };
  }

  // Handle storage errors
  if (error.message.includes("storage")) {
    return {
      type: ChatErrorType.STORAGE_ERROR,
      message: error.message,
      userMessage: t("app.chat.errors.storageError"),
      userMessageKey: "app.chat.errors.storageError",
      details: error,
    };
  }

  // Handle generic errors
  if (context) {
    return {
      type: ChatErrorType.UNKNOWN_ERROR,
      message: error.message,
      userMessage: t("app.chat.errors.errorInContext", {
        context,
        message: error.message,
      }),
      userMessageKey: "app.chat.errors.errorInContext",
      userMessageParams: { context, message: error.message },
      details: error,
    };
  }

  return {
    type: ChatErrorType.UNKNOWN_ERROR,
    message: error.message,
    userMessage: t("app.chat.errors.unexpectedError"),
    userMessageKey: "app.chat.errors.unexpectedError",
    details: error,
  };
}

/**
 * Get user-friendly error message with translation
 *
 * @param error - Error object
 * @param locale - Locale for translation
 * @returns User-friendly translated message
 */
export function getUserErrorMessage(
  error: Error,
  locale: CountryLanguage,
): string {
  const chatError = toChatError(error, locale);
  return chatError.userMessage;
}

/**
 * Check if error should be retried
 *
 * @param error - Error object
 * @param locale - Locale for translation
 * @returns true if error is retryable
 */
export function isRetryableError(
  error: Error,
  locale: CountryLanguage,
): boolean {
  const chatError = toChatError(error, locale);

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
 * Log error with context (silent - no console output)
 * Error logging should be handled by proper error boundaries
 *
 * @param error - Error object
 * @param locale - Locale for translation
 * @param context - Context for the error
 */
export function logError(
  error: Error,
  locale: CountryLanguage,
  context?: string,
): void {
  // Convert to structured error for error boundaries to handle
  toChatError(error, locale, context);
  // Errors are handled by error boundaries, no console logging needed
}

/**
 * Create error message for display with translation
 *
 * @param error - Error object
 * @param locale - Locale for translation
 * @param context - Context for the error
 * @returns Formatted translated error message
 */
export function formatErrorMessage(
  error: Error,
  locale: CountryLanguage,
  context?: string,
): string {
  const chatError = toChatError(error, locale, context);
  return chatError.userMessage;
}
