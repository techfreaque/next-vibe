import { describe, expect, test } from "bun:test";
import { ChatModelId } from "next-vibe/agent/ai-stream/models";
import type { AgentEnvAvailability } from "next-vibe/agent/env-availability";
import { ContentLevel } from "next-vibe/agent/skills/enum";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";

import { buildFaqStructuredData } from "../../_components/faq-structured-data";
import { getModelFacts, listModelFacts, type ModelFacts } from "./model-facts";
import { isApiCallable, uncensoredKind } from "./model-format";
import { listMediaFacts } from "./model-media-facts";
import {
  bestForContent,
  chatModelFaq,
  chatModelMeta,
  findRelatedMediaModels,
  findRelatedModels,
  HAND_PICKED_MODEL_IDS,
  mediaModelFaq,
  mediaModelMeta,
} from "./model-seo";
import { buildChatModelStructuredData } from "./model-structured-data";

/** Every provider key configured: the registry-level public set. */
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

const LOCALES: readonly CountryLanguage[] = ["en-US", "de-DE", "pl-PL", "fr-FR"];

function factsOf(id: ChatModelId): ModelFacts {
  const facts = getModelFacts(id, ALL);
  if (facts === null) {
    return expect.unreachable(`no public page for ${id}`);
  }
  return facts;
}

describe("model page titles and descriptions", () => {
  test("unique per locale across chat and media pages", () => {
    for (const locale of LOCALES) {
      const titles = new Set<string>();
      const descriptions = new Set<string>();
      const metas = [
        ...listModelFacts(ALL).map((facts) => chatModelMeta(facts, locale)),
        ...listMediaFacts(ALL).map((facts) => mediaModelMeta(facts, locale)),
      ];
      for (const meta of metas) {
        expect(titles.has(meta.title)).toBe(false);
        expect(descriptions.has(meta.description)).toBe(false);
        titles.add(meta.title);
        descriptions.add(meta.description);
        expect(meta.description).not.toContain("{{");
        expect(meta.title).not.toContain("{{");
      }
    }
  });

  test("titles fit a search result when a short variant exists", () => {
    for (const facts of listModelFacts(ALL)) {
      expect(chatModelMeta(facts, "en-US").title.length).toBeLessThanOrEqual(
        60,
      );
    }
  });

  test("uncensored titles only on uncensored-tier pages", () => {
    for (const facts of listModelFacts(ALL)) {
      const title = chatModelMeta(facts, "en-US").title;
      expect(title.includes("uncensored AI")).toBe(
        !facts.isLegacy && facts.content === ContentLevel.UNCENSORED,
      );
    }
  });
});

describe("best for", () => {
  test("every hand-picked model has a public page and a line in all locales", () => {
    expect(HAND_PICKED_MODEL_IDS.length).toBe(20);
    for (const id of HAND_PICKED_MODEL_IDS) {
      const facts = factsOf(id);
      for (const locale of LOCALES) {
        const line = bestForContent(facts, locale).line;
        expect(line).not.toBeNull();
        expect(line?.startsWith("bestFor.")).toBe(false);
      }
    }
  });

  test("generated lists exist for every model", () => {
    for (const facts of listModelFacts(ALL)) {
      expect(bestForContent(facts, "en-US").good.length).toBeGreaterThan(0);
    }
  });
});

describe("uncensored kinds", () => {
  test("UncensoredLM has its own worldview, GLM 5.3 Uncensored has refusals removed", () => {
    expect(uncensoredKind(factsOf(ChatModelId.UNCENSORED_LM_V1_2))).toBe(
      "ownWorldview",
    );
    expect(uncensoredKind(factsOf(ChatModelId.GLM_5_3_UNCENSORED))).toBe(
      "refusalsRemoved",
    );
    expect(uncensoredKind(factsOf(ChatModelId.CLAUDE_SONNET_5_5))).toBeNull();
  });
});

describe("related models", () => {
  test("never the model itself, never twice", () => {
    for (const facts of listModelFacts(ALL)) {
      const slugs = findRelatedModels(facts, ALL).map((model) => model.slug);
      expect(slugs).not.toContain(facts.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
    }
    for (const facts of listMediaFacts(ALL)) {
      const slugs = findRelatedMediaModels(facts, ALL).map((m) => m.slug);
      expect(slugs).not.toContain(facts.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
    }
  });

  test("links a model and its uncensored version both ways", () => {
    const base = factsOf(ChatModelId.GLM_5_3);
    const variant = factsOf(ChatModelId.GLM_5_3_UNCENSORED);
    expect(findRelatedModels(base, ALL)[0]).toMatchObject({
      slug: variant.slug,
      reason: "uncensored",
    });
    expect(findRelatedModels(variant, ALL)[0]).toMatchObject({
      slug: base.slug,
      reason: "original",
    });
  });
});

describe("FAQ", () => {
  test("API answer names the callable id; legacy pages point at the successor", () => {
    for (const facts of listModelFacts(ALL)) {
      const api = chatModelFaq(facts, "en-US")[2];
      if (isApiCallable(facts)) {
        expect(api?.answer).toContain(facts.id);
        expect(api?.answer).toContain("paid account");
      } else if (facts.successor !== null) {
        expect(api?.answer).toContain(facts.successor.id);
      }
    }
  });

  test("no unfilled placeholders or em dashes in any locale", () => {
    for (const locale of LOCALES) {
      const items = [
        ...listModelFacts(ALL).flatMap((facts) => chatModelFaq(facts, locale)),
        ...listMediaFacts(ALL).flatMap((facts) => mediaModelFaq(facts, locale)),
      ];
      for (const item of items) {
        expect(`${item.question} ${item.answer}`).not.toMatch(/\{\{|—/);
      }
    }
  });

  test("FAQPage JSON-LD carries the visible text verbatim", () => {
    const faq = chatModelFaq(factsOf(ChatModelId.CLAUDE_SONNET_5_5), "de-DE");
    const parsed = JSON.parse(JSON.stringify(buildFaqStructuredData(faq)));
    expect(parsed.mainEntity.map((q: { name: string }) => q.name)).toEqual(
      faq.map((item) => item.question),
    );
  });
});

describe("structured data", () => {
  test("Product with a per-locale offer plus a 3-level BreadcrumbList", () => {
    const facts = factsOf(ChatModelId.CLAUDE_SONNET_5_5);
    for (const locale of LOCALES) {
      const graph = JSON.parse(
        JSON.stringify(buildChatModelStructuredData(facts, locale, "d")),
      );
      const [product, breadcrumbs] = graph["@graph"];
      expect(product["@type"]).toBe("Product");
      expect(product.brand.name).toBe(facts.labName);
      expect(product.offers.price).toBeGreaterThan(0);
      expect(product.offers.priceCurrency).toBe(
        locale === "pl-PL" ? "PLN" : locale === "en-US" ? "USD" : "EUR",
      );
      expect(product.aggregateRating).toBeUndefined();
      expect(breadcrumbs["@type"]).toBe("BreadcrumbList");
      expect(breadcrumbs.itemListElement).toHaveLength(3);
    }
  });
});
