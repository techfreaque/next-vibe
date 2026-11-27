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
import { scopedTranslation as skillsScopedTranslation } from "next-vibe/agent/skills/labels/i18n";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { TranslatedKeyType } from "next-vibe/core/i18n/core/scoped-translation";

import { configScopedTranslation } from "@/env/i18n";
import {
  FREE_CREDIT_ALLOWANCE,
  FREE_CREDIT_SIGNED_IN_TOTAL,
} from "@/products/constants";
import { scopedTranslation as productsScopedTranslation } from "@/products/i18n";
import { getSubscriptionTiers } from "@/products/repository-client";

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
  cachePriceText,
  chatHref,
  compareHref,
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
/** Comparison partners in the "vs the closest alternatives" table. */
const MAX_NEAREST = 3;

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

/** Google cuts snippets at ~160 characters. */
const DESCRIPTION_MAX_CHARS = 160;
/** Shorter snippets leave room Google fills with page text. */
const DESCRIPTION_MIN_CHARS = 120;

/**
 * First candidate (richest first) inside the 120-160 snippet window, else the
 * first that fits under 160, else the last (shortest).
 */
function fitDescription(
  first: TranslatedKeyType,
  ...rest: TranslatedKeyType[]
): TranslatedKeyType {
  const candidates = [first, ...rest];
  const fitting = candidates.filter(
    (candidate) => candidate.length <= DESCRIPTION_MAX_CHARS,
  );
  return (
    fitting.find((candidate) => candidate.length >= DESCRIPTION_MIN_CHARS) ??
    fitting[0] ??
    candidates[candidates.length - 1] ??
    first
  );
}

export interface PageMeta {
  title: TranslatedKeyType;
  description: TranslatedKeyType;
}

/** The model's own name already says it is uncensored or abliterated. */
function nameSaysUncensored(name: string): boolean {
  return /uncensored|abliterat/i.test(name);
}

/** Description templates per page family, richest first. */
const DESCRIPTION_TEMPLATES = {
  plain: {
    token: "description",
    flat: "descriptionFlat",
    short: "descriptionShort",
  },
  uncensored: {
    token: "descriptionUncensored",
    flat: "descriptionUncensoredFlat",
    short: "descriptionUncensoredShort",
  },
  uncensoredNamed: {
    token: "descriptionUncensoredNamed",
    flat: "descriptionUncensoredNamedFlat",
    short: "descriptionUncensoredNamedShort",
  },
} as const;

type StartHook = "hookGuest" | "hookAccount" | "hookPaid";

/**
 * What the free allowances buy for one use: guests (no sign-up) when the
 * guest pool covers at least one use, else a free account, else paid only.
 * Same thresholds as the "Is <model> free?" FAQ.
 */
