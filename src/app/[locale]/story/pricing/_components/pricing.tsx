import { Star } from "lucide-react";
import type { JSX } from "react";

import type { SubscriptionPlanValue } from "@/app/api/[locale]/v1/core/subscription/enum";
import { SubscriptionPlan } from "@/app/api/[locale]/v1/core/subscription/enum";
import type { Countries, CountryLanguage, Currencies } from "@/i18n/core/config";
import type { TranslationKey } from "@/i18n/core/static-types";

import { productsRepository, ProductIds } from "@/app/api/[locale]/v1/core/products/repository-client";
import { getCountryFromLocale } from "@/i18n/core/language-utils";

// Custom icon components with enhanced styling
const StarterIcon = (): JSX.Element => (
  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-blue-900/30">
    <Star className="h-6 w-6" />
  </div>
);

export function getPlanPriceForCountry(
  plan: PricingPlan,
  country: Countries,
  isAnnual: boolean,
): number {
  const price = isAnnual
    ? plan.priceByCountry[country].annual
    : plan.priceByCountry[country].monthly;
  return price;
}

/**
 * Calculate the savings percentage when choosing annual over monthly billing
 * Returns the rounded percentage saved (average across all plans)
 */
export function calculateSavingsPercent(locale: CountryLanguage): number {
  const plans = getPricingPlansArray(locale);
  const country = getCountryFromLocale(locale);
  let totalSavingsPercent = 0;
  let validPlansCount = 0;

  // Calculate average savings percentage across all non-enterprise plans
  for (const plan of plans) {
    const monthlyPrice = plan.priceByCountry[country].monthly;
    const annualMonthlyPrice = plan.priceByCountry[country].annual; // This is monthly price when billed annually

    if (monthlyPrice > 0 && annualMonthlyPrice > 0) {
      const savings = monthlyPrice - annualMonthlyPrice;
      const savingsPercent = (savings / monthlyPrice) * 100;

      totalSavingsPercent += savingsPercent;
      validPlansCount++;
    }
  }

  if (validPlansCount === 0) {
    return 0;
  }

  const averageSavingsPercent = totalSavingsPercent / validPlansCount;
  return Math.round(averageSavingsPercent);
}

/**
 * Build pricing plans from centralized products repository
 * This ensures all pricing comes from a single source of truth
 */
function buildPricingPlans(locale: CountryLanguage): Record<SubscriptionPlanValue, PricingPlan> {
  const subscriptionProduct = productsRepository.getProduct(ProductIds.SUBSCRIPTION, locale);
  const definitions = productsRepository.getProductDefinitions();
  const subscriptionDef = definitions[ProductIds.SUBSCRIPTION];

  return {
    [SubscriptionPlan.SUBSCRIPTION]: {
      id: SubscriptionPlan.SUBSCRIPTION,
      name: subscriptionProduct.name,
      description: subscriptionProduct.description,

      features: [
        "app.story.pricing.plans.STARTER.features.messages",
        "app.story.pricing.plans.STARTER.features.models",
        "app.story.pricing.plans.STARTER.features.folders",
        "app.story.pricing.plans.STARTER.features.personas",
      ],
      priceByCountry: {
        DE: {
          monthly: subscriptionDef.priceByCountry.DE,
          annual: Math.round(subscriptionDef.priceByCountry.DE * 0.9 * 100) / 100, // 10% discount for annual
          currency: subscriptionDef.currency,
        },
        PL: {
          currency: subscriptionDef.currency,
          monthly: subscriptionDef.priceByCountry.PL,
          annual: Math.round(subscriptionDef.priceByCountry.PL * 0.9 * 100) / 100, // 10% discount for annual
        },
        GLOBAL: {
          currency: subscriptionDef.currency,
          monthly: subscriptionDef.priceByCountry.GLOBAL,
          annual: Math.round(subscriptionDef.priceByCountry.GLOBAL * 0.9 * 100) / 100, // 10% discount for annual
        },
      },
      pricing: "app.story.pricing.plans.STARTER.price",
      cta: "app.story.pricing.plans.STARTER.cta",
      highlighted: false,
      icon: <StarterIcon />,
    },
  };
}

/**
 * Get pricing plans for a specific locale
 */
export function getPricingPlans(locale: CountryLanguage): Record<SubscriptionPlanValue, PricingPlan> {
  return buildPricingPlans(locale);
}

/**
 * Get plan details by plan ID for a locale
 */
export function getPlanDetails(planId: SubscriptionPlanValue, locale: CountryLanguage): PricingPlan {
  return getPricingPlans(locale)[planId];
}

/**
 * Get all pricing plans as an array for a locale
 */
export function getPricingPlansArray(locale: CountryLanguage): PricingPlan[] {
  return Object.values(getPricingPlans(locale));
}

export interface PricingPlan {
  id: (typeof SubscriptionPlan)[keyof typeof SubscriptionPlan];
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
  icon: JSX.Element;
  badge?: TranslationKey;
}

/**
 * Interface for pricing comparison table features
 */
export interface PricingFeature {
  name: TranslationKey;
  [SubscriptionPlan.SUBSCRIPTION]: boolean;
}

/**
 * Special feature type for features with text values instead of boolean
 */
export interface PricingTextFeature {
  name: TranslationKey;
  type: "text";
  [SubscriptionPlan.SUBSCRIPTION]: TranslationKey;
}

/**
 * Combined type for all pricing comparison features
 */
export type PricingComparisonFeature = PricingFeature | PricingTextFeature;

/**
 * Data for the pricing comparison table
 */
// TODO: Define proper comparison features for AI chat app
export const pricingComparisonFeatures: PricingComparisonFeature[] = [];
