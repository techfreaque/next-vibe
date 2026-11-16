/**
 * Centralized Products & Pricing Repository
 * Single source of truth for all pricing and product data across the platform
 */

import type {
  Countries,
  CountryLanguage,
  Currencies,
} from "next-vibe/core/i18n/core/config";
import { getCountryFromLocale } from "next-vibe/core/i18n/core/language-utils";
import type { JSX } from "react";

import type { SubscriptionPlanValue } from "@/subscription/enum";
import { SubscriptionPlan } from "@/subscription/enum";

import type { PaymentInterval } from "../payment/providers/types";
import {
  FREE_CREDIT_ALLOWANCE,
  FREE_CREDIT_MAX_TOTAL,
  FREE_CREDIT_SIGNED_IN_TOTAL,
} from "./constants";
import type { ProductsTranslationKey } from "./i18n";

/**
 * ============================================================================
 * PRICING CONFIGURATION
 * Single source of truth for all feature pricing
 * ============================================================================
 */

/**
 * Credit Value Definition
 * 1 credit = €0.01 = $0.01 (PL pack: 40 zł / 500 credits = 0.08 zł)
 */
export const CREDIT_VALUE_USD = 0.01;

/**
 * Standard markup percentage applied to all external API costs
 */
export const STANDARD_MARKUP_PERCENTAGE = 0.3; // 30% markup

/**
 * TTS and STT have no flat rate: each voice / transcription route bills its
 * own provider price x STANDARD_MARKUP_PERCENTAGE (calculateTtsCharge in
 * text-to-speech/models.ts, calculateSttCharge in speech-to-text/models.ts).
 */

/**
 * Brave Search Pricing
 * Base: $5.00/1,000 requests
 * With 30% markup: $6.50/1,000 requests
 * Per request: $0.0065 = 0.65 credits
 *
 * NOTE: Rounded to 2 decimal places to avoid floating point display issues
 */
const BRAVE_SEARCH_BASE_COST_PER_1000_USD = 5.0;
const BRAVE_SEARCH_COST_WITH_MARKUP_USD =
  BRAVE_SEARCH_BASE_COST_PER_1000_USD * (1 + STANDARD_MARKUP_PERCENTAGE);
const BRAVE_SEARCH_COST_PER_REQUEST_USD =
  BRAVE_SEARCH_COST_WITH_MARKUP_USD / 1000;
const BRAVE_SEARCH_COST_CALCULATED =
  BRAVE_SEARCH_COST_PER_REQUEST_USD / CREDIT_VALUE_USD;
export const BRAVE_SEARCH_COST_PER_REQUEST =
  Math.round(BRAVE_SEARCH_COST_CALCULATED * 100) / 100;

/**
 * Scrappey (URL Fetcher) Pricing
 * Base: $10.00/10,000 requests
 * With 30% markup: $13.00/10,000 requests
 * Per request: $0.0013 = 0.13 credits
 *
 * NOTE: Rounded to 2 decimal places to avoid floating point display issues
 */
const SCRAPPEY_BASE_COST_PER_10K_USD = 10.0;
const SCRAPPEY_COST_WITH_MARKUP_USD =
  SCRAPPEY_BASE_COST_PER_10K_USD * (1 + STANDARD_MARKUP_PERCENTAGE);
const SCRAPPEY_COST_PER_REQUEST_USD = SCRAPPEY_COST_WITH_MARKUP_USD / 10000;
const SCRAPPEY_COST_CALCULATED =
  SCRAPPEY_COST_PER_REQUEST_USD / CREDIT_VALUE_USD;
export const SCRAPPEY_COST_PER_REQUEST =
  Math.round(SCRAPPEY_COST_CALCULATED * 100) / 100;

/**
 * Kagi Search Pricing
 * Base: $0.015 per request (1.5 cents)
 * With 30% markup: $0.0195 per request
 * Per request: $0.0195 = 1.95 credits
 *
 * NOTE: Rounded to 2 decimal places to avoid floating point display issues
 */
