/**
 * Remote Connection Connect Repository
 *
 * Handles the remote login flow:
 * 1. Bootstrap a leadId from the remote host
 * 2. POST credentials to remote login endpoint
 * 3. Extract JWT from Set-Cookie response
 * 4. Store connection in DB
 */

/* eslint-disable i18next/no-literal-string */

import "server-only";

import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import {
  AUTH_TOKEN_COOKIE_NAME,
  LEAD_ID_COOKIE_NAME,
} from "@/config/constants";
import { defaultLocale } from "@/i18n/core/config";

import { upsertRemoteConnection } from "../repository";
import type { RemoteConnectPostRequestInput } from "./definition";
import type { RemoteConnectT } from "./i18n";

/** Shape of a decoded JWT payload (only the fields we care about) */
interface DecodedJwtPayload {
  id?: string;
  leadId?: string;
}

/**
 * Parse a cookie value from a Set-Cookie header string.
 */
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

/**
 * Decode a JWT payload without verification (we only need the userId/leadId).
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
    };
  } catch {
    return null;
  }
}

/**
 * Bootstrap a leadId from a remote host by hitting the root page.
 * The middleware creates a lead and sets the cookie on the 302 response.
 */
async function bootstrapLeadId(
  remoteUrl: string,
  logger: EndpointLogger,
): Promise<string | null> {
  try {
    const response = await fetch(remoteUrl, {
      method: "GET",
      redirect: "manual",
    });

    const setCookie = response.headers.get("set-cookie");
    if (setCookie) {
      const leadId = parseCookieFromSetCookie(setCookie, LEAD_ID_COOKIE_NAME);
      if (leadId) {
        logger.debug(`[CONNECT] Bootstrapped leadId: ${leadId}`);
        return leadId;
      }
    }

    const location = response.headers.get("location");
    if (location) {
      const redirectUrl = location.startsWith("http")
        ? location
        : `${remoteUrl}${location}`;
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
          logger.debug(
            `[CONNECT] Bootstrapped leadId from redirect: ${leadId}`,
          );
          return leadId;
        }
      }
    }

    logger.warn("[CONNECT] Could not bootstrap leadId from remote host");
    return null;
  } catch (error) {
    logger.error(`[CONNECT] Failed to bootstrap leadId: ${String(error)}`);
    return null;
  }
}

/**
 * Connect to a remote instance: bootstrap leadId, login, store JWT in DB.
 */
export async function connectRemote(
  data: RemoteConnectPostRequestInput,
  user: JwtPrivatePayloadType,
  logger: EndpointLogger,
  t: RemoteConnectT,
): Promise<ResponseType<{ remoteUrlResult: string; isConnected: boolean }>> {
  const { remoteUrl, email, password, instanceId, friendlyName } = data;

  // 1. Bootstrap leadId from remote host
  logger.info("[CONNECT] Bootstrapping leadId from remote...");
  const leadId = await bootstrapLeadId(remoteUrl, logger);

  if (!leadId) {
    return fail({
      message: t("post.errors.noLeadId.title"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }

  // 2. POST login to remote
  const loginUrl = `${remoteUrl}/api/${defaultLocale}/user/public/login`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Cookie: `${LEAD_ID_COOKIE_NAME}=${leadId}`,
  };

  logger.info(`[CONNECT] Logging in to remote: ${loginUrl}`);

  let loginResponse: Response;
  try {
    loginResponse = await fetch(loginUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({ email, password, rememberMe: true }),
      redirect: "manual",
    });
  } catch (error) {
    logger.error(`[CONNECT] Login fetch failed: ${String(error)}`);
    return fail({
      message: t("post.errors.network.title"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }

  if (!loginResponse.ok && loginResponse.status !== 302) {
    logger.warn(
      `[CONNECT] Remote login returned status ${loginResponse.status.toString()}`,
    );

    if (loginResponse.status === 401) {
      return fail({
        message: t("post.errors.unauthorized.title"),
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      });
    }

    if (loginResponse.status === 403) {
      return fail({
        message: t("post.errors.forbidden.title"),
        errorType: ErrorResponseTypes.FORBIDDEN,
      });
    }

    if (loginResponse.status === 404) {
      return fail({
        message: t("post.errors.notFound.title"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    return fail({
      message: t("post.errors.server.title"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }

  // 3. Extract JWT from Set-Cookie header
  const setCookie = loginResponse.headers.get("set-cookie");
  if (!setCookie) {
    logger.warn("[CONNECT] Login succeeded but no Set-Cookie header");
    return fail({
      message: t("post.errors.server.title"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }

  const token = parseCookieFromSetCookie(setCookie, AUTH_TOKEN_COOKIE_NAME);
  const leadIdFromCookie = parseCookieFromSetCookie(
    setCookie,
    LEAD_ID_COOKIE_NAME,
  );

  if (!token) {
    logger.warn("[CONNECT] Login succeeded but no token in Set-Cookie");
    return fail({
      message: t("post.errors.server.title"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }

  const payload = decodeJwtPayload(token);
  const effectiveLeadId = leadIdFromCookie ?? payload?.leadId ?? leadId;

  // 4. Store in DB
  const storeResult = await upsertRemoteConnection({
    userId: user.id,
    remoteUrl,
    token,
    leadId: effectiveLeadId,
    instanceId: instanceId ?? "hermes",
    friendlyName: friendlyName ?? instanceId ?? "hermes",
    logger,
  });

  if (!storeResult.success) {
    return fail({
      message: t("post.errors.server.title"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }

  logger.info(`[CONNECT] Successfully connected to ${remoteUrl}`, {
    userId: user.id,
  });

  return {
    success: true,
    data: { remoteUrlResult: remoteUrl, isConnected: true },
  };
}
