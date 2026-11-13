/**
 * Request gate shared by every /v1 endpoint: API-key identity + per-key rate
 * limit. Returns the OpenAI-shaped error response when the call must stop.
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
import type { StreamingResponse } from "next-vibe/core/route/response.schema";
import type {
  JwtPayloadType,
  JwtPrivatePayloadType,
} from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import type { V1T } from "../i18n";
import { openAiError } from "./openai";

export type GateResult =
  | { ok: true; user: JwtPrivatePayloadType; key: UserApiKey }
  | { ok: false; response: StreamingResponse };

export async function gateApiKeyRequest(
  user: JwtPayloadType,
  request: Request | undefined,
  t: V1T,
  logger: EndpointLogger,
): Promise<GateResult> {
  const resolution: ApiKeyResolution = request
    ? await ApiKeyAuth.keyForRequest(request, logger)
    : { status: "missing" };
  // Lookup failed (DB slow/down): the key may be valid. Retryable 503, never
  // a 401 that tells the client to throw its key away. Logged in ApiKeyAuth.
  if (resolution.status === "unavailable") {
    return {
      ok: false,
      response: openAiError(
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
      response: openAiError(
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
      response: openAiError(
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
      response: openAiError(
        402,
        t("openai.paidRequired"),
        "insufficient_quota",
        "paid_plan_required",
      ),
    };
  }
  const limit = consumeRateLimit(key.id, key.rateLimitPerMinute);
  if (!limit.allowed) {
    return {
      ok: false,
      response: openAiError(
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