function startHook(creditsPerUse: number): StartHook {
  if (creditsPerUse <= FREE_CREDIT_ALLOWANCE.guest) {
    return "hookGuest";
  }
  return creditsPerUse <= FREE_CREDIT_SIGNED_IN_TOTAL
    ? "hookAccount"
    : "hookPaid";
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
          ? fitDescription(
              t("meta.model.descriptionLegacyNoSuccessor", vars),
              t("meta.model.descriptionLegacyNoSuccessorShort", vars),
            )
          : fitDescription(
              t("meta.model.descriptionLegacy", vars),
              t("meta.model.descriptionLegacyShort", vars),
            ),
    };
  }
  const uncensored = facts.content === ContentLevel.UNCENSORED;
  const named = uncensored && nameSaysUncensored(facts.name);
  const hookKey = startHook(facts.creditsPerMessage);
  const plainHook = t(`meta.model.${hookKey}`);
  // Uncensored models add the one-time age check; it is the first thing cut.
  const hooks = uncensored
    ? [t("meta.model.hookAdult", { hook: plainHook }), plainHook]
    : [plainHook];
  const family = !uncensored
    ? DESCRIPTION_TEMPLATES.plain
    : named
      ? DESCRIPTION_TEMPLATES.uncensoredNamed
      : DESCRIPTION_TEMPLATES.uncensored;
  // Richest first: token prices, then the flat per-message price, then the
  // short line without lab and money. Each with and without the age check.
  const templates =
    facts.tokenPrice === null
      ? [family.flat, family.short]
      : [family.token, family.flat, family.short];
  const candidates = templates.flatMap((template) =>
    hooks.map((hook) => t(`meta.model.${template}`, { ...vars, hook })),
  );
  const [firstCandidate, ...otherCandidates] = candidates;
  const description =
    firstCandidate === undefined
      ? t("meta.model.descriptionShort", { ...vars, hook: plainHook })
      : fitDescription(firstCandidate, ...otherCandidates);
  // "<model> chat online" leads every title: the query shape that ranks.
  const title = !uncensored
    ? fitTitle(
        t("meta.model.title", vars),
        t("meta.model.titleShort", vars),
        t("meta.model.titleMin", vars),
      )
    : named
      ? hookKey === "hookGuest"
        ? fitTitle(
            t("meta.model.titleUncensoredNamed", vars),
            t("meta.model.titleUncensoredNamedShort", vars),
            t("meta.model.titleMin", vars),
          )
        : fitTitle(
            t("meta.model.title", vars),
            t("meta.model.titleShort", vars),
            t("meta.model.titleMin", vars),
          )
      : fitTitle(
          t("meta.model.titleUncensored", vars),
          t("meta.model.titleUncensoredShort", vars),
          t("meta.model.titleMin", vars),
        );
  return { title, description };
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
      description: fitDescription(
        t("meta.media.descriptionNoPrice", base),
        t("meta.media.descriptionNoPriceShort", base),
      ),
    };
  }
  const vars = {
    ...base,
    credits: formatNumber(facts.price.credits, locale),
    money: formatMoney(facts.price.credits, locale),
    unit: mediaUnitText(facts.price, t),
    hook: t(`meta.model.${startHook(facts.price.credits)}`),
  };
  return {
    title: fitTitle(
      t("meta.media.title", vars),
      t("meta.media.titleShort", vars),
      t("meta.media.titleMin", vars),
    ),
    description: fitDescription(
      t("meta.media.description", vars),
      t("meta.media.descriptionShort", vars),
      t("meta.media.descriptionMin", vars),
    ),
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
    moneyA: formatMoney(left.creditsPerMessage, locale),
    moneyB: formatMoney(right.creditsPerMessage, locale),
    tierA: tierName(left.content, locale),
    tierB: tierName(right.content, locale),
    contextA: formatTokenCount(left.contextWindow),
    contextB: formatTokenCount(right.contextWindow),
  };
  return {
    title: fitTitle(
      t("meta.compare.title", vars),
      t("meta.compare.titleShort", vars),
      t("meta.compare.titleMin", vars),
    ),
    description: fitDescription(
      t("meta.compare.description", vars),
      t("meta.compare.descriptionShort", vars),
    ),
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

// ─── Price per plan ──────────────────────────────────────────────────────────

export interface PlanRow {
  plan: string;
  /** Monthly price label, or the localized "free". */
  price: string;
  credits: string;
  /** "about 120" / "under 1" uses of this model per month. */
  uses: string;
}

/** How far each plan goes with one model, computed from the product config. */
export interface PlanPricing {
  intro: string;
  usesLabel: string;
  rows: PlanRow[];
  footnote: string;
  /** Chat with the model preselected; null where the page has its own CTA. */
  cta: { href: string; label: string } | null;
}

/** Whole uses a monthly credit amount covers; a sub-one count reads "under 1". */
function usesPerMonth(
  credits: number,
  perUse: number,
  locale: CountryLanguage,
): string {
  const { t } = scopedTranslation.scopedT(locale);
  const count = Math.floor(credits / perUse);
  return count < 1
    ? t("plans.underOne")
    : t("plans.about", { count: formatNumber(count, locale) });
}

function planRows(perUse: number, locale: CountryLanguage): PlanRow[] {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: productT } = productsScopedTranslation.scopedT(locale);
  const free = t("plans.free");
  const row = (plan: string, price: string, credits: number): PlanRow => ({
    plan,
    price,
    credits: formatNumber(credits, locale),
    uses: usesPerMonth(credits, perUse, locale),
  });
  return [
    row(t("plans.guest"), free, FREE_CREDIT_ALLOWANCE.guest),
    row(t("plans.account"), free, FREE_CREDIT_SIGNED_IN_TOTAL),
    ...getSubscriptionTiers(locale).map((tier) => ({
      plan: productT(tier.name),
      price: tier.priceLabel,
      credits: tier.creditsLabel,
      uses: usesPerMonth(tier.credits, perUse, locale),
    })),
  ];
}

