import { describe, expect, test } from "bun:test";
import type { AgentEnvAvailability } from "next-vibe/agent/env-availability";
import { getEnvAvailability } from "next-vibe/agent/env-availability";
import { SkillsRepository } from "next-vibe/agent/skills/repository";
import { SEO_LOCALES } from "next-vibe/core/i18n/core/seo-locales";

import { listModelFacts } from "../../models/_shared/model-facts";
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
      (url) => !url.includes("/models/compare/"),
    );
    expect(modelPages.length).toBe((chat.length + media.length) * n);
    expect(compare.length).toBeGreaterThan(0);
    expect(pathsUnder(urls, "/skill/").length).toBe(skillPages.length * n);
    expect(pathsUnder(urls, "/story/blog/").length).toBe(
      Object.keys(BLOG_POST_DATES).length * n,
    );

    for (const locale of SEO_LOCALES) {
      expect(urls).toContain(`${BASE}/${locale}/models/${chat[0]?.slug}`);
      expect(urls).toContain(`${BASE}/${locale}/models/${media[0]?.slug}`);
      expect(urls).toContain(`${BASE}/${locale}/skill/community-skill`);
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
});
