/**
 * Language Middleware
 *
 * This middleware handles language detection and redirection.
 */

import type { NextRequest } from "next/server";

import type { CountryLanguage } from "@/i18n/core/config";

import { LOCALE_COOKIE_NAME } from "@/config/constants";

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
}

/**
 * Detect locale from request
 * Returns null if path already has valid locale or should be skipped
 * Returns locale string if redirect is needed
 */
export function detectLocale(
  request: NextRequest,
  options: LanguageMiddlewareOptions,
): CountryLanguage | null {
  const {
    supportedLocales,
    defaultLocale,
    supportedLanguages = [],
    supportedCountries = [],
    allowMixedLocales = false,
    cookieName = LOCALE_COOKIE_NAME,
  } = options;

  const path = request.nextUrl.pathname;

  // Check if the path already has a locale prefix
  const pathParts = path.split("/").filter(Boolean);
  const pathFirstPart = pathParts[0] || "";

  // Check if the path starts with a valid locale
  const isValidLocalePrefix =
    pathFirstPart &&
    supportedLocales.some((locale) => {
      const normalizedLocale = locale.toLowerCase();
      const normalizedPathPart = pathFirstPart.toLowerCase();
      return normalizedPathPart === normalizedLocale;
    });

  // If the path already has a valid locale prefix, no redirect needed
  if (isValidLocalePrefix) {
    return null;
  }

  // Check for user's preferred locale from cookie
  const cookieLocale = request.cookies.get(cookieName)?.value as CountryLanguage | undefined;

  // Check if cookie locale is valid
  let validCookieLocale = false;
  if (cookieLocale) {
    if (supportedLocales.includes(cookieLocale)) {
      validCookieLocale = true;
    } else if (allowMixedLocales) {
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
    return cookieLocale;
  }

  // Fallback to Accept-Language header
  const acceptLanguage = request.headers.get("accept-language") || "";
  let detectedLocale = defaultLocale;

  // Try to find a matching locale from Accept-Language header
  for (const lang of acceptLanguage.split(",")) {
    const headerLocale = lang.split(";")[0].trim();

    // Try exact match
    if (supportedLocales.includes(headerLocale as CountryLanguage)) {
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

    // Try to match just the language part
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

  return detectedLocale;
}
