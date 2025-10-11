/**
 * Competitors Enums with Translation Options
 * Enum definitions for competitor analysis data with automatic translation option generation
 */

import { createEnumOptions } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/enum-helpers";

/**
 * Competitor types
 */
export const {
  enum: CompetitorType,
  options: CompetitorTypeOptions,
  Value: CompetitorTypeValue,
} = createEnumOptions({
  DIRECT:
    "app.api.v1.core.businessData.competitors.enums.competitorType.direct",
  INDIRECT:
    "app.api.v1.core.businessData.competitors.enums.competitorType.indirect",
  SUBSTITUTE:
    "app.api.v1.core.businessData.competitors.enums.competitorType.substitute",
  POTENTIAL:
    "app.api.v1.core.businessData.competitors.enums.competitorType.potential",
});

/**
 * Market position categories
 */
export const {
  enum: MarketPosition,
  options: MarketPositionOptions,
  Value: MarketPositionValue,
} = createEnumOptions({
  LEADER:
    "app.api.v1.core.businessData.competitors.enums.marketPosition.leader",
  CHALLENGER:
    "app.api.v1.core.businessData.competitors.enums.marketPosition.challenger",
  FOLLOWER:
    "app.api.v1.core.businessData.competitors.enums.marketPosition.follower",
  NICHE: "app.api.v1.core.businessData.competitors.enums.marketPosition.niche",
  DISRUPTOR:
    "app.api.v1.core.businessData.competitors.enums.marketPosition.disruptor",
});

/**
 * Competitive advantage types
 */
export const {
  enum: CompetitiveAdvantage,
  options: CompetitiveAdvantageOptions,
  Value: CompetitiveAdvantageValue,
} = createEnumOptions({
  PRICE:
    "app.api.v1.core.businessData.competitors.enums.competitiveAdvantage.price",
  QUALITY:
    "app.api.v1.core.businessData.competitors.enums.competitiveAdvantage.quality",
  SERVICE:
    "app.api.v1.core.businessData.competitors.enums.competitiveAdvantage.service",
  INNOVATION:
    "app.api.v1.core.businessData.competitors.enums.competitiveAdvantage.innovation",
  BRAND:
    "app.api.v1.core.businessData.competitors.enums.competitiveAdvantage.brand",
  DISTRIBUTION:
    "app.api.v1.core.businessData.competitors.enums.competitiveAdvantage.distribution",
  TECHNOLOGY:
    "app.api.v1.core.businessData.competitors.enums.competitiveAdvantage.technology",
  EXPERTISE:
    "app.api.v1.core.businessData.competitors.enums.competitiveAdvantage.expertise",
  SPEED:
    "app.api.v1.core.businessData.competitors.enums.competitiveAdvantage.speed",
  CUSTOMIZATION:
    "app.api.v1.core.businessData.competitors.enums.competitiveAdvantage.customization",
});

/**
 * Analysis areas
 */
export const {
  enum: AnalysisArea,
  options: AnalysisAreaOptions,
  Value: AnalysisAreaValue,
} = createEnumOptions({
  PRICING:
    "app.api.v1.core.businessData.competitors.enums.analysisArea.pricing",
  PRODUCT_FEATURES:
    "app.api.v1.core.businessData.competitors.enums.analysisArea.productFeatures",
  MARKETING:
    "app.api.v1.core.businessData.competitors.enums.analysisArea.marketing",
  CUSTOMER_SERVICE:
    "app.api.v1.core.businessData.competitors.enums.analysisArea.customerService",
  DISTRIBUTION:
    "app.api.v1.core.businessData.competitors.enums.analysisArea.distribution",
  TECHNOLOGY:
    "app.api.v1.core.businessData.competitors.enums.analysisArea.technology",
  BRAND_POSITIONING:
    "app.api.v1.core.businessData.competitors.enums.analysisArea.brandPositioning",
  TARGET_AUDIENCE:
    "app.api.v1.core.businessData.competitors.enums.analysisArea.targetAudience",
  STRENGTHS:
    "app.api.v1.core.businessData.competitors.enums.analysisArea.strengths",
  WEAKNESSES:
    "app.api.v1.core.businessData.competitors.enums.analysisArea.weaknesses",
});

// Create DB arrays for database schema
export const CompetitorTypeDB = [
  CompetitorType.DIRECT,
  CompetitorType.INDIRECT,
  CompetitorType.SUBSTITUTE,
  CompetitorType.POTENTIAL,
] as const;

export const MarketPositionDB = [
  MarketPosition.LEADER,
  MarketPosition.CHALLENGER,
  MarketPosition.FOLLOWER,
  MarketPosition.NICHE,
  MarketPosition.DISRUPTOR,
] as const;

export const CompetitiveAdvantageDB = [
  CompetitiveAdvantage.PRICE,
  CompetitiveAdvantage.QUALITY,
  CompetitiveAdvantage.SERVICE,
  CompetitiveAdvantage.INNOVATION,
  CompetitiveAdvantage.BRAND,
  CompetitiveAdvantage.DISTRIBUTION,
  CompetitiveAdvantage.TECHNOLOGY,
  CompetitiveAdvantage.EXPERTISE,
  CompetitiveAdvantage.SPEED,
  CompetitiveAdvantage.CUSTOMIZATION,
] as const;

export const AnalysisAreaDB = [
  AnalysisArea.PRICING,
  AnalysisArea.PRODUCT_FEATURES,
  AnalysisArea.MARKETING,
  AnalysisArea.CUSTOMER_SERVICE,
  AnalysisArea.DISTRIBUTION,
  AnalysisArea.TECHNOLOGY,
  AnalysisArea.BRAND_POSITIONING,
  AnalysisArea.TARGET_AUDIENCE,
  AnalysisArea.STRENGTHS,
  AnalysisArea.WEAKNESSES,
] as const;
