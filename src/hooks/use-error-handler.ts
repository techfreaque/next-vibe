"use client";

import { useEffect } from "react";

import { createEndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/endpoint-logger";
import { defaultLocale } from "@/i18n/core/config";

type ErrorWithDigest = Error & { digest?: string };

interface ErrorHandlerOptions {
  onError?: (error: ErrorWithDigest) => void;
}

/**
 * A hook for handling errors in a consistent way across the application
 *
 * @param error The error object to handle
 * @param options Configuration options for error handling
 * @returns The error digest if available
 */
export default function useErrorHandler(
  error: ErrorWithDigest,
  options: ErrorHandlerOptions = {},
): string | undefined {
  const { onError } = options;

  useEffect(() => {
    const logger = createEndpointLogger(false, Date.now(), defaultLocale);
    logger.error("errors.application.generic", error);
    // Call custom error handler if provided
    if (onError) {
      onError(error);
    }
  }, [error, onError]);

  return error.digest;
}
