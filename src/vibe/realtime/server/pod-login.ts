import {
  AUTH_TOKEN_COOKIE_NAME,
  BEARER_LEAD_ID_SEPARATOR,
} from "@/env/constants";

import { defaultLocale } from "../../core/i18n/core/config";
import type { EndpointLogger } from "../../logger/types";
import {
  extractLocaleFromPath,
  V1_API_PATH_REGEX,
} from "../../platforms/web/middleware/utils";

/** The login form, its two endpoints, and the assets needed to render it. */
export function isPodLoginResource(method: string, path: string): boolean {
  if (method === "POST") {
    return /^\/api\/[a-z]{2}-[A-Z]+\/user\/public\/(?:login|verify-email)$/.test(
      path,
    );
  }
  if (method !== "GET" && method !== "HEAD") {
    return false;
  }
  return (
    /^\/[a-z]{2}-[A-Z]+\/user\/login$/.test(path) ||
    /^\/[a-z]{2}-[A-Z]+\/user\/verify-email\/[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(
      path,
    ) ||
    /^\/api\/[a-z]{2}-[A-Z]+\/user\/public\/login\/options$/.test(path) ||
    path.startsWith("/_next/static/") ||
    path === "/favicon.ico" ||
    path === "/logo.png"
  );
}

/** Runs before proxying HTTP or upgrading a public socket. */
export async function requirePodLogin(
  req: Request,
  url: URL,
  logger: EndpointLogger,
  loopback = false,
): Promise<Response | null> {
  const path = url.pathname;
  const upgrade = req.headers.has("upgrade");
  if (upgrade && path !== "/ws") {
    return new Response(null, { status: 403 });
  }
  if (!upgrade && isPodLoginResource(req.method, path)) {
    return null;
  }
  if (V1_API_PATH_REGEX.test(path)) {
    const { ApiKeyAuth } = await import("@/api-keys/auth");
    const key = await ApiKeyAuth.keyForRequest(req, logger);
    if (key.status === "ok") {
      return null;
    }
    return new Response(null, {
      status: key.status === "unavailable" ? 503 : 401,
    });
  }
  const bearer = req.headers.get("authorization");
  const cookie = new Bun.CookieMap(req.headers.get("cookie") ?? "").get(
    AUTH_TOKEN_COOKIE_NAME,
  );
  const socketToken =
    upgrade && path === "/ws" ? url.searchParams.get("token") : null;
  const token = bearer?.startsWith("Bearer ")
    ? bearer.slice(7).split(BEARER_LEAD_ID_SEPARATOR)[0]
    : (cookie ?? socketToken);
  if (token) {
    const { AuthRepository, isAccountSuspended } =
      await import("../../identity/auth/repository");
    const jwt = await AuthRepository.verifyJwt(token, logger, defaultLocale);
    // The app signs a fresh token for its own loopback hub connection.
    // This internal token has no browser session row.
    if (
      jwt.success &&
      loopback &&
      socketToken === token &&
      !cookie &&
      !bearer &&
      jwt.data.leadId === url.searchParams.get("leadId") &&
      !(await isAccountSuspended(jwt.data.id))
    ) {
      return null;
    }
    if (
      jwt.success &&
      (await AuthRepository.validateSession(
        token,
        jwt.data.id,
        defaultLocale,
        logger,
      ))
    ) {
      return null;
    }
  }
  if (upgrade || path.startsWith("/api/") || req.method !== "GET") {
    return new Response(null, { status: 401 });
  }
  const locale = extractLocaleFromPath(path) ?? defaultLocale;
  const callback = new URLSearchParams({ callbackUrl: path + url.search });
  return new Response(null, {
    status: 303,
    headers: {
      location: `/${locale}/user/login?${callback.toString()}`,
      "cache-control": "no-store",
    },
  });
}
