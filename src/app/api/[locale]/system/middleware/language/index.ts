/**
 * Language Middleware
 *
 * This middleware handles language detection and redirection.
 */

import type { NextRequest } from "next/server";

import { LOCALE_COOKIE_NAME } from "@/config/constants";
import type { CountryLanguage } from "@/i18n/core/config";

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
   * Allow mixed locale combinations like 'de-PL'
   */
  allowMixedLocales?: boolean;

  /**
   * Cookie name for storing the preferred locale
   */
  cookieName?: string;
}

/**
 * Normalize locale format to: en-US (lowercase language, uppercase country)
 * Handles: "en-us", "EN-US", "en_US" -> "en-US"
 */
function normalizeLocaleFormat(locale: string): string {
  if (!locale) {
    return "";
  }

  const normalized = locale.trim().replace(/_/g, "-");
  const parts = normalized.split("-");
  const lang = parts[0]?.toLowerCase();
  const country = parts[1]?.toUpperCase();

  if (!lang) {
    return "";
  }

  return country ? `${lang}-${country}` : lang;
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
    supportedLocales: baseLocales,
    defaultLocale,
    cookieName = LOCALE_COOKIE_NAME,
    allowMixedLocales = false,
  } = options;

  // Generate all possible locale combinations if mixed locales are allowed
  const supportedLocales = allowMixedLocales
    ? ((): CountryLanguage[] => {
        const languages = [
          ...new Set(baseLocales.map((locale) => locale.split("-")[0])),
        ];
        const countries = [
          ...new Set(baseLocales.map((locale) => locale.split("-")[1])),
        ];
        return languages.flatMap((lang) =>
          countries.map((country) => `${lang}-${country}` as CountryLanguage),
        );
      })()
    : baseLocales;

  const path = request.nextUrl.pathname;

  // Check if the path already has a locale prefix
  const pathParts = path.split("/").filter(Boolean);
  const pathFirstPart = pathParts[0] || "";

  // For API routes, check the second path segment (/api/[locale]/...)
  // For regular routes, check the first path segment (/[locale]/...)
  const isApiRoute = pathFirstPart === "api";
  const localeSegment = isApiRoute ? pathParts[1] : pathFirstPart;

  // Check if the path starts with a valid locale
  const isValidLocalePrefix =
    localeSegment &&
    supportedLocales.some((locale) => {
      const normalizedLocale = locale.toLowerCase();
      const normalizedPathPart = localeSegment.toLowerCase();
      return normalizedPathPart === normalizedLocale;
    });

  // If the path already has a valid locale prefix, no redirect needed
  if (isValidLocalePrefix) {
    return null;
  }

  // Check for user's preferred locale from cookie
  const cookieLocale = request.cookies.get(cookieName)?.value as
    | CountryLanguage
    | undefined;

  if (cookieLocale && supportedLocales.includes(cookieLocale)) {
    return cookieLocale;
  }

  // Fallback to Accept-Language header
  const acceptLanguage = request.headers.get("accept-language") || "";

  // Parse Accept-Language header and try to match supported locales
  for (const lang of acceptLanguage.split(",")) {
    const headerLocale = lang.split(";")[0]?.trim();
    if (!headerLocale) {
      continue;
    }

    // Normalize to format: en-US (lowercase lang, uppercase country)
    const normalized = normalizeLocaleFormat(headerLocale);
    if (!normalized) {
      continue;
    }

    // Try exact match first
    if (supportedLocales.includes(normalized as CountryLanguage)) {
      return normalized as CountryLanguage;
    }

    // Try language-only match
    const langCode = normalized.split("-")[0];

    // Prefer GLOBAL variant for the language if available
    const globalLocale = `${langCode}-GLOBAL` as CountryLanguage;
    if (supportedLocales.includes(globalLocale)) {
      return globalLocale;
    }

    // Find any locale with matching language
    const matchingLocale = supportedLocales.find((locale) => {
      const [localeLang] = locale.split("-");
      return localeLang.toLowerCase() === langCode;
    });
    if (matchingLocale) {
      return matchingLocale;
    }
  }

  return defaultLocale;
}
