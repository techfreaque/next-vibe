import type { ErrorResponseType } from "next-vibe/shared/types/response.schema";

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
    this.name = "ApiError" as const;
    this.errorType = options.errorType;
    this.messageParams = options.messageParams;
    this.translationKey = options.translationKey;
  }
}

/**
 * Check if an object is an ErrorResponseType
 */
export function isErrorResponseType(
  // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Error parsing utility requires 'unknown' to handle any error input type
  obj: unknown,
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

/**
 * Parse a parseable error into a proper Error object
 * Preserves error type and translation parameters if available
 *
 * @param error - The error to parse
 * @returns A proper Error object
 */
// eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Error parsing utility requires 'unknown' to handle any error input type
export function parseError(error: unknown): Error {
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
    // Extract meaningful error info from objects without console.error pollution
    // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Error parsing requires type assertion for object property access
    const errorObj = error as Record<string, unknown>;
    const errorMessage =
      errorObj.error || errorObj.message || "An unknown error occurred";
    return new Error(String(errorMessage));
  }

  // Handle string errors
  if (typeof error === "string") {
    return new Error(error);
  }

  // Handle objects with message property
  if (typeof error === "object" && error !== null && "message" in error) {
    // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Error parsing requires type assertion for object property access
    const errorObj = error as Record<string, unknown>;
    const message = errorObj.message;
    if (typeof message === "string") {
      return new Error(message);
    }
  }

  // Handle objects with error property
  if (typeof error === "object" && error !== null && "error" in error) {
    // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Error parsing requires type assertion for object property access
    const errorObj = error as Record<string, unknown>;
    const errorMessage = errorObj.error;
    if (typeof errorMessage === "string") {
      return new Error(errorMessage);
    }
  }

  // Handle null/undefined
  if (error === null || error === undefined) {
    return new Error("errors.noDetails");
  }

  // Default case
  return new Error("An unknown error occurred");
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Required by replace() API
    part.replaceAll(/{(\w+)}/g, (match, key: string) => {
      const value = values[key];
      if (value === null || value === undefined) {
        return "";
      }
      return String(value);
    }),
  );
}
