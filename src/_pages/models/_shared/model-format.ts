/**
 * Pure formatting helpers for the public /models pages. Server-safe (no
 * "use client") so page loaders and generateMetadata can call them too.
 */

import type { ChatModelId } from "next-vibe/agent/ai-stream/models";
import type { Modality } from "next-vibe/agent/models/enum";
import { CHAT_MESSAGE_PRICE_REFERENCE } from "next-vibe/agent/models/models";
import {
  ContentLevel,
  type ContentLevelValue,
} from "next-vibe/agent/skills/enum";
import { scopedTranslation as skillsScopedTranslation } from "next-vibe/agent/skills/labels/i18n";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { getLanguageFromLocale } from "next-vibe/core/i18n/core/language-utils";

import { getCreditUnitPrice } from "@/products/credit-money";

import { scopedTranslation } from "../i18n";
import {
  canonicalComparisonPath,
  type ModelFacts,
  type ModelRef,
} from "./model-facts";
import type { MediaPrice } from "./model-media-facts";

type ModelsT = ReturnType<typeof scopedTranslation.scopedT>["t"];

/** Query param the chat page reads to pre-fill the composer once. */
const PREFILL_PARAM = "q";
/** Query param the chat page reads to select the model once. */
const MODEL_PARAM = "model";

const TIER_KEYS = {
  [ContentLevel.MAINSTREAM]: {
    name: "tiers.mainstream.name",
    line: "tiers.mainstream.line",
    tone: "border-primary/25 bg-primary/10 text-primary",
  },
  [ContentLevel.OPEN]: {
    name: "tiers.open.name",
    line: "tiers.open.line",
    tone: "border-info/30 bg-info/10 text-info",
  },
  [ContentLevel.UNCENSORED]: {
    name: "tiers.uncensored.name",
    line: "tiers.uncensored.line",
    tone: "border-warning/30 bg-warning/10 text-warning",
  },
} as const satisfies Record<
  typeof ContentLevelValue,
  {
    name: "tiers.mainstream.name" | "tiers.open.name" | "tiers.uncensored.name";
    line: "tiers.mainstream.line" | "tiers.open.line" | "tiers.uncensored.line";
    tone: string;
  }
>;

const MODALITY_KEYS = {
  text: "modality.text",
  image: "modality.image",
  audio: "modality.audio",
  video: "modality.video",
} as const satisfies Record<Modality, string>;

export function tierTone(content: typeof ContentLevelValue): string {
  return TIER_KEYS[content].tone;
}

export function tierName(
  content: typeof ContentLevelValue,
  locale: CountryLanguage,
): string {
  const { t } = scopedTranslation.scopedT(locale);
  return t(TIER_KEYS[content].name);
}

export function tierLine(
  content: typeof ContentLevelValue,
  locale: CountryLanguage,
): string {
  const { t } = scopedTranslation.scopedT(locale);
  return t(TIER_KEYS[content].line);
}

export function formatNumber(value: number, locale: CountryLanguage): string {
  return new Intl.NumberFormat(getLanguageFromLocale(locale), {
    maximumFractionDigits: 2,
  }).format(value);
}

export function priceText(
  facts: ModelFacts,
  locale: CountryLanguage,
  t: ModelsT,
): string {
  return facts.creditsPerMessage > 0
    ? t("facts.priceValue", {
        credits: formatNumber(facts.creditsPerMessage, locale),
        money: formatMoney(facts.creditsPerMessage, locale),
      })
    : t("facts.priceFree");
}

export function referenceTurnText(
  facts: ModelFacts,
  locale: CountryLanguage,
  t: ModelsT,
): string {
  if (facts.tokenPrice === null) {
    return t("facts.fixedPrice");
  }
  const { inputTokens, outputTokens } = CHAT_MESSAGE_PRICE_REFERENCE;
  const key =
    facts.tokenPrice.imageOutputCredits === null
      ? "facts.referenceTurn"
      : "facts.referenceImageTurn";
  return t(key, {
    input: formatNumber(inputTokens, locale),
    output: formatNumber(outputTokens, locale),
  });
}

/**
 * Money value of a credit amount in the locale's checkout currency (credit
 * pack price, same anchor as the model selector): "$0.06", "0,23 zł".
 * Small amounts keep a third decimal so cheap per-token prices stay visible.
 */
export function formatMoney(credits: number, locale: CountryLanguage): string {
  const { amount, currency } = getCreditUnitPrice(locale);
  const value = credits * amount;
  if (value > 0 && value < 0.01) {
    return new Intl.NumberFormat(getLanguageFromLocale(locale), {
      style: "currency",
      currency,
      maximumSignificantDigits: 2,
    }).format(value);
  }
  return new Intl.NumberFormat(getLanguageFromLocale(locale), {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: value < 0.1 ? 3 : 2,
  }).format(value);
}

