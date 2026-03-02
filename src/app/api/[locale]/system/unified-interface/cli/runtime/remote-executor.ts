/**
 * Remote Executor
 *
 * HTTP execution adapter for `--target remote` CLI execution.
 * Instead of calling handlers locally, sends HTTP requests to a remote server.
 *
 * The server's WebAuthHandler already supports `Authorization: Bearer` headers
 * (next-api/auth-handler.ts:42-48), so we send the JWT from .vibe.remote.session.
 *
 * Special handling:
 * - Login: Bootstraps a leadId first (GET / on remote), then POSTs login,
 *   extracts JWT from Set-Cookie, writes .vibe.remote.session
 * - Logout: Clears token from .vibe.remote.session but preserves leadId
 */

/* eslint-disable i18next/no-literal-string */

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";

import {
  AUTH_TOKEN_COOKIE_MAX_AGE_DAYS,
  AUTH_TOKEN_COOKIE_NAME,
  LEAD_ID_COOKIE_NAME,
} from "@/config/constants";
import type { CountryLanguage } from "@/i18n/core/config";

import type { EndpointLogger } from "../../shared/logger/endpoint";
import type { CreateApiEndpointAny } from "../../shared/types/endpoint-base";
import { Methods } from "../../shared/types/enums";
import {
  clearRemoteSessionToken,
  readRemoteLeadId,
  readRemoteSessionFile,
  type RemoteSessionData,
  writeRemoteSessionFile,
} from "../auth/remote-session-file";
import { scopedTranslation as cliScopedTranslation } from "../i18n";
import type { CliRequestData } from "./parsing";

/** Shape of a decoded JWT payload (only the fields we care about) */
interface DecodedJwtPayload {
  id?: string;
  leadId?: string;
  isPublic?: boolean;
}

// Known endpoint paths for special handling
const LOGIN_PATH = "user/public/login";
const LOGOUT_PATH = "user/auth/logout";

/**
 * Parse a cookie value from a Set-Cookie header string.
 * Set-Cookie headers can contain multiple cookies separated by commas,
 * but each cookie's attributes are separated by semicolons.
 */
function parseCookieFromSetCookie(
  setCookieHeader: string,
  cookieName: string,
): string | undefined {
  // Set-Cookie can be a single header or multiple values
  // Split on comma-space to handle multiple Set-Cookie values joined
  const cookies = setCookieHeader.split(/,\s*(?=[^;]*=)/);
  for (const cookie of cookies) {
    const match = cookie.match(new RegExp(`${cookieName}=([^;]*)`));
    if (match?.[1]) {
      return match[1];
    }
  }
  return undefined;
}

/**
 * Decode a JWT payload without verification.
 * We only need to read userId and leadId — the server already verified the token.
 */
function decodeJwtPayload(token: string): DecodedJwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3 || !parts[1]) {
      return null;
    }
    const payload = JSON.parse(atob(parts[1])) as Record<
      string,
      string | number | boolean
    >;
    return {
      id: typeof payload.id === "string" ? payload.id : undefined,
      leadId: typeof payload.leadId === "string" ? payload.leadId : undefined,
      isPublic:
        typeof payload.isPublic === "boolean" ? payload.isPublic : undefined,
    };
  } catch {
    return null;
  }
}

/**
 * Bootstrap a leadId from a remote host.
 * Hits the root page which triggers the middleware to create a lead and set the cookie.
 * Follows redirects to capture the Set-Cookie header.
 */
async function bootstrapLeadId(
  host: string,
  logger: EndpointLogger,
): Promise<string | null> {
  try {
    // Fetch root page — middleware creates leadId and redirects
    // Use redirect: "manual" to capture Set-Cookie from the 302 response
    const response = await fetch(host, {
      method: "GET",
      redirect: "manual",
    });

    const setCookie = response.headers.get("set-cookie");
    if (setCookie) {
      const leadId = parseCookieFromSetCookie(setCookie, LEAD_ID_COOKIE_NAME);
      if (leadId) {
        logger.debug(`[REMOTE] Bootstrapped leadId: ${leadId}`);
        return leadId;
      }
    }

    // If the first request didn't return a cookie, follow the redirect
    const location = response.headers.get("location");
    if (location) {
      const redirectUrl = location.startsWith("http")
        ? location
        : `${host}${location}`;
      const redirectResponse = await fetch(redirectUrl, {
        method: "GET",
        redirect: "manual",
      });
      const redirectCookie = redirectResponse.headers.get("set-cookie");
      if (redirectCookie) {
        const leadId = parseCookieFromSetCookie(
          redirectCookie,
          LEAD_ID_COOKIE_NAME,
        );
        if (leadId) {
          logger.debug(`[REMOTE] Bootstrapped leadId from redirect: ${leadId}`);
          return leadId;
        }
      }
    }

    logger.warn("[REMOTE] Could not bootstrap leadId from remote host");
    return null;
  } catch (error) {
    logger.error(`[REMOTE] Failed to bootstrap leadId: ${String(error)}`);
    return null;
  }
}

