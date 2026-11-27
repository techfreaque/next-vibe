/**
 * Wire-format-neutral error for the /v1 surface. The shared pipeline (gate,
 * model resolution, credit pre-flight) produces these; each wire format
 * (OpenAI chat/responses, Anthropic messages) renders them in its own shape.
 */

import { APICallError, RetryError } from "ai";
import type { StreamingResponse } from "next-vibe/core/route/response.schema";

import { API_KEY_UPSTREAM_RATE_LIMIT_RETRY_AFTER_SECONDS } from "@/api-keys/constants";

import type { V1T } from "../i18n";

export type OpenAiErrorKind =
  | "invalid_request_error"
  | "authentication_error"
  | "permission_error"
  | "insufficient_quota"
  | "rate_limit_error"
  | "not_found_error"
  | "server_error";

export interface V1Error {
  status: number;
  message: string;
  type: OpenAiErrorKind;
  code: string | null;
  param: string | null;
  headers: Record<string, string>;
}

export function v1Error(
  status: number,
  message: string,
  type: OpenAiErrorKind,
  code: string | null,
  param: string | null = null,
  headers: Record<string, string> = {},
): V1Error {
  return { status, message, type, code, param, headers };
}

/** Renders a V1Error as the HTTP response of one wire format. */
export type V1ErrorRenderer = (error: V1Error) => StreamingResponse;

/** Extracted upstream HTTP 429 signal with its Retry-After value. */
export interface UpstreamRateLimit {
  retryAfter: string;
  message: string;
}

function findApiCallError(error: Error | undefined): APICallError | undefined {
  if (!error) {
    return undefined;
  }
  if (APICallError.isInstance(error)) {
    return error;
  }
  if (RetryError.isInstance(error)) {
    if (APICallError.isInstance(error.lastError)) {
      return error.lastError;
    }
    for (let i = error.errors.length - 1; i >= 0; i--) {
      const item = error.errors[i];
      if (APICallError.isInstance(item)) {
        return item;
      }
    }
  }
  if (APICallError.isInstance(error.cause)) {
    return error.cause;
  }
  if (RetryError.isInstance(error.cause)) {
    if (APICallError.isInstance(error.cause.lastError)) {
      return error.cause.lastError;
    }
  }
  return undefined;
}

function extractRetryAfterHeader(
  headers: Record<string, string> | undefined,
): string {
  if (headers) {
    let retryAfterMs: string | undefined;
    for (const [headerName, headerValue] of Object.entries(headers)) {
      const lower = headerName.toLowerCase();
      const trimmed = headerValue.trim();
      if (!trimmed) {
        continue;
      }
      if (lower === "retry-after") {
        return trimmed;
      }
      if (lower === "retry-after-ms") {
        retryAfterMs = trimmed;
      }
    }
    if (retryAfterMs !== undefined) {
      const ms = Number(retryAfterMs);
      if (Number.isFinite(ms) && ms > 0) {
        return String(Math.max(1, Math.ceil(ms / 1000)));
      }
    }
  }
  return String(API_KEY_UPSTREAM_RATE_LIMIT_RETRY_AFTER_SECONDS);
}

/**
 * Detects an upstream provider HTTP 429 (direct APICallError or wrapped in
 * AI SDK RetryError) so /v1 can pass through 429 with Retry-After instead of
 * masking it as a 502.
 */
export function extractUpstreamRateLimit(
  error: Error | undefined,
): UpstreamRateLimit | undefined {
  const apiError = findApiCallError(error);
  if (!apiError || apiError.statusCode !== 429) {
    return undefined;
  }
  return {
    retryAfter: extractRetryAfterHeader(apiError.responseHeaders),
    message: apiError.message,
  };
}

/** Format-neutral 429 error built from an upstream provider 429. */
export function upstreamRateLimitError(
  rateLimit: UpstreamRateLimit,
  t: V1T,
): V1Error {
  return v1Error(
    429,
    t("openai.upstreamRateLimited", { error: rateLimit.message }),
    "rate_limit_error",
    "rate_limit_exceeded",
    null,
    { "Retry-After": rateLimit.retryAfter },
  );
}
