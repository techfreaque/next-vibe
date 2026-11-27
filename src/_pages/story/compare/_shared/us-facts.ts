/**
 * Our side of every comparison, read at render time from the same sources
 * the rest of the site uses: model registry + env availability (counts,
 * which upstream providers serve what), the products catalog (plans, pack,
 * free credits) and the API access rule. Nothing about us is hardcoded in
 * copy.
 */

import { getEnvAvailability } from "next-vibe/agent/env-availability";
import {
  getAvailableChatModelCount,
  getAvailableChatModelCountsByContentLevel,
  getAvailableChatProviderCount,
} from "next-vibe/agent/models/all-models";
import {
  ApiProvider,
  apiProviderDisplayNames,
} from "next-vibe/agent/models/models";
import { ContentLevel } from "next-vibe/agent/skills/enum";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { formatCurrency } from "next-vibe/core/i18n/core/localization-utils";

import { getApiAccessPrices } from "@/api-keys/access";
import { configScopedTranslation } from "@/env/i18n";
import {
  FREE_CREDIT_ALLOWANCE,
  FREE_CREDIT_MAX_TOTAL,
  FREE_CREDIT_SIGNED_IN_TOTAL,
  STANDARD_MARKUP_PERCENTAGE,
} from "@/products/constants";
import { scopedTranslation as productsScopedTranslation } from "@/products/i18n";
import {
  getSubscriptionTiers,
  ProductIds,
  productsRepository,
} from "@/products/platform-products";

import {
  listModelFacts,
  OWN_WORLDVIEW_UNCENSORED_MODEL_ID,
  toModelSlug,
} from "../../../models/_shared/model-facts";
import { listMediaFacts } from "../../../models/_shared/model-media-facts";

/** Upstream providers we route to that are also platforms on these pages. */
export const UPSTREAM_PROVIDERS = [
  ApiProvider.VENICE_AI,
  ApiProvider.UNCENSORED_AI,
  ApiProvider.NANO_GPT,
  ApiProvider.FREEDOMGPT,
  ApiProvider.GAB_AI,
  ApiProvider.OPENROUTER,
] as const;

export type UpstreamProvider = (typeof UPSTREAM_PROVIDERS)[number];

export interface UpstreamUsage {
  /** Current public chat models we serve through this provider. */
  models: number;
  /** Of those, uncensored tier. */
  uncensored: number;
  /** Up to three example model names. */
  examples: string[];
}

export interface UsFacts {
  appName: string;
  modelCount: number;
  labCount: number;
  mainstream: number;
  open: number;
  uncensored: number;
  /** Uncensored models with the refusals cut out (all but the own-worldview one). */
  refusalsRemoved: number;
  ownModelName: string;
  ownModelSlug: string;
  imageModels: number;
  videoModels: number;
  musicModels: number;
  voiceModels: number;
  guestCredits: number;
  freeCredits: number;
  maxCredits: number;
  newsletterBonus: number;
  /** "Starter $8, Plus $20, ..." in the locale's currency. */
  planList: string;
  subPrice: string;
  subCredits: number;
  topPrice: string;
  packPrice: string;
  packCredits: number;
  apiSubPrice: string;
  markup: number;
  upstream: Record<UpstreamProvider, UpstreamUsage>;
}

/** A plain string map: UsFacts flattened for i18n interpolation. */
export type UsParams = Record<string, string | number>;