/** Which kind of uncensored a chat model is; null outside the uncensored tier. */
export type UncensoredKind =
  | NonNullable<ModelFacts["uncensoredMethod"]>
  | "unlisted";

export function uncensoredKind(
  facts: Pick<ModelFacts, "uncensoredMethod" | "content">,
): UncensoredKind | null {
  if (facts.content !== ContentLevel.UNCENSORED) {
    return null;
  }
  return facts.uncensoredMethod ?? "unlisted";
}

/** Current text-in/text-out models are callable on the /v1 API. */
export function isApiCallable(facts: ModelFacts): boolean {
  return (
    !facts.isLegacy &&
    facts.inputs.includes("text") &&
    facts.outputs.includes("text")
  );
}

const STRENGTH_KEYS = {
  "modelUtilities.coding": "strengths.coding",
  "modelUtilities.reasoning": "strengths.reasoning",
  "modelUtilities.analysis": "strengths.analysis",
  "modelUtilities.creative": "strengths.creative",
  "modelUtilities.roleplay": "strengths.roleplay",
  "modelUtilities.roleplayDark": "strengths.roleplayDark",
  "modelUtilities.fast": "strengths.fast",
  "modelUtilities.vision": "strengths.vision",
  "modelUtilities.imageGen": "strengths.imageGen",
} as const;

function isStrengthKey(value: string): value is keyof typeof STRENGTH_KEYS {
  return value in STRENGTH_KEYS;
}

export function strengthList(facts: ModelFacts, t: ModelsT): string {
  const labels: string[] = [];
  for (const strength of facts.strengths) {
    if (isStrengthKey(strength)) {
      labels.push(t(STRENGTH_KEYS[strength]));
    }
  }
  return labels.join(", ");
}

export function priceFootnote(locale: CountryLanguage, t: ModelsT): string {
  return t("facts.priceFootnote", { value: formatMoney(1, locale) });
}

export function modalityList(modalities: Modality[], t: ModelsT): string {
  return modalities.map((modality) => t(MODALITY_KEYS[modality])).join(", ");
}

export type FactKey =
  | "lab"
  | "tier"
  | "uncensoredKind"
  | "intelligence"
  | "strengths"
  | "price"
  | "tokenPrice"
  | "cacheReadPrice"
  | "cacheWritePrice"
  | "imageOutputPrice"
  | "context"
  | "parameters"
  | "inputs"
  | "outputs"
  | "tools"
  | "providers"
  | "apiId"
  | "status";

export interface FactRow {
  key: FactKey;
  label: string;
  value: string;
  hint: string | null;
  /**
   * The registry has no value for this model: `value` is a fallback text.
   * Model pages hide such rows; the compare table shows the fallback so both
   * columns keep the same rows.
   */
  missing: boolean;
}

const EXTRA_TOKEN_RATES = [
  { key: "cacheReadPrice", rate: "cacheReadCredits" },
  { key: "cacheWritePrice", rate: "cacheWriteCredits" },
  { key: "imageOutputPrice", rate: "imageOutputCredits" },
] as const;

function apiIdRow(facts: ModelFacts, t: ModelsT): FactRow {
  const label = t("facts.apiId");
  if (isApiCallable(facts)) {
    return {
      key: "apiId",
      label,
      value: facts.id,
      hint: t("facts.apiIdHint"),
      missing: false,
    };
  }
  return {
    key: "apiId",
    label,
    value: !facts.isLegacy
      ? t("facts.apiIdUnsupported")
      : facts.successor === null
        ? t("facts.apiIdLegacyNoSuccessor")
        : t("facts.apiIdLegacy", { successor: facts.successor.id }),
    hint: null,
    missing: false,
  };
}

