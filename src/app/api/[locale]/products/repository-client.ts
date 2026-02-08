/**
 * Centralized Products & Pricing Repository
 * Single source of truth for all pricing and product data across the platform
 */

import type { JSX } from "react";

import type { SubscriptionPlanValue } from "@/app/api/[locale]/subscription/enum";
import { SubscriptionPlan } from "@/app/api/[locale]/subscription/enum";
import type {
  Countries,
  CountryLanguage,
  Currencies,
} from "@/i18n/core/config";
import { getCountryFromLocale } from "@/i18n/core/language-utils";
import type { TranslationKey } from "@/i18n/core/static-types";

/**
 * ============================================================================
 * PRICING CONFIGURATION
 * Single source of truth for all feature pricing
 * ============================================================================
 */

/**
 * Credit Value Definition
 * 1 credit = €0.01 = $0.01 = 0.24 PLN
 */
const CREDIT_VALUE_USD = 0.01;

/**
 * Standard markup percentage applied to all external API costs
 */
export const STANDARD_MARKUP_PERCENTAGE = 0.3; // 30% markup

/**
 * TTS Pricing (Amazon Polly)
 * Base: $4.00/1M characters
 * With 30% markup: $5.20/1M characters
 * Per character: $0.0000052 = 0.00052 credits
 */
const TTS_BASE_COST_PER_MILLION_USD = 4.0;
const TTS_COST_WITH_MARKUP_USD =
  TTS_BASE_COST_PER_MILLION_USD * (1 + STANDARD_MARKUP_PERCENTAGE);
export const TTS_COST_PER_CHARACTER =
  TTS_COST_WITH_MARKUP_USD / 1_000_000 / CREDIT_VALUE_USD;

/**
 * STT Pricing (OpenAI Whisper)
 * Base: $0.006/60 seconds (per minute)
 * With 30% markup: $0.0078/60 seconds
 * Per second: $0.00013 = 0.013 credits
 */
const STT_BASE_COST_PER_MINUTE_USD = 0.006;
const STT_COST_WITH_MARKUP_USD =
  STT_BASE_COST_PER_MINUTE_USD * (1 + STANDARD_MARKUP_PERCENTAGE);
const STT_COST_PER_SECOND_USD = STT_COST_WITH_MARKUP_USD / 60;
export const STT_COST_PER_SECOND = STT_COST_PER_SECOND_USD / CREDIT_VALUE_USD;

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
   * Fetch URL Content (Scrappey): 0.13 credits per request
   * Based on $10/10,000 requests + 30% markup
   */
  FETCH_URL_CONTENT: SCRAPPEY_COST_PER_REQUEST,

  /**
   * STT: 0.013 credits per second
   * Based on OpenAI Whisper $0.006/minute + 30% markup
   * NOTE: Multiply by recording duration in seconds
   */
  STT: STT_COST_PER_SECOND,

  /**
   * TTS: 0.00052 credits per character
   * Based on Amazon Polly $4/1M chars + 30% markup
   * NOTE: Multiply by text length in characters
   */
  TTS: TTS_COST_PER_CHARACTER,
} as const;

export type PaymentInterval = "month" | "year" | "one_time";

/**
 * Product definition with pricing per country
 */
export interface ProductDefinition {
  name: TranslationKey;
  description: TranslationKey;
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
  name: TranslationKey;
  description: TranslationKey;
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
}

/**
 * Internal product definitions with pricing for all countries
 */
