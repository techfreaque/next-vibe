/**
 * Regression tests for TTS provider transient retry and error sanitization.
 *
 * Prod incident 2026-11-26 (NanoGPT outage, 17:53-19:17 UTC): NanoGPT returned
 * HTTP 503 (`async_billing_reservation_failed`, `account_model_restriction_unavailable`),
 * HTTP 500 (`server_error`), HTTP 429 (`api_key_usage_unavailable`), and TCP
 * connect timeouts for `gemini-puck` (`google/gemini-3.8-flash-lite-tts:Puck`).
 * TTS did not retry transient upstream failures and leaked raw NanoGPT billing
 * JSON verbatim to the user, making customers think their own credits failed.
 */

import { describe, expect, it } from "bun:test";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { ErrorResponseTypes } from "next-vibe/core/route/response.schema";
import { createEndpointLogger } from "next-vibe/logger/server";

import { scopedTranslation } from "./i18n";
import {
  extractTtsProviderErrorMessage,
  fetchTtsWithRetry,
  formatTtsProviderFailure,
  isRetryableTtsNetworkError,
  isRetryableTtsStatus,
  parseRetryAfterMs,
  type TtsFetchImpl,
} from "./provider-retry";

const { t } = scopedTranslation.scopedT(defaultLocale);

const NANOGPT_BILLING_503 = JSON.stringify({
  error: {
    message: "Billing reservation failed",
    type: "server_error",
    param: null,
    code: "async_billing_reservation_failed",
  },
});

const NANOGPT_MODEL_ACCESS_503 = JSON.stringify({
  error: {
    message: "Unable to verify model access. Please retry shortly.",
    type: "server_error",
    param: null,
    code: "account_model_restriction_unavailable",
  },
});

const NANOGPT_SERVER_500 = JSON.stringify({
  error: {
    message: "Request failed with status 500",
    type: "server_error",
    param: null,
    code: "server_error",
  },
});

function createSilentLogger(): ReturnType<typeof createEndpointLogger> {
  return createEndpointLogger(false, defaultLocale);
}