/** The fact sheet, in display order. One source for model + compare pages. */
export function buildFactRows(
  facts: ModelFacts,
  locale: CountryLanguage,
): FactRow[] {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: skillsT } = skillsScopedTranslation.scopedT(locale);
  const kind = uncensoredKind(facts);
  const strengths = strengthList(facts, t);
  return [
    {
      key: "lab",
      label: t("facts.lab"),
      value: facts.labName,
      hint: null,
      missing: false,
    },
    {
      key: "tier",
      label: t("facts.tier"),
      value: tierName(facts.content, locale),
      hint: tierLine(facts.content, locale),
      missing: false,
    },
    kind === null
      ? {
          key: "uncensoredKind",
          label: t("facts.uncensoredKind"),
          value: t("facts.notUncensored"),
          hint: null,
          missing: true,
        }
      : {
          key: "uncensoredKind",
          label: t("facts.uncensoredKind"),
          value: t(`uncensoredKind.${kind}.name`),
          hint: t(`uncensoredKind.${kind}.line`),
          missing: false,
        },
    {
      key: "intelligence",
      label: t("facts.intelligence"),
      value: skillsT(facts.intelligence),
      hint: null,
      missing: false,
    },
    {
      key: "strengths",
      label: t("facts.strengths"),
      value: strengths.length > 0 ? strengths : t("facts.notListed"),
      hint: null,
      missing: strengths.length === 0,
    },
    {
      key: "price",
      label: t("facts.price"),
      value: priceText(facts, locale, t),
      hint: `${referenceTurnText(facts, locale, t)} ${t("facts.priceProvider", { provider: facts.priceProvider })}`,
      missing: false,
    },
    facts.tokenPrice === null
      ? {
          key: "tokenPrice",
          label: t("facts.tokenPrice"),
          value: t("facts.notListed"),
          hint: null,
          missing: true,
        }
      : {
          key: "tokenPrice",
          label: t("facts.tokenPrice"),
          value: t("facts.tokenPriceValue", {
            input: formatMoney(facts.tokenPrice.inputCredits, locale),
            output: formatMoney(facts.tokenPrice.outputCredits, locale),
          }),
          hint: t("facts.tokenPriceHint", {
            inputCredits: formatNumber(facts.tokenPrice.inputCredits, locale),
            outputCredits: formatNumber(facts.tokenPrice.outputCredits, locale),
          }),
          missing: false,
        },
    ...EXTRA_TOKEN_RATES.map(({ key, rate }): FactRow => {
      const credits = facts.tokenPrice?.[rate] ?? null;
      return {
        key,
        label: t(`facts.${key}`),
        value:
          credits === null
            ? t("facts.notListed")
            : formatMoney(credits, locale),
        hint:
          credits === null
            ? null
            : t("facts.perMillionCredits", {
                credits: formatNumber(credits, locale),
              }),
        missing: credits === null,
      };
    }),
    {
      key: "context",
      label: t("facts.context"),
      value: t("facts.contextValue", {
        tokens: formatNumber(facts.contextWindow, locale),
      }),
      hint: t("facts.contextHint", {
        pages: formatNumber(facts.contextPages, locale),
      }),
      missing: false,
    },
    {
      key: "parameters",
      label: t("facts.parameters"),
      value:
        facts.parameterCount === null
          ? t("facts.notPublished")
          : t("facts.parametersValue", {
              count: formatNumber(facts.parameterCount, locale),
            }),
      hint: null,
      missing: facts.parameterCount === null,
    },
    {
      key: "inputs",
      label: t("facts.inputs"),
      value: modalityList(facts.inputs, t),
      hint: null,
      missing: false,
    },
    {
      key: "outputs",
      label: t("facts.outputs"),
      value: modalityList(facts.outputs, t),
      hint: null,
      missing: false,
    },
    {
      key: "tools",
      label: t("facts.tools"),
      value: facts.supportsTools ? t("facts.toolsYes") : t("facts.toolsNo"),
      hint: null,
      missing: false,
    },
    {
      key: "providers",
      label: t("facts.providers"),
      value: facts.providers.join(", "),
      hint: null,
      missing: false,
    },
    apiIdRow(facts, t),
    {
      key: "status",
      label: t("facts.status"),
      value: facts.isLegacy
        ? t("facts.statusLegacy")
        : t("facts.statusCurrent"),
      hint: null,
      missing: false,
    },
  ];
}

/** "image", "8s clip", "600 characters": what one priced use is. */
export function mediaUnitText(price: MediaPrice, t: ModelsT): string {
  switch (price.unit) {
    case "image":
      return t("units.image");
    case "audio":
      return t("units.audio");
    case "video":
      return price.amount === null
        ? t("units.videoClip")
        : t("units.video", { seconds: price.amount });
    case "tts":
      return t("units.tts", { chars: price.amount ?? 0 });
    case "stt":
      return t("units.stt", { seconds: price.amount ?? 0 });
  }
}

export function modelHref(locale: CountryLanguage, slug: string): string {
  return `/${locale}/models/${slug}`;
}

export function compareHref(
  locale: CountryLanguage,
  a: ChatModelId,
  b: ChatModelId,
): string {
  return `/${locale}${canonicalComparisonPath(a, b)}`;
}

/**
 * New private chat with the model selected and the composer pre-filled.
 * Public visitors get redirected to incognito by the threads page, which
 * keeps both params.
 */
export function chatHref(locale: CountryLanguage, facts: ModelRef): string {
  const { t } = scopedTranslation.scopedT(locale);
  const query = new URLSearchParams({
    [MODEL_PARAM]: facts.id,
    [PREFILL_PARAM]: t("chatPrompt"),
  });
  return `/${locale}/threads/private/new?${query.toString()}`;
}
