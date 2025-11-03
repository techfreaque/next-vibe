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

export type PaymentInterval = "month" | "year" | "one_time";

/**
 * Product definition with pricing per country
 */
export interface ProductDefinition {
  name: TranslationKey;
  description: TranslationKey;
  priceByCountry: {
    [key in Countries]: number;
  };
  yearlyPriceByCountry?: {
    [key in Countries]: number;
  };
  oneTimePriceByCountry?: {
    [key in Countries]: number;
  };
  currency: Currencies;
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
      DE: 0,
      PL: 0,
      GLOBAL: 0,
    },
    currency: "EUR" as const,
    credits: 20,
    isSubscription: true,
    allowedIntervals: ["month" as const],
    status: "active" as const,
  },
  subscription: {
    name: "app.api.v1.core.products.subscription.name" as const,
    description: "app.api.v1.core.products.subscription.description" as const,
    priceByCountry: {
      DE: 10,
      PL: 10,
      GLOBAL: 10,
    },
    yearlyPriceByCountry: {
      DE: 100,
      PL: 100,
      GLOBAL: 100,
    },
    oneTimePriceByCountry: {
      DE: 15,
      PL: 15,
      GLOBAL: 15,
    },
    currency: "EUR" as const,
    credits: 1000,
    isSubscription: true,
    allowedIntervals: ["month" as const, "year" as const, "one_time" as const],
    status: "active" as const,
  },
  credit_pack: {
    name: "app.api.v1.core.products.creditPack.name" as const,
    description: "app.api.v1.core.products.creditPack.description" as const,
    priceByCountry: {
      DE: 5,
      PL: 5,
      GLOBAL: 5,
    },
    oneTimePriceByCountry: {
      DE: 5,
      PL: 5,
      GLOBAL: 5,
    },
    currency: "EUR" as const,
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

    // Get price based on interval
    let price: number;
    if (interval === "year" && "yearlyPriceByCountry" in definition) {
      price = definition.yearlyPriceByCountry[country];
    } else if (
      interval === "one_time" &&
      "oneTimePriceByCountry" in definition
    ) {
      price = definition.oneTimePriceByCountry[country];
    } else {
      price = definition.priceByCountry[country];
    }

    return {
      id: productId,
      name: definition.name,
      description: definition.description,
      price,
      currency: definition.currency,
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

  // Helper to get price for specific country and interval
  const getPrice = (country: Countries, interval: PaymentInterval): number => {
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
        "app.story.pricing.plans.STARTER.features.messages" as const,
        "app.story.pricing.plans.STARTER.features.models" as const,
        "app.story.pricing.plans.STARTER.features.folders" as const,
        "app.story.pricing.plans.STARTER.features.personas" as const,
      ],
      priceByCountry: {
        DE: {
          monthly: getPrice("DE", "month"),
          annual: getPrice("DE", "year"),
          currency: subscriptionDef.currency,
        },
        PL: {
          monthly: getPrice("PL", "month"),
          annual: getPrice("PL", "year"),
          currency: subscriptionDef.currency,
        },
        GLOBAL: {
          monthly: getPrice("GLOBAL", "month"),
          annual: getPrice("GLOBAL", "year"),
          currency: subscriptionDef.currency,
        },
      },
      pricing: "app.story.pricing.plans.STARTER.price" as const,
      cta: "app.story.pricing.plans.STARTER.cta" as const,
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
