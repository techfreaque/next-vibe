/**
 * Centralized Products & Pricing Repository
 * Single source of truth for all pricing and product data across the platform
 */

import type { JSX } from "react";
import type { TranslationKey } from "@/i18n/core/static-types";
import type {
  Countries,
  CountryLanguage,
  Currencies,
} from "@/i18n/core/config";
import { getCountryFromLocale } from "@/i18n/core/language-utils";
import { SubscriptionPlan } from "@/app/api/[locale]/v1/core/subscription/enum";
import type { SubscriptionPlanValue } from "@/app/api/[locale]/v1/core/subscription/enum";
import { modelOptions } from "@/app/api/[locale]/v1/core/agent/chat/model-access/models";

/**
 * Total number of AI models available
 * Dynamically calculated from modelOptions array
 */
export const TOTAL_MODEL_COUNT = modelOptions.length;

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
  status?: "active" | "deprecated";
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
    name: "app.api.v1.core.products.free.name" as const,
    description: "app.api.v1.core.products.free.description" as const,
    priceByCountry: {
      DE: { price: 0, currency: "EUR" },
      PL: { price: 0, currency: "PLN" },
      US: { price: 0, currency: "USD" },
      GLOBAL: { price: 0, currency: "USD" },
    },
    credits: 20,
    isSubscription: true,
    allowedIntervals: ["month" as const],
    status: "active" as const,
  },
  subscription: {
    name: "app.api.v1.core.products.subscription.name" as const,
    description: "app.api.v1.core.products.subscription.description" as const,
    priceByCountry: {
      DE: { price: 10, currency: "EUR" },
      PL: { price: 70, currency: "PLN" },
      US: { price: 10, currency: "USD" },
      GLOBAL: { price: 10, currency: "USD" },
    },
    yearlyPriceByCountry: {
      DE: { price: 100, currency: "EUR" },
      PL: { price: 700, currency: "PLN" },
      US: { price: 100, currency: "USD" },
      GLOBAL: { price: 100, currency: "USD" },
    },
    credits: 1000,
    isSubscription: true,
    allowedIntervals: ["month" as const, "year" as const],
    status: "active" as const,
  },
  credit_pack: {
    name: "app.api.v1.core.products.creditPack.name" as const,
    description: "app.api.v1.core.products.creditPack.description" as const,
    priceByCountry: {
      DE: { price: 5, currency: "EUR" },
      PL: { price: 5, currency: "PLN" },
      US: { price: 5, currency: "USD" },
      GLOBAL: { price: 5, currency: "USD" },
    },
    oneTimePriceByCountry: {
      DE: { price: 5, currency: "EUR" },
      PL: { price: 40, currency: "PLN" },
      US: { price: 5, currency: "USD" },
      GLOBAL: { price: 5, currency: "USD" },
    },
    credits: 500,
    isSubscription: false,
    allowedIntervals: ["one_time" as const],
    status: "active" as const,
  },
} as const satisfies Record<ProductIds, ProductDefinition>;

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
    let priceData: { price: number; currency: Currencies };
    if (interval === "year" && "yearlyPriceByCountry" in definition) {
      priceData = definition.yearlyPriceByCountry[country];
    } else if (
      interval === "one_time" &&
      "oneTimePriceByCountry" in definition
    ) {
      priceData = definition.oneTimePriceByCountry[country];
    } else {
      priceData = definition.priceByCountry[country];
    }

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
    const status = (definition.status || "active") as "active" | "deprecated";
    return status === "deprecated";
  }

  /**
   * Get replacement product ID for a deprecated product
   */
  getReplacementProduct(productId: ProductIds): ProductIds | null {
    const definition = productDefinitions[productId];
    const replacedBy = (
      "replacedBy" in definition ? definition.replacedBy : undefined
    ) as ProductIds | undefined;
    return replacedBy || null;
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

    return t("app.api.v1.core.products.summary", {
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
  const plans = getPricingPlansArray(locale);
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
  locale: CountryLanguage,
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
        "app.api.v1.core.products.subscription.features.credits",
        "app.api.v1.core.products.subscription.features.allModels",
        "app.api.v1.core.products.subscription.features.allFeatures",
        "app.api.v1.core.products.subscription.features.cancel",
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
      pricing: "app.api.v1.core.products.subscription.price",
      cta: "app.api.v1.core.products.subscription.cta",
      highlighted: false,
      icon: icon,
    },
  };
}

/**
 * Get all pricing plans for a locale as a record
 */
export function getPricingPlans(
  locale: CountryLanguage,
  icon?: JSX.Element,
): Record<typeof SubscriptionPlanValue, PricingPlan> {
  return buildPricingPlans(locale, icon);
}

/**
 * Get specific plan details by ID
 */
export function getPlanDetails(
  planId: typeof SubscriptionPlanValue,
  locale: CountryLanguage,
  icon?: JSX.Element,
): PricingPlan {
  return getPricingPlans(locale, icon)[planId];
}

/**
 * Get all pricing plans as an array
 */
export function getPricingPlansArray(
  locale: CountryLanguage,
  icon?: JSX.Element,
): PricingPlan[] {
  return Object.values(getPricingPlans(locale, icon));
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
