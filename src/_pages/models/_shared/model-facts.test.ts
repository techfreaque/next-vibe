import { describe, expect, test } from "bun:test";
import {
  ChatModelId,
  chatModelOptionsPool,
} from "next-vibe/agent/ai-stream/models";
import {
  calculateCreditCost,
  estimateTurnCredits,
} from "next-vibe/agent/models/models";
import type { AgentEnvAvailability } from "next-vibe/agent/env-availability";
import { ContentLevel } from "next-vibe/agent/skills/enum";

import { collectSitemapEntries } from "../../_root/sitemap.xml/build-sitemap";
import { listCatalogEntries } from "./model-catalog-entries";
import { findMediaFacts, listMediaFacts } from "./model-media-facts";
import {
  OWN_WORLDVIEW_UNCENSORED_MODEL_ID,
  FEATURED_COMPARISON_PAIRS,
  findModelPageAlias,
  findPublicModelId,
  getModelFacts,
  isChatModelAvailable,
  isModelPageAlias,
  listModelFacts,
  PUBLIC_CHAT_MODEL_IDS,
  REFERENCE_INPUT_TOKENS,
  REFERENCE_OUTPUT_TOKENS,
  suggestComparisons,
  toModelSlug,
} from "./model-facts";

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

/** Prod's key set (2026-11-17): no OpenAI, Replicate, fal, Deepgram, ElevenLabs. */
const PROD_LIKE: AgentEnvAvailability = {
  ...ALL,
  claudeCode: false,
  openAiImages: false,
  openAiStt: false,
  openAiTts: false,
  replicate: false,
  falAi: false,
  deepgram: false,
  elevenlabs: false,
};

const CLAUDE_CODE_ALIASES: readonly (readonly [ChatModelId, ChatModelId])[] = [
  [ChatModelId.CLAUDE_CODE_HAIKU, ChatModelId.CLAUDE_HAIKU_5_5],
  [ChatModelId.CLAUDE_CODE_SONNET, ChatModelId.CLAUDE_SONNET_5_5],
  [ChatModelId.CLAUDE_CODE_OPUS, ChatModelId.CLAUDE_OPUS_5_5],
  [ChatModelId.CLAUDE_CODE_FABLE, ChatModelId.CLAUDE_FABLE_5_1],
];

describe("one public page per model", () => {
  test("public model names are unique", () => {
    const names = listModelFacts(ALL).map((f) => f.name);
    expect(new Set(names).size).toBe(names.length);
  });

  test("Claude Code entries are aliases of the regular Claude models", () => {
    for (const [alias, canonical] of CLAUDE_CODE_ALIASES) {
      expect(isModelPageAlias(alias)).toBe(true);
      expect(PUBLIC_CHAT_MODEL_IDS).not.toContain(alias);
      expect(PUBLIC_CHAT_MODEL_IDS).toContain(canonical);
      // Old duplicate URL resolves to the canonical page (redirect target).
      expect(findModelPageAlias(toModelSlug(alias))).toBe(canonical);
      expect(findPublicModelId(toModelSlug(alias))).toBe(canonical);
      // The canonical slug is not an alias (no redirect loop).
      expect(findModelPageAlias(toModelSlug(canonical))).toBeNull();
    }
  });

  test("public catalog lists each model once", () => {
    const names = listCatalogEntries("text").map((e) => e.name);
    expect(new Set(names).size).toBe(names.length);
    const ids = listCatalogEntries("text").map((e) => e.modelId);
    for (const [alias] of CLAUDE_CODE_ALIASES) {
      expect(ids).not.toContain(alias);
    }
  });

  test("sitemap has no duplicate model pages", () => {
    const paths = collectSitemapEntries(ALL).map((e) => e.path);
    for (const [alias, canonical] of CLAUDE_CODE_ALIASES) {
      expect(paths).not.toContain(`/models/${toModelSlug(alias)}`);
      expect(paths).toContain(`/models/${toModelSlug(canonical)}`);
      expect(paths.some((p) => p.includes(`/${toModelSlug(alias)}`))).toBe(
        false,
      );
    }
  });
});