const KAGI_SEARCH_BASE_COST_PER_REQUEST_USD = 0.015;
const KAGI_SEARCH_COST_WITH_MARKUP_USD =
  KAGI_SEARCH_BASE_COST_PER_REQUEST_USD * (1 + STANDARD_MARKUP_PERCENTAGE);
const KAGI_SEARCH_COST_CALCULATED =
  KAGI_SEARCH_COST_WITH_MARKUP_USD / CREDIT_VALUE_USD;
export const KAGI_SEARCH_COST_PER_REQUEST =
  Math.round(KAGI_SEARCH_COST_CALCULATED * 100) / 100;

/**
 * Feature Costs Object
 * Consolidated pricing for all non-model features
 */
export const FEATURE_COSTS = {
  /**
   * Brave Search: 0.65 credits per search
   * Based on $5/1000 requests + 30% markup
   */
  BRAVE_SEARCH: BRAVE_SEARCH_COST_PER_REQUEST,

  /**
   * Kagi Search: 1.95 credits per search
   * Based on $0.015/request (1.5 cents) + 30% markup
   */
  KAGI_SEARCH: KAGI_SEARCH_COST_PER_REQUEST,

  /**
   * Fetch URL Content (Scrappey): 0.13 credits per request
   * Based on $10/10,000 requests + 30% markup
   */
  FETCH_URL_CONTENT: SCRAPPEY_COST_PER_REQUEST,
} as const;

/**
 * Product definition with pricing per country
 */
export interface ProductDefinition {
  name: ProductsTranslationKey;
  description: ProductsTranslationKey;
  priceByCountry: {
    [key in Countries]: {
      price: number;
      currency: Currencies;
    };
  };
  yearlyPriceByCountry?: {
    [key in Countries]: {
      price: number;
      currency: Currencies;
    };
  };
  oneTimePriceByCountry?: {
    [key in Countries]: {
      price: number;
      currency: Currencies;
    };
  };
  isSubscription: boolean;
  allowedIntervals: PaymentInterval[];
  credits: number;
  status: "active" | "deprecated";
  deprecatedAt?: Date;
  replacedBy?: ProductIds;
}

/**
 * Product with price for specific locale
 */
export interface Product {
  id: ProductIds;
  name: ProductsTranslationKey;
  description: ProductsTranslationKey;
  price: number;
  currency: Currencies;
  isSubscription: boolean;
  allowedIntervals: PaymentInterval[];
  credits: number;
  country: Countries;
  status: "active" | "deprecated";
  deprecatedAt?: Date;
  replacedBy?: ProductIds;
}

export enum ProductIds {
  FREE_TIER = "free_tier",
  SUBSCRIPTION = "subscription",
  CREDIT_PACK = "credit_pack",
  CREDIT_PACK_LARGE = "credit_pack_large",
}

/**
 * Credit pack products a user can buy (one-time, no subscription required).
 * Ordered small to large. Retired packs stay in ProductIds (old purchases and
 * ledger rows reference them) but are left out of this list.
 */
export const CREDIT_PACK_PRODUCT_IDS = [ProductIds.CREDIT_PACK] as const;

/**
 * Internal product definitions with pricing for all countries
 */
