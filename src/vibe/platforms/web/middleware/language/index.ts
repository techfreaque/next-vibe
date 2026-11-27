/**
 * Language Middleware
 *
 * This middleware handles language detection and redirection.
 */

import type { NextRequest } from "next-vibe/ui/lib/request";

import { LOCALE_COOKIE_NAME } from "@/env/constants";

import { languageConfig } from "../../../../core/i18n";
import type { CountryLanguage } from "../../../../core/i18n/core/config";
import { canonicalSeoLocale } from "../../../../core/i18n/core/seo-locales";

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

  const normalized = locale.trim().replaceAll("_", "-");
  const parts = normalized.split("-");
  const lang = parts[0]?.toLowerCase();
  const country = parts[1]?.toUpperCase();

  if (!lang) {
    return "";
  }

  return country ? `${lang}-${country}` : lang;
}

/**
 * A locale redirect the middleware must issue.
 * `replaceSegment` = the path's first segment (after /api) is a locale-shaped
 * token that must be swapped for `locale` instead of prefixed. Without it a
 * bad segment survives: /fr-FR/user -> /en-GLOBAL/fr-FR/user (404).
 */
export interface LocaleRedirect {
  locale: CountryLanguage;
  replaceSegment: boolean;
}

/** Locale-shaped segment: xx-YY / xx_YY / xx-GLOBAL (any casing). */
const LOCALE_SHAPED_SEGMENT_REGEX = /^[a-z]{2}[-_](?:[a-z]{2}|global)$/i;

/**
 * Expand the base locales into every language x country combination when
 * mixed locales are allowed (de-PL, en-DE, ...).
 */
const expandedLocaleCache = new WeakMap<CountryLanguage[], CountryLanguage[]>();

function expandLocales(
  baseLocales: CountryLanguage[],
  allowMixedLocales: boolean,
): CountryLanguage[] {
  if (!allowMixedLocales) {
    return baseLocales;
  }
  const cached = expandedLocaleCache.get(baseLocales);
  if (cached) {
    return cached;
  }
  const languages = [
    ...new Set(baseLocales.map((locale) => locale.split("-")[0])),
  ];
  const countries = [
    ...new Set(baseLocales.map((locale) => locale.split("-")[1])),
  ];
  const expanded = languages.flatMap((lang) =>
    countries.map((country) => `${lang}-${country}` as CountryLanguage),
  );
  expandedLocaleCache.set(baseLocales, expanded);
  return expanded;
}

function findLocale(
  supportedLocales: CountryLanguage[],
  candidate: string,
): CountryLanguage | undefined {
  const lower = candidate.toLowerCase();
  return supportedLocales.find((locale) => locale.toLowerCase() === lower);
}

function languageOf(locale: string): string {
  return (locale.split(/[-_]/)[0] ?? "").toLowerCase();
}

/**
 * Fallback locale for a bare language (/hi/, Accept-Language: hi). A language
 * that is the default of some region falls back to its GLOBAL variant. A
 * language that is only a secondary regional language (Hindi in India) falls
 * back to its first region instead: hi -> hi-IN, not hi-GLOBAL.
 */
function languageFallbackLocale(
  supportedLocales: CountryLanguage[],
  language: string,
): CountryLanguage | undefined {
  const regions = Object.values(languageConfig.countryInfo);
  const isRegionalDefault = regions.some(
    (region) => region.language === language,
  );
  const home = isRegionalDefault
    ? undefined
    : regions.find(
        (region) =>
          region.code !== "GLOBAL" &&
          region.languages.some((regional) => regional === language),
      );
  return (
    (home
      ? findLocale(supportedLocales, `${language}-${home.code}`)
      : undefined) ??
    supportedLocales.find((locale) => locale === `${language}-GLOBAL`) ??
    supportedLocales.find((locale) => languageOf(locale) === language)
  );
}

/**
 * Negotiate the best supported locale: cookie, then Accept-Language, then the
 * default. With `language` set, only locales of that language qualify, and the
 * GLOBAL variant of that language is the fallback.
 */
