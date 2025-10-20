import { Star } from "lucide-react";
import type { JSX } from "react";

import type { SubscriptionPlanValue } from "@/app/api/[locale]/v1/core/subscription/enum";
import { SubscriptionPlan } from "@/app/api/[locale]/v1/core/subscription/enum";
import type { Countries, Currencies } from "@/i18n/core/config";
import type { TranslationKey } from "@/i18n/core/static-types";

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
export function calculateSavingsPercent(country: Countries): number {
  const plans = getPricingPlansArray();
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

export const pricingPlans: Record<SubscriptionPlanValue, PricingPlan> = {
  [SubscriptionPlan.SUBSCRIPTION]: {
    id: SubscriptionPlan.SUBSCRIPTION,
    name: "app.story.pricing.plans.STARTER.name",
    description: "app.story.pricing.plans.STARTER.description",

    premiumFeatures: [
      {
        feature: "app.story.pricing.plans.STARTER.features.posts",
        className: "bg-purple-100 dark:bg-purple-900/30",
        icon: <Star className="h-5 w-5 text-purple-600 dark:text-purple-400" />,
      },
    ],
    features: [
      "app.story.pricing.plans.STARTER.features.freeSocialSetup",
      "app.story.pricing.plans.STARTER.features.contentStrategy",
      "app.story.pricing.plans.STARTER.features.strategyCall",
      "app.story.pricing.plans.STARTER.features.analytics",
      "app.story.pricing.plans.STARTER.features.support",
      "app.story.pricing.plans.STARTER.features.calendar",
    ],
    priceByCountry: {
      DE: {
        monthly: 79,
        annual: 69,
        currency: "EUR",
      },
      PL: {
        currency: "PLN",
        monthly: 249,
        annual: 199,
      },
      GLOBAL: {
        currency: "USD",
        monthly: 89,
        annual: 79,
      },
    },
    pricing: "app.story.pricing.plans.STARTER.price",
    cta: "app.story.pricing.plans.STARTER.cta",
    highlighted: false,
    icon: <StarterIcon />,
  },
};

/**
 * Get plan details by plan ID
 */
export function getPlanDetails(planId: SubscriptionPlanValue): PricingPlan {
  return pricingPlans[planId];
}

/**
 * Get all pricing plans as an array
 */
export function getPricingPlansArray(): PricingPlan[] {
  return Object.values(pricingPlans);
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
export const pricingComparisonFeatures: PricingComparisonFeature[] = [
  // Special text features with translation keys for values - these should be first
  {
    name: "pricing.comparison.features.socialMediaPosts",
    type: "text",
    [SubscriptionPlan.SUBSCRIPTION]:
      "app.story.pricing.plans.monthlyPosts.starter",
  },
  {
    name: "pricing.comparison.features.reelsVideos",
    [SubscriptionPlan.SUBSCRIPTION]: false,
  },
  {
    name: "pricing.comparison.features.strategyCalls",
    type: "text",
    [SubscriptionPlan.SUBSCRIPTION]:
      "app.story.pricing.plans.strategyCalls.starter",
  },
  // Boolean features - ordered by importance and availability
  {
    name: "pricing.comparison.features.freeSocialAccountSetup",
    [SubscriptionPlan.SUBSCRIPTION]: true,
  },
  {
    name: "pricing.comparison.features.multiPlatformStrategy",
    [SubscriptionPlan.SUBSCRIPTION]: true,
  },
  {
    name: "pricing.comparison.features.customContentStrategy",
    [SubscriptionPlan.SUBSCRIPTION]: false,
  },
  {
    name: "pricing.comparison.features.contentCalendar",
    [SubscriptionPlan.SUBSCRIPTION]: true,
  },
  {
    name: "pricing.comparison.features.basicAnalytics",
    [SubscriptionPlan.SUBSCRIPTION]: true,
  },
  {
    name: "pricing.comparison.features.emailSupport",
    [SubscriptionPlan.SUBSCRIPTION]: true,
  },
  {
    name: "pricing.comparison.features.advancedAnalytics",
    [SubscriptionPlan.SUBSCRIPTION]: false,
  },
  {
    name: "pricing.comparison.features.prioritySupport",
    [SubscriptionPlan.SUBSCRIPTION]: false,
  },
  {
    name: "pricing.comparison.features.dedicatedAccountManager",
    [SubscriptionPlan.SUBSCRIPTION]: false,
  },
  {
    name: "pricing.comparison.features.customReportingDashboard",
    [SubscriptionPlan.SUBSCRIPTION]: false,
  },
  {
    name: "pricing.comparison.features.dedicatedCreativeTeam",
    [SubscriptionPlan.SUBSCRIPTION]: false,
  },
  {
    name: "pricing.comparison.features.onSiteProduction",
    [SubscriptionPlan.SUBSCRIPTION]: false,
  },
];
