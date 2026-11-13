/**
 * Wire-format-neutral error for the /v1 surface. The shared pipeline (gate,
 * model resolution, credit pre-flight) produces these; each wire format
 * (OpenAI chat/responses, Anthropic messages) renders them in its own shape.
 */

import type { StreamingResponse } from "next-vibe/core/route/response.schema";

export type OpenAiErrorKind =
  | "invalid_request_error"
  | "authentication_error"
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
