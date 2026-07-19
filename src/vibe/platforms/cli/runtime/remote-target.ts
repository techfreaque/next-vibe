/**
 * CLI remote target — the `--thea` / `--hermes` leg.
 *
 * Everything the CLI does when `cliTarget === REMOTE`: HTTP dispatch to another
 * instance, the remote session/cookie dance, and remote login bookkeeping.
 *
 * WHY IT IS A SEPARATE FILE
 * This is the ONLY reason the CLI runtime reaches remote-connection (repository,
 * db rows) and the database. A CLI that only ever runs endpoints in-process —
 * the local/dev targets — needs none of it.
 *
 * Keeping it behind one module means a local-only build swaps ./route-executor's
 * single import for ./remote-target-local and drops this file, taking the
 * remote-connection and DB dependency surface with it.
 */

import { makeHeadlessContext } from "next-vibe/agent/chat/config";
import type { CreateApiEndpointAny } from "next-vibe/core/definition/endpoint-base";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import { ErrorResponseTypes, fail } from "next-vibe/core/route/response.schema";
import type { WidgetData } from "next-vibe/core/utils/json";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { Platform } from "next-vibe/platforms/platforms";

import { AUTH_TOKEN_COOKIE_NAME, LEAD_ID_COOKIE_NAME } from "@/env/constants";

// ── Remote endpoint execution ──────────────────────────────────────────────────
//
// Login/logout use raw fetch to access Set-Cookie headers.
// Everything else goes through RouteExecuteRepository.runInProcess with the instanceId
// from the DB session, which handles direct-http and reverse-ws transports uniformly.

const LOGIN_PATH = "user/public/login";
const LOGOUT_PATH = "user/auth/logout";

