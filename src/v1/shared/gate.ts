/**
 * Request gate shared by every /v1 endpoint: API-key identity + per-key rate
 * limit. Returns the OpenAI-shaped error response when the call must stop.
 */

import "server-only";

import type { UserApiKey } from "@/api-keys/db";
import { ApiKeyAuth } from "@/api-keys/auth";
import { consumeRateLimit } from "@/api-keys/keys";
import { isPaidUser } from "@/api-keys/paid";
import type { StreamingResponse } from "next-vibe/core/route/response.schema";
import type {
  JwtPayloadType,
  JwtPrivatePayloadType,
} from "next-vibe/identity/auth/types";

import type { V1T } from "../i18n";
import { openAiError } from "./openai";

export type GateResult =
  | { ok: true; user: JwtPrivatePayloadType; key: UserApiKey }
  | { ok: false; response: StreamingResponse };

export async function gateApiKeyRequest(
  user: JwtPayloadType,
  request: Request | undefined,
  t: V1T,
): Promise<GateResult> {
  const key = request ? await ApiKeyAuth.keyForRequest(request) : undefined;
  if (user.isPublic || !key) {
    const hasBearer = request?.headers
      .get("authorization")
      ?.startsWith("Bearer ");
    return {
      ok: false,
      response: openAiError(
        401,
        hasBearer ? t("openai.invalidKey") : t("openai.missingKey"),
        "authentication_error",
        hasBearer ? "invalid_api_key" : "missing_api_key",
      ),
    };
  }
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