function negotiateLocale(
  request: NextRequest,
  supportedLocales: CountryLanguage[],
  defaultLocale: CountryLanguage,
  cookieName: string,
  language?: string,
): CountryLanguage {
  const fitsLanguage = (locale: CountryLanguage): boolean =>
    language === undefined || languageOf(locale) === language;

  const rawCookieLocale = request.cookies.get(cookieName)?.value;
  const cookieLocale = rawCookieLocale
    ? findLocale(supportedLocales, rawCookieLocale)
    : undefined;
  if (cookieLocale && fitsLanguage(cookieLocale)) {
    return cookieLocale;
  }

  const geoCode = (
    request.headers.get("cf-ipcountry") ??
    request.headers.get("x-vercel-ip-country")
  )?.toUpperCase();
  const geo = geoCode
    ? Object.values(languageConfig.countryInfo).find(
        ({ code }) => code === geoCode,
      )
    : undefined;
  const preferences = (request.headers.get("accept-language") ?? "")
    .split(",")
    .map((entry) => {
      const [tag, weight] = entry.trim().split(/;\s*q=/i);
      return { tag, weight: weight === undefined ? 1 : Number(weight) };
    })
    .filter(({ weight }) => weight > 0 && weight <= 1)
    .toSorted((a, b) => b.weight - a.weight);
  for (const { tag: headerLocale } of preferences) {
    if (!headerLocale) {
      continue;
    }

    // Normalize to format: en-US (lowercase lang, uppercase country)
    const normalized = normalizeLocaleFormat(headerLocale);
    if (!normalized) {
      continue;
    }
    const langCode = languageOf(normalized);
    if (language !== undefined && langCode !== language) {
      continue;
    }

    // The visitor's country wins over the browser's region for that
    // country's default language: an en-US browser in India gets en-IN.
    if (geo && geo.language === langCode) {
      const regional = findLocale(supportedLocales, `${langCode}-${geo.code}`);
      if (regional) {
        return regional;
      }
    }

    // Try exact match first
    const exact = supportedLocales.find((locale) => locale === normalized);
    if (exact) {
      return exact;
    }

    if (geo) {
      const regional = findLocale(supportedLocales, `${langCode}-${geo.code}`);
      if (regional) {
        return regional;
      }
    }

    // GLOBAL variant of the language, or its home region (hi -> hi-IN)
    const fallbackLocale = languageFallbackLocale(supportedLocales, langCode);
    if (fallbackLocale) {
      return fallbackLocale;
    }
  }

  if (geo) {
    const regional = findLocale(
      supportedLocales,
      `${language ?? geo.language}-${geo.code}`,
    );
    if (regional) {
      return regional;
    }
  }
  if (language !== undefined) {
    const languageLocale = languageFallbackLocale(supportedLocales, language);
    if (languageLocale) {
      return languageLocale;
    }
  }

  return defaultLocale;
}

/**
 * Detect locale from request.
 * Returns null if the path already carries a valid, correctly cased locale.
 * Otherwise returns the locale to redirect to, and whether the path's first
 * segment (after /api) must be replaced rather than prefixed:
 * - wrong casing (/en-us/...) -> replace with the canonical casing
 * - supported language only (/en/..., /de/...) -> replace with the best
 *   locale of that language
 * - locale-shaped but unsupported (/fr-FR/..., /en-GB/...) -> replace with
 *   the best locale of that language if supported, else the negotiated one
 * - anything else (/user/referral) -> prefix the negotiated locale
 */
export function detectLocale(
  request: NextRequest,
  options: LanguageMiddlewareOptions,
): LocaleRedirect | null {
  const {
    supportedLocales: baseLocales,
    defaultLocale,
    cookieName = LOCALE_COOKIE_NAME,
    allowMixedLocales = false,
  } = options;

  const supportedLocales = expandLocales(baseLocales, allowMixedLocales);
  const supportedLanguages = new Set(supportedLocales.map(languageOf));

  const path = request.nextUrl.pathname;

  // For API routes, check the second path segment (/api/[locale]/...)
  // For regular routes, check the first path segment (/[locale]/...)
  const pathParts = path.split("/").filter(Boolean);
  const isApiRoute = pathParts[0] === "api";
  const localeSegment = (isApiRoute ? pathParts[1] : pathParts[0]) ?? "";

  if (localeSegment) {
    const matchedLocale = findLocale(supportedLocales, localeSegment);
    if (matchedLocale) {
      // Correct casing -> no redirect; wrong casing (en-us) -> fix it
      return localeSegment === matchedLocale
        ? null
        : { locale: matchedLocale, replaceSegment: true };
    }

    const isLanguageOnly =
      /^[a-z]{2}$/i.test(localeSegment) &&
      supportedLanguages.has(localeSegment.toLowerCase());
    if (isLanguageOnly && !isApiRoute) {
      const fallback = languageFallbackLocale(
        supportedLocales,
        languageOf(localeSegment),
      );
      if (fallback) {
        const canonical = canonicalSeoLocale(fallback);
        return {
          locale: findLocale(supportedLocales, canonical) ?? fallback,
          replaceSegment: true,
        };
      }
    }
    if (isLanguageOnly || LOCALE_SHAPED_SEGMENT_REGEX.test(localeSegment)) {
      const language = languageOf(localeSegment);
      return {
        locale:
          findLocale(supportedLocales, normalizeLocaleFormat(localeSegment)) ??
          negotiateLocale(
            request,
            supportedLocales,
            defaultLocale,
            cookieName,
            supportedLanguages.has(language) ? language : undefined,
          ),
        replaceSegment: true,
      };
    }
  }

  return {
    locale: negotiateLocale(
      request,
      supportedLocales,
      defaultLocale,
      cookieName,
    ),
    replaceSegment: false,
  };
}

/**
 * Build the redirect target path for a locale redirect.
 * /api paths keep /api in front: /api/fr-FR/x -> /api/en-GLOBAL/x.
 */
export function buildLocaleRedirectPath(
  path: string,
  redirect: LocaleRedirect,
): string {
  const pathParts = path.split("/").filter(Boolean);
  const isApiRoute = pathParts[0] === "api";
  const rest = pathParts.slice(
    (isApiRoute ? 1 : 0) + (redirect.replaceSegment ? 1 : 0),
  );
  const trailingSlash =
    path.length > 1 && path.endsWith("/") && rest.length > 0;
  const parts = [...(isApiRoute ? ["api"] : []), redirect.locale, ...rest];
  return `/${parts.join("/")}${trailingSlash ? "/" : ""}`;
}
