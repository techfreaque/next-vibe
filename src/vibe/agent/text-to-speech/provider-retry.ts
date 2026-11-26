/**
 * Transient retry and user-facing error formatting for TTS provider HTTP calls.
 *
 * Upstream gateways (NanoGPT, OpenRouter, OpenAI, ElevenLabs, Eden AI) can
 * return transient 5xx / 429 / connect-timeout responses during outages (for
 * example NanoGPT 503 `async_billing_reservation_failed` or
 * `account_model_restriction_unavailable`). Without server-side retry and
 * error sanitization, a single upstream blip fails immediately and leaks raw
 * provider billing JSON to the user as if their own account balance failed.
 */

import { safeParseJSON } from "@ai-sdk/provider-utils";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { EndpointLogger } from "next-vibe/logger/types";
import { z } from "zod";

import { summarizeUpstreamError } from "../ai-stream/providers/shared/upstream-error";
import { pollDelay } from "../shared/poll-delay";
import type { TextToSpeechT } from "./i18n";

const DEFAULT_MAX_ATTEMPTS = 3;
const DEFAULT_BASE_DELAY_MS = 500;
const MAX_RETRY_AFTER_MS = 5000;
/**
 * Do not keep retrying after a single slow upstream call already consumed
 * most of the request window (for example a 46s upstream timeout returning 503).
 */
const DEFAULT_MAX_RETRY_WINDOW_MS = 25_000;
const MAX_USER_ERROR_CHARS = 300;

const RETRYABLE_NETWORK_PATTERNS: readonly RegExp[] = [
  /connect timeout|timed? ?out|timeout/i,
  /fetch failed|network|socket hang up|econnreset|econnrefused|etimedout|enotfound|eai_again|epipe|und_err_/i,
];

const providerErrorBodySchema = z.object({
  error: z
    .union([
      z.string(),
      z.object({
        message: z.string().optional(),
        detail: z.string().optional(),
      }),
    ])
    .optional(),
  message: z.string().optional(),
  detail: z
    .union([
      z.string(),
      z.object({
        message: z.string().optional(),
      }),
    ])
    .optional(),
});

export function isRetryableTtsStatus(status: number): boolean {
  return status === 429 || (status >= 500 && status <= 599);
}

export function isRetryableTtsNetworkError(
  error: Error | { name?: string; message?: string } | string,
): boolean {
  if (typeof error === "string") {
    return RETRYABLE_NETWORK_PATTERNS.some((pattern) => pattern.test(error));
  }
  if (error.name === "AbortError") {
    return false;
  }
  const message = error.message ?? "";
  return RETRYABLE_NETWORK_PATTERNS.some((pattern) => pattern.test(message));
}

export function parseRetryAfterMs(headers: Headers): number | null {
  const raw = headers.get("retry-after")?.trim();
  if (!raw) {
    return null;
  }
  const seconds = Number(raw);
  if (Number.isFinite(seconds) && seconds > 0) {
    return Math.min(
      MAX_RETRY_AFTER_MS,
      Math.max(DEFAULT_BASE_DELAY_MS, Math.round(seconds * 1000)),
    );
  }
  return null;
}

export async function extractTtsProviderErrorMessage(
  providerLabel: string,
  status: number,
  headers: Headers,
  rawBody: string,
): Promise<string> {
  const upstream = summarizeUpstreamError(
    providerLabel,
    status,
    headers,
    rawBody,
  );
  if (upstream.isHtmlPage) {
    return upstream.summary;
  }
  const trimmed = rawBody.trim();
  if (!trimmed) {
    return `HTTP ${status}`;
  }
  const parsed = await safeParseJSON({
    text: trimmed,
    schema: providerErrorBodySchema,
  });
  if (parsed.success) {
    const { error, message, detail } = parsed.value;
    const candidate =
      typeof error === "string"
        ? error
        : (error?.message ??
          error?.detail ??
          message ??
          (typeof detail === "string" ? detail : detail?.message));
    if (candidate?.trim()) {
      return candidate.trim().slice(0, MAX_USER_ERROR_CHARS);
    }
  }
  return trimmed.slice(0, MAX_USER_ERROR_CHARS);
}

