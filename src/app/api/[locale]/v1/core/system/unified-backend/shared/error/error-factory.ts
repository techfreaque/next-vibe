/**
 * Error Factory
 * Centralized error creation and handling
 * Eliminates duplication across all platforms
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { ErrorResponseTypes } from "next-vibe/shared/types/response.schema";
import { createErrorResponse } from "next-vibe/shared/types/response.schema";

import type { TranslationKey } from "@/i18n/core/static-types";

import type { EndpointLogger } from "../endpoint-logger";

/**
 * Error context for additional information
 */
export interface ErrorContext {
  endpoint?: string;
  method?: string;
  userId?: string;
  requestId?: string | number;
  [key: string]: unknown;
}

/**
 * Standard error result
 */
export interface ErrorResult {
  success: false;
  error: string;
  metadata?: {
    executionTime?: number;
    endpointPath?: string;
    method?: string;
    [key: string]: unknown;
  };
}

/**
 * Extract error message from various error types
 */
export function extractErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return String(error);
}

/**
 * Extract stack trace from error
 */
export function extractStackTrace(error: unknown): string | undefined {
  if (error instanceof Error) {
    return error.stack;
  }
  return undefined;
}

/**
 * Check if value is an Error instance
 */
export function isError(value: unknown): value is Error {
  return value instanceof Error;
}

/**
 * Create standardized error response
 */
export function createStandardErrorResponse(
  message: TranslationKey,
  errorType: keyof typeof ErrorResponseTypes = "INTERNAL_ERROR",
  messageParams?: Record<string, unknown>,
): ResponseType<never> {
  return createErrorResponse(
    message,
    ErrorResponseTypes[errorType],
    messageParams,
  );
}

/**
 * Create validation error response
 */
export function createValidationErrorResponse(
  error: string,
): ResponseType<never> {
  return createErrorResponse(
    "app.api.v1.core.system.unifiedUi.cli.vibe.endpoints.endpointHandler.error.errors.invalid_request_data",
    ErrorResponseTypes.INVALID_REQUEST_ERROR,
    { error },
  );
}

/**
 * Create URL validation error response
 */
export function createUrlValidationErrorResponse(
  error: string,
): ResponseType<never> {
  return createErrorResponse(
    "app.api.v1.core.system.unifiedUi.cli.vibe.endpoints.endpointHandler.error.errors.invalid_url_parameters",
    ErrorResponseTypes.INVALID_QUERY_ERROR,
    { error },
  );
}

/**
 * Create not found error response
 */
export function createNotFoundErrorResponse(
  resource: string,
): ResponseType<never> {
  return createErrorResponse(
    "app.api.v1.core.system.unifiedUi.cli.vibe.endpoints.endpointHandler.error.errors.resource_not_found",
    ErrorResponseTypes.NOT_FOUND,
    { resource },
  );
}

/**
 * Create permission denied error response
 */
export function createPermissionDeniedErrorResponse(): ResponseType<never> {
  return createErrorResponse(
    "app.api.v1.core.system.unifiedUi.cli.vibe.endpoints.endpointHandler.error.errors.permission_denied",
    ErrorResponseTypes.FORBIDDEN,
  );
}

/**
 * Create internal error response
 */
export function createInternalErrorResponse(
  error?: string,
): ResponseType<never> {
  return createErrorResponse(
    "app.api.v1.core.system.unifiedUi.cli.vibe.endpoints.endpointHandler.error.general.internal_server_error",
    ErrorResponseTypes.INTERNAL_ERROR,
    error ? { error } : undefined,
  );
}

/**
 * Create error result for executor
 */
export function createExecutorErrorResult(
  error: unknown,
  startTime: number,
  context?: ErrorContext,
): ErrorResult {
  const errorMessage = extractErrorMessage(error);
  const executionTime = Date.now() - startTime;

  return {
    success: false,
    error: errorMessage,
    metadata: {
      executionTime,
      endpointPath: context?.endpoint || "",
      method: context?.method || "",
      ...context,
    },
  };
}

/**
 * Log and create error response
 */
export function logAndCreateErrorResponse(
  error: unknown,
  logger: EndpointLogger,
  context?: ErrorContext,
): ResponseType<never> {
  const errorMessage = extractErrorMessage(error);
  const stackTrace = extractStackTrace(error);

  logger.error("Operation failed", {
    error: errorMessage,
    stack: stackTrace,
    ...context,
  });

  return createInternalErrorResponse(errorMessage);
}

/**
 * Create tool not found error
 */
export function createToolNotFoundError(toolName: string): ErrorResult {
  return {
    success: false,
    error: `Tool not found: ${toolName}`,
    metadata: {
      executionTime: 0,
      endpointPath: "",
      method: "",
    },
  };
}

/**
 * Create route not found error
 */
export function createRouteNotFoundError(route: string): ResponseType<never> {
  return createErrorResponse(
    "app.api.v1.core.system.unifiedBackend.cli.vibe.errors.routeNotFound",
    ErrorResponseTypes.NOT_FOUND,
    { route },
  );
}

/**
 * Wrap async operation with error handling
 */
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  logger: EndpointLogger,
  context?: ErrorContext,
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    const stackTrace = extractStackTrace(error);

    logger.error("Operation failed with error", {
      error: errorMessage,
      stack: stackTrace,
      ...context,
    });

    throw error;
  }
}

/**
 * Safe error conversion to string
 */
export function errorToString(error: unknown): string {
  if (error === null) {
    return "null";
  }
  if (error === undefined) {
    return "undefined";
  }
  if (typeof error === "string") {
    return error;
  }
  if (error instanceof Error) {
    return error.message;
  }
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

/**
 * Check if error is recoverable
 */
export function isRecoverableError(error: unknown): boolean {
  if (!isError(error)) {
    return false;
  }

  const recoverablePatterns = [
    "VALIDATION_ERROR",
    "NOT_FOUND",
    "INVALID_REQUEST",
    "INVALID_QUERY",
  ];

  const errorMessage = error.message.toUpperCase();
  return recoverablePatterns.some((pattern) => errorMessage.includes(pattern));
}

