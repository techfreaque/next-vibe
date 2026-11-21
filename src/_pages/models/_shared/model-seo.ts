/**
 * Registry-derived page content for the public /models pages: "best for"
 * lists, related models, visible FAQs, blog links, titles and descriptions.
 *
 * Pure + static + server-safe. Every statement is generated from the model
 * registry (tier, strengths, inputs, price, context, tools, legacy state) so
 * each page says something specific to its model and never invents a fact.
 * The only hand-written copy is one "best for" line for a few top models,
 * keyed by id in HAND_PICKED_LINES and translated in all locales.
 */

import { ChatModelId } from "next-vibe/agent/ai-stream/models";
import type { AgentEnvAvailability } from "next-vibe/agent/env-availability";
import { ModelUtility } from "next-vibe/agent/models/enum";
import {
  ContentLevel,
  IntelligenceLevel,
  type IntelligenceLevelValue,
} from "next-vibe/agent/skills/enum";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { TranslatedKeyType } from "next-vibe/core/i18n/core/scoped-translation";

import { configScopedTranslation } from "@/env/i18n";

import type { FaqItem } from "../../_components/faq-structured-data";
import type { BlogPostSlug } from "../../story/blog/posts-meta";
import { scopedTranslation } from "../i18n";
import {
  formatTokenCount,
  isUncensoredVariantOf,
  listModelFacts,
  type ModelFacts,
} from "./model-facts";
import {
  formatMoney,
  formatNumber,
  isApiCallable,
  mediaUnitText,
  modalityList,
  referenceTurnText,
  tierName,
  uncensoredKind,
} from "./model-format";
import {
  listMediaFacts,
  type MediaModelFacts,
  type MediaPrice,
} from "./model-media-facts";

/** Google shows ~60 characters of a title; longer ones get cut mid-word. */
const TITLE_MAX_CHARS = 60;
/** "Whole books in one prompt" from here up. */
const LONG_CONTEXT_TOKENS = 1_000_000;
/** "Skip it for very long documents" below this. */
const SMALL_CONTEXT_TOKENS = 100_000;
/** "Budget" pick at or under this many credits per reference message. */
const BUDGET_CREDITS = 0.6;
/** "Pricey" at or over this many credits per reference message. */
const PRICEY_CREDITS = 10;
const MAX_GOOD_ITEMS = 6;
const MAX_SKIP_ITEMS = 3;
const MAX_RELATED = 6;

// ─── Titles ──────────────────────────────────────────────────────────────────

/** First candidate that fits a search result title, else the last (shortest). */
function fitTitle(
  first: TranslatedKeyType,
  ...rest: TranslatedKeyType[]
): TranslatedKeyType {
  const candidates = [first, ...rest];
  for (const candidate of candidates) {
    if (candidate.length <= TITLE_MAX_CHARS) {
      return candidate;
    }
  }
  return candidates[candidates.length - 1] ?? first;
}

export interface PageMeta {
  title: TranslatedKeyType;
  description: TranslatedKeyType;
}

export function chatModelMeta(
  facts: ModelFacts,
  locale: CountryLanguage,
): PageMeta {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const vars = {
    appName: configT("appName"),
    model: facts.name,
    lab: facts.labName,
    tier: tierName(facts.content, locale),
    context: formatTokenCount(facts.contextWindow),
    credits: formatNumber(facts.creditsPerMessage, locale),
    money: formatMoney(facts.creditsPerMessage, locale),
    input:
      facts.tokenPrice === null
        ? ""
        : formatMoney(facts.tokenPrice.inputCredits, locale),
    output:
      facts.tokenPrice === null
        ? ""
        : formatMoney(facts.tokenPrice.outputCredits, locale),
    successor: facts.successor?.name ?? "",
  };
  if (facts.isLegacy) {
    return {
      title: fitTitle(
        t("meta.model.titleLegacy", vars),
        t("meta.model.titleLegacyShort", vars),
        t("meta.model.titleMin", vars),
      ),
      description:
        facts.successor === null
          ? t("meta.model.descriptionLegacyNoSuccessor", vars)
          : t("meta.model.descriptionLegacy", vars),
    };
  }
  const uncensored = facts.content === ContentLevel.UNCENSORED;
  const hasTokenPrice = facts.tokenPrice !== null;
  return {
    title: uncensored
      ? fitTitle(
          t("meta.model.titleUncensored", vars),
          t("meta.model.titleUncensoredShort", vars),
          t("meta.model.titleUncensoredMin", vars),
        )
      : fitTitle(
          t("meta.model.title", vars),
          t("meta.model.titleShort", vars),
          t("meta.model.titleMin", vars),
        ),
    description: uncensored
      ? hasTokenPrice
        ? t("meta.model.descriptionUncensored", vars)
        : t("meta.model.descriptionUncensoredFlat", vars)
      : hasTokenPrice
        ? t("meta.model.description", vars)
        : t("meta.model.descriptionFlat", vars),
  };
}

