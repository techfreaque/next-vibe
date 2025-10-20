import {
  Building2,
  Crown,
  Rocket,
  Star,
  Users,
  Video,
  Zap,
} from "lucide-react";
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

const ProfessionalIcon = (): JSX.Element => (
  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-cyan-500 bg-gradient-to-br from-cyan-400 to-cyan-600 text-white shadow-md shadow-cyan-200 dark:shadow-cyan-900/30">
    <Zap className="h-6 w-6" />
  </div>
);

const PremiumIcon = (): JSX.Element => (
  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-500 bg-gradient-to-br from-purple-400 to-purple-600 text-white shadow-md shadow-purple-200 dark:shadow-purple-900/30">
    <Crown className="h-6 w-6" />
  </div>
);

const EnterpriseIcon = (): JSX.Element => (
  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-700 bg-gradient-to-br from-gray-600 to-gray-800 text-white shadow-md shadow-gray-200 dark:shadow-gray-900/30">
    <Building2 className="h-6 w-6" />
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
    if (plan.isEnterprise) {
      continue; // Skip enterprise plans as they have custom pricing
    }

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
  [SubscriptionPlan.STARTER]: {
    id: SubscriptionPlan.STARTER,
    name: "app.site.pricing.plans.STARTER.name",
    description: "app.site.pricing.plans.STARTER.description",

    premiumFeatures: [
      {
        feature: "app.site.pricing.plans.STARTER.features.posts",
        className: "bg-purple-100 dark:bg-purple-900/30",
        icon: <Star className="h-5 w-5 text-purple-600 dark:text-purple-400" />,
      },
    ],
    features: [
      "app.site.pricing.plans.STARTER.features.freeSocialSetup",
      "app.site.pricing.plans.STARTER.features.contentStrategy",
      "app.site.pricing.plans.STARTER.features.strategyCall",
      "app.site.pricing.plans.STARTER.features.analytics",
      "app.site.pricing.plans.STARTER.features.support",
      "app.site.pricing.plans.STARTER.features.calendar",
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
    pricing: "app.site.pricing.plans.STARTER.price",
    cta: "app.site.pricing.plans.STARTER.cta",
    highlighted: false,
    icon: <StarterIcon />,
  },
  [SubscriptionPlan.PROFESSIONAL]: {
    id: SubscriptionPlan.PROFESSIONAL,
    name: "app.site.pricing.plans.PROFESSIONAL.name",
    description: "app.site.pricing.plans.PROFESSIONAL.description",
    premiumFeatures: [
      {
        feature: "app.site.pricing.plans.PROFESSIONAL.features.posts",
        className: "bg-purple-100 dark:bg-purple-900/30",
        icon: <Star className="h-5 w-5 text-purple-600 dark:text-purple-400" />,
      },
      {
        feature: "app.site.pricing.plans.PROFESSIONAL.features.reels",
        className: "bg-pink-100 dark:bg-pink-900/30",
        icon: <Video className="h-5 w-5 text-pink-600 dark:text-pink-400" />,
      },
    ],
    features: [
      "app.site.pricing.plans.PROFESSIONAL.features.freeSocialSetup",
      "app.site.pricing.plans.PROFESSIONAL.features.contentStrategy",
      "app.site.pricing.plans.PROFESSIONAL.features.strategyCall",
      "app.site.pricing.plans.PROFESSIONAL.features.analytics",
      "app.site.pricing.plans.PROFESSIONAL.features.support",
      "app.site.pricing.plans.PROFESSIONAL.features.calendar",
    ],
    priceByCountry: {
      DE: {
        monthly: 149,
        annual: 119,
        currency: "EUR",
      },
      PL: {
        currency: "PLN",
        monthly: 419,
        annual: 349,
      },
      GLOBAL: {
        currency: "USD",
        monthly: 159,
        annual: 129,
      },
    },
    pricing: "app.site.pricing.plans.PROFESSIONAL.price",
    cta: "app.site.pricing.plans.PROFESSIONAL.cta",
    highlighted: true,
    badge: "app.site.pricing.plans.PROFESSIONAL.badge",
    icon: <ProfessionalIcon />,
  },
  [SubscriptionPlan.PREMIUM]: {
    id: SubscriptionPlan.PREMIUM,
    name: "app.site.pricing.plans.PREMIUM.name",
    description: "app.site.pricing.plans.PREMIUM.description",
    premiumFeatures: [
      {
        feature: "app.site.pricing.plans.PREMIUM.premiumFeatures.premiumPosts",
        className: "bg-purple-100 dark:bg-purple-900/30",
        icon: <Star className="h-5 w-5 text-purple-600 dark:text-purple-400" />,
      },
      {
        feature: "app.site.pricing.plans.PREMIUM.premiumFeatures.premiumReels",
        className: "bg-pink-100 dark:bg-pink-900/30",
        icon: <Video className="h-5 w-5 text-pink-600 dark:text-pink-400" />,
      },
    ],
    features: [
      "app.site.pricing.plans.PREMIUM.features.freeSocialSetup",
      "app.site.pricing.plans.PREMIUM.features.contentStrategy",
      "app.site.pricing.plans.PREMIUM.features.strategyCalls",
      "app.site.pricing.plans.PREMIUM.features.analytics",
      "app.site.pricing.plans.PREMIUM.features.accountManager",
      "app.site.pricing.plans.PREMIUM.features.support",
    ],
    priceByCountry: {
      DE: {
        currency: "EUR",
        monthly: 279,
        annual: 239,
      },
      PL: {
        currency: "PLN",
        monthly: 759,
        annual: 699,
      },
      GLOBAL: {
        currency: "USD",
        monthly: 289,
        annual: 249,
      },
    },
    pricing: "app.site.pricing.plans.PREMIUM.price",
    cta: "app.site.pricing.plans.PREMIUM.cta",
    highlighted: false,
    icon: <PremiumIcon />,
  },
  [SubscriptionPlan.ENTERPRISE]: {
    id: SubscriptionPlan.ENTERPRISE,
    name: "app.site.pricing.plans.ENTERPRISE.name",
    priceByCountry: {
      DE: {
        monthly: 0,
        annual: 0,
        currency: "EUR",
      },
      PL: {
        monthly: 0,
        annual: 0,
        currency: "PLN",
      },
      GLOBAL: {
        currency: "USD",
        monthly: 0,
        annual: 0,
      },
    },
    pricing: "app.site.pricing.plans.ENTERPRISE.price",
    description: "app.site.pricing.plans.ENTERPRISE.description",
    premiumFeatures: [
      {
        feature: "app.site.pricing.plans.ENTERPRISE.features.posts",
        className: "bg-indigo-100 dark:bg-indigo-900/30",
        icon: (
          <Rocket className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
        ),
      },
      {
        feature: "app.site.pricing.plans.ENTERPRISE.features.onSiteProduction",
        className: "bg-purple-100 dark:bg-purple-900/30",
        icon: (
          <Building2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        ),
      },
      {
        feature: "app.site.pricing.plans.ENTERPRISE.features.creativeTeam",
        className: "bg-pink-100 dark:bg-pink-900/30",
        icon: <Users className="h-5 w-5 text-pink-600 dark:text-pink-400" />,
      },
    ],
    features: [
      "app.site.pricing.plans.ENTERPRISE.features.freeSocialSetup",
      "app.site.pricing.plans.ENTERPRISE.features.bottomNote",
      // "app.site.pricing.plans.ENTERPRISE.features.platforms",
      // "app.site.pricing.plans.ENTERPRISE.features.contentStrategy",
      // "app.site.pricing.plans.ENTERPRISE.features.creativeTeam",
      // "app.site.pricing.plans.ENTERPRISE.features.onSiteProduction",
      // "app.site.pricing.plans.ENTERPRISE.features.brandStrategy",
      // "app.site.pricing.plans.ENTERPRISE.features.crisisManagement",
      // "app.site.pricing.plans.ENTERPRISE.features.meetings",
      // "app.site.pricing.plans.ENTERPRISE.features.reporting",
      // "app.site.pricing.plans.ENTERPRISE.features.adManagement",
    ],
    cta: "app.site.pricing.plans.ENTERPRISE.cta",
    highlighted: false,
    icon: <EnterpriseIcon />,
    isEnterprise: true,
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
  isEnterprise?: boolean;
}

/**
 * Interface for pricing comparison table features
 */
export interface PricingFeature {
  name: TranslationKey;
  [SubscriptionPlan.STARTER]: boolean;
  [SubscriptionPlan.PROFESSIONAL]: boolean;
  [SubscriptionPlan.PREMIUM]: boolean;
  [SubscriptionPlan.ENTERPRISE]: boolean;
}

/**
 * Special feature type for features with text values instead of boolean
 */
export interface PricingTextFeature {
  name: TranslationKey;
  type: "text";
  [SubscriptionPlan.STARTER]: TranslationKey;
  [SubscriptionPlan.PROFESSIONAL]: TranslationKey;
  [SubscriptionPlan.PREMIUM]: TranslationKey;
  [SubscriptionPlan.ENTERPRISE]: TranslationKey;
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
    [SubscriptionPlan.STARTER]: "app.site.pricing.plans.monthlyPosts.starter",
    [SubscriptionPlan.PROFESSIONAL]: "app.site.pricing.plans.monthlyPosts.professional",
    [SubscriptionPlan.PREMIUM]: "app.site.pricing.plans.monthlyPosts.premium",
    [SubscriptionPlan.ENTERPRISE]: "app.site.pricing.plans.monthlyPosts.enterprise",
  },
  {
    name: "pricing.comparison.features.reelsVideos",
    [SubscriptionPlan.STARTER]: false,
    [SubscriptionPlan.PROFESSIONAL]: true,
    [SubscriptionPlan.PREMIUM]: true,
    [SubscriptionPlan.ENTERPRISE]: true,
  },
  {
    name: "pricing.comparison.features.strategyCalls",
    type: "text",
    [SubscriptionPlan.STARTER]: "app.site.pricing.plans.strategyCalls.starter",
    [SubscriptionPlan.PROFESSIONAL]: "app.site.pricing.plans.strategyCalls.professional",
    [SubscriptionPlan.PREMIUM]: "app.site.pricing.plans.strategyCalls.premium",
    [SubscriptionPlan.ENTERPRISE]: "app.site.pricing.plans.strategyCalls.enterprise",
  },
  // Boolean features - ordered by importance and availability
  {
    name: "pricing.comparison.features.freeSocialAccountSetup",
    [SubscriptionPlan.STARTER]: true,
    [SubscriptionPlan.PROFESSIONAL]: true,
    [SubscriptionPlan.PREMIUM]: true,
    [SubscriptionPlan.ENTERPRISE]: true,
  },
  {
    name: "pricing.comparison.features.multiPlatformStrategy",
    [SubscriptionPlan.STARTER]: true,
    [SubscriptionPlan.PROFESSIONAL]: true,
    [SubscriptionPlan.PREMIUM]: true,
    [SubscriptionPlan.ENTERPRISE]: true,
  },
  {
    name: "pricing.comparison.features.customContentStrategy",
    [SubscriptionPlan.STARTER]: false,
    [SubscriptionPlan.PROFESSIONAL]: false,
    [SubscriptionPlan.PREMIUM]: false,
    [SubscriptionPlan.ENTERPRISE]: true,
  },
  {
    name: "pricing.comparison.features.contentCalendar",
    [SubscriptionPlan.STARTER]: true,
    [SubscriptionPlan.PROFESSIONAL]: true,
    [SubscriptionPlan.PREMIUM]: true,
    [SubscriptionPlan.ENTERPRISE]: true,
  },
  {
    name: "pricing.comparison.features.basicAnalytics",
    [SubscriptionPlan.STARTER]: true,
    [SubscriptionPlan.PROFESSIONAL]: true,
    [SubscriptionPlan.PREMIUM]: true,
    [SubscriptionPlan.ENTERPRISE]: true,
  },
  {
    name: "pricing.comparison.features.emailSupport",
    [SubscriptionPlan.STARTER]: true,
    [SubscriptionPlan.PROFESSIONAL]: true,
    [SubscriptionPlan.PREMIUM]: true,
    [SubscriptionPlan.ENTERPRISE]: true,
  },
  {
    name: "pricing.comparison.features.advancedAnalytics",
    [SubscriptionPlan.STARTER]: false,
    [SubscriptionPlan.PROFESSIONAL]: true,
    [SubscriptionPlan.PREMIUM]: true,
    [SubscriptionPlan.ENTERPRISE]: true,
  },
  {
    name: "pricing.comparison.features.prioritySupport",
    [SubscriptionPlan.STARTER]: false,
    [SubscriptionPlan.PROFESSIONAL]: true,
    [SubscriptionPlan.PREMIUM]: true,
    [SubscriptionPlan.ENTERPRISE]: true,
  },
  {
    name: "pricing.comparison.features.dedicatedAccountManager",
    [SubscriptionPlan.STARTER]: false,
    [SubscriptionPlan.PROFESSIONAL]: false,
    [SubscriptionPlan.PREMIUM]: true,
    [SubscriptionPlan.ENTERPRISE]: true,
  },
  {
    name: "pricing.comparison.features.customReportingDashboard",
    [SubscriptionPlan.STARTER]: false,
    [SubscriptionPlan.PROFESSIONAL]: false,
    [SubscriptionPlan.PREMIUM]: true,
    [SubscriptionPlan.ENTERPRISE]: true,
  },
  {
    name: "pricing.comparison.features.dedicatedCreativeTeam",
    [SubscriptionPlan.STARTER]: false,
    [SubscriptionPlan.PROFESSIONAL]: false,
    [SubscriptionPlan.PREMIUM]: false,
    [SubscriptionPlan.ENTERPRISE]: true,
  },
  {
    name: "pricing.comparison.features.onSiteProduction",
    [SubscriptionPlan.STARTER]: false,
    [SubscriptionPlan.PROFESSIONAL]: false,
    [SubscriptionPlan.PREMIUM]: false,
    [SubscriptionPlan.ENTERPRISE]: true,
  },
];
