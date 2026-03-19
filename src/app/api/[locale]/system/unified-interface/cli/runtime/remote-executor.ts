/**
 * Remote Executor (CLI)
 *
 * Executes commands on a remote host via HTTP.
 * Session is always DB-backed via remote_connections table.
 * No file-based session storage for remote.
 *
 * Login: bootstraps leadId, POSTs credentials to remote, stores JWT in DB.
 * Logout: clears the DB record.
 * All other endpoints: reads token from DB, delegates to executeRemote().
 */

/* eslint-disable oxlint-plugin-i18n/no-literal-string */

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

import {
  buildRemoteHeaders,
  buildRemoteUrl,
  executeRemote,
  type RemoteCallData,
} from "../../remote/remote-call";
import type { EndpointLogger } from "../../shared/logger/endpoint";
import type { CreateApiEndpointAny } from "../../shared/types/endpoint-base";
import { Methods } from "../../shared/types/enums";
import { getRemoteSession } from "../auth/remote-session-cache";
import { scopedTranslation as cliScopedTranslation } from "../i18n";
import type { CliRequestData } from "./cli-request-data";

interface DecodedJwtPayload {
  id?: string;
  leadId?: string;
}

const LOGIN_PATH = "user/public/login";
const LOGOUT_PATH = "user/auth/logout";

function parseCookieFromSetCookie(
  setCookieHeader: string,
  cookieName: string,
): string | undefined {
  const cookies = setCookieHeader.split(/,\s*(?=[^;]*=)/);
  for (const cookie of cookies) {
    const match = cookie.match(new RegExp(`${cookieName}=([^;]*)`));
    if (match?.[1]) {
      return match[1];
    }
  }
  return undefined;
}

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
    };
  } catch {
    return null;
  }
}

async function bootstrapLeadId(
  host: string,
  logger: EndpointLogger,
): Promise<string | null> {
  try {
    const response = await fetch(host, { method: "GET", redirect: "manual" });

    const setCookie = response.headers.get("set-cookie");
    if (setCookie) {
      const leadId = parseCookieFromSetCookie(setCookie, LEAD_ID_COOKIE_NAME);
      if (leadId) {
        logger.debug(`[REMOTE] Bootstrapped leadId: ${leadId}`);
        return leadId;
      }
    }

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

/**
 * Handle login response: extract JWT from Set-Cookie, store in DB.
 */
async function handleLoginResponse(
  response: Response,
  host: string,
  userId: string,
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

  const payload = decodeJwtPayload(token);
  const leadId = leadIdFromCookie ?? payload?.leadId ?? "";

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + AUTH_TOKEN_COOKIE_MAX_AGE_DAYS);

  const { RemoteConnectionRepository } =
    await import("@/app/api/[locale]/user/remote-connection/repository");

  const result = await RemoteConnectionRepository.upsertRemoteConnection({
    userId,
    remoteUrl: host,
    token,
    leadId: leadId || undefined,
    logger,
  });

  if (result.success) {
    logger.info(`[REMOTE] Logged in to ${host} (userId: ${userId})`);
  } else {
    logger.error("[REMOTE] Failed to store session in DB after login");
  }
}

/** Response shape from the remote server */
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
   * Session is always read from remote_connections DB table.
   * userId is required — remote execution requires an authenticated local user.
   */
  static async execute(params: {
    endpoint: CreateApiEndpointAny;
    data: CliRequestData;
    locale: CountryLanguage;
    logger: EndpointLogger;
    remoteUrl: string;
    userId?: string;
  }): Promise<ResponseType<RemoteResponse["data"]>> {
    const { endpoint, data, locale, logger, remoteUrl, userId } = params;
    const { t } = cliScopedTranslation.scopedT(locale);
    const endpointPath = endpoint.path.join("/");
    const isLoginEndpoint = endpointPath === LOGIN_PATH;
    const isLogoutEndpoint = endpointPath === LOGOUT_PATH;

    // Resolve session from DB
    let resolvedToken: string | null = null;
    let resolvedLeadId: string | undefined;
    let resolvedRemoteUrl = remoteUrl;

    if (userId) {
      const dbSession = await getRemoteSession(userId);
      if (dbSession) {
        resolvedToken = dbSession.token;
        resolvedLeadId = dbSession.leadId || undefined;
        resolvedRemoteUrl = dbSession.remoteUrl;
        logger.debug("[REMOTE] Using DB session", { userId });
      }
    }

    // Non-login endpoints require an existing session
    if (!resolvedToken && !isLoginEndpoint) {
      return fail({
        message: t("vibe.errors.remoteNotLoggedIn"),
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      });
    }

    // Login: bootstrap leadId if we don't have one yet
    let leadId = resolvedLeadId ?? null;
    if (isLoginEndpoint && !leadId) {
      logger.info("[REMOTE] No leadId found, bootstrapping from remote...");
      leadId = await bootstrapLeadId(resolvedRemoteUrl, logger);
      if (!leadId) {
        return fail({
          message: t("vibe.errors.remoteNoLeadId"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }
    }

    const effectiveLeadId = resolvedLeadId ?? leadId ?? undefined;
    const token = resolvedToken ?? "";

    // Non-login/logout: delegate to shared executeRemote()
    if (!isLoginEndpoint && !isLogoutEndpoint) {
      return executeRemote<RemoteResponse["data"]>({
        definition: endpoint,
        data: data as RemoteCallData,
        token,
        leadId: effectiveLeadId,
        remoteUrl: resolvedRemoteUrl,
        locale,
        logger,
      });
    }

    // Login/logout: direct fetch to access raw Set-Cookie headers
    const url = buildRemoteUrl(
      resolvedRemoteUrl,
      locale,
      endpoint,
      data as RemoteCallData,
    );
    const headers = buildRemoteHeaders(token, effectiveLeadId);

    const response = await fetch(url, {
      method: endpoint.method,
      headers,
      body: endpoint.method === Methods.GET ? undefined : JSON.stringify(data),
      redirect: "manual",
    });

    if (isLoginEndpoint && response.ok && userId) {
      await handleLoginResponse(response, resolvedRemoteUrl, userId, logger);
    }

    if (isLogoutEndpoint && response.ok && userId) {
      const { db } = await import("@/app/api/[locale]/system/db");
      const { remoteConnections } =
        await import("@/app/api/[locale]/user/remote-connection/db");
      const { eq, and } = await import("drizzle-orm");
      await db
        .delete(remoteConnections)
        .where(
          and(
            eq(remoteConnections.userId, userId),
            eq(remoteConnections.remoteUrl, resolvedRemoteUrl),
          ),
        );

      logger.info(`[REMOTE] Logged out from ${resolvedRemoteUrl}`);
    }

    try {
      return (await response.json()) as ResponseType<RemoteResponse["data"]>;
    } catch {
      return fail({
        message: t("vibe.errors.remoteServerError"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
