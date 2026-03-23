/**
 * Next-Vibe Middleware System
 *
 * This file exports the middleware system for Next.js applications.
 */

import type { NextRequest, NextResponse } from "next-vibe-ui/lib/request";
import { NextResponse as NextResponseClass } from "next-vibe-ui/lib/request";
import { Environment } from "next-vibe/shared/utils";

import {
  AUTH_TOKEN_COOKIE_NAME,
  CSRF_TOKEN_COOKIE_NAME,
  LEAD_ID_COOKIE_NAME,
} from "@/config/constants";
import { env } from "@/config/env";
import type { CountryLanguage } from "@/i18n/core/config";

import type { LanguageMiddlewareOptions } from "./language";
import { detectLocale } from "./language";
import {
  checkLeadId,
  createLeadId,
  getLeadIdFromRequest,
  isLeadIdValid,
  LeadIdCheckResult,
  redeemExchangeToken,
  updateLeadLocale,
  UUID_REGEX,
} from "./lead-id";
import { extractLocaleFromPath, shouldSkipPath } from "./utils";

/**
 * Add CORS headers to API responses so cross-origin clients (e.g. a local
 * instance connecting to the cloud) can read the response body and headers.
 */
function addCorsHeaders(
  request: NextRequest,
  response: NextResponse,
  path: string,
): void {
  if (!path.startsWith("/api/")) {
    return;
  }
  const origin = request.headers.get("origin") ?? "*";
  response.headers.set("Access-Control-Allow-Origin", origin);
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-CSRF-Token",
  );
  response.headers.set("Access-Control-Allow-Credentials", "true");
}

/**
 * Ensure a CSRF double-submit cookie is present on every page/API response.
 * The cookie is NOT HttpOnly so client-side JS can read it and echo it as the
 * X-CSRF-Token request header. The server validates header === cookie.
 *
 * We reuse an existing token if valid; otherwise mint a fresh one.
 */
function stampCsrfCookie(request: NextRequest, response: NextResponse): void {
  const existing = request.cookies.get(CSRF_TOKEN_COOKIE_NAME)?.value;
  const token =
    existing && existing.length >= 32
      ? existing
      : crypto.randomUUID().replace(/-/g, "");

  response.cookies.set({
    name: CSRF_TOKEN_COOKIE_NAME,
    value: token,
    httpOnly: false, // Must be readable by JS for the double-submit pattern
    path: "/",
    secure: env.NODE_ENV === Environment.PRODUCTION,
    sameSite: "strict" as const,
    maxAge: 24 * 60 * 60, // 1 day - refreshed on every request
  });
}

/**
 * Main middleware function that handles both language detection and leadId tracking
 *
 * @param request The incoming request
 * @param options Language middleware options
 * @returns Response with appropriate redirects and cookies set
 */
