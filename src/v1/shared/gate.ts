/**
 * Request gate shared by every /v1 endpoint: API-key identity + per-key rate
 * limit. Returns a format-neutral V1Error when the call must stop; the caller
 * renders it in its own wire format (OpenAI or Anthropic).
 */

import "server-only";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type {
  JwtPayloadType,
  JwtPrivatePayloadType,
} from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import { buildApiUnlockUrl, getApiAccessPrices } from "@/api-keys/access";
import {
  API_KEY_LOOKUP_RETRY_AFTER_SECONDS,
  ApiKeyAuth,
  type ApiKeyResolution,
} from "@/api-keys/auth";
import type { UserApiKey } from "@/api-keys/db";
import { apiKeysEnv } from "@/api-keys/env";
import {
  acquireStreamSlot,
  consumeRateLimit,
  effectiveBurstLimit,
} from "@/api-keys/keys";
import { isPaidUser } from "@/api-keys/paid";
import { buildPublicOrigin } from "@/api-keys/repository";

import type { V1T } from "../i18n";
import { type V1Error, v1Error } from "./errors";

export type GateResult =
  | { ok: true; user: JwtPrivatePayloadType; key: UserApiKey }
  | { ok: false; error: V1Error };

export interface GateOptions {
  /**
   * false = authenticate without consuming the per-minute budget (free,
   * local-only calls such as token counting that clients fire constantly).
   */
  consumeRateLimit?: boolean;
}

export async function gateApiKeyRequest(
  user: JwtPayloadType,
  request: Request | undefined,
  locale: CountryLanguage,
  t: V1T,
  logger: EndpointLogger,
  options: GateOptions = {},
): Promise<GateResult> {
  const resolution: ApiKeyResolution = request
    ? await ApiKeyAuth.keyForRequest(request, logger)
    : { status: "missing" };
  // Lookup failed (DB slow/down): the key may be valid. Retryable 503, never
  // a 401 that tells the client to throw its key away. Logged in ApiKeyAuth.
  if (resolution.status === "unavailable") {
    return {
      ok: false,
      error: v1Error(
        503,
        t("openai.authUnavailable", {
          seconds: API_KEY_LOOKUP_RETRY_AFTER_SECONDS,
        }),
        "server_error",
        "auth_unavailable",
        null,
        { "Retry-After": String(API_KEY_LOOKUP_RETRY_AFTER_SECONDS) },
      ),
    };
  }
  if (user.isPublic || resolution.status !== "ok") {
    const missing = resolution.status === "missing";
    return {
      ok: false,
      error: v1Error(
        401,
        missing ? t("openai.missingKey") : t("openai.invalidKey"),
        "authentication_error",
        missing ? "missing_api_key" : "invalid_api_key",
      ),
    };
  }
  const { key } = resolution;
  if (key.userId !== user.id) {
    // Defence in depth: the key must belong to the resolved user.
    return {
      ok: false,
      error: v1Error(
        401,
        t("openai.invalidKey"),
        "authentication_error",
        "invalid_api_key",
      ),
    };
  }
  // /v1 is a paid feature. Free accounts may hold keys (made ahead of their
  // first purchase), but every call answers 402 with the exact fix: what to
  // buy, what it costs, and the absolute URL to buy it at.
  if (!(await isPaidUser(user.id))) {
    return {
      ok: false,
      error: v1Error(
        402,
        t("openai.paidRequired", {
          subPrice: getApiAccessPrices(locale).subPrice,
          url: buildApiUnlockUrl(buildPublicOrigin(request), locale),
        }),
        "insufficient_quota",
        "paid_plan_required",
      ),
    };
  }
  if (options.consumeRateLimit === false) {
    return { ok: true, user, key };
  }
  const burstLimit = effectiveBurstLimit(key.rateLimitPerMinute);
  const limit = consumeRateLimit(key.id, burstLimit);
  if (!limit.allowed) {
    return {
      ok: false,
      error: v1Error(
        429,
        t("openai.rateLimited", {
          seconds: limit.retryAfterSeconds,
        }),
        "rate_limit_error",
        "rate_limit_exceeded",
        null,
        { "Retry-After": String(limit.retryAfterSeconds) },
      ),
    };
  }
  return { ok: true, user, key };
}

export type StreamSlotGateResult =
  | { ok: true; release: () => void }
  | { ok: false; error: V1Error };

/**
 * Reserves one concurrent stream slot for a key before opening an SSE stream.
 * Returns a 429 V1Error with Retry-After when the per-key abuse cap is reached.
 */
export function acquireV1StreamSlot(
  keyId: string,
  t: V1T,
  maxConcurrent: number = apiKeysEnv.API_KEY_MAX_CONCURRENT_STREAMS,
): StreamSlotGateResult {
  const slot = acquireStreamSlot(keyId, maxConcurrent);
  if (!slot.allowed) {
    return {
      ok: false,
      error: v1Error(
        429,
        t("openai.tooManyStreams", {
          limit: maxConcurrent,
          seconds: slot.retryAfterSeconds,
        }),
        "rate_limit_error",
        "rate_limit_exceeded",
        null,
        { "Retry-After": String(slot.retryAfterSeconds) },
      ),
    };
  }
  return { ok: true, release: slot.release };
}
