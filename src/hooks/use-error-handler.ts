"use client";

import { errorLogger } from "next-vibe/shared/utils";
import { useEffect } from "react";

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
    errorLogger("Application error:", error);
    // Call custom error handler if provided
    if (onError) {
      onError(error);
    }
  }, [error, onError]);

  return error.digest;
}
