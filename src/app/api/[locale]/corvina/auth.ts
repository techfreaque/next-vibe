/**
 * Corvina Auth Client
 *
 * Keycloak client_credentials token fetcher with in-memory cache.
 * Tokens last ~300s; we refresh when fewer than CACHE_SAFETY_SECONDS remain.
 *
 * Cache key includes clientId + realm + scope so a future multi-tenant
 * variant can coexist without spurious cache hits.
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { corvinaEnv } from "./env";

interface CachedToken {
  accessToken: string;
  expiresAt: number;
}

interface KeycloakTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export class CorvinaAuth {
  private static readonly CACHE_SAFETY_SECONDS = 30;
  private static readonly TOKEN_REQUEST_TIMEOUT_MS = 15_000;
  private static cache = new Map<string, CachedToken>();
  private static inflight = new Map<string, Promise<ResponseType<string>>>();

  static async getAccessToken(
    logger: EndpointLogger,
  ): Promise<ResponseType<string>> {
    const clientId = corvinaEnv.CORVINA_CLIENT_ID;
    const clientSecret = corvinaEnv.CORVINA_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      logger.warn("[CORVINA_AUTH] Missing service-account credentials");
      return fail({
        message:
          "Corvina service-account credentials are not configured. Set CORVINA_CLIENT_ID and CORVINA_CLIENT_SECRET in .env.local.",
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      });
    }

    const cacheKey = this.buildCacheKey(clientId);
    const cached = this.cache.get(cacheKey);
    const now = Math.floor(Date.now() / 1000);

    if (cached && cached.expiresAt - now > this.CACHE_SAFETY_SECONDS) {
      return success(cached.accessToken);
    }

    const existing = this.inflight.get(cacheKey);
    if (existing) {
      return existing;
    }

    const promise = this.fetchToken(clientId, clientSecret, logger).finally(
      () => {
        this.inflight.delete(cacheKey);
      },
    );
    this.inflight.set(cacheKey, promise);
    return promise;
  }

  private static buildCacheKey(clientId: string): string {
    return `${corvinaEnv.CORVINA_REALM}:${clientId}:${corvinaEnv.CORVINA_ORG_SCOPE}`;
  }

  private static async fetchToken(
    clientId: string,
    clientSecret: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<string>> {
    const tokenUrl = `${corvinaEnv.CORVINA_AUTH_BASE_URL}/auth/realms/${corvinaEnv.CORVINA_REALM}/protocol/openid-connect/token`;
    const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    const body = new URLSearchParams({
      grant_type: "client_credentials",
      scope: `org:${corvinaEnv.CORVINA_ORG_SCOPE}`,
    }).toString();

    let response: Response;
    try {
      response = await fetch(tokenUrl, {
        method: "POST",
        headers: {
          Authorization: `Basic ${basic}`,
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body,
        signal: AbortSignal.timeout(this.TOKEN_REQUEST_TIMEOUT_MS),
      });
    } catch (error) {
      logger.error("[CORVINA_AUTH] Token request network error", {
        error: String(error),
        tokenUrl,
      });
      return fail({
        message: "Could not reach Corvina auth server.",
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      logger.error("[CORVINA_AUTH] Token request failed", {
        status: response.status,
        body: text.slice(0, 500),
      });
      if (response.status === 401 || response.status === 403) {
        return fail({
          message:
            "Corvina rejected the service-account credentials. Verify CORVINA_CLIENT_ID, CORVINA_CLIENT_SECRET, CORVINA_REALM, and CORVINA_ORG_SCOPE.",
          errorType: ErrorResponseTypes.UNAUTHORIZED,
        });
      }
      return fail({
        message: `Corvina auth server returned ${response.status}.`,
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    let parsed: KeycloakTokenResponse;
    try {
      parsed = (await response.json()) as KeycloakTokenResponse;
    } catch (error) {
      logger.error("[CORVINA_AUTH] Token response parse error", {
        error: String(error),
      });
      return fail({
        message: "Corvina auth server returned an unparseable response.",
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    if (!parsed.access_token || typeof parsed.expires_in !== "number") {
      logger.error("[CORVINA_AUTH] Token response missing fields", {
        hasToken: Boolean(parsed.access_token),
        expiresIn: parsed.expires_in,
      });
      return fail({
        message: "Corvina auth server returned a malformed token response.",
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }

    const expiresAt = Math.floor(Date.now() / 1000) + parsed.expires_in;
    this.cache.set(this.buildCacheKey(clientId), {
      accessToken: parsed.access_token,
      expiresAt,
    });
    logger.debug("[CORVINA_AUTH] Token refreshed", {
      expiresIn: parsed.expires_in,
    });
    return success(parsed.access_token);
  }

  static invalidate(): void {
    this.cache.clear();
  }
}
