/**
 * Error Handler
 * Utilities for handling tool execution errors
 */

import "server-only";

import type { EndpointLogger } from "../cli/vibe/endpoints/endpoint-handler/logger";
import type { AIToolExecutionResult } from "./types";

/**
 * Extract error message from unknown error
 */
// eslint-disable-next-line no-restricted-syntax
export function extractErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

/**
 * Create error result for tool execution
 */

export function createErrorResult(
  // eslint-disable-next-line no-restricted-syntax
  error: unknown,
  startTime: number,
  toolName: string,
  logger: EndpointLogger,
): AIToolExecutionResult {
  const errorMessage = extractErrorMessage(error);

  logger.error(`[AI Tool Executor] Execution failed`, {
    toolName,
    error: errorMessage,
  });

  return {
    success: false,
    error: errorMessage,
    metadata: {
      executionTime: Date.now() - startTime,
      endpointPath: "",
      method: "",
    },
  };
}

/**
 * Log execution error
 */

export function logExecutionError(
  // eslint-disable-next-line no-restricted-syntax
  error: unknown,
  toolName: string,
  logger: EndpointLogger,
  // eslint-disable-next-line no-restricted-syntax
  context?: Record<string, unknown>,
): void {
  const errorMessage = extractErrorMessage(error);

  logger.error(`[AI Tool Executor] Execution failed`, {
    toolName,
    error: errorMessage,
    ...context,
  });
}
