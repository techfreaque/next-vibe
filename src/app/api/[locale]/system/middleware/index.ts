/**
 * Next-Vibe Middleware System
 *
 * This file exports the middleware system for Next.js applications.
 */

import type { NextRequest, NextResponse } from "next/server";
import { NextResponse as NextResponseClass } from "next/server";

import type { CountryLanguage } from "@/i18n/core/config";

import type { LanguageMiddlewareOptions } from "./language";
import { detectLocale } from "./language";
import {
  checkLeadId,
  createLeadId,
  getLeadIdFromRequest,
  LeadIdCheckResult,
  updateLeadLocale,
} from "./lead-id";
import { extractLocaleFromPath, shouldSkipPath } from "./utils";

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

  // Step 1: Handle language detection and redirection
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

    return NextResponseClass.redirect(new URL(newPath, request.url));
  }

  // Step 2: Extract locale from path for leadId middleware
  const locale =
    (extractLocaleFromPath(path) as CountryLanguage) || options.defaultLocale;

  // Step 4: Handle leadId tracking
  const leadIdCheck = await checkLeadId(request);

  if (leadIdCheck === LeadIdCheckResult.SKIP) {
    return NextResponseClass.next();
  }

  if (
    leadIdCheck === LeadIdCheckResult.INVALID ||
    leadIdCheck === LeadIdCheckResult.MISSING
  ) {
    const isApiRoute = path.startsWith("/api/");

    if (isApiRoute) {
      // For API routes with invalid or missing leadId, return auth error
      return NextResponseClass.json(
        {
          error: "invalid_identity",
          message: "Could not verify identity. Invalid or expired session.",
        },
        { status: 401 },
      );
    }

    // For page routes, create a new leadId and set it in the cookie
    return await createLeadId(request, locale);
  }

  // Valid leadId — sync lead locale if it changed
  const leadLocale = request.cookies.get("lead_locale")?.value;
  if (leadLocale !== locale) {
    const leadId = getLeadIdFromRequest(request);
    if (leadId) {
      // Fire-and-forget DB update — don't block the request
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
    return response;
  }

  // Valid leadId and session, continue
  return NextResponseClass.next();
}