export async function middleware(
  request: NextRequest,
  options: LanguageMiddlewareOptions,
): Promise<NextResponse> {
  const path = request.nextUrl.pathname;

  // Skip for static files
  if (shouldSkipPath(path)) {
    return NextResponseClass.next();
  }

  // CORS preflight for API routes - needed so cross-origin clients (e.g. a
  // local instance calling the cloud login endpoint) can complete the request.
  if (request.method === "OPTIONS" && path.startsWith("/api/")) {
    return new NextResponseClass(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          "GET, POST, PUT, PATCH, DELETE, OPTIONS",
        "Access-Control-Allow-Headers":
          "Content-Type, Authorization, X-CSRF-Token, Cookie",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  // Step 1: Strip bare "/en/" prefix hallucinated by AI tools in local testing.
  // Redirect to the path without it so normal locale detection takes over.
  // Skipped in production - this only happens during local dev/testing.
  if (env.NODE_ENV !== Environment.PRODUCTION) {
    const pathParts = path.split("/").filter(Boolean);
    const isApiRoute = pathParts[0] === "api";
    const bareSegment = isApiRoute ? pathParts[1] : pathParts[0];
    if (bareSegment === "en") {
      let stripped: string;
      if (isApiRoute) {
        // /api/en/foo -> /api/foo
        stripped = `/api/${pathParts.slice(2).join("/")}`;
      } else {
        // /en/foo -> /foo
        stripped = `/${pathParts.slice(1).join("/")}`;
      }
      const redirectUrl = new URL(stripped || "/", request.url);
      redirectUrl.search = request.nextUrl.search;
      return NextResponseClass.redirect(redirectUrl);
    }
  }

  // Step 2: Handle language detection and redirection
  const detectedLocale = detectLocale(request, options);

  // If we need to redirect for locale, do it now
  if (detectedLocale) {
    let newPath: string;

    // Handle API routes: /api/... -> /api/[locale]/...
    if (path.startsWith("/api/") || path === "/api") {
      const apiPath = path === "/api" ? "" : path.slice(4); // Remove "/api"
      newPath = `/api/${detectedLocale}${apiPath}`;
    }
    // Handle root path: / -> /[locale]
    else if (path === "/") {
      newPath = `/${detectedLocale}`;
    }
    // Handle regular paths: /... -> /[locale]/...
    else {
      newPath = `/${detectedLocale}${path}`;
    }

    const redirectUrl = new URL(newPath, request.url);
    redirectUrl.search = request.nextUrl.search;
    return NextResponseClass.redirect(redirectUrl);
  }

  // Step 2: Extract locale from path for leadId middleware
  const locale =
    (extractLocaleFromPath(path) as CountryLanguage) || options.defaultLocale;

  // Step 3: Frame routes - redeem exchange token (?et=) before any lead check.
  // The embed script called the config API (credentials: include), which minted
  // a short-lived token encoding lead_id + optional auth JWT. We redeem it here,
  // set the real httpOnly cookies, then pass through - no redirect needed.
  if (path.includes("/frame/")) {
    const et = request.nextUrl.searchParams.get("et");
    if (et) {
      const payload = await redeemExchangeToken(et);
      if (payload) {
        const response = NextResponseClass.next();
        // Only set leadId cookie if the token carried one.
        // If leadId is null, fall through - the leadId check below creates a new lead.
        if (payload.leadId) {
          response.cookies.set({
            name: LEAD_ID_COOKIE_NAME,
            value: payload.leadId,
            httpOnly: true,
            path: "/",
            secure: env.NODE_ENV === Environment.PRODUCTION,
            sameSite: "none" as const, // Required for cross-origin iframes
            maxAge: 365 * 24 * 60 * 60 * 10,
          });
        }
        if (payload.authToken) {
          response.cookies.set({
            name: AUTH_TOKEN_COOKIE_NAME,
            value: payload.authToken,
            httpOnly: true,
            path: "/",
            secure: env.NODE_ENV === Environment.PRODUCTION,
            sameSite: "none" as const, // Required for cross-origin iframes
            maxAge: 30 * 24 * 60 * 60, // 30 days
          });
        }
        // If we set a leadId cookie, we're done - skip the leadId check
        if (payload.leadId) {
          stampCsrfCookie(request, response);
          return response;
        }
        // No leadId in token - fall through to lead creation below
      }
      // Invalid/expired token or missing leadId - fall through to normal lead creation below
    }
  }

  // Step 4: Handle leadId tracking
  const leadIdCheck = await checkLeadId(request);

  if (leadIdCheck === LeadIdCheckResult.SKIP) {
    const res = NextResponseClass.next();
    stampCsrfCookie(request, res);
    addCorsHeaders(request, res, path);
    return res;
  }

  if (
    leadIdCheck === LeadIdCheckResult.INVALID ||
    leadIdCheck === LeadIdCheckResult.MISSING
  ) {
    const isApiRoute = path.startsWith("/api/");

    if (isApiRoute) {
      // If the request carries a Bearer token, the JWT inside already contains
      // a leadId - the route handler will authenticate via the token. Pass through.
      const authHeader = request.headers.get("authorization");
      if (authHeader?.startsWith("Bearer ")) {
        const bearerResp = NextResponseClass.next();
        stampCsrfCookie(request, bearerResp);
        addCorsHeaders(request, bearerResp, path);
        return bearerResp;
      }

      // The public login endpoint must work without a pre-existing lead_id
      // (cross-origin remote-connect clients have no cookie). Create one on
      // the fly and pass through - do NOT redirect (that would drop the body).
      if (path.includes("/user/public/login")) {
        const newLead = await createLeadId(request, locale);
        const newLeadId = newLead.cookies.get(LEAD_ID_COOKIE_NAME)?.value;
        const loginResp = NextResponseClass.next();
        if (newLeadId) {
          loginResp.cookies.set({
            name: LEAD_ID_COOKIE_NAME,
            value: newLeadId,
            httpOnly: true,
            path: "/",
            secure: env.NODE_ENV === Environment.PRODUCTION,
            sameSite: "lax" as const,
            maxAge: 365 * 24 * 60 * 60 * 10,
          });
        }
        stampCsrfCookie(request, loginResp);
        addCorsHeaders(request, loginResp, path);
        return loginResp;
      }

      // All other API routes with invalid or missing leadId: auth error
      const origin = request.headers.get("origin") ?? "*";
      return NextResponseClass.json(
        {
          error: "invalid_identity",
          message: "Could not verify identity. Invalid or expired session.",
        },
        {
          status: 401,
          headers: {
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Credentials": "true",
          },
        },
      );
    }

    // For page routes: check if a valid leadId is provided in the URL query params.
    // This allows email links (e.g. unsubscribe) to restore the lead session
    // without creating a new lead. The leadId must be a valid UUID that exists in DB.
    const urlLeadId = request.nextUrl.searchParams.get("id");
    if (
      urlLeadId &&
      UUID_REGEX.test(urlLeadId) &&
      (await isLeadIdValid(urlLeadId))
    ) {
      const urlLeadResp = NextResponseClass.next();
      urlLeadResp.cookies.set({
        name: LEAD_ID_COOKIE_NAME,
        value: urlLeadId,
        httpOnly: true,
        path: "/",
        secure: env.NODE_ENV === Environment.PRODUCTION,
        sameSite: "lax" as const,
        maxAge: 365 * 24 * 60 * 60 * 10,
      });
      stampCsrfCookie(request, urlLeadResp);
      addCorsHeaders(request, urlLeadResp, path);
      return urlLeadResp;
    }

    // For page routes (including /frame/ without valid et), create a new leadId.
    // Frame routes: redirect is OK here because the iframe will reload with the
    // cookie set - browser follows the redirect transparently.
    const leadIdResp = await createLeadId(request, locale);
    addCorsHeaders(request, leadIdResp, path);
    return leadIdResp;
  }

  // Valid leadId - sync lead locale if it changed
  const leadLocale = request.cookies.get("lead_locale")?.value;
  if (leadLocale !== locale) {
    const leadId = getLeadIdFromRequest(request);
    if (leadId) {
      // Fire-and-forget DB update - don't block the request
      // eslint-disable-next-line no-empty-function -- Fire-and-forget: best-effort locale sync
      void updateLeadLocale(leadId, locale).catch(() => {});
    }
    const response = NextResponseClass.next();
    response.cookies.set("lead_locale", locale, {
      path: "/",
      httpOnly: true,
      sameSite: "lax" as const,
      maxAge: 365 * 24 * 60 * 60 * 10, // 10 years
    });
    stampCsrfCookie(request, response);
    addCorsHeaders(request, response, path);
    return response;
  }

  // Valid leadId and session, continue
  const finalResponse = NextResponseClass.next();
  stampCsrfCookie(request, finalResponse);
  addCorsHeaders(request, finalResponse, path);
  return finalResponse;
}