export function mediaModelMeta(
  facts: MediaModelFacts,
  locale: CountryLanguage,
): PageMeta {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const base = {
    appName: configT("appName"),
    model: facts.name,
    lab: facts.labName,
    tier: tierName(facts.content, locale),
    type: t(`catalog.types.${facts.type}`),
    inputs: modalityList(facts.inputs, t),
  };
  if (facts.price === null) {
    return {
      title: fitTitle(
        t("meta.media.titleNoPrice", base),
        t("meta.media.titleNoPriceShort", base),
      ),
      description: t("meta.media.descriptionNoPrice", base),
    };
  }
  const vars = {
    ...base,
    credits: formatNumber(facts.price.credits, locale),
    money: formatMoney(facts.price.credits, locale),
    unit: mediaUnitText(facts.price, t),
  };
  return {
    title: fitTitle(
      t("meta.media.title", vars),
      t("meta.media.titleShort", vars),
      t("meta.media.titleMin", vars),
    ),
    description: t("meta.media.description", vars),
  };
}

export function compareMeta(
  left: ModelFacts,
  right: ModelFacts,
  locale: CountryLanguage,
): PageMeta {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const vars = {
    appName: configT("appName"),
    a: left.name,
    b: right.name,
    creditsA: formatNumber(left.creditsPerMessage, locale),
    creditsB: formatNumber(right.creditsPerMessage, locale),
    contextA: formatTokenCount(left.contextWindow),
    contextB: formatTokenCount(right.contextWindow),
  };
  return {
    title: fitTitle(
      t("meta.compare.title", vars),
      t("meta.compare.titleShort", vars),
      t("meta.compare.titleMin", vars),
    ),
    description: t("meta.compare.description", vars),
  };
}

// ─── Best for ────────────────────────────────────────────────────────────────

export type BestForKey =
  | "coding"
  | "reasoning"
  | "analysis"
  | "creative"
  | "roleplay"
  | "roleplayDark"
  | "fast"
  | "vision"
  | "videoInput"
  | "audioInput"
  | "imageGen"
  | "longContext"
  | "budget"
  | "tools"
  | "uncensored"
  | "ownWorldview";

export type SkipKey =
  | "noTools"
  | "noImages"
  | "coding"
  | "analysis"
  | "reasoning"
  | "creative"
  | "roleplay"
  | "pricey"
  | "smallContext"
  | "filtered"
  | "legacy"
  | "legacyNoSuccessor";

type PickKey =
  | "claudeOpus"
  | "claudeSonnet"
  | "claudeHaiku"
  | "gptSol"
  | "gptLuna"
  | "geminiArgon"
  | "geminiFlash"
  | "grok"
  | "deepseekPro"
  | "deepseekFlash"
  | "glm"
  | "kimi"
  | "qwenMax"
  | "mistralLarge"
  | "metaWonder"
  | "uncensoredLm"
  | "glmUncensored"
  | "glmFlashUncensored"
  | "deepseekFlashUncensored"
  | "veniceUncensored";

/**
 * Hand-written "best for" line for the most visited models (featured
 * comparison partners + each big lab's flagship and fast model). Every other
 * model gets only the generated lists.
 */
