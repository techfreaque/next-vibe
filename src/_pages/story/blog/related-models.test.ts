import { describe, expect, test } from "bun:test";
import type { AgentEnvAvailability } from "next-vibe/agent/env-availability";

import { collectSitemapEntries } from "../../_root/sitemap.xml/build-sitemap";
import { listModelFacts } from "../../models/_shared/model-facts";
import type { BlogPostSlug } from "./posts-meta";
import { RELATED_MODEL_SPECS, relatedModelLinks } from "./related-models-data";

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

const SLUGS = Object.keys(RELATED_MODEL_SPECS).filter(
  (slug): slug is BlogPostSlug => slug in RELATED_MODEL_SPECS,
);

describe("blog related models", () => {
  const sitemap = new Set(collectSitemapEntries(ALL).map(({ path }) => path));
  const modelPaths = new Set(
    listModelFacts(ALL)
      .filter((facts) => !facts.isLegacy)
      .map((facts) => `/models/${facts.slug}`),
  );

  test("every curated post gets two or three links", () => {
    expect(SLUGS.length).toBeGreaterThan(0);
    for (const slug of SLUGS) {
      const links = relatedModelLinks(slug, ALL);
      expect({ slug, ok: links.length >= 2 && links.length <= 3 }).toEqual({
        slug,
        ok: true,
      });
      expect(new Set(links.map((link) => link.path)).size).toBe(links.length);
    }
  });

  test("model links point at current, sitemapped model pages", () => {
    for (const slug of SLUGS) {
      for (const link of relatedModelLinks(slug, ALL)) {
        if (link.kind === "model") {
          expect({ slug, path: link.path, live: modelPaths.has(link.path) })
            .toEqual({ slug, path: link.path, live: true });
          expect(sitemap.has(link.path)).toBe(true);
        }
      }
    }
  });

  test("compare links are canonical, indexable and in the sitemap", () => {
    for (const slug of SLUGS) {
      for (const link of relatedModelLinks(slug, ALL)) {
        if (link.kind === "compare") {
          expect({ slug, path: link.path, inSitemap: sitemap.has(link.path) })
            .toEqual({ slug, path: link.path, inSitemap: true });
        }
      }
    }
  });
});