describe("TTS provider transient retry", () => {
  it("retries NanoGPT 503 billing reservation and 500 errors and recovers on success", async () => {
    const delays: number[] = [];
    const responses = [
      new Response(NANOGPT_BILLING_503, { status: 503 }),
      new Response(NANOGPT_SERVER_500, { status: 500 }),
      new Response(new Uint8Array([1, 2, 3]), {
        status: 200,
        headers: { "content-type": "audio/mpeg" },
      }),
    ];
    let callCount = 0;
    const fetchImpl: TtsFetchImpl = async () => {
      const next = responses[callCount];
      callCount++;
      return next ?? new Response(null, { status: 500 });
    };

    const result = await fetchTtsWithRetry({
      fetchImpl,
      url: "https://api.nano-gpt.com/api/v1/audio/speech",
      init: { method: "POST", body: "{}" },
      logger: createSilentLogger(),
      providerLabel: "NanoGPT",
      context: { model: "google/gemini-3.8-flash-lite-tts", voice: "Puck" },
      sleep: async (ms) => {
        delays.push(ms);
      },
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.response.status).toBe(200);
    expect(result.attempts).toBe(3);
    expect(callCount).toBe(3);
    expect(delays).toEqual([500, 1500]);
  });

  it("stops after maxAttempts on persistent 503 and leaves the final body readable", async () => {
    let callCount = 0;
    const fetchImpl: TtsFetchImpl = async () => {
      callCount++;
      return new Response(NANOGPT_MODEL_ACCESS_503, { status: 503 });
    };

    const result = await fetchTtsWithRetry({
      fetchImpl,
      url: "https://api.nano-gpt.com/api/v1/audio/speech",
      init: { method: "POST", body: "{}" },
      logger: createSilentLogger(),
      providerLabel: "NanoGPT",
      sleep: async () => undefined,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.response.status).toBe(503);
    expect(result.attempts).toBe(3);
    expect(callCount).toBe(3);
    const body = await result.response.text();
    expect(body).toBe(NANOGPT_MODEL_ACCESS_503);
  });

  it("does not retry non-retryable 400 client errors", async () => {
    let callCount = 0;
    const fetchImpl: TtsFetchImpl = async () => {
      callCount++;
      return new Response(
        JSON.stringify({ error: { message: "Input text exceeds limit" } }),
        { status: 400 },
      );
    };

    const result = await fetchTtsWithRetry({
      fetchImpl,
      url: "https://api.nano-gpt.com/api/v1/audio/speech",
      init: { method: "POST", body: "{}" },
      logger: createSilentLogger(),
      providerLabel: "NanoGPT",
      sleep: async () => undefined,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.response.status).toBe(400);
    expect(result.attempts).toBe(1);
    expect(callCount).toBe(1);
  });

  it("stops retrying when an upstream attempt already exceeded the retry time budget", async () => {
    let currentTime = 0;
    let callCount = 0;
    const fetchImpl: TtsFetchImpl = async () => {
      callCount++;
      // Simulate the 46s upstream NanoGPT stall observed in prod.
      currentTime += 46_000;
      return new Response(NANOGPT_BILLING_503, { status: 503 });
    };

    const result = await fetchTtsWithRetry({
      fetchImpl,
      url: "https://api.nano-gpt.com/api/v1/audio/speech",
      init: { method: "POST", body: "{}" },
      logger: createSilentLogger(),
      providerLabel: "NanoGPT",
      now: () => currentTime,
      sleep: async () => undefined,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.attempts).toBe(1);
    expect(callCount).toBe(1);
  });

  it("retries transient connect timeout errors and recovers", async () => {
    let callCount = 0;
    const fetchImpl: TtsFetchImpl = async () => {
      callCount++;
      if (callCount === 1) {
        return Promise.reject(
          new Error(
            "Connect Timeout Error (attempted address: api.nano-gpt.com:443, timeout: 10000ms)",
          ),
        );
      }
      return new Response(new Uint8Array([4, 5, 6]), { status: 200 });
    };

    const result = await fetchTtsWithRetry({
      fetchImpl,
      url: "https://api.nano-gpt.com/api/v1/audio/speech",
      init: { method: "POST", body: "{}" },
      logger: createSilentLogger(),
      providerLabel: "NanoGPT",
      sleep: async () => undefined,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.response.status).toBe(200);
    expect(result.attempts).toBe(2);
  });

  it("does not retry AbortError", async () => {
    let callCount = 0;
    const fetchImpl: TtsFetchImpl = async () => {
      callCount++;
      const err = new Error("The operation was aborted");
      err.name = "AbortError";
      return Promise.reject(err);
    };

    const result = await fetchTtsWithRetry({
      fetchImpl,
      url: "https://api.nano-gpt.com/api/v1/audio/speech",
      init: { method: "POST", body: "{}" },
      logger: createSilentLogger(),
      providerLabel: "NanoGPT",
      sleep: async () => undefined,
    });

    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.retryable).toBe(false);
    expect(result.attempts).toBe(1);
    expect(callCount).toBe(1);
  });

  it("honours and caps Retry-After headers on 429 responses", async () => {
    const delays: number[] = [];
    let callCount = 0;
    const fetchImpl: TtsFetchImpl = async () => {
      callCount++;
      if (callCount === 1) {
        return new Response(
          JSON.stringify({
            error: {
              message: "Usage could not be verified. Please retry.",
              code: "api_key_usage_unavailable",
            },
          }),
          { status: 429, headers: { "retry-after": "30" } },
        );
      }
      return new Response(new Uint8Array([7]), { status: 200 });
    };

    const result = await fetchTtsWithRetry({
      fetchImpl,
      url: "https://api.nano-gpt.com/api/v1/audio/speech",
      init: { method: "POST", body: "{}" },
      logger: createSilentLogger(),
      providerLabel: "NanoGPT",
      sleep: async (ms) => {
        delays.push(ms);
      },
    });

    expect(result.ok).toBe(true);
    expect(delays).toEqual([5000]);
  });
});

describe("TTS provider error sanitization", () => {
  it("hides raw NanoGPT billing reservation JSON on 503/500/429 and reassures user credits were not charged", async () => {
    const cases: ReadonlyArray<readonly [number, string]> = [
      [503, NANOGPT_BILLING_503],
      [503, NANOGPT_MODEL_ACCESS_503],
      [500, NANOGPT_SERVER_500],
      [429, '{"error":{"message":"api_key_usage_unavailable"}}'],
    ];
    for (const [status, rawBody] of cases) {
      const failure = await formatTtsProviderFailure({
        providerLabel: "NanoGPT",
        status,
        headers: new Headers(),
        rawBody,
        t,
      });

      expect(failure.success).toBe(false);
      if (failure.success) {
        continue;
      }
      expect(failure.errorType).toBe(ErrorResponseTypes.EXTERNAL_SERVICE_ERROR);
      expect(failure.message).toBe(t("post.errors.providerUnavailable"));
      expect(failure.message).not.toContain("Billing reservation");
      expect(failure.message).not.toContain("async_billing_reservation_failed");
      expect(failure.message).not.toContain("{");
    }
  });

  it("extracts a clean message from non-outage 400 JSON errors instead of raw JSON", async () => {
    const failure = await formatTtsProviderFailure({
      providerLabel: "NanoGPT",
      status: 400,
      headers: new Headers(),
      rawBody: JSON.stringify({
        error: { message: "Text must be 4096 characters or fewer." },
      }),
      t,
    });

    expect(failure.success).toBe(false);
    if (failure.success) {
      return;
    }
    expect(failure.message).toBe(
      t("post.errors.conversionFailed", {
        error: "Text must be 4096 characters or fewer.",
      }),
    );
    expect(String(failure.message)).toBe(
      "Speech synthesis failed: Text must be 4096 characters or fewer.",
    );
  });

  it("summarizes Cloudflare HTML error pages instead of leaking HTML markup", async () => {
    const html =
      "<!doctype html><html><head><title>Attention Required! | Cloudflare</title></head><body>blocked</body></html>";
    const extracted = await extractTtsProviderErrorMessage(
      "NanoGPT",
      403,
      new Headers({ "cf-ray": "abc123" }),
      html,
    );
    expect(extracted).toContain("NanoGPT edge returned 403");
    expect(extracted).toContain("cf-ray abc123");
    expect(extracted).not.toContain("<html");
  });

  it("classifies status codes, Retry-After, and network errors accurately", () => {
    expect(isRetryableTtsStatus(429)).toBe(true);
    expect(isRetryableTtsStatus(500)).toBe(true);
    expect(isRetryableTtsStatus(503)).toBe(true);
    expect(isRetryableTtsStatus(400)).toBe(false);
    expect(isRetryableTtsStatus(401)).toBe(false);

    expect(parseRetryAfterMs(new Headers({ "retry-after": "2" }))).toBe(2000);
    expect(parseRetryAfterMs(new Headers({ "retry-after": "120" }))).toBe(5000);
    expect(parseRetryAfterMs(new Headers())).toBeNull();

    expect(isRetryableTtsNetworkError(new Error("fetch failed"))).toBe(true);
    expect(
      isRetryableTtsNetworkError(new Error("Connect Timeout Error")),
    ).toBe(true);
    const abort = new Error("Aborted");
    abort.name = "AbortError";
    expect(isRetryableTtsNetworkError(abort)).toBe(false);
  });
});