const productDefinitions = {
  free_tier: {
    name: "app.api.products.free.name" as const,
    description: "app.api.products.free.description" as const,
    priceByCountry: {
      DE: { price: 0, currency: "EUR" as const },
      PL: { price: 0, currency: "PLN" as const },
      US: { price: 0, currency: "USD" as const },
      GLOBAL: { price: 0, currency: "USD" as const },
    },
    credits: 20,
    isSubscription: true,
    allowedIntervals: ["month" as const],
    status: "active" as const,
  },
  subscription: {
    name: "app.api.products.subscription.name" as const,
    description: "app.api.products.subscription.description" as const,
    priceByCountry: {
      DE: { price: 8, currency: "EUR" as const },
      PL: { price: 30, currency: "PLN" as const },
      US: { price: 8, currency: "USD" as const },
      GLOBAL: { price: 8, currency: "USD" as const },
    },
    yearlyPriceByCountry: {
      DE: { price: 80, currency: "EUR" as const },
      PL: { price: 300, currency: "PLN" as const },
      US: { price: 80, currency: "USD" as const },
      GLOBAL: { price: 80, currency: "USD" as const },
    },
    credits: 800,
    isSubscription: true,
    allowedIntervals: ["month" as const, "year" as const],
    status: "active" as const,
  },
  credit_pack: {
    name: "app.api.products.creditPack.name" as const,
    description: "app.api.products.creditPack.description" as const,
    priceByCountry: {
      DE: { price: 5, currency: "EUR" as const },
      PL: { price: 5, currency: "PLN" as const },
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

    // Get price and currency based on interval and country
    // Let TypeScript infer the literal type from the data
    const priceData =
      interval === "year" && "yearlyPriceByCountry" in definition
        ? definition.yearlyPriceByCountry[country]
        : interval === "one_time" && "oneTimePriceByCountry" in definition
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
      status: definition.status || "active",
      deprecatedAt: ("deprecatedAt" in definition
        ? definition.deprecatedAt
        : undefined) as Date | undefined,
      replacedBy: ("replacedBy" in definition
        ? definition.replacedBy
        : undefined) as ProductIds | undefined,
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
      [ProductIds.CREDIT_PACK]: this.getProduct(ProductIds.CREDIT_PACK, locale),
    };
  }

  /**
   * Check if a product can be purchased (not deprecated)
   */
  canPurchase(productId: ProductIds): boolean {
    const definition = productDefinitions[productId];
    return (definition.status || "active") === "active";
  }

  /**
   * Check if a product is deprecated (for existing subscribers check)
   */
  isDeprecated(productId: ProductIds): boolean {
    const definition = productDefinitions[productId];
    // Type widening: definition.status is inferred as "active" literal from const context
    // but architecturally it represents the union "active" | "deprecated"
    return (definition.status as "active" | "deprecated") === "deprecated";
  }

  /**
   * Get replacement product ID for a deprecated product
   */
  getReplacementProduct(productId: ProductIds): ProductIds | null {
    const definition = productDefinitions[productId];
    return (
      "replacedBy" in definition ? definition.replacedBy || null : null
    ) as ProductIds | null;
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
   * Example: "We offer Free (20 credits/month), Credit Packs (€5/500 credits), and Unlimited (€10/month) plans."
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
    const packPrice = creditPack.priceByCountry[country].price;
    const packCurrency = creditPack.priceByCountry[country].currency;

    const subCurrencySymbol =
      subCurrency === "EUR" ? "€" : subCurrency === "PLN" ? "zł" : "$";
    const packCurrencySymbol =
      packCurrency === "EUR" ? "€" : packCurrency === "PLN" ? "zł" : "$";

    return t("app.api.products.summary", {
      freeCredits: freeTier.credits,
      packCurrency: packCurrencySymbol,
      packPrice: packPrice,
      packCredits: creditPack.credits,
      subCurrency: subCurrencySymbol,
      subPrice: subPrice,
    });
  }
}

export const productsRepository = new ProductsRepositoryImpl();

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
  name: TranslationKey;
  description: TranslationKey;
  features: TranslationKey[];
  premiumFeatures?: {
    feature: TranslationKey;
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
  pricing: TranslationKey;
  cta: TranslationKey;
  highlighted: boolean;
  icon?: JSX.Element; // Optional - must be provided by client components
  badge?: TranslationKey;
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
        "app.api.products.subscription.features.credits",
        "app.api.products.subscription.features.allModels",
        "app.api.products.subscription.features.allFeatures",
        "app.api.products.subscription.features.cancel",
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
      pricing: "app.api.products.subscription.price",
      cta: "app.api.products.subscription.cta",
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
  name: TranslationKey;
  [SubscriptionPlan.SUBSCRIPTION]: boolean;
}

export interface PricingTextFeature {
  name: TranslationKey;
  type: "text";
  [SubscriptionPlan.SUBSCRIPTION]: TranslationKey;
}

export type PricingComparisonFeature = PricingFeature | PricingTextFeature;

/**
 * Pricing comparison features data
 * Currently empty - add features as needed
 */
export const pricingComparisonFeatures: PricingComparisonFeature[] = [];
