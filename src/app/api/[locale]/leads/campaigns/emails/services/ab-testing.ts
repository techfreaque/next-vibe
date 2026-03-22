/**
 * A/B Testing Service
 * Handles journey assignment and performance tracking for email campaigns
 */

import {
  type ErrorResponseType,
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { IconKey } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import type { CountryLanguage } from "@/i18n/core/config";
import { Countries } from "@/i18n/core/config";

import { EmailJourneyVariant } from "../../../enum";
import {
  type JourneysTranslationKey,
  scopedTranslation as journeysScopedTranslation,
} from "../journeys/i18n";
import type { ABTestConfig } from "../types";
import { scopedTranslation } from "./i18n";

/**
 * Journey Variant Static Metadata (non-translatable parts)
 */
const JOURNEY_VARIANT_METADATA: Partial<
  Record<
    (typeof EmailJourneyVariant)[keyof typeof EmailJourneyVariant],
    {
      color: string;
      icon: IconKey;
      characteristicKeys: readonly JourneysTranslationKey[];
    }
  >
> = {
  [EmailJourneyVariant.UNCENSORED_CONVERT]: {
    color: "#F59E0B", // Amber
    icon: "zap",
    characteristicKeys: [
      "emailJourneys.components.journeyInfo.uncensoredConvert.characteristics.tone",
      "emailJourneys.components.journeyInfo.uncensoredConvert.characteristics.story",
      "emailJourneys.components.journeyInfo.uncensoredConvert.characteristics.transparency",
      "emailJourneys.components.journeyInfo.uncensoredConvert.characteristics.angle",
      "emailJourneys.components.journeyInfo.uncensoredConvert.characteristics.energy",
    ] as const,
  },
  [EmailJourneyVariant.SIDE_HUSTLE]: {
    color: "#10B981", // Emerald
    icon: "trending-up",
    characteristicKeys: [
      "emailJourneys.components.journeyInfo.sideHustle.characteristics.disclosure",
      "emailJourneys.components.journeyInfo.sideHustle.characteristics.updates",
      "emailJourneys.components.journeyInfo.sideHustle.characteristics.income",
      "emailJourneys.components.journeyInfo.sideHustle.characteristics.proof",
      "emailJourneys.components.journeyInfo.sideHustle.characteristics.energy",
    ] as const,
  },
  [EmailJourneyVariant.QUIET_RECOMMENDATION]: {
    color: "#6B7280", // Gray
    icon: "user",
    characteristicKeys: [
      "emailJourneys.components.journeyInfo.quietRecommendation.characteristics.signal",
      "emailJourneys.components.journeyInfo.quietRecommendation.characteristics.specifics",
      "emailJourneys.components.journeyInfo.quietRecommendation.characteristics.testing",
      "emailJourneys.components.journeyInfo.quietRecommendation.characteristics.comparison",
      "emailJourneys.components.journeyInfo.quietRecommendation.characteristics.affiliate",
    ] as const,
  },
};

/**
 * Default A/B Test Configuration
 * Equal distribution across all variants with precise weights
 */
const DEFAULT_AB_TEST_CONFIG: ABTestConfig = {
  name: "Email Journey A/B Test",
  description: "Testing three unbottled.ai affiliate email journey approaches",
  isActive: true,
  startDate: new Date("2024-01-01"),
  variants: {
    [EmailJourneyVariant.UNCENSORED_CONVERT]: {
      weight: 34,
      description:
        "Enthusiast who discovered unbottled.ai and shares it with affiliate link",
    },
    [EmailJourneyVariant.SIDE_HUSTLE]: {
      weight: 33,
      description: "Transparent affiliate marketer with real weekly use cases",
    },
    [EmailJourneyVariant.QUIET_RECOMMENDATION]: {
      weight: 33,
      description:
        "Low-key professional recommendation after 3 weeks of testing",
    },
  },
  targetAudience: {
    countries: Object.values(Countries),
  },
};

/**
 * A/B Testing Service Class
 */
export class ABTestingService {
  private config: ABTestConfig;

  constructor(config: ABTestConfig = DEFAULT_AB_TEST_CONFIG) {
    this.config = config;
  }

  /**
   * Assign a journey variant to a lead based on A/B test configuration
   * Uses deterministic assignment based on lead ID for consistency
   */
  assignJourneyVariant(
    leadId: string,
    logger: EndpointLogger,
    leadData?: {
      country?: string;
      source?: string;
    },
  ): (typeof EmailJourneyVariant)[keyof typeof EmailJourneyVariant] {
    // Check if A/B test is active
    if (!this.config.isActive) {
      return EmailJourneyVariant.UNCENSORED_CONVERT; // Default fallback
    }

    // Check if lead meets target audience criteria
    if (!this.isTargetAudience(leadData)) {
      return EmailJourneyVariant.UNCENSORED_CONVERT; // Default for non-target audience
    }

    // Use lead ID to create deterministic assignment with higher precision
    const hash = this.hashString(leadId);
    const percentage = (hash % 10000) / 100; // 0-99.99 for better precision

    // Calculate cumulative weights
    let cumulativeWeight = 0;
    const variants = Object.entries(this.config.variants) as Array<
      [
        (typeof EmailJourneyVariant)[keyof typeof EmailJourneyVariant],
        { weight: number; description: string },
      ]
    >;

    for (const [variant, variantConfig] of variants) {
      cumulativeWeight += variantConfig.weight;
      if (percentage < cumulativeWeight) {
        logger.info("ab.test.assignment.success", {
          leadId,
          variant,
          percentage,
          cumulativeWeight,
          hash,
        });
        return variant;
      }
    }

    // Fallback (should not reach here with proper weights)
    logger.warn("ab.test.assignment.fallback", {
      leadId,
      percentage,
      totalWeight: cumulativeWeight,
      variants: Object.keys(this.config.variants),
    });
    return EmailJourneyVariant.UNCENSORED_CONVERT;
  }

  /**
   * Check if lead meets target audience criteria
   */
  private isTargetAudience(leadData?: {
    country?: string;
    source?: string;
  }): boolean {
    if (!leadData || !this.config.targetAudience) {
      return true; // Include all if no criteria specified
    }

    const { targetAudience } = this.config;

    // Check country criteria
    if (
      targetAudience.countries &&
      leadData.country &&
      !targetAudience.countries.includes(leadData.country)
    ) {
      return false;
    }
    return true;
  }

  /**
   * Simple hash function for deterministic assignment
   */
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }
}

