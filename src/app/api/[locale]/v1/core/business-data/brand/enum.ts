/**
 * Brand Enums with Translation Options
 * Enum definitions for brand data using proper translation patterns
 */

import { createEnumOptions } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/enum-helpers";

/**
 * Brand personality traits
 */
export const {
  enum: BrandPersonality,
  options: BrandPersonalityOptions,
  Value: BrandPersonalityValue,
} = createEnumOptions({
  PROFESSIONAL:
    "app.api.v1.core.businessData.brand.enums.personality.professional",
  FRIENDLY: "app.api.v1.core.businessData.brand.enums.personality.friendly",
  INNOVATIVE: "app.api.v1.core.businessData.brand.enums.personality.innovative",
  TRUSTWORTHY:
    "app.api.v1.core.businessData.brand.enums.personality.trustworthy",
  CREATIVE: "app.api.v1.core.businessData.brand.enums.personality.creative",
  AUTHORITATIVE:
    "app.api.v1.core.businessData.brand.enums.personality.authoritative",
  PLAYFUL: "app.api.v1.core.businessData.brand.enums.personality.playful",
  SOPHISTICATED:
    "app.api.v1.core.businessData.brand.enums.personality.sophisticated",
  APPROACHABLE:
    "app.api.v1.core.businessData.brand.enums.personality.approachable",
  BOLD: "app.api.v1.core.businessData.brand.enums.personality.bold",
  CARING: "app.api.v1.core.businessData.brand.enums.personality.caring",
  RELIABLE: "app.api.v1.core.businessData.brand.enums.personality.reliable",
});

/**
 * Brand voice tones
 */
export const {
  enum: BrandVoice,
  options: BrandVoiceOptions,
  Value: BrandVoiceValue,
} = createEnumOptions({
  FORMAL: "app.api.v1.core.businessData.brand.enums.voice.formal",
  CASUAL: "app.api.v1.core.businessData.brand.enums.voice.casual",
  CONVERSATIONAL:
    "app.api.v1.core.businessData.brand.enums.voice.conversational",
  AUTHORITATIVE: "app.api.v1.core.businessData.brand.enums.voice.authoritative",
  FRIENDLY: "app.api.v1.core.businessData.brand.enums.voice.friendly",
  PROFESSIONAL: "app.api.v1.core.businessData.brand.enums.voice.professional",
  HUMOROUS: "app.api.v1.core.businessData.brand.enums.voice.humorous",
  INSPIRING: "app.api.v1.core.businessData.brand.enums.voice.inspiring",
  EDUCATIONAL: "app.api.v1.core.businessData.brand.enums.voice.educational",
  EMPATHETIC: "app.api.v1.core.businessData.brand.enums.voice.empathetic",
});

/**
 * Visual style categories
 */
export const {
  enum: VisualStyle,
  options: VisualStyleOptions,
  Value: VisualStyleValue,
} = createEnumOptions({
  MODERN: "app.api.v1.core.businessData.brand.enums.visualStyle.modern",
  CLASSIC: "app.api.v1.core.businessData.brand.enums.visualStyle.classic",
  MINIMALIST: "app.api.v1.core.businessData.brand.enums.visualStyle.minimalist",
  BOLD: "app.api.v1.core.businessData.brand.enums.visualStyle.bold",
  ELEGANT: "app.api.v1.core.businessData.brand.enums.visualStyle.elegant",
  PLAYFUL: "app.api.v1.core.businessData.brand.enums.visualStyle.playful",
  CORPORATE: "app.api.v1.core.businessData.brand.enums.visualStyle.corporate",
  CREATIVE: "app.api.v1.core.businessData.brand.enums.visualStyle.creative",
  LUXURY: "app.api.v1.core.businessData.brand.enums.visualStyle.luxury",
  RUSTIC: "app.api.v1.core.businessData.brand.enums.visualStyle.rustic",
  TECH: "app.api.v1.core.businessData.brand.enums.visualStyle.tech",
  ARTISTIC: "app.api.v1.core.businessData.brand.enums.visualStyle.artistic",
});

/**
 * Brand asset types
 */
export const {
  enum: BrandAssetType,
  options: BrandAssetTypeOptions,
  Value: BrandAssetTypeValue,
} = createEnumOptions({
  LOGO: "app.api.v1.core.businessData.brand.enums.assetType.logo",
  COLOR_PALETTE:
    "app.api.v1.core.businessData.brand.enums.assetType.colorPalette",
  TYPOGRAPHY: "app.api.v1.core.businessData.brand.enums.assetType.typography",
  IMAGERY: "app.api.v1.core.businessData.brand.enums.assetType.imagery",
  ICONS: "app.api.v1.core.businessData.brand.enums.assetType.icons",
  PATTERNS: "app.api.v1.core.businessData.brand.enums.assetType.patterns",
});

// Create DB arrays for database schema
export const BrandPersonalityDB = [
  BrandPersonality.PROFESSIONAL,
  BrandPersonality.FRIENDLY,
  BrandPersonality.INNOVATIVE,
  BrandPersonality.TRUSTWORTHY,
  BrandPersonality.CREATIVE,
  BrandPersonality.AUTHORITATIVE,
  BrandPersonality.PLAYFUL,
  BrandPersonality.SOPHISTICATED,
  BrandPersonality.APPROACHABLE,
  BrandPersonality.BOLD,
  BrandPersonality.CARING,
  BrandPersonality.RELIABLE,
] as const;

export const BrandVoiceDB = [
  BrandVoice.FORMAL,
  BrandVoice.CASUAL,
  BrandVoice.CONVERSATIONAL,
  BrandVoice.AUTHORITATIVE,
  BrandVoice.FRIENDLY,
  BrandVoice.PROFESSIONAL,
  BrandVoice.HUMOROUS,
  BrandVoice.INSPIRING,
  BrandVoice.EDUCATIONAL,
  BrandVoice.EMPATHETIC,
] as const;

export const VisualStyleDB = [
  VisualStyle.MODERN,
  VisualStyle.CLASSIC,
  VisualStyle.MINIMALIST,
  VisualStyle.BOLD,
  VisualStyle.ELEGANT,
  VisualStyle.PLAYFUL,
  VisualStyle.CORPORATE,
  VisualStyle.CREATIVE,
  VisualStyle.LUXURY,
  VisualStyle.RUSTIC,
  VisualStyle.TECH,
  VisualStyle.ARTISTIC,
] as const;

export const BrandAssetTypeDB = [
  BrandAssetType.LOGO,
  BrandAssetType.COLOR_PALETTE,
  BrandAssetType.TYPOGRAPHY,
  BrandAssetType.IMAGERY,
  BrandAssetType.ICONS,
  BrandAssetType.PATTERNS,
] as const;
