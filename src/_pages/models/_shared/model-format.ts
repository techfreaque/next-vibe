/**
 * Pure formatting helpers for the public /models pages. Server-safe (no
 * "use client") so page loaders and generateMetadata can call them too.
 */

import { scopedTranslation as agentScopedTranslation } from "next-vibe/agent/i18n";
import type { Modality } from "next-vibe/agent/models/enum";
import {
  ContentLevel,
  type ContentLevelValue,
} from "next-vibe/agent/skills/enum";
import { scopedTranslation as skillsScopedTranslation } from "next-vibe/agent/skills/i18n";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  getCountryFromLocale,
  getLanguageFromLocale,
} from "next-vibe/core/i18n/core/language-utils";

import { scopedTranslation } from "../i18n";
import { formatTokenCount, type ModelFacts } from "./model-facts";

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

function isEuroLocale(locale: CountryLanguage): boolean {
  return getCountryFromLocale(locale) === "DE";
}

export function priceText(
  facts: ModelFacts,
  locale: CountryLanguage,
  t: ModelsT,
): string {
  return facts.creditsPerMessage > 0
    ? t("facts.priceValue", {
        credits: formatNumber(facts.creditsPerMessage, locale),
      })
    : t("facts.priceFree");
}

export function priceHint(
  facts: ModelFacts,
  locale: CountryLanguage,
  t: ModelsT,
): string {
  if (facts.messagesPerCurrencyUnit === null) {
    return t("facts.priceHintFree");
  }
  return t("facts.priceHint", {
    count: formatNumber(facts.messagesPerCurrencyUnit, locale),
    unit: isEuroLocale(locale) ? t("currencyUnit.eur") : t("currencyUnit.usd"),
  });
}

export function creditValueText(locale: CountryLanguage, t: ModelsT): string {
  return isEuroLocale(locale) ? t("creditValue.eur") : t("creditValue.usd");
}

export function priceFootnote(locale: CountryLanguage, t: ModelsT): string {
  return t("facts.priceFootnote", {
    value: isEuroLocale(locale) ? t("creditValue.eur") : t("creditValue.usd"),
  });
}

export function modalityList(modalities: Modality[], t: ModelsT): string {
  return modalities.map((modality) => t(MODALITY_KEYS[modality])).join(", ");
}

export type FactKey =
  | "lab"
  | "tier"
  | "intelligence"
  | "price"
  | "context"
  | "inputs"
  | "outputs"
  | "tools"
  | "providers"
  | "status";

export interface FactRow {
  key: FactKey;
  label: string;
  value: string;
  hint: string | null;
}

/** The fact sheet, in display order. One source for model + compare pages. */
export function buildFactRows(
  facts: ModelFacts,
  locale: CountryLanguage,
): FactRow[] {
  const { t } = scopedTranslation.scopedT(locale);
  const { t: skillsT } = skillsScopedTranslation.scopedT(locale);
  return [
    { key: "lab", label: t("facts.lab"), value: facts.labName, hint: null },
    {
      key: "tier",
      label: t("facts.tier"),
      value: tierName(facts.content, locale),
      hint: tierLine(facts.content, locale),
    },
    {
      key: "intelligence",
      label: t("facts.intelligence"),
      value: skillsT(facts.intelligence),
      hint: null,
    },
    {
      key: "price",
      label: t("facts.price"),
      value: priceText(facts, locale, t),
      hint: priceHint(facts, locale, t),
    },
    {
      key: "context",
      label: t("facts.context"),
      value: t("facts.contextValue", {
        tokens: formatTokenCount(facts.contextWindow),
      }),
      hint: t("facts.contextHint", {
        pages: formatNumber(facts.contextPages, locale),
      }),
    },
    {
      key: "inputs",
      label: t("facts.inputs"),
      value: modalityList(facts.inputs, t),
      hint: null,
    },
    {
      key: "outputs",
      label: t("facts.outputs"),
      value: modalityList(facts.outputs, t),
      hint: null,
    },
    {
      key: "tools",
      label: t("facts.tools"),
      value: facts.supportsTools ? t("facts.toolsYes") : t("facts.toolsNo"),
      hint: null,
    },
    {
      key: "providers",
      label: t("facts.providers"),
      value: facts.providers.join(", "),
      hint: null,
    },
    {
      key: "status",
      label: t("facts.status"),
      value: facts.isLegacy
        ? t("facts.statusLegacy")
        : t("facts.statusCurrent"),
      hint: null,
    },
  ];
}

export function modelDescription(
  facts: ModelFacts,
  locale: CountryLanguage,
): string {
  const { t } = agentScopedTranslation.scopedT(locale);
  return t(facts.description);
}

export function modelHref(locale: CountryLanguage, slug: string): string {
  return `/${locale}/models/${slug}`;
}

export function compareHref(
  locale: CountryLanguage,
  a: string,
  b: string,
): string {
  return `/${locale}/models/compare/${a}/${b}`;
}

/**
 * New private chat with the model selected and the composer pre-filled.
 * Public visitors get redirected to incognito by the threads page, which
 * keeps both params.
 */
export function chatHref(locale: CountryLanguage, facts: ModelFacts): string {
  const { t } = scopedTranslation.scopedT(locale);
  const query = new URLSearchParams({
    [MODEL_PARAM]: facts.id,
    [PREFILL_PARAM]: t("chatPrompt"),
  });
  return `/${locale}/threads/private/new?${query.toString()}`;
}
