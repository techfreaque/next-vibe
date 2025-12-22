/**
 * Shared types for the chat system
 * Contains tier levels, model utilities, character categories, and related interfaces
 */

import type { TranslationKey } from "@/i18n/core/static-types";

import {
  ContentLevelFilter,
  type ContentLevelFilterValue,
  type ContentLevelValue,
  IntelligenceLevelFilter,
  type IntelligenceLevelFilterValue,
  type IntelligenceLevelValue,
  PriceLevelFilter,
  type PriceLevelFilterValue,
  type SpeedLevelValue,
} from "./favorites/enum";
import type { IconKey } from "./model-access/icons";

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
// CHARACTER CATEGORY - User-facing task types
// ============================================
// NOTE: CharacterCategory enum is now defined in personas/enum.ts
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
// CHARACTER REQUIREMENTS - Hard filters
// ============================================

export interface CharacterRequirements {
  minContent?: typeof ContentLevelValue;
  maxContent?: typeof ContentLevelValue;
  minIntelligence?: typeof IntelligenceLevelValue;
  maxIntelligence?: typeof IntelligenceLevelValue;
  minSpeed?: typeof SpeedLevelValue;
  maxSpeed?: typeof SpeedLevelValue;
  requiredFeatures?: (keyof ModelFeatures)[];
}

// ============================================
// CHARACTER PREFERENCES - Soft scoring
// ============================================

export interface CharacterPreferences {
  preferredStrengths?: ModelUtility[];
  ignoredWeaknesses?: ModelUtility[];
}

// ============================================
// CHARACTER OWNERSHIP
// ============================================

export interface CharacterOwnership {
  type: "system" | "user" | "public";
  userId?: string;
  isDefault?: boolean; // Show in onboarding
  isFeatured?: boolean; // Highlight in UI
}

// ============================================
// CHARACTER DISPLAY INFO
// ============================================

export interface CharacterDisplay {
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
  typeof IntelligenceLevelFilterValue
>[] = [
  {
    value: IntelligenceLevelFilter.ANY,
    label: "app.chat.tiers.any",
    icon: "circle-dashed",
    description: "app.chat.tiers.anyDesc",
  },
  {
    value: IntelligenceLevelFilter.QUICK,
    label: "app.chat.tiers.intelligence.quick",
    icon: "zap",
    description: "app.chat.tiers.intelligence.quickDesc",
  },
  {
    value: IntelligenceLevelFilter.SMART,
    label: "app.chat.tiers.intelligence.smart",
    icon: "lightbulb",
    description: "app.chat.tiers.intelligence.smartDesc",
  },
  {
    value: IntelligenceLevelFilter.BRILLIANT,
    label: "app.chat.tiers.intelligence.brilliant",
    icon: "sparkles",
    description: "app.chat.tiers.intelligence.brilliantDesc",
  },
];

export const PRICE_DISPLAY: TierDisplayConfig<typeof PriceLevelFilterValue>[] =
  [
    {
      value: PriceLevelFilter.ANY,
      label: "app.chat.tiers.any",
      icon: "circle-dashed",
      description: "app.chat.tiers.anyDesc",
    },
    {
      value: PriceLevelFilter.CHEAP,
      label: "app.chat.tiers.price.cheap",
      icon: "coins",
      description: "app.chat.tiers.price.cheapDesc",
    },
    {
      value: PriceLevelFilter.STANDARD,
      label: "app.chat.tiers.price.standard",
      icon: "coins",
      description: "app.chat.tiers.price.standardDesc",
    },
    {
      value: PriceLevelFilter.PREMIUM,
      label: "app.chat.tiers.price.premium",
      icon: "crown",
      description: "app.chat.tiers.price.premiumDesc",
    },
  ];

export const CONTENT_DISPLAY: TierDisplayConfig<
  typeof ContentLevelFilterValue
>[] = [
  {
    value: ContentLevelFilter.ANY,
    label: "app.chat.tiers.any",
    icon: "circle-dashed",
    description: "app.chat.tiers.anyDesc",
  },
  {
    value: ContentLevelFilter.MAINSTREAM,
    label: "app.chat.tiers.content.mainstream",
    icon: "home",
    description: "app.chat.tiers.content.mainstreamDesc",
  },
  {
    value: ContentLevelFilter.OPEN,
    label: "app.chat.tiers.content.open",
    icon: "log-out",
    description: "app.chat.tiers.content.openDesc",
  },
  {
    value: ContentLevelFilter.UNCENSORED,
    label: "app.chat.tiers.content.uncensored",
    icon: "shield-off",
    description: "app.chat.tiers.content.uncensoredDesc",
  },
];