const HAND_PICKED_LINES: Partial<Record<ChatModelId, PickKey>> = {
  [ChatModelId.CLAUDE_OPUS_5_5]: "claudeOpus",
  [ChatModelId.CLAUDE_SONNET_5_5]: "claudeSonnet",
  [ChatModelId.CLAUDE_HAIKU_5_5]: "claudeHaiku",
  [ChatModelId.GPT_6_2_SOL]: "gptSol",
  [ChatModelId.GPT_6_LUNA]: "gptLuna",
  [ChatModelId.GEMINI_4_ARGON]: "geminiArgon",
  [ChatModelId.GEMINI_3_8_FLASH]: "geminiFlash",
  [ChatModelId.GROK_4_7]: "grok",
  [ChatModelId.DEEPSEEK_V4_PRO]: "deepseekPro",
  [ChatModelId.DEEPSEEK_V4_1_FLASH]: "deepseekFlash",
  [ChatModelId.GLM_5_3]: "glm",
  [ChatModelId.KIMI_K3_1_PRO]: "kimi",
  [ChatModelId.QWEN_4_MAX]: "qwenMax",
  [ChatModelId.MISTRAL_LARGE_4]: "mistralLarge",
  [ChatModelId.META_MUSE_WONDER]: "metaWonder",
  [ChatModelId.UNCENSORED_LM_V1_2]: "uncensoredLm",
  [ChatModelId.GLM_5_3_UNCENSORED]: "glmUncensored",
  [ChatModelId.GLM_5_3_FLASH_UNCENSORED]: "glmFlashUncensored",
  [ChatModelId.VENICE_DEEPSEEK_V4_1_FLASH_UNCENSORED]:
    "deepseekFlashUncensored",
  [ChatModelId.VENICE_UNCENSORED]: "veniceUncensored",
};

/** Ids with a hand-written line (tests check each one has a public page). */
export const HAND_PICKED_MODEL_IDS: readonly ChatModelId[] = Object.values(
  ChatModelId,
).filter((id) => HAND_PICKED_LINES[id] !== undefined);

const STRENGTH_BEST_FOR = [
  [ModelUtility.CODING, "coding"],
  [ModelUtility.REASONING, "reasoning"],
  [ModelUtility.ANALYSIS, "analysis"],
  [ModelUtility.CREATIVE, "creative"],
  [ModelUtility.ROLEPLAY, "roleplay"],
  [ModelUtility.ROLEPLAY_DARK, "roleplayDark"],
] as const satisfies readonly (readonly [string, BestForKey])[];

const INTELLIGENCE_RANK: Record<typeof IntelligenceLevelValue, number> = {
  [IntelligenceLevel.QUICK]: 0,
  [IntelligenceLevel.SMART]: 1,
  [IntelligenceLevel.BRILLIANT]: 2,
};

/** Generated "use it for" items, most specific first. */
export function bestForKeys(facts: ModelFacts): BestForKey[] {
  const keys: BestForKey[] = [];
  const kind = uncensoredKind(facts);
  if (kind === "ownWorldview") {
    keys.push("ownWorldview");
  } else if (kind !== null) {
    keys.push("uncensored");
  }
  for (const [utility, key] of STRENGTH_BEST_FOR) {
    if (facts.strengths.some((strength) => strength === utility)) {
      keys.push(key);
    }
  }
  if (facts.inputs.includes("image")) {
    keys.push("vision");
  }
  if (facts.inputs.includes("video")) {
    keys.push("videoInput");
  }
  if (facts.inputs.includes("audio")) {
    keys.push("audioInput");
  }
  if (facts.outputs.includes("image")) {
    keys.push("imageGen");
  }
  if (facts.contextWindow >= LONG_CONTEXT_TOKENS) {
    keys.push("longContext");
  }
  if (
    facts.creditsPerMessage > 0 &&
    facts.creditsPerMessage <= BUDGET_CREDITS
  ) {
    keys.push("budget");
  }
  if (
    facts.supportsTools &&
    INTELLIGENCE_RANK[facts.intelligence] >=
      INTELLIGENCE_RANK[IntelligenceLevel.SMART]
  ) {
    keys.push("tools");
  }
  if (facts.strengths.some((strength) => strength === ModelUtility.FAST)) {
    keys.push("fast");
  }
  return keys.slice(0, MAX_GOOD_ITEMS);
}

