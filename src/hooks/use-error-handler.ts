"use client";

import { useEffect } from "react";

import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

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

  useEffect(() => {
    const logger = createEndpointLogger(false, Date.now(), locale);
    logger.error("errors.application.generic", error);
    // Call custom error handler if provided
    if (onError) {
      onError(error);
    }
  }, [error, onError, locale]);

  return error.digest;
}
