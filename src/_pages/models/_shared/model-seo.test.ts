import { describe, expect, test } from "bun:test";
import { ChatModelId } from "next-vibe/agent/ai-stream/models";
import type { AgentEnvAvailability } from "next-vibe/agent/env-availability";
import {
  ApiProvider,
  apiProviderDisplayNames,
} from "next-vibe/agent/models/models";
import { ContentLevel } from "next-vibe/agent/skills/enum";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";

import { getCreditUnitPrice } from "@/products/credit-money";

import { buildFaqStructuredData } from "../../_components/faq-structured-data";
import {
  getModelFacts,
  listModelFacts,
  type ModelFacts,
  suggestComparisons,
} from "./model-facts";
import {
  buildFactRows,
  chatHref,
  isApiCallable,
  uncensoredKind,
} from "./model-format";
import { listMediaFacts } from "./model-media-facts";
import {
  bestForContent,
  chatModelBlogSlugs,
  chatModelFaq,
  chatModelLanding,
  chatModelMeta,
  findRelatedMediaModels,
  findRelatedModels,
  HAND_PICKED_MODEL_IDS,
  mediaBestForContent,
  mediaModelFaq,
  mediaModelMeta,
} from "./model-seo";
import {
  buildChatModelStructuredData,
  buildMediaModelStructuredData,
} from "./model-structured-data";

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
  test("labels each documented method and leaves unknown methods unspecified", () => {
    expect(uncensoredKind(factsOf(ChatModelId.UNCENSORED_LM_V1_2))).toBe(
      "ownWorldview",
    );
    expect(uncensoredKind(factsOf(ChatModelId.GLM_5_3_UNCENSORED))).toBe(
      "abliterated",
    );
    expect(uncensoredKind(factsOf(ChatModelId.DRUMMER_ARTEMIS_31B))).toBe(
      "fineTuned",
    );
    expect(uncensoredKind(factsOf(ChatModelId.GAB_AI_ARYA))).toBe("unlisted");
    expect(uncensoredKind(factsOf(ChatModelId.CLAUDE_SONNET_5_5))).toBeNull();
  });

  test("uses only relay routes when the instance forces the relay", () => {
    const availability = {
      ...ALL,
      unbottledSystem: true,
      unbottledForce: true,
    };
    expect(
      getModelFacts(ChatModelId.KIMI_K3_1_PRO_UNCENSORED, ALL),
    ).not.toBeNull();
    expect(
      getModelFacts(ChatModelId.KIMI_K3_1_PRO_UNCENSORED, availability),
    ).toBeNull();
    const relayModel = getModelFacts(
      ChatModelId.MIMO_V2_6_FLASH_ABLITERATED,
      availability,
    );
    expect(relayModel?.providers).toEqual([
      apiProviderDisplayNames[ApiProvider.UNBOTTLED],
    ]);
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
    expect(suggestComparisons(base, ALL).map((other) => other.id)).toContain(
      variant.id,
    );
    expect(suggestComparisons(variant, ALL).map((other) => other.id)).toContain(
      base.id,
    );
  });
});