describe("own-worldview uncensored model comparisons", () => {
  test("the own-worldview uncensored model has a public page", () => {
    expect(PUBLIC_CHAT_MODEL_IDS).toContain(OWN_WORLDVIEW_UNCENSORED_MODEL_ID);
  });

  test("every uncensored-tier text model links to it first", () => {
    for (const facts of listModelFacts(ALL)) {
      if (
        facts.isLegacy ||
        facts.id === OWN_WORLDVIEW_UNCENSORED_MODEL_ID ||
        facts.content !== ContentLevel.UNCENSORED ||
        facts.outputs.join() !== "text"
      ) {
        continue;
      }
      expect(suggestComparisons(facts, ALL)[0]?.id).toBe(
        OWN_WORLDVIEW_UNCENSORED_MODEL_ID,
      );
    }
  });

  test("its page links every featured pair, and the sitemap lists them", () => {
    const facts = getModelFacts(OWN_WORLDVIEW_UNCENSORED_MODEL_ID, ALL);
    expect(facts).not.toBeNull();
    if (facts === null) {
      return;
    }
    const linked = suggestComparisons(facts, ALL).map((pick) => pick.id);
    const paths = new Set(collectSitemapEntries(ALL).map((entry) => entry.path));
    for (const [a, b] of FEATURED_COMPARISON_PAIRS) {
      expect(linked).toContain(a === facts.id ? b : a);
      expect(
        paths.has(`/models/compare/${toModelSlug(a)}/${toModelSlug(b)}`),
      ).toBe(true);
    }
  });
});

describe("model page price per message", () => {
  test("image-output models include one image at the image token rate", () => {
    const imageModelIds = new Set(
      chatModelOptionsPool
        .filter(
          (o) =>
            "imageOutputTokenCost" in o &&
            o.imageOutputTokenCost !== undefined &&
            PUBLIC_CHAT_MODEL_IDS.includes(o.id),
        )
        .map((o) => o.id),
    );
    expect(imageModelIds.size).toBeGreaterThan(0);
    for (const id of imageModelIds) {
      const options = chatModelOptionsPool.filter(
        (o) => o.id === id && !o.adminOnly,
      );
      const cheapestText = Math.min(
        ...options.map((o) =>
          calculateCreditCost(
            o,
            REFERENCE_INPUT_TOKENS,
            REFERENCE_OUTPUT_TOKENS,
          ),
        ),
      );
      const cheapestEstimate = Math.min(
        ...options.map((o) =>
          estimateTurnCredits(
            o,
            REFERENCE_INPUT_TOKENS,
            REFERENCE_OUTPUT_TOKENS,
          ),
        ),
      );
      const shown = getModelFacts(id, ALL)?.creditsPerMessage ?? 0;
      expect({ id, shown }).toEqual({
        id,
        shown: Math.round(cheapestEstimate * 100) / 100,
      });
      expect(shown).toBeGreaterThan(cheapestText);
    }
  });
});

describe("models without a configured provider key are hidden", () => {
  test("no ElevenLabs voice on the catalog, sitemap or media facts", () => {
    const tts = listCatalogEntries("tts", { availability: PROD_LIKE });
    expect(tts.length).toBeGreaterThan(0);
    expect(tts.some((entry) => entry.labId === "elevenlabs")).toBe(false);
    expect(
      listMediaFacts(PROD_LIKE).some(
        (facts) =>
          facts.type === "tts" && facts.modelId.startsWith("elevenlabs-"),
      ),
    ).toBe(false);
    expect(findMediaFacts("elevenlabs-rachel", PROD_LIKE)).toBeNull();
    const paths = collectSitemapEntries(PROD_LIKE).map((e) => e.path);
    expect(paths.some((p) => p.includes("elevenlabs-rachel"))).toBe(false);
  });

  test("the voices exist when the key is configured", () => {
    expect(findMediaFacts("elevenlabs-rachel", ALL)).not.toBeNull();
    expect(
      listCatalogEntries("tts", { availability: ALL }).some(
        (entry) => entry.labId === "elevenlabs",
      ),
    ).toBe(true);
  });

  test("a chat model with no configured provider has no facts", () => {
    const none: AgentEnvAvailability = {
      openRouter: false,
      claudeCode: false,
      voice: false,
      braveSearch: false,
      kagiSearch: false,
      anySearch: false,
      uncensoredAI: false,
      freedomGPT: false,
      gabAI: false,
      veniceAI: false,
      nanoGPT: false,
      scrappey: false,
      openAiImages: false,
      openAiStt: false,
      replicate: false,
      falAi: false,
      modelsLab: false,
      edenAiStt: false,
      deepgram: false,
      openAiTts: false,
      edenAiTts: false,
      elevenlabs: false,
      unbottledSystem: false,
      unbottledForce: false,
    };
    expect(listModelFacts(none)).toEqual([]);
    expect(getModelFacts(OWN_WORLDVIEW_UNCENSORED_MODEL_ID, none)).toBeNull();
    expect(isChatModelAvailable(OWN_WORLDVIEW_UNCENSORED_MODEL_ID, PROD_LIKE)).toBe(
      true,
    );
  });
});