/** Null for free and legacy models: there is nothing to plan for. */
export function chatPlanPricing(
  facts: ModelFacts,
  locale: CountryLanguage,
): PlanPricing | null {
  if (facts.isLegacy || facts.creditsPerMessage <= 0) {
    return null;
  }
  const { t } = scopedTranslation.scopedT(locale);
  return {
    intro: t("plans.intro", {
      model: facts.name,
      credits: formatNumber(facts.creditsPerMessage, locale),
      money: formatMoney(facts.creditsPerMessage, locale),
    }),
    usesLabel: t("plans.messages"),
    rows: planRows(facts.creditsPerMessage, locale),
    footnote: [
      referenceTurnText(facts, locale, t),
      cachePriceText(facts, locale, t),
      t("plans.footnote"),
    ]
      .filter(Boolean)
      .join(" "),
    cta: {
      href: chatHref(locale, facts),
      label: t("model.chatCta", { model: facts.name }),
    },
  };
}

export function mediaPlanPricing(
  facts: MediaModelFacts,
  locale: CountryLanguage,
): PlanPricing | null {
  if (facts.isLegacy || facts.price === null || facts.price.credits <= 0) {
    return null;
  }
  const { t } = scopedTranslation.scopedT(locale);
  return {
    intro: t("plans.mediaIntro", {
      model: facts.name,
      credits: formatNumber(facts.price.credits, locale),
      money: formatMoney(facts.price.credits, locale),
      unit: mediaUnitText(facts.price, t),
    }),
    usesLabel: t("plans.uses"),
    rows: planRows(facts.price.credits, locale),
    footnote: t("plans.mediaFootnote"),
    cta: null,
  };
}

// ─── Nearest models table ────────────────────────────────────────────────────

export interface NearestRow {
  slug: string;
  name: string;
  tier: string;
  intelligence: string;
  context: string;
  price: string;
  /** Head-to-head page; null on the row of the model the page is about. */
  compare: { href: string; label: string } | null;
}

