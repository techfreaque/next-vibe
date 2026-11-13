/**
 * Anthropic wire-format helpers for /v1/messages: the Anthropic error
 * envelope ({type:"error", error:{type, message}}) with the status codes and
 * retry hints the Anthropic SDK (and so Claude Code) acts on.
 */

import "server-only";

import type { StreamingResponse } from "next-vibe/core/route/response.schema";

import type { V1Error } from "./errors";
import { openAiJson } from "./openai";

export type AnthropicErrorType =
  | "invalid_request_error"
  | "authentication_error"
  | "billing_error"
  | "permission_error"
  | "not_found_error"
  | "request_too_large"
  | "rate_limit_error"
  | "api_error"
  | "overloaded_error";

export function anthropicErrorType(status: number): AnthropicErrorType {
  switch (status) {
    case 400:
      return "invalid_request_error";
    case 401:
      return "authentication_error";
    case 402:
      return "billing_error";
    case 403:
      return "permission_error";
    case 404:
      return "not_found_error";
    case 413:
      return "request_too_large";
    case 429:
      return "rate_limit_error";
    case 529:
      return "overloaded_error";
    default:
      return "api_error";
  }
}

export function anthropicErrorBody(
  type: AnthropicErrorType,
  message: string,
): { type: "error"; error: { type: AnthropicErrorType; message: string } } {
  return { type: "error", error: { type, message } };
}

/** V1ErrorRenderer for the Anthropic messages format. */
export function anthropicErrorResponse(error: V1Error): StreamingResponse {
  const retryable = error.status === 429 || error.status >= 500;
  return openAiJson(
    anthropicErrorBody(anthropicErrorType(error.status), error.message),
    error.status,
    {
      ...error.headers,
      "x-should-retry": retryable ? "true" : "false",
    },
  );
}
