/**
 * Next.js Middleware
 *
 * This file implements the middleware for the application.
 */

import type { NextRequest, NextResponse } from "next/server";

// we have to use relative paths as vercel cant resolve import aliases from here
import { middleware } from "./app/api/[locale]/system/middleware";
import type { languageDefaults } from "./i18n";
import type { CountryLanguage } from "./i18n/core/config";

const defaultLocale: `${typeof languageDefaults.language}-${typeof languageDefaults.country}` =
  "en-GLOBAL";

const supportedLocales: CountryLanguage[] = [
  "de-DE",
  "pl-PL",
  "en-GLOBAL",
  "en-US",
];

/**
 * Middleware implementation
 */
export async function proxy(request: NextRequest): Promise<NextResponse> {
  return await middleware(request, {
    supportedLocales,
    defaultLocale,
    allowMixedLocales: true,
  });
}

/**
 * Middleware configuration
 */
export const config = {
  matcher: [
    // Match all paths except static files and specific API routes
    "/",
    "/((?!_next/static|_next/image|image|images|favicon.ico|robots.txt|sitemap.xml|api/[^/]+/manifest).*)",
  ],
};
