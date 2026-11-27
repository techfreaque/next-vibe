/**
 * Unit tests for the API-key abuse guards (high burst ceiling + concurrent
 * stream cap) and upstream provider 429 passthrough extraction.
 *
 * Pure unit tests: no DB, no network, no paid inference.
 */

import { afterEach, describe, expect, it } from "bun:test";
import { APICallError, RetryError } from "ai";
import { defaultLocale } from "next-vibe/core/i18n/core/config";

import {
  API_KEY_CONCURRENCY_RETRY_AFTER_SECONDS,
  API_KEY_DEFAULT_BURST_LIMIT_PER_MINUTE,
  API_KEY_DEFAULT_MAX_CONCURRENT_STREAMS,
  API_KEY_UPSTREAM_RATE_LIMIT_RETRY_AFTER_SECONDS,
} from "./constants";
import { apiKeysEnv } from "./env";
import {
  acquireStreamSlot,
  consumeRateLimit,
  effectiveBurstLimit,
  getActiveStreamCount,
  resetRateLimit,
} from "./keys";
import { scopedTranslation as v1ScopedTranslation } from "../v1/i18n";
import {
  extractUpstreamRateLimit,
  upstreamRateLimitError,
} from "../v1/shared/errors";
import { acquireV1StreamSlot } from "../v1/shared/gate";

const baselineEnv = { ...apiKeysEnv };

afterEach(() => {
  Object.assign(apiKeysEnv, baselineEnv);
  resetRateLimit();
});

describe("API key abuse guard defaults", () => {
  it("defaults to a high burst ceiling (~1,200/min) and 50 concurrent streams", () => {
    expect(API_KEY_DEFAULT_BURST_LIMIT_PER_MINUTE).toBe(1_200);
    expect(API_KEY_DEFAULT_MAX_CONCURRENT_STREAMS).toBe(50);
    expect(apiKeysEnv.API_KEY_BURST_LIMIT_PER_MINUTE).toBe(1_200);
    expect(apiKeysEnv.API_KEY_MAX_CONCURRENT_STREAMS).toBe(50);
  });

  it("never throttles legacy DB keys with stored rate_limit_per_minute = 60 at 60/min", () => {
    const effective = effectiveBurstLimit(60);
    expect(effective).toBe(API_KEY_DEFAULT_BURST_LIMIT_PER_MINUTE);
    expect(effective).toBeGreaterThan(60);

    const keyId = "legacy-paid-key";
    const now = 1_700_000_000_000;
    for (let i = 0; i < 120; i++) {
      const result = consumeRateLimit(keyId, effective, now + i);
      expect(result.allowed).toBe(true);
    }
  });

  it("respects env ceiling overrides and explicit higher per-key overrides", () => {
    apiKeysEnv.API_KEY_BURST_LIMIT_PER_MINUTE = 2_400;
    expect(effectiveBurstLimit(60)).toBe(2_400);
    expect(effectiveBurstLimit(undefined)).toBe(2_400);
    expect(effectiveBurstLimit(5_000)).toBe(5_000);
  });
});

describe("consumeRateLimit (sliding-window burst ceiling)", () => {
  it("blocks once the burst ceiling is reached and recovers after the 60s window", () => {
    const keyId = "burst-key";
    const t0 = 1_700_000_000_000;

    expect(consumeRateLimit(keyId, 3, t0)).toEqual({
      allowed: true,
      retryAfterSeconds: 0,
    });
    expect(consumeRateLimit(keyId, 3, t0 + 1_000)).toEqual({
      allowed: true,
      retryAfterSeconds: 0,
    });
    expect(consumeRateLimit(keyId, 3, t0 + 2_000)).toEqual({
      allowed: true,
      retryAfterSeconds: 0,
    });

    const blocked = consumeRateLimit(keyId, 3, t0 + 10_000);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBe(50);

    // Once the oldest hit ages past 60s, a new slot opens.
    const recovered = consumeRateLimit(keyId, 3, t0 + 60_000);
    expect(recovered).toEqual({ allowed: true, retryAfterSeconds: 0 });
  });

  it("isolates burst counters per API key", () => {
    const t0 = 1_700_000_000_000;
    expect(consumeRateLimit("key-a", 1, t0).allowed).toBe(true);
    expect(consumeRateLimit("key-a", 1, t0 + 100).allowed).toBe(false);
    expect(consumeRateLimit("key-b", 1, t0 + 100).allowed).toBe(true);
  });

  it("uses env ceiling by default when no explicit limit is passed", () => {
    apiKeysEnv.API_KEY_BURST_LIMIT_PER_MINUTE = 2;
    const t0 = 1_700_000_000_000;
    expect(consumeRateLimit("env-key", undefined, t0).allowed).toBe(true);
    expect(consumeRateLimit("env-key", undefined, t0 + 1).allowed).toBe(true);
    expect(consumeRateLimit("env-key", undefined, t0 + 2).allowed).toBe(false);
  });
});