/** Generated "skip it for" items: honest limits from the same data. */
export function skipKeys(facts: ModelFacts): SkipKey[] {
  const keys: SkipKey[] = [];
  if (facts.isLegacy) {
    keys.push(facts.successor === null ? "legacyNoSuccessor" : "legacy");
  }
  if (facts.content === ContentLevel.MAINSTREAM) {
    keys.push("filtered");
  }
  if (!facts.supportsTools) {
    keys.push("noTools");
  }
  for (const [utility, key] of STRENGTH_BEST_FOR) {
    if (
      key !== "roleplayDark" &&
      !facts.strengths.some((strength) => strength === utility) &&
      facts.weaknesses.some((weakness) => weakness === utility)
    ) {
      keys.push(key);
    }
  }
  if (!facts.inputs.includes("image")) {
    keys.push("noImages");
  }
  if (facts.creditsPerMessage >= PRICEY_CREDITS) {
    keys.push("pricey");
  }
  if (facts.contextWindow < SMALL_CONTEXT_TOKENS) {
    keys.push("smallContext");
  }
  return keys.slice(0, MAX_SKIP_ITEMS);
}

export interface BestForContent {
  /** Hand-written line for a top model; null for every other model. */
  line: string | null;
  good: string[];
  skip: string[];
}

export function bestForContent(
  facts: ModelFacts,
  locale: CountryLanguage,
): BestForContent {
  const { t } = scopedTranslation.scopedT(locale);
  const pick = HAND_PICKED_LINES[facts.id];
  return {
    line: pick === undefined ? null : t(`bestFor.picks.${pick}`),
    good: bestForKeys(facts).map((key) => t(`bestFor.items.${key}`)),
    skip: skipKeys(facts).map((key) =>
      t(`bestFor.skipItems.${key}`, {
        lab: facts.labName,
        successor: facts.successor?.name ?? "",
        tokens: formatTokenCount(facts.contextWindow),
        credits: formatNumber(facts.creditsPerMessage, locale),
      }),
    ),
  };
}

export function mediaBestForContent(
  facts: MediaModelFacts,
  locale: CountryLanguage,
): BestForContent {
  const { t } = scopedTranslation.scopedT(locale);
  return {
    line: null,
    good: [t(`bestFor.media.${facts.type}`)],
    skip: [
      ...(facts.isLegacy ? [t("bestFor.skipItems.legacyNoSuccessor")] : []),
      t("bestFor.media.otherOutputs", {
        outputs: modalityList(facts.outputs, t),
      }),
    ],
  };
}

// ─── Related models ──────────────────────────────────────────────────────────

export type RelatedReason =
  | "uncensored"
  | "original"
  | "cheaper"
  | "sameLab"
  | "sameTier"
  | "sameType";

export interface RelatedModel {
  slug: string;
  name: string;
  labName: string;
  reason: RelatedReason;
  /** Credits per reference use (message for chat, unit for media); null when unpriced. */
  credits: number | null;
  /** Media only: what one priced use is. */
  mediaPrice: MediaPrice | null;
}

function toRelated(other: ModelFacts, reason: RelatedReason): RelatedModel {
  return {
    slug: other.slug,
    name: other.name,
    labName: other.labName,
    reason,
    credits: other.creditsPerMessage,
    mediaPrice: null,
  };
}

/**
 * Sibling model pages: the uncensored version (or the original it came
 * from), up to two cheaper models of the same tier and at least the same
 * intelligence, same-lab models, then same-tier models closest in price.
 */
