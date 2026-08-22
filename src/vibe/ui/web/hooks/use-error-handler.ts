"use client";

import { useEffect } from "react";

import type { CountryLanguage } from "../../../core/i18n/core/config";
import { useLogger } from "./use-logger";

type ErrorWithDigest = Error & { digest?: string };

interface ErrorHandlerOptions {
  onError?: (error: ErrorWithDigest) => void;
}

/**
 * A hook for handling errors in a consistent way across the application
 *
 * @param error The error object to handle
 * @param locale The locale from the current route context
 * @param options Configuration options for error handling
 * @returns The error digest if available
 */
export default function useErrorHandler(
  error: ErrorWithDigest,
  locale: CountryLanguage,
  options: ErrorHandlerOptions = {},
): string | undefined {
  const { onError } = options;
  const logger = useLogger();

  useEffect(() => {
    logger.error(`Application error: ${error.message || "unknown"}`, {
      message: error.message,
      name: error.name,
      digest: error.digest,
      stack: error.stack?.slice(0, 500),
    });
    // Call custom error handler if provided
    if (onError) {
      onError(error);
    }
  }, [error, onError, locale, logger]);

  return error.digest;
}