const productDefinitions: Record<ProductIds, ProductDefinition> = {
  free_tier: {
    name: "free.name",
    description: "free.description",
    priceByCountry: {
      DE: { price: 0, currency: "EUR" as const },
      PL: { price: 0, currency: "PLN" as const },
      US: { price: 0, currency: "USD" as const },
      GLOBAL: { price: 0, currency: "USD" as const },
    },
    credits: FREE_CREDIT_ALLOWANCE.guest,
    isSubscription: true,
    allowedIntervals: ["month" as const],
    status: "active" as const,
  },
  subscription: {
    name: "subscription.name",
    description: "subscription.description",
    priceByCountry: {
      DE: { price: 8, currency: "EUR" as const },
      PL: { price: 30, currency: "PLN" as const },
      US: { price: 8, currency: "USD" as const },
      GLOBAL: { price: 8, currency: "USD" as const },
    },
    yearlyPriceByCountry: {
      DE: { price: 88, currency: "EUR" as const },
      PL: { price: 330, currency: "PLN" as const },
      US: { price: 88, currency: "USD" as const },
      GLOBAL: { price: 88, currency: "USD" as const },
    },
    credits: 800,
    isSubscription: true,
    allowedIntervals: ["month" as const, "year" as const],
    status: "active" as const,
  },
  credit_pack: {
    name: "creditPack.name",
    description: "creditPack.description",
    // Must equal oneTimePriceByCountry (what checkout charges): a pack has no
    // other interval, and some surfaces read the default price.
    priceByCountry: {
      DE: { price: 5, currency: "EUR" as const },
      PL: { price: 40, currency: "PLN" as const },
      US: { price: 5, currency: "USD" as const },
      GLOBAL: { price: 5, currency: "USD" as const },
    },
    oneTimePriceByCountry: {
      DE: { price: 5, currency: "EUR" as const },
      PL: { price: 40, currency: "PLN" as const },
      US: { price: 5, currency: "USD" as const },
      GLOBAL: { price: 5, currency: "USD" as const },
    },
    credits: 500,
    isSubscription: false,
    allowedIntervals: ["one_time" as const],
    status: "active" as const,
  },
  // Retired 2026-11-13: $20 / 2500 credits ($0.008 per credit) lost money after
  // Stripe fees. Kept so historical purchases still resolve; not for sale.
  credit_pack_large: {
    name: "creditPackLarge.name",
    description: "creditPackLarge.description",
    priceByCountry: {
      DE: { price: 20, currency: "EUR" as const },
      PL: { price: 160, currency: "PLN" as const },
      US: { price: 20, currency: "USD" as const },
      GLOBAL: { price: 20, currency: "USD" as const },
    },
    oneTimePriceByCountry: {
      DE: { price: 20, currency: "EUR" as const },
      PL: { price: 160, currency: "PLN" as const },
      US: { price: 20, currency: "USD" as const },
      GLOBAL: { price: 20, currency: "USD" as const },
    },
    credits: 2500,
    isSubscription: false,
    allowedIntervals: ["one_time" as const],
    status: "deprecated" as const,
    deprecatedAt: new Date("2026-11-13T00:00:00Z"),
    replacedBy: ProductIds.CREDIT_PACK,
  },
};

/**
 * Products Repository Interface
 */
export interface ProductsRepository {
  /**
   * Get a specific product for a locale with optional interval
   */
  getProduct(
    productId: ProductIds,
    locale: CountryLanguage,
    interval?: PaymentInterval,
  ): Product;

  /**
   * Get all products for a specific locale
   */
  getProducts(locale: CountryLanguage): Record<ProductIds, Product>;

  /**
   * Check if a product can be purchased (not deprecated)
   */
  canPurchase(productId: ProductIds): boolean;

  /**
   * Check if a product is deprecated (for existing subscribers check)
   */
  isDeprecated(productId: ProductIds): boolean;

  /**
   * Get replacement product ID for a deprecated product
   */
  getReplacementProduct(productId: ProductIds): ProductIds | null;

  /**
   * Get raw product definitions (internal use only)
   */
  getProductDefinitions(): Record<ProductIds, ProductDefinition>;

  /**
   * Get a summary of all products in a single sentence
   * Single source of truth for product summary text
   */
  getProductsSummary(
    locale: CountryLanguage,
    t: (key: string, params?: Record<string, string | number>) => string,
  ): string;
}

/**
 * Products Repository Implementation
 */
