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
import { AuthRepository } from "next-vibe/identity/auth/repository";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import { V1_PATH_REGEX } from "./constants";
import type { UserApiKey } from "./db";
import { findActiveKey, touchKey } from "./keys";

/** key resolved per request, so the handler does not hit the DB twice. */
const resolvedKeys = new WeakMap<Request, UserApiKey>();

function bearerOf(request: Request): string | undefined {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) {
    return undefined;
  }
  return header.slice(7).trim() || undefined;
}

export class ApiKeyAuth {
  static isV1Request(request: Request): boolean {
    return V1_PATH_REGEX.test(new URL(request.url).pathname);
  }

  /**
   * Returns undefined when the request is not a /v1 request (normal auth
   * applies). On /v1 a missing/invalid/revoked key resolves to an anonymous
   * public user WITHOUT creating a lead - the endpoint turns that into a 401.
   */
  static async authenticateRequest(
    request: Request,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<JwtPayloadType> | undefined> {
    if (!ApiKeyAuth.isV1Request(request)) {
      return undefined;
    }
    const anonymous = success(AuthRepository.anonymousPublicUser());
    const bearer = bearerOf(request);
    if (!bearer) {
      return anonymous;
    }
    const key = await findActiveKey(bearer);
    if (!key) {
      return anonymous;
    }
    const payload = await AuthRepository.authenticateUserById(
      key.userId,
      locale,
      logger,
    );
    if (!payload.success) {
      return anonymous;
    }
    resolvedKeys.set(request, key);
    void touchKey(key.id).catch(() => undefined);
    return success(payload.data);
  }

  /** The key that authenticated this request (set by authenticateRequest). */
  static async keyForRequest(
    request: Request,
  ): Promise<UserApiKey | undefined> {
    const cached = resolvedKeys.get(request);
    if (cached) {
      return cached;
    }
    const bearer = bearerOf(request);
    return bearer ? findActiveKey(bearer) : undefined;
  }
}
