import { describe, expect, test } from "bun:test";
import { ChatModelId } from "next-vibe/agent/ai-stream/models";
import type { AgentEnvAvailability } from "next-vibe/agent/env-availability";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";

import {
  compareFaq,
  compareReadMore,
  compareVerdict,
  moreComparisons,
  priceRatio,
} from "./model-compare";
import {
  canonicalComparisonPath,
  getModelFacts,
  type ModelFacts,
} from "./model-facts";
import { compareHref } from "./model-format";
import { compareMeta } from "./model-seo";
import { buildCompareStructuredData } from "./model-structured-data";

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

const LOCALES: readonly CountryLanguage[] = [
  "en-US",
  "de-DE",
  "pl-PL",
  "fr-FR",
  "it-IT",
  "es-ES",
];

function factsOf(id: ChatModelId): ModelFacts {
  const facts = getModelFacts(id, ALL);
  if (facts === null) {
    return expect.unreachable(`no public page for ${id}`);
  }
  return facts;
}

function factsBySlug(slug: string): ModelFacts {
  const id = Object.values(ChatModelId).find(
    (candidate) => getModelFacts(candidate, ALL)?.slug === slug,
  );
  return id === undefined
    ? expect.unreachable(`no model ${slug}`)
    : factsOf(id);
}

const PAIRS: readonly (readonly [ChatModelId, ChatModelId])[] = [
  [ChatModelId.UNCENSORED_LM_V1_2, ChatModelId.GPT_6_2_SOL],
  [ChatModelId.CLAUDE_OPUS_5_5, ChatModelId.CLAUDE_SONNET_5_5],
  [ChatModelId.GLM_5_3, ChatModelId.GLM_5_3_UNCENSORED],
  [ChatModelId.DEEPSEEK_V4_1_FLASH, ChatModelId.GEMINI_3_8_FLASH],
];

describe("compare pages", () => {
  test("verdict, FAQ and meta render without placeholders in every locale", () => {
    for (const [a, b] of PAIRS) {
      const left = factsOf(a);
      const right = factsOf(b);
      for (const locale of LOCALES) {
        const verdict = compareVerdict(left, right, locale);
        const faq = compareFaq(left, right, locale);
        const meta = compareMeta(left, right, locale);
        const text = [
          ...verdict.headline,
          ...verdict.left,
          ...verdict.right,
          ...faq.flatMap((item) => [item.question, item.answer]),
          meta.title,
          meta.description,
        ].join("\n");
        expect(text).not.toContain("{{");
        expect(text).not.toContain("compareFaq.");
        expect(text).not.toContain("—");
        expect(meta.description.length).toBeLessThanOrEqual(160);
        expect(new Set(faq.map((item) => item.question)).size).toBe(faq.length);
        expect(faq[0]?.question).toContain(left.name);
        expect(faq[0]?.question).toContain(right.name);
      }
    }
  });

  test("reasons only come from real differences", () => {
    const sol = factsOf(ChatModelId.GPT_6_2_SOL);
    const lm = factsOf(ChatModelId.UNCENSORED_LM_V1_2);
    const verdict = compareVerdict(lm, sol, "en-US");
    expect(verdict.similar).toBe(false);
    expect(verdict.left.some((line) => line.includes("Uncensored"))).toBe(true);
    if (sol.contextWindow > lm.contextWindow * 1.1) {
      expect(
        verdict.right.some((line) => line.startsWith("More context")),
      ).toBe(true);
      expect(verdict.left.some((line) => line.startsWith("More context"))).toBe(
        false,
      );
    }
  });

  test("a model against an identical copy gets no invented edge", () => {
    const sol = factsOf(ChatModelId.GPT_6_2_SOL);
    const twin: ModelFacts = { ...sol, name: `${sol.name} twin` };
    const verdict = compareVerdict(sol, twin, "en-US");
    expect(verdict.similar).toBe(true);
    expect(verdict.left).toEqual([]);
    expect(verdict.right).toEqual([]);
  });

  test("a free model is cheaper without a ratio", () => {
    expect(priceRatio(0, 5)).toBe(Number.POSITIVE_INFINITY);
    expect(priceRatio(0, 0)).toBe(1);
    expect(priceRatio(2, 4)).toBe(2);
  });

  test("more comparisons skip the other model and use canonical URLs", () => {
    const lm = factsOf(ChatModelId.UNCENSORED_LM_V1_2);
    const sol = factsOf(ChatModelId.GPT_6_2_SOL);
    const links = moreComparisons(lm, sol, ALL);
    expect(links.length).toBeGreaterThan(0);
    expect(links.length).toBeLessThanOrEqual(3);
    for (const link of links) {
      expect(link.path).not.toContain(`/${sol.slug}`);
      expect(link.path).not.toContain("/tools/");
      const [, , , a, b] = link.path.split("/");
      expect(link.path.startsWith("/models/compare/")).toBe(true);
      expect(a === lm.slug || b === lm.slug).toBe(true);
      const otherSlug = a === lm.slug ? b : a;
      const other = factsBySlug(otherSlug ?? "");
      expect(canonicalComparisonPath(lm, other)).toBe(link.path);
    }
  });

  test("localized compare links use canonical order for either input order", () => {
    const uncensored = ChatModelId.UNCENSORED_LM_V1_2;
    const sonnet = ChatModelId.CLAUDE_SONNET_5_5;
    const canonical = "/de-DE/models/compare/uncensored-lm-v1-2/claude-sonnet-5-5";
    expect(compareHref("de-DE", sonnet, uncensored)).toBe(canonical);
    expect(compareHref("de-DE", uncensored, sonnet)).toBe(canonical);
  });

  test("read-more links stay within three cards", () => {
    for (const [a, b] of PAIRS) {
      const readMore = compareReadMore(factsOf(a), factsOf(b));
      expect(
        readMore.landings.length + readMore.posts.length,
      ).toBeLessThanOrEqual(3);
      expect(new Set(readMore.posts).size).toBe(readMore.posts.length);
    }
  });

  test("structured data is one Service per model plus breadcrumbs, never Product", () => {
    const left = factsOf(ChatModelId.UNCENSORED_LM_V1_2);
    const right = factsOf(ChatModelId.GPT_6_2_SOL);
    const data = buildCompareStructuredData(
      "en-US",
      "UncensoredLM vs GPT",
      canonicalComparisonPath(left, right),
      [
        { facts: left, description: "a" },
        { facts: right, description: "b" },
      ],
    );
    const json = JSON.stringify(data);
    expect(json).not.toContain('"Product"');
    expect(json).not.toContain("aggregateRating");
    expect(json).not.toContain("review");
    expect(json.match(/"@type":"Service"/g)?.length).toBe(2);
    expect(json).toContain('"BreadcrumbList"');
  });
});