export async function formatTtsProviderFailure(params: {
  providerLabel: string;
  status: number;
  headers: Headers;
  rawBody: string;
  t: TextToSpeechT;
}): Promise<ResponseType<never>> {
  if (isRetryableTtsStatus(params.status)) {
    return fail({
      message: params.t("post.errors.providerUnavailable"),
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });
  }
  const detail = await extractTtsProviderErrorMessage(
    params.providerLabel,
    params.status,
    params.headers,
    params.rawBody,
  );
  return fail({
    message: params.t("post.errors.conversionFailed", { error: detail }),
    errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
  });
}

export type TtsRetryFetchResult =
  | {
      ok: true;
      response: Response;
      attempts: number;
    }
  | {
      ok: false;
      errorMessage: string;
      retryable: boolean;
      attempts: number;
    };

export type TtsFetchImpl = (
  input: string,
  init?: RequestInit,
) => Promise<Response>;

export interface FetchTtsWithRetryParams {
  fetchImpl: TtsFetchImpl;
  url: string;
  init: RequestInit;
  logger: EndpointLogger;
  providerLabel: string;
  context?: Record<string, string | number | boolean | null | undefined>;
  maxAttempts?: number;
  baseDelayMs?: number;
  maxRetryWindowMs?: number;
  now?: () => number;
  sleep?: (ms: number, lastResponse?: Response) => Promise<void>;
}

export async function fetchTtsWithRetry(
  params: FetchTtsWithRetryParams,
): Promise<TtsRetryFetchResult> {
  const maxAttempts = params.maxAttempts ?? DEFAULT_MAX_ATTEMPTS;
  const baseDelayMs = params.baseDelayMs ?? DEFAULT_BASE_DELAY_MS;
  const maxRetryWindowMs =
    params.maxRetryWindowMs ?? DEFAULT_MAX_RETRY_WINDOW_MS;
  const now = params.now ?? Date.now;
  const sleep = params.sleep ?? pollDelay;
  const startedAt = now();

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await params.fetchImpl(params.url, params.init);
      if (response.ok) {
        return { ok: true, response, attempts: attempt };
      }

      const elapsedMs = now() - startedAt;
      const canRetry =
        isRetryableTtsStatus(response.status) &&
        attempt < maxAttempts &&
        elapsedMs < maxRetryWindowMs;

      if (!canRetry) {
        return { ok: true, response, attempts: attempt };
      }

      const rawBody = await response.text().catch(() => "");
      const upstream = summarizeUpstreamError(
        params.providerLabel,
        response.status,
        response.headers,
        rawBody,
      );
      const delayMs =
        parseRetryAfterMs(response.headers) ??
        baseDelayMs * Math.pow(3, attempt - 1);

      params.logger.warn("[TTS] Upstream provider transient error, retrying", {
        provider: params.providerLabel,
        attempt,
        maxAttempts,
        status: response.status,
        retryDelayMs: delayMs,
        elapsedMs,
        error: upstream.summary,
        providerRequestId: response.headers.get("x-request-id"),
        ...params.context,
      });

      await sleep(delayMs, response);
    } catch (error) {
      const parsed = parseError(error);
      const retryable = isRetryableTtsNetworkError(
        error instanceof Error ? error : parsed.message,
      );
      const elapsedMs = now() - startedAt;
      const canRetry =
        retryable && attempt < maxAttempts && elapsedMs < maxRetryWindowMs;

      if (!canRetry) {
        return {
          ok: false,
          errorMessage: parsed.message,
          retryable,
          attempts: attempt,
        };
      }

      const delayMs = baseDelayMs * Math.pow(3, attempt - 1);
      params.logger.warn("[TTS] Upstream provider network error, retrying", {
        provider: params.providerLabel,
        attempt,
        maxAttempts,
        retryDelayMs: delayMs,
        elapsedMs,
        error: parsed.message,
        ...params.context,
      });

      await sleep(delayMs);
    }
  }

  return {
    ok: false,
    errorMessage: "TTS request exhausted retry attempts",
    retryable: true,
    attempts: maxAttempts,
  };
}
