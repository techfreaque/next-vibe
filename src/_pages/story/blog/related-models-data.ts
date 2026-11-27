/**
 * "Models to try" links at the end of platform and alternatives posts that do
 * not already link model pages in their body. Server-only (reads the
 * instance's env availability): page modules call `loadRelatedModels` in their
 * tanstackLoader and pass the result to ArticleEnd.
 *
 * Compare pairs come from the editorial/featured sets that the sitemap
 * already lists, so every emitted compare URL is indexable and sitemapped
 * (asserted in related-models.test.ts). Unavailable or legacy models and
 * non-indexable pairs are dropped at load time, never linked.
 */

import { ChatModelId } from "next-vibe/agent/ai-stream/models";
import type { AgentEnvAvailability } from "next-vibe/agent/env-availability";
import { getEnvAvailability } from "next-vibe/agent/env-availability";

import {
  canonicalComparisonPath,
  getModelFacts,
  isIndexableComparison,
} from "@/_pages/models/_shared/model-facts";

import type { BlogPostSlug } from "./posts-meta";

type RelatedModelSpec =
  | { model: ChatModelId }
  | { pair: readonly [ChatModelId, ChatModelId] };

/** One crawlable link: a model page or a model comparison (locale-less path). */
export type RelatedModelLink =
  | { kind: "model"; path: string; name: string }
  | { kind: "compare"; path: string; a: string; b: string };

const ULM = ChatModelId.UNCENSORED_LM_V1_2;

/** Curated per post, most relevant first. Two or three each. */
export const RELATED_MODEL_SPECS: Partial<
  Record<BlogPostSlug, readonly RelatedModelSpec[]>