/** The page's model first, then its closest comparison partners. */
export function nearestRows(
  facts: ModelFacts,
  nearest: readonly ModelFacts[],
  locale: CountryLanguage,
): NearestRow[] {
  if (nearest.length === 0) {
    return [];
  }
  const { t } = scopedTranslation.scopedT(locale);
  const { t: skillsT } = skillsScopedTranslation.scopedT(locale);
  const toRow = (model: ModelFacts, isSelf: boolean): NearestRow => ({
    slug: model.slug,
    name: model.name,
    tier: tierName(model.content, locale),
    intelligence: skillsT(model.intelligence),
    context: formatTokenCount(model.contextWindow),
    price:
      model.creditsPerMessage > 0
        ? t("related.perMessage", {
            credits: formatNumber(model.creditsPerMessage, locale),
          })
        : t("facts.priceFree"),
    compare: isSelf
      ? null
      : {
          href: compareHref(locale, facts.id, model.id),
          label: t("model.compareWith", {
            model: facts.name,
            other: model.name,
          }),
        },
  });
  return [
    toRow(facts, true),
    ...nearest.slice(0, MAX_NEAREST).map((model) => toRow(model, false)),
  ];
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

/** "Is <model> uncensored?" answer, shared by model and compare pages. */
export function uncensoredAnswer(
  facts: ModelFacts,
  locale: CountryLanguage,
): string {
  const { t } = scopedTranslation.scopedT(locale);
  const kind = uncensoredKind(facts);
  if (kind !== null) {
    return `${t("faq.uncensored.yes")} ${t(`uncensoredKind.${kind}.line`)} ${t("faq.uncensored.consent")}`;
  }
  return facts.content === ContentLevel.OPEN
    ? t("faq.uncensored.open", { model: facts.name })
    : t("faq.uncensored.mainstream", { model: facts.name, lab: facts.labName });
}

/** "Can I use <model> via API?" answer, shared by model and compare pages. */
export function apiAnswer(facts: ModelFacts, locale: CountryLanguage): string {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  if (isApiCallable(facts)) {
    return t("faq.api.a", { id: facts.id, appName: configT("appName") });
  }
  if (!facts.isLegacy) {
    return t("facts.apiIdUnsupported");
  }
  return facts.successor === null
    ? t("faq.api.legacyNoSuccessor", { model: facts.name })
    : t("faq.api.legacy", {
        model: facts.name,
        successor: facts.successor.name,
        id: facts.successor.id,
      });
}

/**
 * "Is <model> free?": what the guest and free-account allowances buy, then
 * the cheapest plan. Empty for free and legacy models.
 */
function freeFaqItem(facts: ModelFacts, locale: CountryLanguage): FaqItem[] {
  const starter = getSubscriptionTiers(locale)[0];
  if (facts.isLegacy || facts.creditsPerMessage <= 0 || starter === undefined) {
    return [];
  }
  const { t } = scopedTranslation.scopedT(locale);
  const perUse = facts.creditsPerMessage;
  const guestMessages = Math.floor(FREE_CREDIT_ALLOWANCE.guest / perUse);
  const accountMessages = Math.floor(FREE_CREDIT_SIGNED_IN_TOTAL / perUse);
  const vars = {
    model: facts.name,
    credits: formatNumber(perUse, locale),
    guest: formatNumber(FREE_CREDIT_ALLOWANCE.guest, locale),
    guestMessages: formatNumber(guestMessages, locale),
    account: formatNumber(FREE_CREDIT_SIGNED_IN_TOTAL, locale),
    accountMessages: formatNumber(accountMessages, locale),
    planPrice: starter.priceLabel,
    planCredits: starter.creditsLabel,
    planMessages: formatNumber(Math.floor(starter.credits / perUse), locale),
  };
  return [
    {
      question: t("faq.free.q", { model: facts.name }),
      answer:
        guestMessages >= 1
          ? t("faq.free.a", vars)
          : accountMessages >= 1
            ? t("faq.free.aAccount", vars)
            : t("faq.free.aPaid", vars),
    },
  ];
}

/** "<model> or <closest model>?": price, context and tier, from the registry. */
function versusFaqItem(
  facts: ModelFacts,
  other: ModelFacts | undefined,
  locale: CountryLanguage,
): FaqItem[] {
  if (other === undefined) {
    return [];
  }
  const { t } = scopedTranslation.scopedT(locale);
  return [
    {
      question: t("faq.versus.q", { model: facts.name, other: other.name }),
      answer: t("faq.versus.a", {
        model: facts.name,
        other: other.name,
        credits: formatNumber(facts.creditsPerMessage, locale),
        otherCredits: formatNumber(other.creditsPerMessage, locale),
        context: formatTokenCount(facts.contextWindow),
        otherContext: formatTokenCount(other.contextWindow),
        tier: tierName(facts.content, locale),
        otherTier: tierName(other.content, locale),
      }),
    },
  ];
}

/** Visible FAQ for a chat model page; the FAQPage JSON-LD uses the same items. */
export function chatModelFaq(
  facts: ModelFacts,
  locale: CountryLanguage,
  related: readonly RelatedModel[] = [],
  nearest: readonly ModelFacts[] = [],
): FaqItem[] {
  const { t } = scopedTranslation.scopedT(locale);
  const model = facts.name;
  const credits = formatNumber(facts.creditsPerMessage, locale);
  const money = formatMoney(facts.creditsPerMessage, locale);
  const freeItem = freeFaqItem(facts, locale);
  const versusItem = versusFaqItem(facts, nearest[0], locale);

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

  const modalitiesSentence = t("faq.inputs.modalities", {
    inputs: modalityList(facts.inputs, t),
    outputs: modalityList(facts.outputs, t),
  });
  const toolsSentence = facts.supportsTools
    ? t("faq.inputs.toolsYes")
    : t("faq.inputs.toolsNo");

  const items: FaqItem[] = [
    {
      question: t("faq.price.q", { model }),
      answer:
        facts.tokenPrice === null || facts.creditsPerMessage === 0
          ? priceAnswer
          : [
              priceAnswer,
              cachePriceText(facts, locale, t),
              referenceTurnText(facts, locale, t),
            ]
              .filter(Boolean)
              .join(" "),
    },
    {
      question: t("faq.uncensored.q", { model }),
      answer: uncensoredAnswer(facts, locale),
    },
    { question: t("faq.api.q", { model }), answer: apiAnswer(facts, locale) },
    ...freeItem,
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

  const bestFor = bestForContent(facts, locale);
  if (bestFor.good.length > 0) {
    const list = t("faq.bestFor.a", { items: bestFor.good.join("; ") });
    items.push({
      question: t("faq.bestFor.q", { model }),
      answer: bestFor.line === null ? list : `${bestFor.line} ${list}`,
    });
  }

  const cheaper = related.find((other) => other.reason === "cheaper");
  if (cheaper !== undefined && cheaper.credits !== null) {
    items.push({
      question: t("faq.cheaper.q", { model }),
      answer: t("faq.cheaper.a", {
        model,
        other: cheaper.name,
        otherCredits: formatNumber(cheaper.credits, locale),
        credits,
      }),
    });
  }

  items.push(...versusItem);

  if (!facts.isLegacy) {
    items.push({
      question: t("faq.try.q", { model }),
      answer: t("faq.try.a", { model }),
    });
  } else if (facts.successor !== null) {
    items.push({
      question: t("faq.try.q", { model }),
      answer: t("faq.try.aLegacy", { model, successor: facts.successor.name }),
    });
  }

  return items;
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
  const mediaUncensoredAnswer =
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
      answer: mediaUncensoredAnswer,
    },
    {
      question: t("faq.providers.q", { model }),
      answer: t("faq.providers.a", { providers: facts.providers.join(", ") }),
    },
  ];
}

