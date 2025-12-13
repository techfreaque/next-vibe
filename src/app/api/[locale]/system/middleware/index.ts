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
import { checkLeadId, createLeadId } from "./lead-id";
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

  // Step 3: Handle leadId tracking
  const leadIdCheck = checkLeadId(request);

  // If we should skip leadId handling, continue
  if (leadIdCheck === "skip") {
    return NextResponseClass.next();
  }

  // If leadId needs to be created, create it
  if (leadIdCheck === null) {
    return await createLeadId(request, locale);
  }

  // Otherwise continue
  return NextResponseClass.next();
}
