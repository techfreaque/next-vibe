/**
 * Next.js Middleware
 *
 * This file implements the middleware for the application using the next-vibe middleware system.
 */

import type { NextRequest, NextResponse } from "next/server";

// we have to use relative paths as vercel cant resolve import aliases from here
import {
  createLanguageMiddleware,
  createMiddleware,
} from "./app/api/[locale]/v1/core/system/middleware";
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
];

/**
 * Middleware implementation
 */
export async function proxy(request: NextRequest): Promise<NextResponse> {
  return await composedMiddleware(request);
}

/**
 * Create the composed middleware function
 */
const composedMiddleware = createMiddleware([
  // Language detection and redirection with country-language format
  createLanguageMiddleware({
    supportedLocales: allSupportedLocales,
    defaultLocale,
    supportedLanguages: availableLanguages,
    supportedCountries: availableCountries,
    allowMixedLocales: true, // Enable support for mixed language-country combinations
    excludePaths: ["/_next/"],
  }),
]);

/**
 * Middleware configuration
 */
export const config = {
  matcher: [
    // Match all API routes
    "/api/:locale/v1/:path*",
    // Match all paths except static files and API routes
    "/",
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
