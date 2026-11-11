/**
 * Next.js Response Wrappers
 * Minimal wrappers to convert ResponseType to NextResponse
 * All validation is handled by genericHandler
 */

import { NextResponse } from "next-vibe/ui/lib/request";

import type { EndpointLogger } from "../../logger/types";
import { Platform } from "../../platforms/platforms";
import { validateData } from "../core-utils/validation";
import type { CreateApiEndpointAny } from "../definition/endpoint-base";
import type { CountryLanguage } from "../i18n/core/config";
import { scopedTranslation as sharedScopedTranslation } from "../i18n/shared";
import { errorResponseSchema } from "./error-response.schema";
import type { ErrorResponseType, ResponseType } from "./response.schema";
import { ErrorResponseTypes, fail, success } from "./response.schema";

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
 * Builds clean error chains. Messages arrive already translated and, for
 * validation failures, already formatted by validateData.
 */
export function wrapErrorResponse(
  error: ErrorResponseType,
  logger: EndpointLogger,
  locale: CountryLanguage,
  endpoint?: CreateApiEndpointAny | null,
): NextResponse<ErrorResponseType> {
  // Build clean error chain
  const { logChain } = buildErrorChain(error);

  // 4xx: delivered to the caller - usually expected (bad input, auth, no
  // credits), but several real client bugs only ever surfaced here (guest UI
  // calling an account-only endpoint, empty path params, version skew), so
  // they stay visible at warn. 5xx is an unexpected server failure.
  const errorCode = error.errorType.errorCode;
  const logMeta = {
    endpoint: endpoint?.aliases?.[0] ?? endpoint?.path?.join("/"),
    errorKey: error.errorType.errorKey,
    errorCode,
  };
  if (error.expected) {
    // A benign, expected 4xx - a logged-out visitor's /me probe, or a public
    // caller hitting a role-gated endpoint. Not a fault; kept at debug so real
    // auth drops (a logged-IN user wrongly seen as public) stay visible at warn.
    logger.debug(`API Error (expected):\n${logChain.join("\n")}`, logMeta);
  } else if (
    error.errorType.errorKey ===
    ErrorResponseTypes.EXTERNAL_SERVICE_ERROR.errorKey
  ) {
    // A third party or peer instance failed (provider down, peer offline).
    // Not our bug, but worth seeing - warn; the cause was logged where the
    // upstream call failed.
    logger.warn(`API Error:\n${logChain.join("\n")}`, logMeta);
  } else if (errorCode >= 500) {
    logger.error(`API Error:\n${logChain.join("\n")}`, logMeta);
  } else {
    logger.warn(`API Error:\n${logChain.join("\n")}`, logMeta);
  }

  // Validate error response format
  const validationResult = validateData(
    error,
    errorResponseSchema,
    logger,
    Platform.NEXT_API,
    "error-response-schema",
    locale,
  );

  // Handle validation errors in the error response itself
  if (!validationResult.success) {
    logger.error(
      `Error response validation failed: ${validationResult.message ?? "Unknown validation error"}`,
    );
    const { t } = sharedScopedTranslation.scopedT(locale);
    return NextResponse.json(
      fail({
        message: t("errors.invalidErrorResponseDetail", {
          error: validationResult.message,
        }),
        errorType: ErrorResponseTypes.INVALID_RESPONSE_ERROR,
      }),
      { status: 500 },
    );
  }

  // Return the validated error response
  return NextResponse.json(validationResult.data as ErrorResponseType, {
    status: error.errorType.errorCode,
  });
}
