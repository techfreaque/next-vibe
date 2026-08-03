/**
 * A/B Testing Service
 * Handles journey assignment and performance tracking for email campaigns
 */

import { Countries } from "next-vibe/core/i18n/core/config";
import { EmailJourneyVariant } from "next-vibe/identity/lead/enum";
import type { EndpointLogger } from "next-vibe/logger/types";

import type { ABTestConfig } from "../types";

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
