import { describe, expect, test } from "bun:test";
import type { AgentEnvAvailability } from "next-vibe/agent/env-availability";
import { getEnvAvailability } from "next-vibe/agent/env-availability";
import { SkillsRepository } from "next-vibe/agent/skills/repository";
import {
  seoLanguageAlternates,
  SEO_LOCALES,
} from "next-vibe/core/i18n/core/seo-locales";

import {
  canonicalComparisonPath,
  isIndexableComparison,
  listModelFacts,
} from "../../models/_shared/model-facts";
import { listMediaFacts } from "../../models/_shared/model-media-facts";
import { BLOG_POST_DATES } from "../../story/blog/posts-meta";
import { buildSitemapXml, SITEMAP_STATIC_PATHS } from "./build-sitemap";
import * as rootRoute from "./root-route";

/** Every provider key configured. */
const ALL: AgentEnvAvailability = {
  openRouter: true,
  claudeCode: true,
  voice: true,
  braveSearch: true,
  kagiSearch: true,
  anySearch: true,
  uncensoredAI: true,
  freedomGPT: true,
  gabAI: true,
  veniceAI: true,
  nanoGPT: true,
  scrappey: true,
  openAiImages: true,
  openAiStt: true,
  replicate: true,
  falAi: true,
  modelsLab: true,
  edenAiStt: true,
  deepgram: true,
  openAiTts: true,
  edenAiTts: true,
  elevenlabs: true,
  unbottledSystem: false,
  unbottledForce: false,
};

const BASE = "https://example.test";

function locs(xml: string): string[] {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1] ?? "");
}

function pathsUnder(urls: readonly string[], prefix: string): string[] {
  return urls.filter((url) => {
    const path = url.slice(BASE.length).replace(/^\/[a-z]{2}-[A-Z]+/, "");
    return path.startsWith(prefix);
  });
}

describe("sitemap.xml", () => {
  test("is never prerendered at build time", () => {
    // A prerendered sitemap is baked with the build's placeholder env (no
    // provider keys): prod shipped zero model pages that way.
    expect(rootRoute.dynamic).toBe("force-dynamic");
  });

  test("lists every model, compare, media, skill and blog page in every SEO locale", () => {
    const skillPages = [
      ...SkillsRepository.listPublicDefaultSkillIds().map((id) => ({
        id,
        updatedAt: null,
      })),
      { id: "community-skill", updatedAt: new Date("2026-11-01T10:00:00Z") },
    ];
    const urls = locs(buildSitemapXml(ALL, skillPages, BASE));
    const n = SEO_LOCALES.length;

    const chat = listModelFacts(ALL);
    const media = listMediaFacts(ALL);
    expect(chat.length).toBeGreaterThan(0);
    expect(media.length).toBeGreaterThan(0);

    const compare = pathsUnder(urls, "/models/compare/");
    const modelPages = pathsUnder(urls, "/models/").filter(
      (url) =>
        !url.includes("/models/compare/") &&
        !url.endsWith("/models/changelog"),
    );
    expect(modelPages.length).toBe((chat.length + media.length) * n);
    expect(compare.length).toBeGreaterThan(0);
    expect(pathsUnder(urls, "/skill/").length).toBe(skillPages.length * n);
    expect(pathsUnder(urls, "/story/blog/").length).toBe(
      Object.keys(BLOG_POST_DATES).length * n,
    );

    for (const locale of SEO_LOCALES) {
      expect(urls).toContain(`${BASE}/${locale}/story/abliterated-ai-chat`);
      expect(urls).toContain(`${BASE}/${locale}/models/${chat[0]?.slug}`);
      expect(urls).toContain(`${BASE}/${locale}/models/${media[0]?.slug}`);
      expect(urls).toContain(`${BASE}/${locale}/skill/community-skill`);
      expect(urls).toContain(`${BASE}/${locale}/models/changelog`);
    }
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls.length).toBeGreaterThan(SITEMAP_STATIC_PATHS.length * n);
  });

  test("GET serves model pages whenever a chat provider key is configured", async () => {
    const availability = await getEnvAvailability();
    const response = await rootRoute.GET();
    expect(response.status).toBe(200);
    const xml = await response.text();
    const modelLocs = locs(xml).filter((url) => url.includes("/models/"));
    const skillLocs = locs(xml).filter((url) => url.includes("/skill/"));
    expect(skillLocs.length).toBeGreaterThan(0);
    if (listModelFacts(availability).length > 0) {
      expect(modelLocs.length).toBeGreaterThan(0);
    }
  });

  test("omits redirecting paths and skill IDs that do not resolve as landing pages", () => {
    const xml = buildSitemapXml(
      ALL,
      ["community-skill", "community-skill", "science-bot", "thea__brilliant", "default", ".", "oops/"].map(
        (id) => ({ id, updatedAt: null }),
      ),
      BASE,
    );
    const urls = locs(xml);
    expect(pathsUnder(urls, "/skill/")).toEqual(
      SEO_LOCALES.map((locale) => `${BASE}/${locale}/skill/community-skill`),
    );
    for (const locale of SEO_LOCALES) {
      expect(urls).not.toContain(`${BASE}/${locale}`);
      expect(urls).not.toContain(`${BASE}/${locale}/subscription`);
      expect(urls).not.toContain(`${BASE}/${locale}/pricing`);
    }
    expect(urls.some((url) => url.endsWith("/"))).toBe(false);
  });

  test("lists one URL per comparison and points every hreflang at a listed canonical", () => {
    const xml = buildSitemapXml(ALL, [], BASE);
    const urls = new Set(locs(xml));
    const chatModels = new Map(
      listModelFacts(ALL).map((facts) => [facts.slug, facts]),
    );
    for (const url of pathsUnder([...urls], "/models/compare/")) {
      const [, locale, , , leftSlug, rightSlug] = new URL(url).pathname.split("/");
      const left = leftSlug && chatModels.get(leftSlug);
      const right = rightSlug && chatModels.get(rightSlug);
      if (!left || !right) {
        expect.unreachable("sitemap compares unavailable models");
      }
      expect(left.id).not.toBe(right.id);
      expect(isIndexableComparison(left, right)).toBe(true);
      const path = canonicalComparisonPath(left, right);
      expect(path).toBe(canonicalComparisonPath(right, left));
      expect(url).toBe(`${BASE}/${locale}${path}`);
    }
    // Every legacy model with an available successor has its upgrade comparison
    // in the sitemap (real "old vs new" search queries).
    const legacyWithSuccessor = listModelFacts(ALL).filter(
      (facts) => facts.isLegacy && facts.successor !== null,
    );
    expect(legacyWithSuccessor.length).toBeGreaterThan(0);
    for (const legacy of legacyWithSuccessor) {
      if (!legacy.successor) {
        continue;
      }
      const upgradePath = canonicalComparisonPath(legacy, legacy.successor);
      for (const locale of SEO_LOCALES) {
        expect(urls.has(`${BASE}/${locale}${upgradePath}`)).toBe(true);
      }
    }
    for (const block of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
      const page = block[1] ?? "";
      const [url] = locs(page);
      if (!url) {
        expect.unreachable("sitemap entry lacks loc");
      }
      const [, , ...path] = new URL(url).pathname.split("/");
      const alternates = Object.fromEntries(
        [...page.matchAll(/hreflang="([^"]+)" href="([^"]+)"/g)].map(
          ([, language, href]) => [language, href],
        ),
      );
      expect(alternates).toEqual(seoLanguageAlternates(BASE, path.join("/")));
      for (const target of Object.values(alternates)) {
        expect(urls.has(target ?? "")).toBe(true);
      }
    }
  });
});
