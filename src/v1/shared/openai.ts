/**
 * OpenAI wire-format helpers for the /v1 surface: error envelope + raw JSON
 * responses (the /v1 endpoints bypass our {success,data} envelope on purpose -
 * stock OpenAI SDKs parse the body as-is).
 */

import "server-only";

import type { WidgetData } from "next-vibe/core/utils/json";
import {
  createStreamingResponse,
  type StreamingResponse,
} from "next-vibe/core/route/response.schema";

export type OpenAiErrorKind =
  | "invalid_request_error"
  | "authentication_error"
  | "insufficient_quota"
  | "rate_limit_error"
  | "not_found_error"
  | "server_error";

// eslint-disable-next-line typescript/consistent-type-definitions, @typescript-eslint/consistent-type-definitions -- Must be a type alias, not an interface: only aliases get the implicit index signature that makes this assignable to WidgetData when passed to openAiJson.
export type OpenAiErrorBody = {
  error: {
    message: string;
    type: OpenAiErrorKind;
    param: string | null;
    code: string | null;
  };
};

export function openAiErrorBody(
  message: string,
  type: OpenAiErrorKind,
  code: string | null,
  param: string | null = null,
): OpenAiErrorBody {
  return { error: { message, type, param, code } };
}

export function openAiJson(
  body: WidgetData,
  status = 200,
  headers: Record<string, string> = {},
): StreamingResponse {
  return createStreamingResponse(
    new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json", ...headers },
    }),
  );
}

export function openAiError(
  status: number,
  message: string,
  type: OpenAiErrorKind,
  code: string | null,
  param: string | null = null,
  headers: Record<string, string> = {},
): StreamingResponse {
  return openAiJson(
    openAiErrorBody(message, type, code, param),
    status,
    headers,
  );
}

export function newCompletionId(): string {
  return `chatcmpl-${crypto.randomUUID().replaceAll("-", "")}`;
}

/** Fixed `created` for model objects (OpenAI requires an integer). */
export const MODEL_CREATED_AT = 1_735_689_600;