export async function loadUsFacts(locale: CountryLanguage): Promise<UsFacts> {
  const availability = await getEnvAvailability();
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const { t: productT } = productsScopedTranslation.scopedT(locale);
  const tiers = getAvailableChatModelCountsByContentLevel(false, availability);
  const models = listModelFacts(availability).filter((m) => !m.isLegacy);
  const media = listMediaFacts(availability).filter((m) => !m.isLegacy);
  const countMedia = (types: readonly string[]): number =>
    media.filter((m) => types.includes(m.type)).length;

  const products = productsRepository.getProducts(locale);
  const pack = products[ProductIds.CREDIT_PACK];
  const subscription = products[ProductIds.SUBSCRIPTION];
  const planTiers = getSubscriptionTiers(locale);
  const own = models.find((m) => m.id === OWN_WORLDVIEW_UNCENSORED_MODEL_ID);

  const usageFor = (provider: UpstreamProvider): UpstreamUsage => {
    const label = apiProviderDisplayNames[provider];
    const served = models.filter((m) => m.providers.includes(label));
    const uncensoredServed = served.filter(
      (m) => m.content === ContentLevel.UNCENSORED,
    );
    return {
      models: served.length,
      uncensored: uncensoredServed.length,
      examples: (uncensoredServed.length > 0 ? uncensoredServed : served)
        .slice(0, 3)
        .map((m) => m.name.trim()),
    };
  };
  const upstream: Record<UpstreamProvider, UpstreamUsage> = {
    [ApiProvider.VENICE_AI]: usageFor(ApiProvider.VENICE_AI),
    [ApiProvider.UNCENSORED_AI]: usageFor(ApiProvider.UNCENSORED_AI),
    [ApiProvider.NANO_GPT]: usageFor(ApiProvider.NANO_GPT),
    [ApiProvider.FREEDOMGPT]: usageFor(ApiProvider.FREEDOMGPT),
    [ApiProvider.GAB_AI]: usageFor(ApiProvider.GAB_AI),
    [ApiProvider.OPENROUTER]: usageFor(ApiProvider.OPENROUTER),
  };

  return {
    appName: configT("appName"),
    modelCount: getAvailableChatModelCount(false, availability),
    labCount: getAvailableChatProviderCount(false, availability),
    mainstream: tiers.mainstream,
    open: tiers.open,
    uncensored: tiers.uncensored,
    refusalsRemoved: Math.max(0, tiers.uncensored - (own ? 1 : 0)),
    ownModelName: own?.name.trim() ?? "",
    ownModelSlug: toModelSlug(OWN_WORLDVIEW_UNCENSORED_MODEL_ID),
    imageModels: countMedia(["image"]),
    videoModels: countMedia(["video"]),
    musicModels: countMedia(["audio"]),
    voiceModels: countMedia(["tts", "stt"]),
    guestCredits: FREE_CREDIT_ALLOWANCE.guest,
    freeCredits: FREE_CREDIT_SIGNED_IN_TOTAL,
    maxCredits: FREE_CREDIT_MAX_TOTAL,
    newsletterBonus: FREE_CREDIT_ALLOWANCE.newsletterBonus,
    planList: planTiers
      .map((tier) => `${productT(tier.name)} ${tier.priceLabel}`)
      .join(", "),
    subPrice: planTiers[0]?.priceLabel ?? "",
    subCredits: subscription.credits,
    topPrice: planTiers.at(-1)?.priceLabel ?? "",
    packPrice: formatCurrency(pack.price, pack.currency, locale),
    packCredits: pack.credits,
    apiSubPrice: getApiAccessPrices(locale).subPrice,
    markup: Math.round(STANDARD_MARKUP_PERCENTAGE * 100),
    upstream,
  };
}

/** Flat interpolation params for copy about us. */
export function usParams(facts: UsFacts): UsParams {
  const params: UsParams = {
    appName: facts.appName,
    modelCount: facts.modelCount,
    labCount: facts.labCount,
    mainstream: facts.mainstream,
    open: facts.open,
    uncensored: facts.uncensored,
    refusalsRemoved: facts.refusalsRemoved,
    ownModel: facts.ownModelName,
    imageModels: facts.imageModels,
    videoModels: facts.videoModels,
    musicModels: facts.musicModels,
    voiceModels: facts.voiceModels,
    guestCredits: facts.guestCredits,
    freeCredits: facts.freeCredits,
    maxCredits: facts.maxCredits,
    newsletterBonus: facts.newsletterBonus,
    planList: facts.planList,
    subPrice: facts.subPrice,
    subCredits: facts.subCredits,
    topPrice: facts.topPrice,
    packPrice: facts.packPrice,
    packCredits: facts.packCredits,
    apiSubPrice: facts.apiSubPrice,
    markup: facts.markup,
  };
  for (const provider of UPSTREAM_PROVIDERS) {
    const usage = facts.upstream[provider];
    const key = UPSTREAM_PARAM_KEY[provider];
    params[`${key}Models`] = usage.models;
    params[`${key}Uncensored`] = usage.uncensored;
    params[`${key}Examples`] = usage.examples.join(", ");
  }
  return params;
}

/** Param prefix per upstream provider ("veniceModels", "nanoGptExamples"). */
const UPSTREAM_PARAM_KEY: Record<UpstreamProvider, string> = {
  [ApiProvider.VENICE_AI]: "venice",
  [ApiProvider.UNCENSORED_AI]: "uncensoredAi",
  [ApiProvider.NANO_GPT]: "nanoGpt",
  [ApiProvider.FREEDOMGPT]: "freedomGpt",
  [ApiProvider.GAB_AI]: "gabAi",
  [ApiProvider.OPENROUTER]: "openRouter",
};
