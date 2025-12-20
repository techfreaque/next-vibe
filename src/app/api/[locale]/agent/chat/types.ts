/**
 * Shared types for the chat system
 * Contains tier levels, model utilities, persona categories, and related interfaces
 */

import type { TranslationKey } from "@/i18n/core/static-types";

import type { IconKey } from "./model-access/icons";

// ============================================
// TIER LEVELS
// ============================================

export type IntelligenceLevel = "quick" | "smart" | "brilliant";
export type SpeedLevel = "fast" | "balanced" | "thorough";
export type PriceLevel = "cheap" | "standard" | "premium";
export type ContentLevel = "mainstream" | "open" | "uncensored";


// ============================================
// MODEL UTILITY - What models are good at
// ============================================

export enum ModelUtility {
  // Core capabilities
  CHAT = "chat",
  CODING = "coding",
  CREATIVE = "creative",
  ANALYSIS = "analysis",
  REASONING = "reasoning",
  ROLEPLAY = "roleplay",

  // Performance traits
  FAST = "fast",
  SMART = "smart",
  VISION = "vision",
  IMAGE_GEN = "imageGen",

  // Content handling (what model CAN do)
  POLITICAL_LEFT = "politicalLeft",
  POLITICAL_RIGHT = "politicalRight",
  CONTROVERSIAL = "controversial",
  ADULT_IMPLIED = "adultImplied",
  ADULT_EXPLICIT = "adultExplicit",
  VIOLENCE = "violence",
  HARMFUL = "harmful",
  ILLEGAL_INFO = "illegalInfo",
  MEDICAL_ADVICE = "medicalAdvice",
  OFFENSIVE_LANGUAGE = "offensiveLanguage",
  ROLEPLAY_DARK = "roleplayDark",
  CONSPIRACY = "conspiracy",

  // Meta
  LEGACY = "legacy",
  UNCENSORED = "uncensored",
}

// ============================================
// PERSONA CATEGORY - User-facing task types
// ============================================
// NOTE: PersonaCategory enum is now defined in personas/enum.ts
// using the localized enum pattern with createEnumOptions()

// ============================================
// MODEL FEATURES - Binary capabilities
// ============================================

export interface ModelFeatures {
  imageInput: boolean;
  pdfInput: boolean;
  imageOutput: boolean;
  streaming: boolean;
  toolCalling: boolean;
}

// ============================================
// PERSONA REQUIREMENTS - Hard filters
// ============================================

export interface PersonaRequirements {
  minContent?: ContentLevel;
  maxContent?: ContentLevel;
  minIntelligence?: IntelligenceLevel;
  maxIntelligence?: IntelligenceLevel;
  minSpeed?: SpeedLevel;
  maxSpeed?: SpeedLevel;
  requiredFeatures?: (keyof ModelFeatures)[];
}

// ============================================
// PERSONA PREFERENCES - Soft scoring
// ============================================

export interface PersonaPreferences {
  preferredStrengths?: ModelUtility[];
  ignoredWeaknesses?: ModelUtility[];
}

// ============================================
// PERSONA OWNERSHIP
// ============================================

export interface PersonaOwnership {
  type: "system" | "user" | "public";
  userId?: string;
  isDefault?: boolean; // Show in onboarding
  isFeatured?: boolean; // Highlight in UI
}

// ============================================
// PERSONA DISPLAY INFO
// ============================================

export interface PersonaDisplay {
  shortDescription: TranslationKey;
  suggestedModels?: string[];
  tags?: TranslationKey[];
}


// ============================================
// TIER DISPLAY CONFIGS
// ============================================

  interface TierDisplayConfig<T extends string> {
  value: T;
  label: TranslationKey;
  icon: IconKey;
  description?: TranslationKey;
}

export const INTELLIGENCE_DISPLAY: TierDisplayConfig<
  IntelligenceLevel | "any"
>[] = [
  {
    value: "any",
    label: "app.chat.tiers.any",
    icon: "circle-dashed",
    description: "app.chat.tiers.anyDesc",
  },
  {
    value: "quick",
    label: "app.chat.tiers.intelligence.quick",
    icon: "zap",
    description: "app.chat.tiers.intelligence.quickDesc",
  },
  {
    value: "smart",
    label: "app.chat.tiers.intelligence.smart",
    icon: "lightbulb",
    description: "app.chat.tiers.intelligence.smartDesc",
  },
  {
    value: "brilliant",
    label: "app.chat.tiers.intelligence.brilliant",
    icon: "sparkles",
    description: "app.chat.tiers.intelligence.brilliantDesc",
  },
];


export const PRICE_DISPLAY: TierDisplayConfig<PriceLevel | "any">[] = [
  {
    value: "any",
    label: "app.chat.tiers.any",
    icon: "circle-dashed",
    description: "app.chat.tiers.anyDesc",
  },
  {
    value: "cheap",
    label: "app.chat.tiers.price.cheap",
    icon: "coins",
    description: "app.chat.tiers.price.cheapDesc",
  },
  {
    value: "standard",
    label: "app.chat.tiers.price.standard",
    icon: "coins",
    description: "app.chat.tiers.price.standardDesc",
  },
  {
    value: "premium",
    label: "app.chat.tiers.price.premium",
    icon: "crown",
    description: "app.chat.tiers.price.premiumDesc",
  },
];

export const CONTENT_DISPLAY: TierDisplayConfig<ContentLevel | "any">[] = [
  {
    value: "any",
    label: "app.chat.tiers.any",
    icon: "circle-dashed",
    description: "app.chat.tiers.anyDesc",
  },
  {
    value: "mainstream",
    label: "app.chat.tiers.content.mainstream",
    icon: "home",
    description: "app.chat.tiers.content.mainstreamDesc",
  },
  {
    value: "open",
    label: "app.chat.tiers.content.open",
    icon: "log-out",
    description: "app.chat.tiers.content.openDesc",
  },
  {
    value: "uncensored",
    label: "app.chat.tiers.content.uncensored",
    icon: "shield-off",
    description: "app.chat.tiers.content.uncensoredDesc",
  },
];