/**
 * Default A/B Testing Service Instance
 */
export const abTestingService = new ABTestingService();

/**
 * Standalone utility functions for A/B testing
 * These can be used without instantiating the service class
 */

/**
 * Validate A/B Test Configuration (standalone function)
 */
export function validateABTestConfig(
  config: ABTestConfig,
  locale: CountryLanguage,
): {
  isValid: boolean;
  errors: ErrorResponseType[];
} {
  const errors: ErrorResponseType[] = [];
  const t = scopedTranslation.scopedT(locale).t;

  // Check if weights sum to approximately 100
  const totalWeight = Object.values(config.variants).reduce(
    (sum, variant) => sum + variant.weight,
    0,
  );

  if (Math.abs(totalWeight - 100) > 0.01) {
    errors.push(
      fail({
        message: t("abTesting.invalidWeights"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
        messageParams: { totalWeight },
      }),
    );
  }

  // Check if all variants have positive weights
  for (const [variant, variantConfig] of Object.entries(config.variants)) {
    if (!variantConfig) {
      continue;
    }
    if (variantConfig.weight <= 0) {
      errors.push(
        fail({
          message: t("abTesting.negativeWeight"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
          messageParams: { variant, weight: variantConfig.weight },
        }),
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Get A/B Test Summary (standalone function)
 */
export function getABTestSummary(
  config: ABTestConfig = DEFAULT_AB_TEST_CONFIG,
  locale: CountryLanguage,
): {
  enabled: boolean;
  totalVariants: number;
  variants: Array<{
    id: string;
    name: string;
    weight: number;
    metadata: {
      name: string;
      description: string;
      color: string;
      icon: IconKey;
      characteristics: readonly string[];
    };
  }>;
  isValid: boolean;
} {
  const jt = journeysScopedTranslation.scopedT(locale).t;
  const validation = validateABTestConfig(config, locale);

  const variants = Object.entries(config.variants) as Array<
    [
      (typeof EmailJourneyVariant)[keyof typeof EmailJourneyVariant],
      { weight: number; description: string },
    ]
  >;

  return {
    enabled: config.isActive,
    totalVariants: Object.keys(config.variants).length,
    variants: variants.map(([key, variant]) => {
      const staticMeta = JOURNEY_VARIANT_METADATA[key];

      let name: string;
      let description: string;
      if (key === EmailJourneyVariant.UNCENSORED_CONVERT) {
        name = jt(
          "emailJourneys.components.journeyInfo.uncensoredConvert.name",
        );
        description = jt(
          "emailJourneys.components.journeyInfo.uncensoredConvert.longDescription",
        );
      } else if (key === EmailJourneyVariant.SIDE_HUSTLE) {
        name = jt("emailJourneys.components.journeyInfo.sideHustle.name");
        description = jt(
          "emailJourneys.components.journeyInfo.sideHustle.longDescription",
        );
      } else if (key === EmailJourneyVariant.QUIET_RECOMMENDATION) {
        name = jt(
          "emailJourneys.components.journeyInfo.quietRecommendation.name",
        );
        description = jt(
          "emailJourneys.components.journeyInfo.quietRecommendation.longDescription",
        );
      } else {
        name = variant.description;
        description = variant.description;
      }

      const characteristics = staticMeta
        ? staticMeta.characteristicKeys.map((k) => jt(k))
        : [];

      return {
        id: key,
        name: variant.description,
        weight: variant.weight,
        metadata: {
          name,
          description,
          color: staticMeta?.color ?? "#6B7280",
          icon: staticMeta?.icon ?? "user",
          characteristics,
        },
      };
    }),
    isValid: validation.isValid,
  };
}