/** Response shape from the remote server — matches ResponseType but with CliResponseData */
interface RemoteResponse {
  success: boolean;
  data?: Record<
    string,
    | string
    | number
    | boolean
    | null
    | Record<string, string | number | boolean | null>
    | Record<string, string | number | boolean | null>[]
  >;
  message?: string;
  errorType?: string;
  messageParams?: Record<string, string>;
}

export class RemoteExecutor {
  /**
   * Execute an endpoint on a remote host via HTTP.
   */
  static async execute(params: {
    endpoint: CreateApiEndpointAny;
    data: CliRequestData;
    locale: CountryLanguage;
    logger: EndpointLogger;
    remoteUrl: string;
  }): Promise<ResponseType<RemoteResponse["data"]>> {
    const { endpoint, data, locale, logger, remoteUrl } = params;
    const { t } = cliScopedTranslation.scopedT(locale);
    const endpointPath = endpoint.path.join("/");
    const isLoginEndpoint = endpointPath === LOGIN_PATH;
    const isLogoutEndpoint = endpointPath === LOGOUT_PATH;

    // 1. Read existing remote session
    const session = await readRemoteSessionFile(logger, locale);
    const existingLeadId = await readRemoteLeadId(logger);

    // 2. For non-login endpoints, require authentication
    if (!session.success && !isLoginEndpoint) {
      return fail({
        message: t("vibe.errors.remoteNotLoggedIn"),
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      });
    }

    // 3. For login: ensure we have a leadId (bootstrap if needed)
    let leadId = existingLeadId;
    if (isLoginEndpoint && !leadId) {
      logger.info("[REMOTE] No leadId found, bootstrapping from remote...");
      leadId = await bootstrapLeadId(remoteUrl, logger);
      if (!leadId) {
        return fail({
          message: t("vibe.errors.remoteNoLeadId"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }
    }

    // Use leadId from session if available
    const effectiveLeadId = session.success ? session.data.leadId : leadId;

    // 4. Build URL
    const url =
      endpoint.method === Methods.GET
        ? buildGetUrl(remoteUrl, locale, endpointPath, data)
        : `${remoteUrl}/api/${locale}/${endpointPath}`;

    // 5. Build headers
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (session.success) {
      headers["Authorization"] = `Bearer ${session.data.token}`;
    }
    if (effectiveLeadId) {
      headers["Cookie"] = `${LEAD_ID_COOKIE_NAME}=${effectiveLeadId}`;
    }

    // 6. Send request
    logger.debug(`[REMOTE] ${endpoint.method} ${url}`);

    const response = await fetch(url, {
      method: endpoint.method,
      headers,
      body: endpoint.method === Methods.GET ? undefined : JSON.stringify(data),
      redirect: "manual",
    });

    // 7. Handle login response — extract token and write session
    if (isLoginEndpoint && response.ok) {
      await handleLoginResponse(response, remoteUrl, locale, logger);
    }

    // 8. Handle logout response — clear session token, keep leadId
    if (isLogoutEndpoint && response.ok) {
      await clearRemoteSessionToken(logger, locale);
      logger.info(`[REMOTE] Logged out from ${remoteUrl}`);
    }

    // 9. Parse and return response
    try {
      const json = (await response.json()) as ResponseType<
        RemoteResponse["data"]
      >;
      return json;
    } catch {
      return fail({
        message: t("vibe.errors.remoteServerError"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}

/**
 * Build a GET URL with query parameters from data.
 */
function buildGetUrl(
  host: string,
  locale: CountryLanguage,
  endpointPath: string,
  data: CliRequestData,
): string {
  const url = new URL(`/api/${locale}/${endpointPath}`, host);
  if (data && typeof data === "object") {
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

/**
 * Handle the login response: extract JWT from Set-Cookie, decode it, write session.
 */
async function handleLoginResponse(
  response: Response,
  host: string,
  locale: CountryLanguage,
  logger: EndpointLogger,
): Promise<void> {
  const setCookie = response.headers.get("set-cookie");
  if (!setCookie) {
    logger.warn("[REMOTE] Login succeeded but no Set-Cookie header received");
    return;
  }

  const token = parseCookieFromSetCookie(setCookie, AUTH_TOKEN_COOKIE_NAME);
  const leadIdFromCookie = parseCookieFromSetCookie(
    setCookie,
    LEAD_ID_COOKIE_NAME,
  );

  if (!token) {
    logger.warn("[REMOTE] Login succeeded but no token in Set-Cookie");
    return;
  }

  // Decode JWT to get userId and leadId
  const payload = decodeJwtPayload(token);
  const userId = payload?.id ?? "";
  const leadId = leadIdFromCookie ?? payload?.leadId ?? "";

  if (!leadId) {
    logger.warn("[REMOTE] Could not extract leadId from login response");
  }

  // Calculate expiration
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + AUTH_TOKEN_COOKIE_MAX_AGE_DAYS);

  const sessionData: RemoteSessionData = {
    token,
    userId,
    leadId,
    expiresAt: expiresAt.toISOString(),
    createdAt: new Date().toISOString(),
    host,
  };

  const writeResult = await writeRemoteSessionFile(sessionData, logger, locale);
  if (writeResult.success) {
    logger.info(`[REMOTE] Logged in to ${host} (userId: ${userId})`);
  } else {
    logger.error("[REMOTE] Failed to write session file after login");
  }
}