// ─── Blog links ──────────────────────────────────────────────────────────────

const MAX_BLOG_LINKS = 3;

function hasStrength(
  facts: ModelFacts,
  ...utilities: ModelFacts["strengths"][number][]
): boolean {
  return facts.strengths.some((strength) => utilities.includes(strength));
}

/** Landing page that matches an uncensored model's kind; null outside that tier. */
export type ModelLandingKey = "uncensored" | "abliterated";

export function chatModelLanding(facts: ModelFacts): ModelLandingKey | null {
  const kind = uncensoredKind(facts);
  if (kind === null || facts.isLegacy) {
    return null;
  }
  return kind === "abliterated" ? "abliterated" : "uncensored";
}

/**
 * Posts that cover this chat model, most specific first: the post about its
 * family or platform, the explainer for its kind of uncensored and the best uncensored LLM guide, then roleplay,
 * API and coding-tool guides where relevant. A landing page (see
 * chatModelLanding) takes one of the MAX_BLOG_LINKS slots.
 */
/**
 * The post written about this model's own family or platform, if any:
 * DeepSeek, Claude, Grok, GPT, Gab, FreedomGPT and Venice each have one.
 */
function familyPost(facts: ModelFacts): BlogPostSlug | null {
  if (facts.slug.includes("deepseek")) {
    return "deepseek-uncensored";
  }
  switch (facts.labName) {
    case "Anthropic":
      return "claude-without-filters";
    case "xAI":
      return "grok-alternative";
    case "OpenAI":
      return "chatgpt-alternative-without-filters";
    case "Gab AI":
      return "gab-ai-alternatives";
    case "FreedomGPT":
      return "freedomgpt-alternatives";
    case "Venice.ai":
      return "venice-ai-alternatives";
    default:
      return null;
  }
}

export function chatModelBlogSlugs(facts: ModelFacts): BlogPostSlug[] {
  const kind = uncensoredKind(facts);
  const roleplay = hasStrength(
    facts,
    ModelUtility.ROLEPLAY,
    ModelUtility.ROLEPLAY_DARK,
  );
  const family = familyPost(facts);
  const candidates: BlogPostSlug[] = [];
  if (kind !== null) {
    // The family post takes the explainer's slot; the best-uncensored guide
    // stays on every uncensored page.
    candidates.push(
      family ??
        (kind === "abliterated"
          ? "abliterated-vs-uncensored-models"
          : "uncensored-models-what-each-is-good-at"),
      "best-uncensored-llm",
      kind === "abliterated"
        ? "abliterated-vs-uncensored-models"
        : "uncensored-models-what-each-is-good-at",
    );
    if (roleplay) {
      candidates.push("ai-roleplay-without-filter");
    }
    if (isApiCallable(facts)) {
      candidates.push("uncensored-llm-api");
    }
    candidates.push(
      "uncensored-models-what-each-is-good-at",
      "chatgpt-alternative-without-filters",
    );
  } else {
    if (family !== null) {
      candidates.push(family);
    }
    if (hasStrength(facts, ModelUtility.CODING) && facts.supportsTools) {
      candidates.push("unbottled-api-in-coding-tools");
    }
    if (roleplay) {
      candidates.push("ai-roleplay-without-filter");
    }
    candidates.push(
      "openai-anthropic-compatible-api",
      "chatgpt-alternative-without-filters",
    );
  }
  const slots =
    chatModelLanding(facts) === null ? MAX_BLOG_LINKS : MAX_BLOG_LINKS - 1;
  return [...new Set(candidates)].slice(0, slots);
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