export class ProductsRepositoryImpl implements ProductsRepository {
  /**
   * Get a specific product for a locale with optional interval
   */
  getProduct(
    productId: ProductIds,
    locale: CountryLanguage,
    interval: PaymentInterval = "month",
  ): Product {
    const country = getCountryFromLocale(locale);
    const definition = productDefinitions[productId];
    // An interval the product is not sold in falls back to its first one, so a
    // credit pack read without "one_time" still shows the checkout price.
    const effectiveInterval = definition.allowedIntervals.includes(interval)
      ? interval
      : (definition.allowedIntervals[0] ?? interval);

    // Get price and currency based on interval and country
    // Let TypeScript infer the literal type from the data
    const priceData =
      effectiveInterval === "year" && definition.yearlyPriceByCountry
        ? definition.yearlyPriceByCountry[country]
        : effectiveInterval === "one_time" && definition.oneTimePriceByCountry
          ? definition.oneTimePriceByCountry[country]
          : definition.priceByCountry[country];

    return {
      id: productId,
      name: definition.name,
      description: definition.description,
      price: priceData.price,
      currency: priceData.currency,
      isSubscription: definition.isSubscription,
      allowedIntervals: definition.allowedIntervals,
      credits: definition.credits,
      country,
      status: definition.status,
      deprecatedAt: definition.deprecatedAt,
      replacedBy: definition.replacedBy,
    };
  }

  /**
   * Get all products for a specific locale
   */
  getProducts(locale: CountryLanguage): Record<ProductIds, Product> {
    return {
      [ProductIds.FREE_TIER]: this.getProduct(ProductIds.FREE_TIER, locale),
      [ProductIds.SUBSCRIPTION]: this.getProduct(
        ProductIds.SUBSCRIPTION,
        locale,
      ),
      [ProductIds.CREDIT_PACK]: this.getProduct(
        ProductIds.CREDIT_PACK,
        locale,
        "one_time",
      ),
      [ProductIds.CREDIT_PACK_LARGE]: this.getProduct(
        ProductIds.CREDIT_PACK_LARGE,
        locale,
        "one_time",
      ),
    };
  }

  /**
   * Check if a product can be purchased (not deprecated)
   */
  canPurchase(productId: ProductIds): boolean {
    const definition = productDefinitions[productId];
    return definition.status === "active";
  }

  /**
   * Check if a product is deprecated (for existing subscribers check)
   */
  isDeprecated(productId: ProductIds): boolean {
    return productDefinitions[productId].status === "deprecated";
  }

  /**
   * Get replacement product ID for a deprecated product
   */
  getReplacementProduct(productId: ProductIds): ProductIds | null {
    return productDefinitions[productId].replacedBy ?? null;
  }

  /**
   * Get raw product definitions (for backward compatibility)
   */
  getProductDefinitions(): Record<ProductIds, ProductDefinition> {
    return productDefinitions;
  }

  /**
   * Get a summary of all products in a single sentence
   * Single source of truth for product summary text
   * Example: "We offer Free (20/40/90 credits/month by tier), Credit Packs (€5/500 credits), and Unlimited (€10/month) plans."
   */
  getProductsSummary(
    locale: CountryLanguage,
    t: (key: string, params?: Record<string, string | number>) => string,
  ): string {
    const country = getCountryFromLocale(locale);

    const freeTier = productDefinitions[ProductIds.FREE_TIER];
    const subscription = productDefinitions[ProductIds.SUBSCRIPTION];
    const creditPack = productDefinitions[ProductIds.CREDIT_PACK];

    const subPrice = subscription.priceByCountry[country].price;
    const subCurrency = subscription.priceByCountry[country].currency;
    // Packs are one-time purchases: checkout charges oneTimePriceByCountry
    const packPriceData = (
      creditPack.oneTimePriceByCountry ?? creditPack.priceByCountry
    )[country];
    const packPrice = packPriceData.price;
    const packCurrency = packPriceData.currency;

    const subCurrencySymbol =
      subCurrency === "EUR" ? "€" : subCurrency === "PLN" ? "zł" : "$";
    const packCurrencySymbol =
      packCurrency === "EUR" ? "€" : packCurrency === "PLN" ? "zł" : "$";

    return t("summary", {
      freeCredits: freeTier.credits,
      freeCreditsSignedIn: FREE_CREDIT_SIGNED_IN_TOTAL,
      freeCreditsMax: FREE_CREDIT_MAX_TOTAL,
      packCurrency: packCurrencySymbol,
      packPrice: packPrice,
      packCredits: creditPack.credits,
      subCredits: subscription.credits,
      subCurrency: subCurrencySymbol,
      subPrice: subPrice,
    });
  }
}

