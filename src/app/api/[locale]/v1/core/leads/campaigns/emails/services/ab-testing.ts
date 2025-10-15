/**
 * A/B Testing Service
 * Handles journey assignment and performance tracking for email campaigns
 */

import {
  createErrorResponse,
  type ErrorResponseType,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import { Countries } from "@/i18n/core/config";

import { EmailJourneyVariant } from "../../../enum";
import type { ABTestConfig } from "../types";

/**
 * A/B Test Constants
 */
const AB_TEST_CONSTANTS = {
  PERSONAS: {
    SARAH: {
      name: "Sarah",
      title: "Social Media Strategist",
      avatar: "S",
      personality: "warm and consultative",
    },
    MARCUS: {
      name: "Marcus",
      title: "Growth Analytics Manager",
      avatar: "M",
      personality: "data-driven and results-oriented",
    },
    ALEX: {
      name: "Alex",
      title: "Business Development Director",
      avatar: "A",
      personality: "direct and action-focused",
    },
  },
} as const;

/**
 * Journey Variant Metadata
 */
const JOURNEY_VARIANT_METADATA = {
  [EmailJourneyVariant.PERSONAL_APPROACH]: {
    name: "Personal & Human Touch",
    description:
      "Emphasizes personal connection, human expertise, and relationship building",
    color: "#10B981", // Emerald
    icon: "👥",
    characteristics: [
      "Personal storytelling",
      "Human connection",
      "Relationship building",
      "Trust and credibility",
      "Consultative approach",
    ] as const,
  },
  [EmailJourneyVariant.RESULTS_FOCUSED]: {
    name: "Results & Social Proof",
    description: "Focuses on metrics, case studies, and proven results",
    color: "#3B82F6", // Blue
    icon: "📊",
    characteristics: [
      "Data-driven messaging",
      "Case studies",
      "ROI focus",
      "Performance metrics",
      "Social proof",
    ] as const,
  },
  [EmailJourneyVariant.PERSONAL_RESULTS]: {
    name: "Personal Approach & Results Focused",
    description: "Combines personal touch with results-driven messaging",
    color: "#8B5CF6", // Purple
    icon: "🎯",
    characteristics: [
      "Personal relationship building",
      "Data-driven results",
      "Case studies",
      "Authentic communication",
      "Results-focused CTAs",
    ] as const,
  },
} as const;

/**
 * Default A/B Test Configuration
 * Equal distribution across all variants with precise weights
 */
const DEFAULT_AB_TEST_CONFIG: ABTestConfig = {
  name: "Email Journey A/B Test",
  description: "Testing three different email journey approaches",
  isActive: true,
  startDate: new Date("2024-01-01"),
  variants: {
    // [EmailJourneyVariant.PERSONAL_APPROACH]: {
    //   weight: 33.33,
    //   description: "Personal touch with relationship building",
    // },
    [EmailJourneyVariant.RESULTS_FOCUSED]: {
      weight: 50,
      description: "Data-driven with case studies and metrics",
    },
    [EmailJourneyVariant.PERSONAL_RESULTS]: {
      weight: 50,
      description: "Personal approach with results-driven messaging",
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
      return EmailJourneyVariant.PERSONAL_APPROACH; // Default fallback
    }

    // Check if lead meets target audience criteria
    if (!this.isTargetAudience(leadData)) {
      return EmailJourneyVariant.PERSONAL_APPROACH; // Default for non-target audience
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
    return EmailJourneyVariant.PERSONAL_APPROACH;
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
    if (targetAudience.countries && leadData.country) {
      if (!targetAudience.countries.includes(leadData.country)) {
        return false;
      }
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
export function validateABTestConfig(config: ABTestConfig): {
  isValid: boolean;
  errors: ErrorResponseType[];
} {
  const errors: ErrorResponseType[] = [];

  // Check if weights sum to approximately 100
  const totalWeight = Object.values(config.variants).reduce(
    (sum, variant) => sum + variant.weight,
    0,
  );

  if (Math.abs(totalWeight - 100) > 0.01) {
    errors.push(
      createErrorResponse(
        "app.api.errors.ab_test_total_weight_invalid",
        ErrorResponseTypes.VALIDATION_ERROR,
        { totalWeight },
      ),
    );
  }

  // Check if all variants have positive weights
  for (const [variant, variantConfig] of Object.entries(config.variants)) {
    if (variantConfig.weight <= 0) {
      errors.push(
        createErrorResponse(
          "app.api.errors.ab_test_variant_weight_invalid",
          ErrorResponseTypes.VALIDATION_ERROR,
          { variant, weight: variantConfig.weight },
        ),
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
      icon: string;
      characteristics: readonly string[];
    };
  }>;
  isValid: boolean;
} {
  const validation = validateABTestConfig(config);

  const variants = Object.entries(config.variants) as Array<
    [
      (typeof EmailJourneyVariant)[keyof typeof EmailJourneyVariant],
      { weight: number; description: string },
    ]
  >;

  return {
    enabled: config.isActive,
    totalVariants: Object.keys(config.variants).length,
    variants: variants.map(([key, variant]) => ({
      id: key,
      name: variant.description,
      weight: variant.weight,
      metadata: JOURNEY_VARIANT_METADATA[key],
    })),
    isValid: validation.isValid,
  };
}

/**
 * Export constants and metadata for external use
 */
export { AB_TEST_CONSTANTS, DEFAULT_AB_TEST_CONFIG, JOURNEY_VARIANT_METADATA };