interface RemoteEndpointResponse {
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

export async function executeRemoteEndpoint(params: {
  endpoint: CreateApiEndpointAny;
  data: Record<string, WidgetData>;
  urlPathParams?: Record<string, string | number | boolean | null | undefined>;
  locale: CountryLanguage;
  logger: EndpointLogger;
  remoteUrl: string;
  userId: string | undefined;
  user: JwtPayloadType;
  signal: AbortSignal;
  platform: Platform;
}): Promise<ResponseType<WidgetData>> {
  const {
    endpoint,
    data,
    urlPathParams,
    locale,
    logger,
    remoteUrl,
    userId,
    user,
    signal,
    platform,
  } = params;
  const { scopedTranslation: cliT } =
    await import("next-vibe/platforms/cli/i18n");
  const { t } = cliT.scopedT(locale);

  const endpointPath = endpoint.path.join("/");
  const isLoginEndpoint = endpointPath === LOGIN_PATH;
  const isLogoutEndpoint = endpointPath === LOGOUT_PATH;

  const { getRemoteSession } =
    await import("next-vibe/platforms/cli/auth/remote-session-cache");
  const { Methods } = await import("next-vibe/core/definition/enums");
  const { BEARER_LEAD_ID_SEPARATOR } = await import("@/env/constants");

  // Resolve session from DB
  let resolvedToken: string | null = null;
  let resolvedLeadId: string | null = null;
  let resolvedRemoteUrl = remoteUrl;
  let resolvedInstanceId: string | null = null;

  if (userId) {
    const dbSession = await getRemoteSession(userId);
    if (dbSession) {
      resolvedToken = dbSession.token;
      resolvedLeadId = dbSession.leadId;
      resolvedRemoteUrl = dbSession.remoteUrl;
      resolvedInstanceId = dbSession.instanceId;
    }
  }

  if (!resolvedToken && !isLoginEndpoint) {
    return fail({
      message: t("vibe.errors.remoteNotLoggedIn"),
      errorType: ErrorResponseTypes.UNAUTHORIZED,
    });
  }

  // Login: bootstrap leadId from remote host if we don't have one
  let leadId: string | null = resolvedLeadId;
  if (isLoginEndpoint && !leadId) {
    leadId = await bootstrapRemoteLeadId(resolvedRemoteUrl, logger);
    if (!leadId) {
      return fail({
        message: t("vibe.errors.remoteNoLeadId"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  if (!leadId) {
    return fail({
      message: t("vibe.errors.remoteNoLeadId"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }

  const effectiveLeadId = leadId;
  const token = resolvedToken ?? "";

  // Non-login/logout: all tool calls go through the unified execute-tool repository.
  // RouteExecuteRepository.runInProcess handles routing rule resolution, direct-http and
  // reverse-ws transports, all callback modes, platform-based permission gating, and
  // long-running task creation.
  if (!isLoginEndpoint && !isLogoutEndpoint) {
    if (userId && resolvedInstanceId) {
      const { createEndpointLogger } = await import("next-vibe/logger/server");
      const transportLogger = createEndpointLogger(false, locale);
      const { RouteExecuteRepository } =
        await import("next-vibe/execute-tool/repository");
      return RouteExecuteRepository.runInProcessTyped({
        definition: endpoint,
        input: data,
        urlPathParams,
        instanceId: resolvedInstanceId,
        callbackMode: "wait",
        user,
        locale,
        logger: transportLogger,
        // no user context — UTC (dates not user-facing here)
        toolExecutionContext: makeHeadlessContext(signal, undefined, "UTC"),
        platform,
      });
    }
    return fail({
      message: t("vibe.errors.remoteNotLoggedIn"),
      errorType: ErrorResponseTypes.UNAUTHORIZED,
    });
  }

  // Login/logout: direct fetch to access raw Set-Cookie headers. This is an
  // auth-bootstrap call (no session/instanceId exists yet at login, and we need
  // the raw Set-Cookie response) — the one place that legitimately bypasses the
  // unified runInProcessTyped path.
  const loginPath = endpoint.path.join("/");
  let url = `${resolvedRemoteUrl}/api/${locale}/${loginPath}`;
  if (endpoint.method === Methods.GET) {
    const u = new URL(`/api/${locale}/${loginPath}`, resolvedRemoteUrl);
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && value !== null) {
        u.searchParams.set(
          key,
          typeof value === "object" ? JSON.stringify(value) : String(value),
        );
      }
    }
    url = u.toString();
  }
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}${BEARER_LEAD_ID_SEPARATOR}${effectiveLeadId}`,
  };

  // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- auth-bootstrap: login/logout needs the raw Set-Cookie response and runs before any session/instanceId exists (see comment above)
  const response = await fetch(url, {
    method: endpoint.method,
    headers,
    body: endpoint.method === Methods.GET ? undefined : JSON.stringify(data),
    redirect: "manual",
  });

  if (isLoginEndpoint && response.ok && userId) {
    await handleRemoteLoginResponse(
      response,
      resolvedRemoteUrl,
      userId,
      logger,
    );
  }

  if (isLogoutEndpoint && response.ok && userId) {
    const { db } = await import("next-vibe/database");
    const { remoteConnections } =
      await import("next-vibe/remote-connection/db");
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
    return (await response.json()) as ResponseType<
      RemoteEndpointResponse["data"]
    >;
  } catch {
    return fail({
      message: t("vibe.errors.remoteServerError"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
}

function parseSetCookie(
  setCookieHeader: string,
  name: string,
): string | undefined {
  const cookies = setCookieHeader.split(/,\s*(?=[^;]*=)/);
  for (const cookie of cookies) {
    const match = cookie.match(new RegExp(`${name}=([^;]*)`));
    if (match?.[1]) {
      return match[1];
    }
  }
  return undefined;
}

async function bootstrapRemoteLeadId(
  host: string,
  logger: EndpointLogger,
): Promise<string | null> {
  try {
    // auth-bootstrap: reads the raw Set-Cookie lead_id before any session exists;
    // must hit the wire, cannot go through the typed/in-process path.
    // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- lead-id bootstrap (raw Set-Cookie, pre-session)
    const response = await fetch(host, { method: "GET", redirect: "manual" });
    const setCookie = response.headers.get("set-cookie");
    if (setCookie) {
      const leadId = parseSetCookie(setCookie, LEAD_ID_COOKIE_NAME);
      if (leadId) {
        return leadId;
      }
    }
    const location = response.headers.get("location");
    if (location) {
      const redirectUrl = location.startsWith("http")
        ? location
        : `${host}${location}`;
      // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- lead-id bootstrap: follow redirect to read raw Set-Cookie (pre-session)
      const redirectResponse = await fetch(redirectUrl, {
        method: "GET",
        redirect: "manual",
      });
      const redirectCookie = redirectResponse.headers.get("set-cookie");
      if (redirectCookie) {
        const leadId = parseSetCookie(redirectCookie, LEAD_ID_COOKIE_NAME);
        if (leadId) {
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

async function handleRemoteLoginResponse(
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

  const token = parseSetCookie(setCookie, AUTH_TOKEN_COOKIE_NAME);
  const leadId = parseSetCookie(setCookie, LEAD_ID_COOKIE_NAME);

  if (!token) {
    logger.error("[REMOTE] Login succeeded but no token in Set-Cookie");
    return;
  }
  if (!leadId) {
    logger.error("[REMOTE] Login succeeded but no leadId in Set-Cookie");
    return;
  }

  const { RemoteConnectionRepository } =
    await import("next-vibe/remote-connection/repository");
  // CLI login flow (vibe --thea/--hermes) has no user-decided sync scope to
  // carry - unlike the connect endpoint's request body. Omitting it here
  // makes the repository carry forward the existing row's scope on a
  // reconnect, only falling back to the schema's baseline for a genuinely
  // first-ever row - never a value fabricated at this call site.
  const result = await RemoteConnectionRepository.upsertRemoteConnection({
    userId,
    remoteUrl: host,
    token,
    leadId,
    logger,
  });

  if (result.success) {
    logger.info(`[REMOTE] Logged in to ${host} (userId: ${userId})`);
  } else {
    logger.error("[REMOTE] Failed to store session in DB after login");
  }
}
