/**
 * Sitemap builder - every public, indexable page, once per locale, with
 * hreflang alternates. Pure: model registry, blog registry, comparison
 * pages, a fixed list of marketing pages, plus the public skill pages the caller passes in (those
 * live partly in the DB), so it is safe to build per request.
 *
 * App pages (threads, account, admin, tools) are deliberately absent.
 */

import { resolveIdAlias } from "next-vibe/agent/chat/slugify";
import type { AgentEnvAvailability } from "next-vibe/agent/env-availability";
import { NO_SKILL_ID } from "next-vibe/agent/skills/constants";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  SEO_LOCALES,
  seoLanguageAlternates,
} from "next-vibe/core/i18n/core/seo-locales";

import { configScopedTranslation } from "@/env/i18n";

import { CREATE_KINDS } from "../../create/_shared/create-kinds";
import {
  latestModelChangelogDate,
  MODEL_CHANGELOG_PATH,
} from "../../models/_shared/model-changelog";
import {
  canonicalComparisonPath,
  listModelFacts,
  suggestComparisons,
} from "../../models/_shared/model-facts";
import { listMediaFacts } from "../../models/_shared/model-media-facts";
import { BLOG_POST_DATES } from "../../story/blog/posts-meta";
import { listCompareEntries } from "../../story/compare/_shared/platforms";

/** Public marketing pages (locale-less paths). */
export const SITEMAP_STATIC_PATHS: readonly string[] = [
  "/story",
  "/story/about-us",
  "/story/uncensored-ai",
  "/story/abliterated-ai-chat",
  "/story/blog",
  "/story/careers",
  "/story/framework",
  "/story/self-host",
  "/story/build-a-skill",
  "/story/earn",
  "/story/partners",
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
  "/create",
  ...CREATE_KINDS.map((kind) => `/create/${kind}`),
];

/** Comparison pages per model: its suggested "compare with" set, deduped. */
const COMPARISONS_PER_MODEL = 3;

export interface SitemapEntry {
  /** Locale-less path, e.g. "/models/claude-opus-5-5". */
  path: string;
  /** YYYY-MM-DD when known. */
  lastmod: string | null;
}

/** A public skill landing page (/skill/<id>). */
export interface SitemapSkillPage {
  /** Built-in skill id or community skill slug. */
  id: string;
  updatedAt: Date | null;
}

/** Indexable locales - shared with page canonical/hreflang tags. */
export function sitemapLocales(): readonly CountryLanguage[] {
  return SEO_LOCALES;
}

/**
 * Models are listed only when their provider API key is configured on this
 * instance (`availability`), same rule as the model pages themselves.
 */
export function collectSitemapEntries(
  availability: AgentEnvAvailability,
  skillPages: readonly SitemapSkillPage[] = [],
): SitemapEntry[] {
  const entries: SitemapEntry[] = SITEMAP_STATIC_PATHS.map((path) => ({
    path,
    lastmod: null,
  }));

  for (const [slug, date] of Object.entries(BLOG_POST_DATES)) {
    entries.push({ path: `/story/blog/${slug}`, lastmod: date });
  }

  entries.push(...listCompareEntries());

  entries.push({
    path: MODEL_CHANGELOG_PATH,
    lastmod: latestModelChangelogDate(),
  });

  const seenSkills = new Set<string>();
  for (const skill of skillPages) {
    if (
      seenSkills.has(skill.id) ||
      !/^[a-z0-9][a-z0-9-]*$/.test(skill.id) ||
      skill.id === NO_SKILL_ID ||
      resolveIdAlias(skill.id) !== skill.id
    ) {
      continue;
    }
    seenSkills.add(skill.id);
    entries.push({
      path: `/skill/${encodeURIComponent(skill.id)}`,
      lastmod: skill.updatedAt?.toISOString().slice(0, 10) ?? null,
    });
  }

  const models = listModelFacts(availability);
  const seenPairs = new Set<string>();
  for (const facts of models) {
    entries.push({ path: `/models/${facts.slug}`, lastmod: null });
  }
  for (const facts of listMediaFacts(availability)) {
    entries.push({ path: `/models/${facts.slug}`, lastmod: null });
  }
  for (const facts of models) {
    if (facts.isLegacy) {
      if (facts.successor !== null) {
        const path = canonicalComparisonPath(facts, facts.successor);
        if (!seenPairs.has(path)) {
          seenPairs.add(path);
          entries.push({ path, lastmod: null });
        }
      }
      continue;
    }
    for (const other of suggestComparisons(
      facts,
      availability,
      COMPARISONS_PER_MODEL,
    )) {
      const path = canonicalComparisonPath(facts, other);
      if (seenPairs.has(path)) {
        continue;
      }
      seenPairs.add(path);
      entries.push({ path, lastmod: null });
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

/** One sitemap `<loc>` with its `<lastmod>` (YYYY-MM-DD or null). */
export interface SitemapUrl {
  url: string;
  lastmod: string | null;
}

/**
 * Every absolute `<loc>` the sitemap lists, in the same order. IndexNow
 * submits exactly this set, so a page is pinged iff crawlers can find it.
 */
export function listSitemapUrls(
  availability: AgentEnvAvailability,
  skillPages: readonly SitemapSkillPage[] = [],
  baseUrl: string = publicBaseUrl(),
): SitemapUrl[] {
  const base = baseUrl.replace(/\/+$/, "");
  const locales = sitemapLocales();
  const urls: SitemapUrl[] = [];
  for (const entry of collectSitemapEntries(availability, skillPages)) {
    for (const locale of locales) {
      urls.push({
        url: `${base}/${locale}${entry.path}`,
        lastmod: entry.lastmod,
      });
    }
  }
  return urls;
}

export function buildSitemapXml(
  availability: AgentEnvAvailability,
  skillPages: readonly SitemapSkillPage[] = [],
  baseUrl: string = publicBaseUrl(),
): string {
  const base = baseUrl.replace(/\/+$/, "");
  const locales = sitemapLocales();
  const lines: string[] = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`,
  ];

  for (const entry of collectSitemapEntries(availability, skillPages)) {
    const languageUrls = seoLanguageAlternates(base, entry.path);
    const alternates = Object.entries(languageUrls).map(
      ([language, url]) =>
        `    <xhtml:link rel="alternate" hreflang="${language}" href="${escapeXml(url)}"/>`,
    );
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