describe("acquireStreamSlot (concurrent in-flight stream cap)", () => {
  it("caps simultaneous streams per key and frees slots on release", () => {
    const keyId = "stream-key";
    const s1 = acquireStreamSlot(keyId, 2);
    const s2 = acquireStreamSlot(keyId, 2);
    expect(s1.allowed).toBe(true);
    expect(s2.allowed).toBe(true);
    expect(getActiveStreamCount(keyId)).toBe(2);

    const s3 = acquireStreamSlot(keyId, 2);
    expect(s3).toEqual({
      allowed: false,
      retryAfterSeconds: API_KEY_CONCURRENCY_RETRY_AFTER_SECONDS,
    });

    // Different key is unaffected.
    const other = acquireStreamSlot("other-stream-key", 2);
    expect(other.allowed).toBe(true);
    if (other.allowed) {
      other.release();
    }

    // Releasing s1 once frees exactly one slot; releasing twice is idempotent.
    if (s1.allowed) {
      s1.release();
      s1.release();
    }
    expect(getActiveStreamCount(keyId)).toBe(1);

    const s4 = acquireStreamSlot(keyId, 2);
    expect(s4.allowed).toBe(true);
    expect(getActiveStreamCount(keyId)).toBe(2);

    if (s2.allowed) {
      s2.release();
    }
    if (s4.allowed) {
      s4.release();
    }
    expect(getActiveStreamCount(keyId)).toBe(0);
  });

  it("acquireV1StreamSlot produces a 429 V1Error with Retry-After when capped", () => {
    apiKeysEnv.API_KEY_MAX_CONCURRENT_STREAMS = 1;
    const { t } = v1ScopedTranslation.scopedT(defaultLocale);

    const first = acquireV1StreamSlot("v1-stream-key", t);
    expect(first.ok).toBe(true);

    const second = acquireV1StreamSlot("v1-stream-key", t);
    expect(second.ok).toBe(false);
    if (!second.ok) {
      expect(second.error.status).toBe(429);
      expect(second.error.type).toBe("rate_limit_error");
      expect(second.error.code).toBe("rate_limit_exceeded");
      expect(second.error.headers["Retry-After"]).toBe(
        String(API_KEY_CONCURRENCY_RETRY_AFTER_SECONDS),
      );
    }

    if (first.ok) {
      first.release();
    }
    const third = acquireV1StreamSlot("v1-stream-key", t);
    expect(third.ok).toBe(true);
    if (third.ok) {
      third.release();
    }
  });
});

describe("extractUpstreamRateLimit (provider 429 passthrough)", () => {
  const { t } = v1ScopedTranslation.scopedT(defaultLocale);

  it("extracts HTTP 429 and Retry-After from a direct APICallError", () => {
    const err = new APICallError({
      message: "Upstream rate limit exceeded",
      url: "https://provider.example/v1/chat/completions",
      requestBodyValues: {},
      statusCode: 429,
      responseHeaders: { "Retry-After": "17" },
    });
    const extracted = extractUpstreamRateLimit(err);
    expect(extracted).toEqual({
      retryAfter: "17",
      message: "Upstream rate limit exceeded",
    });
    if (extracted) {
      const v1Err = upstreamRateLimitError(extracted, t);
      expect(v1Err.status).toBe(429);
      expect(v1Err.type).toBe("rate_limit_error");
      expect(v1Err.code).toBe("rate_limit_exceeded");
      expect(v1Err.headers["Retry-After"]).toBe("17");
    }
  });

  it("unwraps RetryError wrapping an APICallError 429 and converts retry-after-ms", () => {
    const inner = new APICallError({
      message: "Too many upstream requests",
      url: "https://provider.example/v1/messages",
      requestBodyValues: {},
      statusCode: 429,
      responseHeaders: { "retry-after-ms": "2500" },
    });
    const retryErr = new RetryError({
      message: "Failed after 3 attempts",
      reason: "maxRetriesExceeded",
      errors: [inner],
    });
    const extracted = extractUpstreamRateLimit(retryErr);
    expect(extracted).toEqual({
      retryAfter: "3",
      message: "Too many upstream requests",
    });
  });

  it("falls back to default Retry-After when the provider 429 omits the header", () => {
    const err = new APICallError({
      message: "Rate limited",
      url: "https://provider.example/v1/chat/completions",
      requestBodyValues: {},
      statusCode: 429,
      responseHeaders: {},
    });
    expect(extractUpstreamRateLimit(err)).toEqual({
      retryAfter: String(API_KEY_UPSTREAM_RATE_LIMIT_RETRY_AFTER_SECONDS),
      message: "Rate limited",
    });
  });

  it("returns undefined for non-429 provider errors and plain errors", () => {
    const err500 = new APICallError({
      message: "Internal error",
      url: "https://provider.example/v1/chat/completions",
      requestBodyValues: {},
      statusCode: 500,
    });
    expect(extractUpstreamRateLimit(err500)).toBeUndefined();
    expect(extractUpstreamRateLimit(new Error("boom"))).toBeUndefined();
    expect(extractUpstreamRateLimit(undefined)).toBeUndefined();
  });
});
