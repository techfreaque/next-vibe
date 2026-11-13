/**
 * API-key authentication for the OpenAI-compatible /v1 surface.
 *
 * Keys authenticate ONLY on /api/<locale>/v1/* - a key is never a general
 * session token, so it cannot reach account/payment/admin endpoints.
 */

import "server-only";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  success,
  type ResponseType,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { AuthRepository } from "next-vibe/identity/auth/repository";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import { V1_PATH_REGEX } from "./constants";
import type { UserApiKey } from "./db";
import { findActiveKey, touchKey } from "./keys";

/**
 * Outcome of resolving a request's bearer key. `unavailable` = the lookup
 * itself failed (DB down/slow/timeout): the key may be perfectly valid, so the
 * caller must answer with a retryable 503, never a 401.
 */
export type ApiKeyResolution =
  | { status: "ok"; key: UserApiKey }
  | { status: "missing" }
  | { status: "invalid" }
  | { status: "unavailable" };

/** Key lookup; injectable so tests can simulate a failing DB. */
export type ApiKeyLookup = (
  plaintext: string,
) => Promise<UserApiKey | undefined>;

/** Seconds a client should wait before retrying after a failed key lookup. */
export const API_KEY_LOOKUP_RETRY_AFTER_SECONDS = 5;

/** Resolution per request, so the handler does not hit the DB twice. */
const resolutions = new WeakMap<Request, ApiKeyResolution>();

/**
 * The key a client sent: `Authorization: Bearer <key>` (OpenAI clients,
 * Claude Code with ANTHROPIC_AUTH_TOKEN) or `x-api-key: <key>` (Anthropic
 * clients, Claude Code with ANTHROPIC_API_KEY).
 */
function bearerOf(request: Request): string | undefined {
  const header = request.headers.get("authorization");
  if (header && /^bearer\s/i.test(header)) {
    const token = header.slice(7).trim();
    if (token) {
      return token;
    }
  }
  return request.headers.get("x-api-key")?.trim() || undefined;
}

export class ApiKeyAuth {
  static isV1Request(request: Request): boolean {
    return V1_PATH_REGEX.test(new URL(request.url).pathname);
  }

  /**
   * Returns undefined when the request is not a /v1 request (normal auth
   * applies). On /v1 a missing/invalid/revoked key resolves to an anonymous
   * public user WITHOUT creating a lead - the endpoint turns that into a 401.
   * A failed lookup (DB error/timeout) also resolves anonymous, but the
   * request is marked `unavailable` so the endpoint answers 503, not 401.
   */
  static async authenticateRequest(
    request: Request,
    locale: CountryLanguage,
    logger: EndpointLogger,
    lookup: ApiKeyLookup = findActiveKey,
  ): Promise<ResponseType<JwtPayloadType> | undefined> {
    if (!ApiKeyAuth.isV1Request(request)) {
      return undefined;
    }
    const anonymous = success(AuthRepository.anonymousPublicUser());
    const resolution = await ApiKeyAuth.resolve(request, logger, lookup);
    if (resolution.status !== "ok") {
      return anonymous;
    }
    const { key } = resolution;
    const payload = await AuthRepository.authenticateUserById(
      key.userId,
      locale,
      logger,
    );
    if (!payload.success) {
      // The key is valid; building the user's identity failed (DB trouble).
      logger.error("API key user lookup failed", {
        keyId: key.id,
        message: payload.message,
      });
      resolutions.set(request, { status: "unavailable" });
      return anonymous;
    }
    void touchKey(key.id).catch(() => undefined);
    return success(payload.data);
  }

  /**
   * How this request's key resolved. Reuses the result of
   * authenticateRequest; looks the key up only when auth did not run.
   */
  static async keyForRequest(
    request: Request,
    logger: EndpointLogger,
    lookup: ApiKeyLookup = findActiveKey,
  ): Promise<ApiKeyResolution> {
    return (
      resolutions.get(request) ?? ApiKeyAuth.resolve(request, logger, lookup)
    );
  }

  private static async resolve(
    request: Request,
    logger: EndpointLogger,
    lookup: ApiKeyLookup,
  ): Promise<ApiKeyResolution> {
    const bearer = bearerOf(request);
    let resolution: ApiKeyResolution;
    if (!bearer) {
      resolution = { status: "missing" };
    } else {
      try {
        const key = await lookup(bearer);
        resolution = key ? { status: "ok", key } : { status: "invalid" };
      } catch (error) {
        logger.error("API key lookup failed", parseError(error));
        resolution = { status: "unavailable" };
      }
    }
    resolutions.set(request, resolution);
    return resolution;
  }
}