export function findRelatedModels(
  facts: ModelFacts,
  availability: AgentEnvAvailability,
  limit = MAX_RELATED,
): RelatedModel[] {
  const all = listModelFacts(availability);
  const current = all.filter(
    (other) =>
      other.id !== facts.id &&
      !other.isLegacy &&
      other.outputs.join() === facts.outputs.join(),
  );
  const picks: RelatedModel[] = [];
  const add = (other: ModelFacts, reason: RelatedReason): void => {
    if (
      picks.length < limit &&
      !picks.some((pick) => pick.slug === other.slug)
    ) {
      picks.push(toRelated(other, reason));
    }
  };
  const byPriceDistance = (a: ModelFacts, b: ModelFacts): number =>
    Math.abs(a.creditsPerMessage - facts.creditsPerMessage) -
    Math.abs(b.creditsPerMessage - facts.creditsPerMessage);

  for (const other of all) {
    if (isUncensoredVariantOf(other, facts)) {
      add(other, "uncensored");
    } else if (isUncensoredVariantOf(facts, other)) {
      add(other, "original");
    }
  }

  const rank = INTELLIGENCE_RANK[facts.intelligence];
  current
    .filter(
      (other) =>
        other.content === facts.content &&
        INTELLIGENCE_RANK[other.intelligence] >= rank &&
        other.creditsPerMessage > 0 &&
        other.creditsPerMessage < facts.creditsPerMessage * 0.6,
    )
    .toSorted(
      (a, b) =>
        INTELLIGENCE_RANK[b.intelligence] - INTELLIGENCE_RANK[a.intelligence] ||
        a.creditsPerMessage - b.creditsPerMessage,
    )
    .slice(0, 2)
    .forEach((other) => add(other, "cheaper"));

  current
    .filter((other) => other.labName === facts.labName)
    .toSorted(byPriceDistance)
    .slice(0, 2)
    .forEach((other) => add(other, "sameLab"));

  current
    .filter((other) => other.content === facts.content)
    .toSorted(
      (a, b) =>
        Math.abs(INTELLIGENCE_RANK[a.intelligence] - rank) -
          Math.abs(INTELLIGENCE_RANK[b.intelligence] - rank) ||
        byPriceDistance(a, b),
    )
    .forEach((other) => add(other, "sameTier"));

  return picks;
}