export const productsRepository = new ProductsRepositoryImpl();

function currencySymbol(c: string): string {
  return c === "EUR" ? "€" : c === "PLN" ? "zł" : "$";
}

/** "$5", "€8", "40 zł": the złoty sign follows the amount. */
function formatPriceLabel(price: number, currency: string): string {
  return currency === "PLN"
    ? `${price} ${currencySymbol(currency)}`
    : `${currencySymbol(currency)}${price}`;
}

/**
 * Returns interpolation params for pricing-related i18n strings.
 * Use as second argument to t() calls that contain {{subscriptionCredits}},
 * {{packCredits}}, {{packPrice}}, {{freeCredits}}, {{subscriptionPrice}} etc.
 *
 * For emails/server-side use getPricingParamsForLocale(locale) instead.
 */
export function getPricingParams(
  locale: CountryLanguage,
): Record<string, string> {
  const country = getCountryFromLocale(locale);
  const free = productDefinitions[ProductIds.FREE_TIER];
  const sub = productDefinitions[ProductIds.SUBSCRIPTION];
  const pack = productDefinitions[ProductIds.CREDIT_PACK];
  const subPriceData = sub.priceByCountry[country];
  // Packs are one-time purchases: checkout charges oneTimePriceByCountry
  const packPriceData = (pack.oneTimePriceByCountry ?? pack.priceByCountry)[
    country
  ];

  return {
    freeCredits: String(free.credits),
    freeCreditsGuest: String(FREE_CREDIT_ALLOWANCE.guest),
    freeCreditsSignedIn: String(FREE_CREDIT_SIGNED_IN_TOTAL),
    freeCreditsNewsletterBonus: String(FREE_CREDIT_ALLOWANCE.newsletterBonus),
    freeCreditsMax: String(FREE_CREDIT_MAX_TOTAL),
    subscriptionCredits: String(sub.credits),
    packCredits: String(pack.credits),
    subscriptionPrice: formatPriceLabel(
      subPriceData.price,
      subPriceData.currency,
    ),
    packPrice: formatPriceLabel(packPriceData.price, packPriceData.currency),
  };
}

/**
 * USD list prices in cents, for USD-denominated illustrations (referral
 * earnings examples are paid and shown in USD).
 */
export function getUsdPriceCents(): {
  subscriptionMonthly: number;
  creditPack: number;
} {
  const sub = productDefinitions[ProductIds.SUBSCRIPTION];
  const pack = productDefinitions[ProductIds.CREDIT_PACK];
  const packPrices = pack.oneTimePriceByCountry ?? pack.priceByCountry;
  return {
    subscriptionMonthly: Math.round(sub.priceByCountry.US.price * 100),
    creditPack: Math.round(packPrices.US.price * 100),
  };
}

/**
 * ============================================================================
 * PRICING PLAN INTERFACES AND HELPERS
 * Replaces story/pricing/_components/pricing.tsx
 * ============================================================================
 */

/**
 * Pricing plan interface for UI display
 * Contains all information needed to render pricing cards
 */
export interface PricingPlan {
  id: typeof SubscriptionPlanValue;
  name: ProductsTranslationKey;
  description: ProductsTranslationKey;
  features: ProductsTranslationKey[];
  premiumFeatures?: {
    feature: ProductsTranslationKey;
    className?: string;
    icon: JSX.Element;
  }[];
  priceByCountry: {
    [key in Countries]: {
      monthly: number;
      annual: number;
      currency: Currencies;
    };
  };
  pricing: ProductsTranslationKey;
  cta: ProductsTranslationKey;
  highlighted: boolean;
  icon?: JSX.Element; // Optional - must be provided by client components
  badge?: ProductsTranslationKey;
}

/**
 * Get price for a specific plan, country, and billing interval
 */
export function getPlanPriceForCountry(
  plan: PricingPlan,
  country: Countries,
  isAnnual: boolean,
): number {
  return isAnnual
    ? plan.priceByCountry[country].annual
    : plan.priceByCountry[country].monthly;
}

/**
 * Calculate average savings percentage when choosing annual over monthly billing
 */
