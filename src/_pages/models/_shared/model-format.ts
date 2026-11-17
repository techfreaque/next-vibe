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

import { getCreditUnitPrice } from "@/products/credit-money";

import { scopedTranslation } from "../i18n";
import {
  formatTokenCount,
  type ModelFacts,
  OWN_WORLDVIEW_UNCENSORED_MODEL_ID,
} from "./model-facts";

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

/**
 * Money value of a credit amount in the locale's checkout currency (credit
 * pack price, same anchor as the model selector): "$0.06", "0,23 zł".
 * Small amounts keep a third decimal so cheap per-token prices stay visible.
 */
export function formatMoney(credits: number, locale: CountryLanguage): string {
  const { amount, currency } = getCreditUnitPrice(locale);
  const value = credits * amount;
  const digits = value > 0 && value < 0.1 ? 3 : 2;
  return new Intl.NumberFormat(getLanguageFromLocale(locale), {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: digits,
  }).format(value);
}

/** Which kind of uncensored a chat model is; null outside the uncensored tier. */
export type UncensoredKind = "ownWorldview" | "refusalsRemoved";

export function uncensoredKind(
  facts: Pick<ModelFacts, "id" | "content">,
): UncensoredKind | null {
  if (facts.content !== ContentLevel.UNCENSORED) {
    return null;
  }
  return facts.id === OWN_WORLDVIEW_UNCENSORED_MODEL_ID
    ? "ownWorldview"
    : "refusalsRemoved";
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
  | "uncensoredKind"
  | "intelligence"
  | "strengths"
  | "price"
  | "tokenPrice"
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
    value:
      facts.successor === null
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
      hint: priceHint(facts, locale, t),
      missing: false,
    },
    facts.tokenPrice === null
      ? {
          key: "tokenPrice",
          label: t("facts.tokenPrice"),
          value: t("facts.fixedPrice"),
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
    {
      key: "context",
      label: t("facts.context"),
      value: t("facts.contextValue", {
        tokens: formatTokenCount(facts.contextWindow),
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
