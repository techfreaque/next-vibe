/**
 * Next.js Middleware
 *
 * This file implements the middleware for the application.
 */

import type { NextRequest, NextResponse } from "next/server";

// we have to use relative paths as vercel cant resolve import aliases from here
import { middleware } from "./app/api/[locale]/v1/core/system/middleware";
import type { languageDefaults } from "./i18n";
import type { Countries, CountryLanguage, Languages } from "./i18n/core/config";

const availableCountries: Countries[] = ["DE", "PL", "GLOBAL"];
const availableLanguages: Languages[] = ["de", "pl", "en"];
const defaultLocale: `${typeof languageDefaults.language}-${typeof languageDefaults.country}` =
  "en-GLOBAL";
const allSupportedLocales: CountryLanguage[] = [
  "de-DE",
  "pl-PL",
  "en-GLOBAL",
  "de-PL",
  "pl-DE",
  "pl-GLOBAL",
  "de-GLOBAL",
  "en-DE",
  "en-PL",
  "en-US",
  "de-US",
  "pl-US",
];

/**
 * Middleware implementation
 */
export async function proxy(request: NextRequest): Promise<NextResponse> {
  return await middleware(request, {
    supportedLocales: allSupportedLocales,
    defaultLocale,
    supportedLanguages: availableLanguages,
    supportedCountries: availableCountries,
    allowMixedLocales: true,
  });
}

/**
 * Middleware configuration
 */
export const config = {
  matcher: [
    // Match all paths except static files and API routes
    "/",
    "/((?!api|_next/static|_next/image|image|images|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
