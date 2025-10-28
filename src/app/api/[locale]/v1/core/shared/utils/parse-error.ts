import type { ErrorResponseType } from "@/app/api/[locale]/v1/core/shared/types/response.schema";
import type { TParams, TranslationKey } from "@/i18n/core/static-types";

/**
 * Custom error class that preserves error type and translation parameters
 */
class ApiError extends Error {
  errorType?: string;
  messageParams?: TParams;
  translationKey?: TranslationKey;

  constructor(options: {
    errorType: string;
    messageParams?: TParams;
    translationKey: TranslationKey;
  }) {
    super(options.translationKey);
    // eslint-disable-next-line i18next/no-literal-string
    this.name = "ApiError";
    this.errorType = options.errorType;
    this.messageParams = options.messageParams;
    this.translationKey = options.translationKey;
  }
}

// eslint-disable-next-line no-restricted-syntax
type ErrorCheckInput = unknown;

/**
 * Check if an object is an ErrorResponseType
 */
export function isErrorResponseType(
  obj: ErrorCheckInput,
): obj is ErrorResponseType {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "success" in obj &&
    obj.success === false &&
    "message" in obj &&
    "errorType" in obj
  );
}

/**
 * Possible error input types for error checking and parsing
 */

// eslint-disable-next-line no-restricted-syntax
type ParseableError = unknown;

/**
 * Extract ErrorResponseType from an error or return null
 */
export function extractErrorResponse(
  error: ParseableError,
): ErrorResponseType | null {
  if (isErrorResponseType(error)) {
    return error;
  }
  return null;
}

/**
 * Parse a parseable error into a proper Error object
 * Preserves error type and translation parameters if available
 *
 * @param error - The error to parse
 * @returns A proper Error object
 */
export function parseError(error: ParseableError): Error {
  // Handle standard Error instances
  if (error instanceof Error) {
    return error;
  }

  // Handle ErrorResponseType objects
  if (isErrorResponseType(error)) {
    return new ApiError({
      errorType: error.errorType.errorKey,
      messageParams: error.messageParams,
      translationKey: error.message,
    });
  }

  // Handle other objects
  if (typeof error === "object" && error !== null) {
    try {
      return new Error(JSON.stringify(error));
    } catch {
      return new Error("errors.unknown");
    }
  }

  // Handle string errors
  if (typeof error === "string") {
    return new Error(error);
  }

  // Handle objects with message property
  if (typeof error === "object" && error !== null && "message" in error) {
    const errorObj = error as { message: string };
    return new Error(errorObj.message);
  }

  // Handle objects with error property
  if (typeof error === "object" && error !== null && "error" in error) {
    const errorObj = error as { error: string };
    return new Error(errorObj.error);
  }

  // Handle null/undefined
  if (error === null || error === undefined) {
    return new Error("errors.noDetails");
  }

  // Default case
  return new Error("errors.unknown");
}

/**
 * Format strings with values using a template pattern
 *
 * @param strings - The strings to format
 * @param values - The values to insert into the strings
 * @returns The formatted strings
 */
export function format<
  T extends Record<string, string | number | boolean | null | undefined>,
>(strings: string[], values: T): string[] {
  return strings.map((part) =>
    part.replace(/{(\w+)}/g, (_, key: string) => {
      const value = values[key];
      if (value === null || value === undefined) {
        return "";
      }
      return String(value);
    }),
  );
}
