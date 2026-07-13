/**
 * Next.js Response Wrappers
 * Minimal wrappers to convert ResponseType to NextResponse
 * All validation is handled by genericHandler
 */

import { formatValidationErrorCompact } from "next-vibe/core/core-utils/format-validation-error";
import { validateData } from "next-vibe/core/core-utils/validation";
import type { CreateApiEndpointAny } from "next-vibe/core/definition/endpoint-base";
import { Platform } from "next-vibe/core/definition/platform";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type {
  ErrorResponseType,
  ResponseType,
} from "next-vibe/core/route/response.schema";
import {
  errorResponseSchema,
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import type { EndpointLogger } from "next-vibe/logger/types";
import { NextResponse } from "next-vibe/ui/lib/request";

import { scopedTranslation as sharedScopedTranslation } from "@/_pages/shared/i18n";

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
function buildErrorChain(error: ErrorResponseType): {
  logChain: string[];
  humanReadable: string;
} {
  const logChain: string[] = [];
  const humanReadableParts: string[] = [];

  let currentError: ErrorResponseType | undefined = error;
  let depth = 0;

  while (currentError && !currentError.success && depth < 10) {
    // Prevent infinite loops
    const indent = "  ".repeat(depth);

    // For logging (includes error codes)
    logChain.push(
      `${indent}${currentError.message} [${currentError.errorType.errorKey} / ${currentError.errorType.errorCode}]`,
    );

    // For human-readable output (clean and simple)
    humanReadableParts.push(`${indent}${currentError.message}`);

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
 * Properly translates errors and builds clean error chains.
 * When endpoint is provided, validation errors get a compact field-level message.
 */
export function wrapErrorResponse(
  error: ErrorResponseType,
  locale: CountryLanguage,
  logger: EndpointLogger,
  endpoint?: CreateApiEndpointAny | null,
): NextResponse<ErrorResponseType> {
  // Enrich validation errors with compact field-level details for external callers
  const compactDetails = formatValidationErrorCompact(
    error.messageParams,
    endpoint,
  );
  if (compactDetails) {
    error = { ...error, message: compactDetails as typeof error.message };
  }
  // Build clean error chain
  const { logChain } = buildErrorChain(error);

  // Log the full error chain for debugging
  logger.error(`API Error:\n${logChain.join("\n")}`, {
    endpoint: endpoint?.aliases?.[0] ?? endpoint?.path?.join("/"),
    messageParams: error.messageParams,
    errorKey: error.errorType.errorKey,
    errorCode: error.errorType.errorCode,
  });

  // Validate error response format
  const validationResult = validateData(
    error,
    errorResponseSchema,
    logger,
    locale,
    Platform.NEXT_API,
    "error-response-schema",
  );

  // Handle validation errors in the error response itself
  if (!validationResult.success) {
    logger.error(
      `Error response validation failed: ${validationResult.message ?? "Unknown validation error"}`,
    );
    const { t: sharedT } = sharedScopedTranslation.scopedT(locale);
    return NextResponse.json(
      fail({
        message: sharedT("errorTypes.invalid_response_error"),
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
