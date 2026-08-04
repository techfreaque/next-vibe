/**
 * Raising a failure as a thrown exception.
 *
 * Split out of `response.schema.ts` because this is an optional concern: both
 * consumers sit behind a web request boundary (`next-handler.ts` catches the
 * class, `identity/auth/repository.ts` raises it). A build without that boundary
 * - CLI + MCP only - never needs either, and `fail()` is its whole error path.
 */

import type { TranslatedKeyType } from "../i18n/core/scoped-translation";
import type {
  ErrorResponseType,
  ErrorResponseTypesElements,
} from "./response.schema";
import { fail } from "./response.schema";

/**
 * Custom error class that carries ErrorResponseType data
 * This allows ErrorResponseType to be thrown and caught in try-catch blocks
 */
export class ErrorResponseError extends Error {
  readonly errorResponse: ErrorResponseType;

  constructor(errorResponse: ErrorResponseType) {
    super(errorResponse.message);
    this.name = "ErrorResponseError";
    this.errorResponse = errorResponse;
  }
}

/**
 * Create a throwable error response with a translation key
 * This creates an ErrorResponseType and throws it as an ErrorResponseError
 * @param message - The translation key for the error message
 * @param errorType - The type of error
 * @throws ErrorResponseError containing the ErrorResponseType
 */
export function throwErrorResponse(
  message: TranslatedKeyType,
  errorType: ErrorResponseTypesElements[keyof ErrorResponseTypesElements],
): never {
  const errorResponse = fail({ message, errorType });
  // eslint-disable-next-line restricted/restricted-syntax -- Core utility function that intentionally throws for error propagation
  throw new ErrorResponseError(errorResponse);
}
