import { describe, expect, test } from "bun:test";
import { ChatModelId } from "next-vibe/agent/ai-stream/models";
import { ContentLevel } from "next-vibe/agent/skills/enum";

import { collectSitemapEntries } from "../../_root/sitemap.xml/build-sitemap";
import { listCatalogEntries } from "./model-catalog-entries";
import {
  BUILT_UNCENSORED_MODEL_ID,
  FEATURED_COMPARISON_PAIRS,
  findModelPageAlias,
  findPublicModelId,
  getModelFacts,
  isModelPageAlias,
  listModelFacts,
  PUBLIC_CHAT_MODEL_IDS,
  suggestComparisons,
  toModelSlug,
} from "./model-facts";

const CLAUDE_CODE_ALIASES: readonly (readonly [ChatModelId, ChatModelId])[] = [
  [ChatModelId.CLAUDE_CODE_HAIKU, ChatModelId.CLAUDE_HAIKU_5_5],
  [ChatModelId.CLAUDE_CODE_SONNET, ChatModelId.CLAUDE_SONNET_5_5],
  [ChatModelId.CLAUDE_CODE_OPUS, ChatModelId.CLAUDE_OPUS_5_5],
  [ChatModelId.CLAUDE_CODE_FABLE, ChatModelId.CLAUDE_FABLE_5_1],
];

describe("one public page per model", () => {
  test("public model names are unique", () => {
    const names = listModelFacts().map((f) => f.name);
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
    const paths = collectSitemapEntries().map((e) => e.path);
    for (const [alias, canonical] of CLAUDE_CODE_ALIASES) {
      expect(paths).not.toContain(`/models/${toModelSlug(alias)}`);
      expect(paths).toContain(`/models/${toModelSlug(canonical)}`);
      expect(
        paths.some((p) => p.includes(`/${toModelSlug(alias)}`)),
      ).toBe(false);
    }
  });
});

describe("built-uncensored model comparisons", () => {
  test("the built-uncensored model has a public page", () => {
    expect(PUBLIC_CHAT_MODEL_IDS).toContain(BUILT_UNCENSORED_MODEL_ID);
  });

  test("every uncensored-tier text model links to it first", () => {
    for (const facts of listModelFacts()) {
      if (
        facts.isLegacy ||
        facts.id === BUILT_UNCENSORED_MODEL_ID ||
        facts.content !== ContentLevel.UNCENSORED ||
        facts.outputs.join() !== "text"
      ) {
        continue;
      }
      expect(suggestComparisons(facts)[0]?.id).toBe(BUILT_UNCENSORED_MODEL_ID);
    }
  });

  test("its page links every featured pair, and the sitemap lists them", () => {
    const facts = getModelFacts(BUILT_UNCENSORED_MODEL_ID);
    expect(facts).not.toBeNull();
    if (facts === null) {
      return;
    }
    const linked = suggestComparisons(facts).map((pick) => pick.id);
    const paths = new Set(collectSitemapEntries().map((entry) => entry.path));
    for (const [a, b] of FEATURED_COMPARISON_PAIRS) {
      expect(linked).toContain(a === facts.id ? b : a);
      expect(
        paths.has(`/models/compare/${toModelSlug(a)}/${toModelSlug(b)}`),
      ).toBe(true);
    }
  });
});