export function calculateSavingsPercent(locale: CountryLanguage): number {
  const plans = getPricingPlansArray();
  const country = getCountryFromLocale(locale);
  let totalSavingsPercent = 0;
  let validPlansCount = 0;

  for (const plan of plans) {
    const monthlyPrice = plan.priceByCountry[country].monthly;
    const annualMonthlyPrice = plan.priceByCountry[country].annual;

    if (monthlyPrice > 0 && annualMonthlyPrice > 0) {
      const savings = monthlyPrice - annualMonthlyPrice;
      const savingsPercent = (savings / monthlyPrice) * 100;

      totalSavingsPercent += savingsPercent;
      validPlansCount++;
    }
  }

  return validPlansCount === 0
    ? 0
    : Math.round(totalSavingsPercent / validPlansCount);
}

/**
 * Build pricing plans with icon components
 * Note: Icons are lazy-loaded to avoid circular dependencies
 */
function buildPricingPlans(
  icon?: JSX.Element,
): Record<typeof SubscriptionPlanValue, PricingPlan> {
  const definitions = productsRepository.getProductDefinitions();
  const subscriptionDef = definitions[ProductIds.SUBSCRIPTION];

  // Helper to get price and currency for specific country and interval
  const getPriceData = (
    country: Countries,
    interval: PaymentInterval,
  ): { price: number; currency: Currencies } => {
    if (interval === "year" && subscriptionDef.yearlyPriceByCountry) {
      return subscriptionDef.yearlyPriceByCountry[country];
    }
    return subscriptionDef.priceByCountry[country];
  };

  return {
    [SubscriptionPlan.SUBSCRIPTION]: {
      id: SubscriptionPlan.SUBSCRIPTION,
      name: subscriptionDef.name,
      description: subscriptionDef.description,
      features: [
        "subscription.features.credits",
        "subscription.features.allModels",
        "subscription.features.allFeatures",
        "subscription.features.cancel",
      ],
      priceByCountry: {
        DE: {
          monthly: getPriceData("DE", "month").price,
          annual: getPriceData("DE", "year").price,
          currency: getPriceData("DE", "month").currency,
        },
        PL: {
          monthly: getPriceData("PL", "month").price,
          annual: getPriceData("PL", "year").price,
          currency: getPriceData("PL", "month").currency,
        },
        US: {
          monthly: getPriceData("US", "month").price,
          annual: getPriceData("US", "year").price,
          currency: getPriceData("US", "month").currency,
        },
        GLOBAL: {
          monthly: getPriceData("GLOBAL", "month").price,
          annual: getPriceData("GLOBAL", "year").price,
          currency: getPriceData("GLOBAL", "month").currency,
        },
      },
      pricing: "subscription.price",
      cta: "subscription.cta",
      highlighted: false,
      icon: icon,
    },
  };
}

/**
 * Get all pricing plans for a locale as a record
 */
export function getPricingPlans(
  icon?: JSX.Element,
): Record<typeof SubscriptionPlanValue, PricingPlan> {
  return buildPricingPlans(icon);
}

/**
 * Get specific plan details by ID
 */
export function getPlanDetails(
  planId: typeof SubscriptionPlanValue,
  icon?: JSX.Element,
): PricingPlan {
  return getPricingPlans(icon)[planId];
}

/**
 * Get all pricing plans as an array
 */
export function getPricingPlansArray(icon?: JSX.Element): PricingPlan[] {
  return Object.values(getPricingPlans(icon));
}

/**
 * Pricing comparison feature interfaces
 */
export interface PricingFeature {
  name: ProductsTranslationKey;
  [SubscriptionPlan.SUBSCRIPTION]: boolean;
}

export interface PricingTextFeature {
  name: ProductsTranslationKey;
  type: "text";
  [SubscriptionPlan.SUBSCRIPTION]: ProductsTranslationKey;
}

export type PricingComparisonFeature = PricingFeature | PricingTextFeature;

/**
 * Pricing comparison features data
 * Currently empty - add features as needed
 */
export const pricingComparisonFeatures: PricingComparisonFeature[] = [];
