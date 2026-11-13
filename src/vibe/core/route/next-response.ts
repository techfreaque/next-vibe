/**
 * Next.js Response Wrappers
 * Minimal wrappers to convert ResponseType to NextResponse
 * All validation is handled by genericHandler
 */

import type { NextRequest } from "next-vibe/ui/lib/request";
import { NextResponse } from "next-vibe/ui/lib/request";

import { AUTH_TOKEN_COOKIE_NAME } from "@/env/constants";

import type { EndpointLogger } from "../../logger/types";
import { Platform } from "../../platforms/platforms";
import { V1_API_PATH_REGEX } from "../../platforms/web/middleware/utils";
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

/** Coarse browser/client family from a User-Agent - never the raw string. */
function userAgentFamily(userAgent: string | null): string {
  if (!userAgent) {
    return "none";
  }
  const family = /bot|crawl|spider|slurp|preview|headless/i.test(userAgent)
    ? "bot"
    : /curl|wget|python|node|bun|undici|axios|go-http|okhttp/i.test(userAgent)
      ? "script"
      : /Edg\//.test(userAgent)
        ? "edge"
        : /OPR\//.test(userAgent)
          ? "opera"
          : /Firefox\//.test(userAgent)
            ? "firefox"
            : /Chrome\/|Chromium\//.test(userAgent)
              ? "chrome"
              : /Safari\//.test(userAgent)
                ? "safari"
                : "other";
  return /Mobile|Android|iPhone|iPad/.test(userAgent)
    ? `${family}-mobile`
    : family;
}

/** origin + pathname only - query strings can carry tokens. */
function stripQuery(url: string | null): string | null {
  if (!url) {
    return null;
  }
  try {
    const parsed = new URL(url);
    return `${parsed.origin}${parsed.pathname}`;
  } catch {
    return url.split(/[?#]/)[0] ?? null;
  }
}

/**
 * Request context for an API error log line: enough to find the caller (which
 * page fired it, logged in or not, which client) without secrets - no query
 * strings, no body, no cookie/token values.
 */
function describeRequestForLog(request: NextRequest): {
  method: string;
  path: string;
  referer: string | null;
  auth: "bearer" | "cookie" | "none";
  client: string;
} {
  return {
    method: request.method,
    path: request.nextUrl.pathname,
    referer: stripQuery(request.headers.get("referer")),
    auth: request.headers.get("authorization")
      ? "bearer"
      : request.cookies.get(AUTH_TOKEN_COOKIE_NAME)?.value
        ? "cookie"
        : "none",
    client: userAgentFamily(request.headers.get("user-agent")),
  };
}

/**
 * Wraps an error response in NextResponse
 * Builds clean error chains. Messages arrive already translated and, for
 * validation failures, already formatted by validateData.
 */
/** OpenAI error `type` for an HTTP status. */
function openAiErrorKind(status: number): string {
  if (status === 401) {
    return "authentication_error";
  }
  if (status === 402) {
    return "insufficient_quota";
  }
  if (status === 403) {
    return "permission_error";
  }
  if (status === 404) {
    return "not_found_error";
  }
  if (status === 429) {
    return "rate_limit_error";
  }
  return status >= 500 ? "server_error" : "invalid_request_error";
}

/** Anthropic error `type` for an HTTP status. */
function anthropicErrorKind(status: number): string {
  if (status === 400 || status === 422) {
    return "invalid_request_error";
  }
  if (status === 402) {
    return "billing_error";
  }
  if (status === 403) {
    return "permission_error";
  }
  if (status === 413) {
    return "request_too_large";
  }
  return status < 500 ? openAiErrorKind(status) : "api_error";
}

/**
 * The public OpenAI/Anthropic-compatible API (/api/<locale>/v1/*) is called by
 * stock SDKs and coding agents that only understand their own error envelope.
 * Framework-level failures there (schema validation, CSRF, unexpected throws)
 * are answered in that envelope instead of {success:false,...}.
 */
function v1WireErrorResponse(
  request: NextRequest,
  status: number,
  message: string,
): NextResponse<ErrorResponseType> | undefined {
  const pathname = new URL(request.url).pathname;
  if (!V1_API_PATH_REGEX.test(pathname)) {
    return undefined;
  }
  const anthropic = /\/v1\/messages(\/|$)/.test(pathname);
  const body = anthropic
    ? { type: "error", error: { type: anthropicErrorKind(status), message } }
    : {
        error: {
          message,
          type: openAiErrorKind(status),
          param: null,
          code: status === 400 ? "invalid_request" : null,
        },
      };
  return new NextResponse<ErrorResponseType>(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export function wrapErrorResponse(
  error: ErrorResponseType,
  logger: EndpointLogger,
  locale: CountryLanguage,
  endpoint?: CreateApiEndpointAny | null,
  /** The incoming request - adds caller context (page, auth, client) to the log. */
  request?: NextRequest | null,
): NextResponse<ErrorResponseType> {
  // Build clean error chain
  const { logChain, humanReadable } = buildErrorChain(error);

  // 4xx: delivered to the caller - usually expected (bad input, auth, no
  // credits), but several real client bugs only ever surfaced here (guest UI
  // calling an account-only endpoint, empty path params, version skew), so
  // they stay visible at warn. 5xx is an unexpected server failure.
  const errorCode = error.errorType.errorCode;
  const logMeta = {
    endpoint: endpoint?.aliases?.[0] ?? endpoint?.path?.join("/"),
    errorKey: error.errorType.errorKey,
    errorCode,
    ...(request ? describeRequestForLog(request) : {}),
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

  const wireError = request
    ? v1WireErrorResponse(
        request,
        error.errorType.errorCode,
        humanReadable.replaceAll(/\n\s*/g, " ").trim(),
      )
    : undefined;
  if (wireError) {
    return wireError;
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