> = {
  "character-ai-alternatives": [
    { model: ChatModelId.VENICE_UNCENSORED_ROLEPLAY },
    { model: ChatModelId.DRUMMER_ARTEMIS_31B },
    { pair: [ULM, ChatModelId.VENICE_UNCENSORED_ROLEPLAY] },
  ],
  "janitor-ai-alternatives": [
    { model: ChatModelId.VENICE_UNCENSORED_ROLEPLAY },
    { pair: [ULM, ChatModelId.DRUMMER_ARTEMIS_31B] },
    { pair: [ULM, ChatModelId.VENICE_UNCENSORED_ROLEPLAY] },
  ],
  "chub-ai-alternatives": [
    { model: ChatModelId.DRUMMER_ARTEMIS_31B },
    { pair: [ULM, ChatModelId.VENICE_UNCENSORED_ROLEPLAY] },
    { pair: [ULM, ChatModelId.DRUMMER_ARTEMIS_31B] },
  ],
  "crushon-ai-alternatives": [
    { model: ChatModelId.VENICE_UNCENSORED_ROLEPLAY },
    { pair: [ULM, ChatModelId.VENICE_UNCENSORED_ROLEPLAY] },
    { pair: [ULM, ChatModelId.VENICE_DEEPSEEK_V4_1_FLASH_UNCENSORED] },
  ],
  "sillytavern-alternatives": [
    { model: ChatModelId.DRUMMER_ARTEMIS_31B },
    { model: ChatModelId.GLM_5_3_FLASH_UNCENSORED },
    { pair: [ULM, ChatModelId.DRUMMER_ARTEMIS_31B] },
  ],
  "claude-alternatives": [
    { model: ChatModelId.KIMI_K3_1_PRO_UNCENSORED },
    { pair: [ChatModelId.CLAUDE_SONNET_5_5, ChatModelId.GLM_5_3_UNCENSORED] },
    { pair: [ULM, ChatModelId.CLAUDE_SONNET_5_5] },
  ],
  "freedomgpt-alternatives": [
    { pair: [ULM, ChatModelId.FREEDOMGPT_LIBERTY] },
    { model: ChatModelId.GLM_5_3_UNCENSORED },
    { pair: [ULM, ChatModelId.GLM_5_3_UNCENSORED] },
  ],
  "gab-ai-alternatives": [
    { pair: [ULM, ChatModelId.GAB_AI_ARYA] },
    { pair: [ULM, ChatModelId.GROK_4_7] },
    { pair: [ULM, ChatModelId.GPT_6_2_SOL] },
  ],
  "free-uncensored-ai": [
    { model: ChatModelId.GLM_5_3_FLASH_UNCENSORED },
    {
      pair: [ChatModelId.GLM_5_3_FLASH, ChatModelId.GLM_5_3_FLASH_UNCENSORED],
    },
    { pair: [ULM, ChatModelId.GLM_5_3_FLASH_UNCENSORED] },
  ],
  "nanogpt-alternatives": [
    { model: ChatModelId.KIMI_K3_1_PRO_UNCENSORED },
    { pair: [ChatModelId.GLM_5_3, ChatModelId.GLM_5_3_UNCENSORED] },
    {
      pair: [
        ChatModelId.DEEPSEEK_V4_1_FLASH,
        ChatModelId.VENICE_DEEPSEEK_V4_1_FLASH_UNCENSORED,
      ],
    },
  ],
  "nofiltergpt-alternatives": [
    { model: ChatModelId.GLM_5_3_UNCENSORED },
    { pair: [ULM, ChatModelId.GLM_5_3_UNCENSORED] },
    { pair: [ULM, ChatModelId.GPT_6_2_SOL] },
  ],
  "venice-ai-alternatives": [
    { model: ChatModelId.VENICE_UNCENSORED },
    { pair: [ULM, ChatModelId.VENICE_UNCENSORED] },
    {
      pair: [
        ChatModelId.DEEPSEEK_V4_1_FLASH,
        ChatModelId.VENICE_DEEPSEEK_V4_1_FLASH_UNCENSORED,
      ],
    },
  ],
  "poe-alternatives": [
    { model: ChatModelId.GPT_6_2_SOL },
    { pair: [ULM, ChatModelId.CLAUDE_SONNET_5_5] },
    { pair: [ChatModelId.GPT_6_2_SOL, ChatModelId.KIMI_K3_1_PRO] },
  ],
  "typingmind-alternatives": [
    { model: ChatModelId.CLAUDE_SONNET_5_5 },
    { pair: [ChatModelId.CLAUDE_SONNET_5_5, ChatModelId.KIMI_K3_1_PRO] },
    { pair: [ChatModelId.GLM_5_3, ChatModelId.DEEPSEEK_V4_PRO] },
  ],
  "model-refresh-uncensored-providers": [
    { model: ChatModelId.QWEN_3_6_PLUS_UNCENSORED },
    { pair: [ChatModelId.GLM_5_3, ChatModelId.GLM_5_3_UNCENSORED] },
    {
      pair: [
        ChatModelId.DEEPSEEK_V4_1_FLASH,
        ChatModelId.VENICE_DEEPSEEK_V4_1_FLASH_UNCENSORED,
      ],
    },
  ],
  "unbottled-api-in-coding-tools": [
    { model: ChatModelId.GLM_5_3_UNCENSORED },
    { pair: [ChatModelId.CLAUDE_SONNET_5_5, ChatModelId.KIMI_K3_1_PRO] },
    { pair: [ChatModelId.GLM_5_3, ChatModelId.DEEPSEEK_V4_PRO] },
  ],
};

/** Links for a post on this instance: live, current models and indexable pairs only. */
export function relatedModelLinks(
  slug: BlogPostSlug,
  availability: AgentEnvAvailability,
): RelatedModelLink[] {
  const specs = RELATED_MODEL_SPECS[slug] ?? [];
  return specs.flatMap((spec): RelatedModelLink[] => {
    if ("model" in spec) {
      const facts = getModelFacts(spec.model, availability);
      if (facts === null || facts.isLegacy) {
        return [];
      }
      return [
        { kind: "model", path: `/models/${facts.slug}`, name: facts.name },
      ];
    }
    const left = getModelFacts(spec.pair[0], availability);
    const right = getModelFacts(spec.pair[1], availability);
    if (
      left === null ||
      right === null ||
      left.isLegacy ||
      right.isLegacy ||
      !isIndexableComparison(left, right)
    ) {
      return [];
    }
    return [
      {
        kind: "compare",
        path: canonicalComparisonPath(left, right),
        a: left.name,
        b: right.name,
      },
    ];
  });
}

export async function loadRelatedModels(
  slug: BlogPostSlug,
): Promise<RelatedModelLink[]> {
  return relatedModelLinks(slug, await getEnvAvailability());
}
