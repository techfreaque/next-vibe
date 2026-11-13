import { describe, expect, test } from "bun:test";

import { ChatModelId } from "next-vibe/agent/ai-stream/models";

import { collectSitemapEntries } from "../../_root/sitemap.xml/build-sitemap";
import { listCatalogEntries } from "./model-catalog-entries";
import {
  findModelPageAlias,
  findPublicModelId,
  isModelPageAlias,
  listModelFacts,
  PUBLIC_CHAT_MODEL_IDS,
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
