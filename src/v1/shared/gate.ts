/**
 * Request gate shared by every /v1 endpoint: API-key identity + per-key rate
 * limit. Returns a format-neutral V1Error when the call must stop; the caller
 * renders it in its own wire format (OpenAI or Anthropic).
 */

import "server-only";

import type { UserApiKey } from "@/api-keys/db";
import {
  API_KEY_LOOKUP_RETRY_AFTER_SECONDS,
  ApiKeyAuth,
  type ApiKeyResolution,
} from "@/api-keys/auth";
import { consumeRateLimit } from "@/api-keys/keys";
import { isPaidUser } from "@/api-keys/paid";
import type {
  JwtPayloadType,
  JwtPrivatePayloadType,
} from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

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
  // /v1 is a paid feature. A key created before the account lapsed to free-tier
  // stops working too: 402 with a pointer to upgrade.
  if (!(await isPaidUser(user.id))) {
    return {
      ok: false,
      error: v1Error(
        402,
        t("openai.paidRequired"),
        "insufficient_quota",
        "paid_plan_required",
      ),
    };
  }
  if (options.consumeRateLimit === false) {
    return { ok: true, user, key };
  }
  const limit = consumeRateLimit(key.id, key.rateLimitPerMinute);
  if (!limit.allowed) {
    return {
      ok: false,
      error: v1Error(
        429,
        t("openai.rateLimited", {
          limit: key.rateLimitPerMinute,
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
