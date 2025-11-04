/**
 * Language Middleware
 *
 * This middleware handles language detection and redirection.
 */

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import type { CountryLanguage } from "@/i18n/core/config";

import { LOCALE_COOKIE_NAME } from "@/config/constants";
import type { MiddlewareFunction, MiddlewareHandler } from "../core/types";

export interface LanguageMiddlewareOptions {
  /**
   * Supported country-language combinations
   */
  supportedLocales: CountryLanguage[];

  /**
   * Default country-language to use if no locale is detected
   */
  defaultLocale: CountryLanguage;

  /**
   * Supported languages (e.g., ['en', 'de', 'fr'])
   */
  supportedLanguages?: string[];

  /**
   * Supported countries (e.g., ['us', 'de', 'fr'])
   */
  supportedCountries?: string[];

  /**
   * Allow mixed locale combinations like 'de-PL'
   */
  allowMixedLocales?: boolean;

  /**
   * Cookie name for storing the preferred locale
   */
  cookieName?: string;

  /**
   * Paths to exclude from locale detection
   */
  excludePaths?: (string | RegExp)[];
}

/**
 * Creates a language middleware handler
 *
 * @param options Language middleware options
 * @returns A middleware handler
 */
export function createLanguageMiddleware(
  options: LanguageMiddlewareOptions,
): MiddlewareHandler {
  const {
    supportedLocales,
    defaultLocale,
    supportedLanguages = [],
    supportedCountries = [],
    allowMixedLocales = false,
    cookieName = LOCALE_COOKIE_NAME,
    excludePaths = [],
  } = options;

  // Create a combined set of supported locales
  const allSupportedLocales = [...supportedLocales];

  // If mixed locales are allowed, add all possible language-country combinations
  if (
    allowMixedLocales &&
    supportedLanguages.length > 0 &&
    supportedCountries.length > 0
  ) {
    for (const lang of supportedLanguages) {
      for (const country of supportedCountries) {
        const mixedLocale = `${lang}-${country}` as CountryLanguage;
        if (!allSupportedLocales.includes(mixedLocale)) {
          allSupportedLocales.push(mixedLocale);
        }
      }
    }
  }

  const handler: MiddlewareFunction = (request: NextRequest) => {
    const path = request.nextUrl.pathname;

    // Skip for excluded paths
    for (const excludePath of excludePaths) {
      if (
        (typeof excludePath === "string" && path.startsWith(excludePath)) ||
        (excludePath instanceof RegExp && excludePath.test(path))
      ) {
        return NextResponse.next();
      }
    }

    // Skip for static files, images, and Next.js internals
    if (
      path.includes("/_next/") ||
      path.includes("/static/") ||
      path.includes("/images/") ||
      path.match(/\\.(ico|png|jpg|jpeg|svg|css|js|woff|woff2|ttf|eot)$/) ||
      path === "/favicon.ico" ||
      path === "/robots.txt" ||
      path === "/sitemap.xml"
    ) {
      return NextResponse.next();
    }

    // Check if the path already has a locale prefix
    const pathParts = path.split("/").filter(Boolean);
    const pathFirstPart = pathParts[0] || "";

    // Check if the path starts with a valid locale
    const isValidLocalePrefix =
      pathFirstPart &&
      allSupportedLocales.some((locale) => {
        const normalizedLocale = locale.toLowerCase();
        const normalizedPathPart = pathFirstPart.toLowerCase();
        return normalizedPathPart === normalizedLocale;
      });

    // If the path already has a valid locale prefix, continue without any redirection
    if (isValidLocalePrefix) {
      return NextResponse.next();
    }

    // Only perform locale detection if there's no locale in the URL
    // First check for user's preferred locale from cookie
    const cookieLocale = request.cookies.get(cookieName)?.value;

    // Check if cookie locale is valid (it's in our supported locales or a valid mixed locale)
    let validCookieLocale = false;
    if (cookieLocale) {
      // Check if it's in our standard supported locales
      if (supportedLocales.includes(cookieLocale as CountryLanguage)) {
        validCookieLocale = true;
      }
      // If mixed locales are allowed, validate the cookie locale format and parts
      else if (allowMixedLocales) {
        const [lang, country] = cookieLocale.split("-");
        if (
          lang &&
          country &&
          supportedLanguages.includes(lang) &&
          supportedCountries.includes(country)
        ) {
          validCookieLocale = true;
        }
      }
    }

    // Use cookie locale if available and valid
    if (cookieLocale && validCookieLocale) {
      // Prepare new path with locale prefix from cookie
      const newPath =
        path === "/" ? `/${cookieLocale}` : `/${cookieLocale}${path}`;
      return NextResponse.redirect(new URL(newPath, request.url));
    }

    // Fallback to Accept-Language header if no valid cookie is set
    const acceptLanguage = request.headers.get("accept-language") || "";
    let detectedLocale = defaultLocale;

    // Try to find a matching locale from Accept-Language header
    for (const lang of acceptLanguage.split(",")) {
      const headerLocale = lang.split(";")[0].trim();

      // Try exact match (e.g., "en-US")
      if (allSupportedLocales.includes(headerLocale as CountryLanguage)) {
        detectedLocale = headerLocale as CountryLanguage;
        break;
      }

      // If mixed locales are allowed, validate the header locale
      if (allowMixedLocales) {
        const [langPart, countryPart] = headerLocale.split("-");
        if (
          langPart &&
          countryPart &&
          supportedLanguages.includes(langPart) &&
          supportedCountries.includes(countryPart.toLowerCase())
        ) {
          detectedLocale =
            `${langPart}-${countryPart.toLowerCase()}` as CountryLanguage;
          break;
        }
      }

      // Try to match just the language part with a supported country (e.g., "en" to "en-US")
      const langPart = headerLocale.split("-")[0];

      // Special handling for "en" language - prefer "en-GLOBAL" if available
      if (langPart === "en" && supportedLocales.includes("en-GLOBAL")) {
        detectedLocale = "en-GLOBAL";
        break;
      }

      const matchingLocale = supportedLocales.find((locale) =>
        locale.startsWith(`${langPart}-`),
      );

      if (matchingLocale) {
        detectedLocale = matchingLocale;
        break;
      }
    }

    // Prepare new path with locale prefix
    const newPath =
      path === "/" ? `/${detectedLocale}` : `/${detectedLocale}${path}`;

    // Redirect to the locale prefixed route
    return NextResponse.redirect(new URL(newPath, request.url));
  };

  return {
    handler,
    options: {
      // Skip for API routes and static files
      matcher: (path) => !path.startsWith("/api/") && !path.includes("/_next/"),
    },
  };
}
