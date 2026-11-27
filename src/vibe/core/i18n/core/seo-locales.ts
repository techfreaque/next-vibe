/**
 * SEO locale set: the locales search engines should index.
 *
 * Every page is served under all language x country combinations
 * (e.g. /de-US/..., /en-PL/...), but only one locale per language/market is
 * canonical. Page metadata (canonical + hreflang) and the sitemap both read
 * this module so they can never disagree.
 */

import type { CountryLanguage } from "./config";

/**
 * Indexable locales - regional variants share a canonical page per language.
 *
 * English: en-GLOBAL is the one English canonical (hreflang "en" and
 * x-default). en-US serves the same text, prices (USD) and number format, so
 * it canonicalizes to en-GLOBAL and stays out of hreflang and the sitemap
 * (Google already folded en-US into en-GLOBAL). en-IN stays self-canonical in
 * the hreflang cluster: it really differs (lakh/crore digit grouping in every
 * price, credit and context number, India defaults, sibling of hi-IN), and
 * hreflang lets Google serve it to Indian searchers while en-GLOBAL keeps the
 * rest of the English signals.
 */
export const SEO_LOCALES: readonly CountryLanguage[] = [
  "de-DE",
  "pl-PL",
  "fr-FR",
  "it-IT",
  "es-ES",
  "sk-SK",
  "en-GLOBAL",
  "en-IN",
  "hi-IN",
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
 * hreflang alternates for a locale-less path: every indexable locale, the bare
 * language for languages without a GLOBAL locale (so de-AT, de-CH, fr-BE,
 * fr-CA, es-MX and friends get the German/French/Spanish page instead of the
 * English x-default), plus x-default. Keys are hreflang values, values are
 * absolute URLs.
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
  for (const locale of SEO_LOCALES) {
    const language = locale.split("-")[0] ?? locale;
    alternates[language] ??= `${base}/${canonicalSeoLocale(locale)}${suffix}`;
  }
  alternates["x-default"] = `${base}/${SEO_DEFAULT_LOCALE}${suffix}`;
  return alternates;
}

/**
 * Canonical locale for any served locale: itself when indexable, otherwise
 * the language's GLOBAL locale if indexable, else the language's first
 * indexable locale (de-US -> de-DE, en-PL -> en-GLOBAL, en-US -> en-GLOBAL),
 * else the default.
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