describe("fact sheets and trial links", () => {
  test("ties optional prices to the same provider as the reference turn", () => {
    const facts = factsOf(ChatModelId.CLAUDE_SONNET_5_5);
    const rows = buildFactRows(facts, "en-US");
    expect(facts.providers[0]).toBe(facts.priceProvider);
    expect(rows.find((row) => row.key === "price")?.hint).toContain(
      facts.priceProvider,
    );
    expect(rows.find((row) => row.key === "cacheReadPrice")?.missing).toBe(
      false,
    );
    expect(rows.find((row) => row.key === "imageOutputPrice")?.missing).toBe(
      true,
    );
    const image = listModelFacts(ALL).find(
      (model) =>
        model.tokenPrice !== null &&
        model.tokenPrice.imageOutputCredits !== null,
    );
    expect(image).toBeDefined();
    if (image !== undefined) {
      expect(chatModelFaq(image, "en-US")[0]?.answer).toContain(
        "one generated image",
      );
    }
  });

  test("prefills a prompt and the model id on the locale's chat page", () => {
    const facts = factsOf(ChatModelId.CLAUDE_SONNET_5_5);
    const url = new URL(chatHref("fr-FR", facts), "https://example.test");
    expect(url.pathname).toBe("/fr-FR/threads/private/new");
    expect(url.searchParams.get("model")).toBe(facts.id);
    expect(url.searchParams.get("q")).toBeTruthy();
  });

  test("media guidance and pricing use the model's output and a visible provider", () => {
    for (const facts of listMediaFacts(ALL)) {
      const bestFor = mediaBestForContent(facts, "en-US");
      expect(bestFor.good).toHaveLength(1);
      expect(bestFor.skip.length).toBeGreaterThan(0);
      if (facts.price !== null) {
        expect(facts.providers).toContain(facts.price.provider);
        expect(mediaModelFaq(facts, "en-US")[0]?.answer).toContain(
          facts.price.provider,
        );
      }
    }
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

  test("uncensored answers open with a yes; others never do", () => {
    for (const facts of listModelFacts(ALL)) {
      const answer = chatModelFaq(facts, "en-US")[1]?.answer ?? "";
      expect(answer.startsWith("Yes.")).toBe(uncensoredKind(facts) !== null);
    }
  });

  test("cheaper alternative comes from the related cheaper pick", () => {
    for (const facts of listModelFacts(ALL)) {
      const related = findRelatedModels(facts, ALL);
      const cheaper = related.find((other) => other.reason === "cheaper");
      const item = chatModelFaq(facts, "en-US", related).find((faq) =>
        faq.question.startsWith("Is there a cheaper alternative"),
      );
      if (cheaper === undefined) {
        expect(item).toBeUndefined();
      } else {
        expect(item?.answer).toContain(cheaper.name);
        expect(cheaper.credits ?? 0).toBeLessThan(facts.creditsPerMessage);
      }
    }
  });

  test("read-more links match the model's kind and leave room for a landing", () => {
    const abliterated = factsOf(ChatModelId.GLM_5_3_UNCENSORED);
    expect(chatModelLanding(abliterated)).toBe("abliterated");
    expect(chatModelBlogSlugs(abliterated)[0]).toBe(
      "abliterated-vs-uncensored-models",
    );
    const ownWorldview = factsOf(ChatModelId.UNCENSORED_LM_V1_2);
    expect(chatModelLanding(ownWorldview)).toBe("uncensored");
    expect(chatModelBlogSlugs(ownWorldview)[0]).toBe(
      "uncensored-models-what-each-is-good-at",
    );
    expect(chatModelLanding(factsOf(ChatModelId.CLAUDE_SONNET_5_5))).toBeNull();
    for (const facts of listModelFacts(ALL)) {
      const slots = chatModelLanding(facts) === null ? 3 : 2;
      const slugs = chatModelBlogSlugs(facts);
      expect(slugs.length).toBeLessThanOrEqual(slots);
      expect(new Set(slugs).size).toBe(slugs.length);
      expect(slugs.includes("best-uncensored-llm")).toBe(
        facts.content === ContentLevel.UNCENSORED,
      );
    }
  });

  test("no unfilled placeholders or em dashes in any locale", () => {
    for (const locale of LOCALES) {
      const items = [
        ...listModelFacts(ALL).flatMap((facts) =>
          chatModelFaq(facts, locale, findRelatedModels(facts, ALL)),
        ),
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
    expect(parsed.mainEntity).toMatchObject(
      faq.map(({ question, answer }) => ({
        name: question,
        acceptedAnswer: { text: answer },
      })),
    );
  });
});

describe("structured data", () => {
  test("chat models carry a Service with a per-locale offer and breadcrumbs", () => {
    const facts = factsOf(ChatModelId.CLAUDE_SONNET_5_5);
    for (const locale of LOCALES) {
      const graph = JSON.parse(
        JSON.stringify(buildChatModelStructuredData(facts, locale, "d")),
      );
      const [service, breadcrumbs] = graph["@graph"];
      const { amount, currency } = getCreditUnitPrice(locale);
      expect(service["@type"]).toBe("Service");
      expect(service.brand.name).toBe(facts.labName);
      expect(service.offers.price).toBeCloseTo(
        facts.creditsPerMessage * amount,
        6,
      );
      expect(service.offers.priceCurrency).toBe(currency);
      expect(service.aggregateRating).toBeUndefined();
      expect(service.review).toBeUndefined();
      expect(service.offers.shippingDetails).toBeUndefined();
      expect(service.offers.hasMerchantReturnPolicy).toBeUndefined();
      expect(breadcrumbs["@type"]).toBe("BreadcrumbList");
      expect(breadcrumbs.itemListElement).toHaveLength(3);
    }
  });

  test("media model offers exist only when the unit and registry price are known", () => {
    const facts = listMediaFacts(ALL).find((model) => model.price !== null);
    if (!facts?.price) {
      expect.unreachable("registry has no priced media models");
    }
    const locale = "pl-PL";
    const { amount, currency } = getCreditUnitPrice(locale);
    const withPrice = buildMediaModelStructuredData(facts, locale, "d", "image");
    const withoutPrice = buildMediaModelStructuredData(
      { ...facts, price: null },
      locale,
      "d",
      "image",
    );
    const [service] = JSON.parse(JSON.stringify(withPrice))["@graph"];
    expect(service["@type"]).toBe("Service");
    expect(service.offers.price).toBeCloseTo(facts.price.credits * amount, 6);
    expect(service.offers.priceCurrency).toBe(currency);
    expect(JSON.stringify(withoutPrice)).not.toContain('"offers"');
  });
});
