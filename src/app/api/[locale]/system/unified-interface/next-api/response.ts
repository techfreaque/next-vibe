/**
 * Next.js Response Wrappers
 * Minimal wrappers to convert ResponseType to NextResponse
 * All validation is handled by genericHandler
 */

import { NextResponse } from "next/server";
import type {
  ErrorResponseType,
  ResponseType,
} from "next-vibe/shared/types/response.schema";
import {
  errorResponseSchema,
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { validateData } from "next-vibe/shared/utils";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import type { EndpointLogger } from "../../unified-interface/shared/logger/endpoint";

/**
 * Wraps a validated success response in NextResponse
 * Validation is already done by genericHandler
 */
export function wrapSuccessResponse<TResponse>(
  data: TResponse,
  status = 200,
): NextResponse<ResponseType<TResponse>> {
  return NextResponse.json(success(data), { status });
}

/**
 * Builds a clean, human-readable error chain for logging and debugging
 */
function buildErrorChain(
  error: ErrorResponseType,
  locale: CountryLanguage,
): {
  logChain: string[];
  humanReadable: string;
} {
  const { t } = simpleT(locale);
  const logChain: string[] = [];
  const humanReadableParts: string[] = [];

  let currentError: ErrorResponseType | undefined = error;
  let depth = 0;

  while (currentError && !currentError.success && depth < 10) {
    // Prevent infinite loops
    const indent = "  ".repeat(depth);
    const translatedMessage = t(
      currentError.message,
      currentError.messageParams,
    );

    // For logging (includes error codes)
    logChain.push(
      `${indent}${translatedMessage} [${currentError.errorType.errorKey} / ${currentError.errorType.errorCode}]`,
    );

    // For human-readable output (clean and simple)
    humanReadableParts.push(`${indent}${translatedMessage}`);

    currentError = currentError.cause;
    depth++;
  }

  return {
    logChain,
    humanReadable: humanReadableParts.join("\n"),
  };
}

/**
 * Wraps an error response in NextResponse
 * Properly translates errors and builds clean error chains
 */
export function wrapErrorResponse(
  error: ErrorResponseType,
  locale: CountryLanguage,
  logger: EndpointLogger,
): NextResponse<ErrorResponseType> {
  // Build clean error chain
  const { logChain } = buildErrorChain(error, locale);

  // Log the full error chain for debugging
  logger.error(`API Error:\n${logChain.join("\n")}`, {
    messageParams: error.messageParams,
    errorKey: error.errorType.errorKey,
    errorCode: error.errorType.errorCode,
  });

  // Validate error response format
  const validationResult = validateData(error, errorResponseSchema, logger);

  // Handle validation errors in the error response itself
  if (!validationResult.success) {
    logger.error(
      `Error response validation failed: ${validationResult.message ?? "Unknown validation error"}`,
    );
    return NextResponse.json(
      fail({
        message: "app.api.shared.errorTypes.invalid_response_error",
        errorType: ErrorResponseTypes.INVALID_RESPONSE_ERROR,
        messageParams: { error: validationResult.message },
      }),
      { status: 500 },
    );
  }

  // Return the validated error response
  return NextResponse.json(validationResult.data as ErrorResponseType, {
    status: error.errorType.errorCode,
  });
}