/** Same media type: same lab first, then closest in price. */
export function findRelatedMediaModels(
  facts: MediaModelFacts,
  availability: AgentEnvAvailability,
  limit = MAX_RELATED,
): RelatedModel[] {
  const price = facts.price?.credits ?? 0;
  const distance = (other: MediaModelFacts): number =>
    Math.abs((other.price?.credits ?? 0) - price);
  return listMediaFacts(availability)
    .filter(
      (other) =>
        other.type === facts.type &&
        other.slug !== facts.slug &&
        !other.isLegacy,
    )
    .toSorted(
      (a, b) =>
        Number(b.labName === facts.labName) -
          Number(a.labName === facts.labName) || distance(a) - distance(b),
    )
    .slice(0, limit)
    .map((other): RelatedModel => ({
      slug: other.slug,
      name: other.name,
      labName: other.labName,
      reason: other.labName === facts.labName ? "sameLab" : "sameType",
      credits: other.price?.credits ?? null,
      mediaPrice: other.price,
    }));
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

/** Visible FAQ for a chat model page; the FAQPage JSON-LD uses the same items. */
export function chatModelFaq(
  facts: ModelFacts,
  locale: CountryLanguage,
): FaqItem[] {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const model = facts.name;
  const credits = formatNumber(facts.creditsPerMessage, locale);
  const money = formatMoney(facts.creditsPerMessage, locale);

  const priceAnswer =
    facts.creditsPerMessage <= 0
      ? t("faq.price.aFree", { model })
      : facts.tokenPrice === null
        ? t("faq.price.aFlat", {
            credits,
            money,
            provider: facts.priceProvider,
          })
        : t("faq.price.aTokens", {
            credits,
            money,
            provider: facts.priceProvider,
            input: formatMoney(facts.tokenPrice.inputCredits, locale),
            output: formatMoney(facts.tokenPrice.outputCredits, locale),
          });

  const kind = uncensoredKind(facts);
  const uncensoredAnswer =
    kind !== null
      ? `${t(`uncensoredKind.${kind}.line`)} ${t("faq.uncensored.consent")}`
      : facts.content === ContentLevel.OPEN
        ? t("faq.uncensored.open", { model })
        : t("faq.uncensored.mainstream", { model, lab: facts.labName });

  const apiAnswer = isApiCallable(facts)
    ? t("faq.api.a", { id: facts.id, appName: configT("appName") })
    : !facts.isLegacy
      ? t("facts.apiIdUnsupported")
      : facts.successor === null
        ? t("faq.api.legacyNoSuccessor", { model })
        : t("faq.api.legacy", {
            model,
            successor: facts.successor.name,
            id: facts.successor.id,
          });
  const modalitiesSentence = t("faq.inputs.modalities", {
    inputs: modalityList(facts.inputs, t),
    outputs: modalityList(facts.outputs, t),
  });
  const toolsSentence = facts.supportsTools
    ? t("faq.inputs.toolsYes")
    : t("faq.inputs.toolsNo");

  return [
    {
      question: t("faq.price.q", { model }),
      answer:
        facts.tokenPrice === null || facts.creditsPerMessage === 0
          ? priceAnswer
          : `${priceAnswer} ${referenceTurnText(facts, locale, t)}`,
    },
    { question: t("faq.uncensored.q", { model }), answer: uncensoredAnswer },
    { question: t("faq.api.q", { model }), answer: apiAnswer },
    {
      question: t("faq.context.q", { model }),
      answer: t("faq.context.a", {
        tokens: formatNumber(facts.contextWindow, locale),
        pages: formatNumber(facts.contextPages, locale),
      }),
    },
    {
      question: t("faq.inputs.q", { model }),
      answer: `${modalitiesSentence} ${toolsSentence}`,
    },
    {
      question: t("faq.providers.q", { model }),
      answer: t("faq.providers.a", { providers: facts.providers.join(", ") }),
    },
  ];
}

/** Visible FAQ for a media/voice model page. */
export function mediaModelFaq(
  facts: MediaModelFacts,
  locale: CountryLanguage,
): FaqItem[] {
  const { t } = scopedTranslation.scopedT(locale);
  const model = facts.name;
  const priceAnswer =
    facts.price === null
      ? t("mediaFaq.price.aNone")
      : t("mediaFaq.price.a", {
          credits: formatNumber(facts.price.credits, locale),
          money: formatMoney(facts.price.credits, locale),
          unit: mediaUnitText(facts.price, t),
          provider: facts.price.provider,
        });
  const uncensoredAnswer =
    facts.content === ContentLevel.UNCENSORED
      ? facts.type === "image"
        ? `${t("mediaFaq.uncensored.uncensored", { model })} ${t("mediaFaq.uncensored.consent")}`
        : t("mediaFaq.uncensored.uncensored", { model })
      : facts.content === ContentLevel.OPEN
        ? t("mediaFaq.uncensored.open", { model })
        : t("mediaFaq.uncensored.mainstream", { model, lab: facts.labName });
  return [
    { question: t("mediaFaq.price.q", { model }), answer: priceAnswer },
    {
      question: t("mediaFaq.use.q", { model }),
      answer: t("mediaFaq.use.a", {
        model,
        type: t(`catalog.types.${facts.type}`),
      }),
    },
    {
      question: t("mediaFaq.inputs.q", { model }),
      answer: t("mediaFaq.inputs.a", {
        inputs: modalityList(facts.inputs, t),
        outputs: modalityList(facts.outputs, t),
      }),
    },
    {
      question: t("mediaFaq.uncensored.q", { model }),
      answer: uncensoredAnswer,
    },
    {
      question: t("faq.providers.q", { model }),
      answer: t("faq.providers.a", { providers: facts.providers.join(", ") }),
    },
  ];
}

// ─── Blog links ──────────────────────────────────────────────────────────────

/** Posts that cover this chat model's kind, most relevant first. */
export function chatModelBlogSlugs(facts: ModelFacts): BlogPostSlug[] {
  const coding = facts.strengths.some(
    (strength) => strength === ModelUtility.CODING,
  );
  if (facts.content === ContentLevel.UNCENSORED) {
    return [
      "uncensored-models-what-each-is-good-at",
      "chatgpt-alternative-without-filters",
      "openai-anthropic-compatible-api",
    ];
  }
  return coding && facts.supportsTools
    ? [
        "openai-anthropic-compatible-api",
        "unbottled-api-in-coding-tools",
        "chatgpt-alternative-without-filters",
      ]
    : [
        "openai-anthropic-compatible-api",
        "chatgpt-alternative-without-filters",
      ];
}

/** Posts that cover this media type. */
export function mediaModelBlogSlugs(facts: MediaModelFacts): BlogPostSlug[] {
  switch (facts.type) {
    case "video":
      return ["ai-video-generators-compared"];
    case "audio":
    case "tts":
    case "stt":
      return ["ai-music-and-voice-generators"];
    case "image":
      return ["uncensored-ai-image-generator"];
  }
}
