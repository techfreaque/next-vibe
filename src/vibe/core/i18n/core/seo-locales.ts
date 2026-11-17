/**
 * SEO locale set: the locales search engines should index.
 *
 * Every page is served under all language x country combinations
 * (e.g. /de-US/..., /en-PL/...), but only one locale per language/market is
 * canonical. Page metadata (canonical + hreflang) and the sitemap both read
 * this module so they can never disagree.
 */

import type { CountryLanguage } from "./config";

/** Indexable locales - same set the middleware lists as supported. */
export const SEO_LOCALES: readonly CountryLanguage[] = [
  "de-DE",
  "pl-PL",
  "fr-FR",
  "en-GLOBAL",
  "en-US",
];

/** hreflang="x-default" target. */
export const SEO_DEFAULT_LOCALE: CountryLanguage = "en-GLOBAL";

/**
 * hreflang value for an indexable locale. GLOBAL is not an ISO region, so a
 * GLOBAL locale is announced as the bare language ("en").
 */
export function hreflangFor(locale: CountryLanguage): string {
  return locale.endsWith("-GLOBAL") ? (locale.split("-")[0] ?? locale) : locale;
}

/**
 * hreflang alternates for a locale-less path: every indexable locale plus
 * x-default. Keys are hreflang values, values are absolute URLs.
 */
export function seoLanguageAlternates(
  baseUrl: string,
  path: string,
): Record<string, string> {
  const base = baseUrl.replace(/\/+$/, "");
  const suffix = path ? `/${path.replace(/^\/+/, "")}` : "";
  const alternates: Record<string, string> = {};
  for (const locale of SEO_LOCALES) {
    alternates[hreflangFor(locale)] = `${base}/${locale}${suffix}`;
  }
  alternates["x-default"] = `${base}/${SEO_DEFAULT_LOCALE}${suffix}`;
  return alternates;
}

/**
 * Canonical locale for any served locale: itself when indexable, otherwise
 * the language's GLOBAL locale if indexable, else the language's first
 * indexable locale (de-US -> de-DE, en-PL -> en-GLOBAL), else the default.
 */
export function canonicalSeoLocale(locale: CountryLanguage): CountryLanguage {
  if (SEO_LOCALES.includes(locale)) {
    return locale;
  }
  const [language] = locale.split("-");
  const sameLanguage = SEO_LOCALES.filter((seo) =>
    seo.startsWith(`${language}-`),
  );
  return (
    sameLanguage.find((seo) => seo.endsWith("-GLOBAL")) ??
    sameLanguage[0] ??
    SEO_DEFAULT_LOCALE
  );
}
