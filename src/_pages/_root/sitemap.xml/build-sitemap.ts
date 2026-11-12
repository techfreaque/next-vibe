/**
 * Sitemap builder - every public, indexable page, once per locale, with
 * hreflang alternates. Pure + static (model registry, blog registry, a fixed
 * list of marketing pages), so it is safe to build per request.
 *
 * App pages (threads, account, admin, tools) are deliberately absent.
 */

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";

import { configScopedTranslation } from "@/env/i18n";

import {
  listModelFacts,
  suggestComparisons,
} from "../../models/_shared/model-facts";
import { listMediaFacts } from "../../models/_shared/model-media-facts";
import { BLOG_POST_DATES } from "../../story/blog/posts-meta";

/** Public marketing pages (locale-less paths). */
export const SITEMAP_STATIC_PATHS: readonly string[] = [
  "/story",
  "/story/about-us",
  "/story/blog",
  "/story/careers",
  "/story/framework",
  "/story/self-host",
  "/story/build-a-skill",
  "/story/earn",
  "/story/refusal-index",
  "/story/invest",
  "/story/newsletter",
  "/story/imprint",
  "/story/privacy-policy",
  "/story/terms-of-service",
  "/docs/api",
  "/subscription/overview",
  "/help",
  "/skills",
  "/models",
];

/** Comparison pages per model: its suggested "compare with" set, deduped. */
const COMPARISONS_PER_MODEL = 3;

export interface SitemapEntry {
  /** Locale-less path, e.g. "/models/claude-opus-5-5". */
  path: string;
  /** YYYY-MM-DD when known. */
  lastmod: string | null;
}

/** One canonical locale per country - same set the middleware serves. */
const SITEMAP_LOCALES: readonly CountryLanguage[] = [
  "de-DE",
  "pl-PL",
  "en-US",
  "en-GLOBAL",
];

export function sitemapLocales(): readonly CountryLanguage[] {
  return SITEMAP_LOCALES;
}

/** hreflang value: GLOBAL is generic language, not a region. */
function hreflang(locale: CountryLanguage): string {
  return locale.endsWith("-GLOBAL") ? (locale.split("-")[0] ?? locale) : locale;
}

export function collectSitemapEntries(): SitemapEntry[] {
  const entries: SitemapEntry[] = SITEMAP_STATIC_PATHS.map((path) => ({
    path,
    lastmod: null,
  }));

  for (const [slug, date] of Object.entries(BLOG_POST_DATES)) {
    entries.push({ path: `/story/blog/${slug}`, lastmod: date });
  }

  const models = listModelFacts();
  const seenPairs = new Set<string>();
  for (const facts of models) {
    entries.push({ path: `/models/${facts.slug}`, lastmod: null });
  }
  for (const facts of listMediaFacts()) {
    entries.push({ path: `/models/${facts.slug}`, lastmod: null });
  }
  for (const facts of models) {
    if (facts.isLegacy) {
      continue;
    }
    for (const other of suggestComparisons(facts, COMPARISONS_PER_MODEL)) {
      const pairKey = [facts.slug, other.slug].toSorted().join("|");
      if (seenPairs.has(pairKey)) {
        continue;
      }
      seenPairs.add(pairKey);
      entries.push({
        path: `/models/compare/${facts.slug}/${other.slug}`,
        lastmod: null,
      });
    }
  }
  return entries;
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

/**
 * Public origin, same source as every page's canonical/hreflang tags
 * (metadataGenerator). Never NEXT_PUBLIC_APP_URL: Next prerenders this route
 * at build time, before the runtime env exists, so prod shipped
 * http://localhost:3000 in every <loc>.
 */
function publicBaseUrl(): string {
  const { t } = configScopedTranslation.scopedT("en-GLOBAL");
  return t("websiteUrl");
}

export function buildSitemapXml(baseUrl: string = publicBaseUrl()): string {
  const base = baseUrl.replace(/\/+$/, "");
  const locales = sitemapLocales();
  const defaultLocale = locales.find((locale) => locale.endsWith("-GLOBAL"));
  const lines: string[] = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`,
  ];

  for (const entry of collectSitemapEntries()) {
    const alternates = locales.map(
      (locale) =>
        `    <xhtml:link rel="alternate" hreflang="${hreflang(locale)}" href="${escapeXml(`${base}/${locale}${entry.path}`)}"/>`,
    );
    if (defaultLocale !== undefined) {
      alternates.push(
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(`${base}/${defaultLocale}${entry.path}`)}"/>`,
      );
    }
    for (const locale of locales) {
      lines.push(`  <url>`);
      lines.push(
        `    <loc>${escapeXml(`${base}/${locale}${entry.path}`)}</loc>`,
      );
      if (entry.lastmod !== null) {
        lines.push(`    <lastmod>${entry.lastmod}</lastmod>`);
      }
      lines.push(...alternates);
      lines.push(`  </url>`);
    }
  }

  lines.push(`</urlset>`, ``);
  return lines.join("\n");
}
