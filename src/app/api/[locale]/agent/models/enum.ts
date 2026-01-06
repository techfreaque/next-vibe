/**
 * Model Access Enums
 * Contains model utility enums and related types
 */

import { createEnumOptions } from "next-vibe/system/unified-interface/shared/field/enum";

// ============================================
// MODEL UTILITY - What models are good at
// ============================================

/**
 * Model Utility enum - represents what models are good at (strengths/weaknesses)
 */
export const {
  enum: ModelUtility,
  options: ModelUtilityOptions,
  Value: ModelUtilityValue,
} = createEnumOptions({
  // Core capabilities
  CHAT: "app.chat.modelUtilities.chat",
  CODING: "app.chat.modelUtilities.coding",
  CREATIVE: "app.chat.modelUtilities.creative",
  ANALYSIS: "app.chat.modelUtilities.analysis",
  REASONING: "app.chat.modelUtilities.reasoning",
  ROLEPLAY: "app.chat.modelUtilities.roleplay",

  // Performance traits
  FAST: "app.chat.modelUtilities.fast",
  SMART: "app.chat.modelUtilities.smart",
  VISION: "app.chat.modelUtilities.vision",
  IMAGE_GEN: "app.chat.modelUtilities.imageGen",

  // Content handling (what model CAN do)
  POLITICAL_LEFT: "app.chat.modelUtilities.politicalLeft",
  POLITICAL_RIGHT: "app.chat.modelUtilities.politicalRight",
  CONTROVERSIAL: "app.chat.modelUtilities.controversial",
  ADULT_IMPLIED: "app.chat.modelUtilities.adultImplied",
  ADULT_EXPLICIT: "app.chat.modelUtilities.adultExplicit",
  VIOLENCE: "app.chat.modelUtilities.violence",
  HARMFUL: "app.chat.modelUtilities.harmful",
  ILLEGAL_INFO: "app.chat.modelUtilities.illegalInfo",
  MEDICAL_ADVICE: "app.chat.modelUtilities.medicalAdvice",
  OFFENSIVE_LANGUAGE: "app.chat.modelUtilities.offensiveLanguage",
  ROLEPLAY_DARK: "app.chat.modelUtilities.roleplayDark",
  CONSPIRACY: "app.chat.modelUtilities.conspiracy",

  // Meta
  LEGACY: "app.chat.modelUtilities.legacy",
  UNCENSORED: "app.chat.modelUtilities.uncensored",
});

/**
 * Database enum array for Drizzle
 */
export const ModelUtilityDB = [
  ModelUtility.CHAT,
  ModelUtility.CODING,
  ModelUtility.CREATIVE,
  ModelUtility.ANALYSIS,
  ModelUtility.REASONING,
  ModelUtility.ROLEPLAY,
  ModelUtility.FAST,
  ModelUtility.SMART,
  ModelUtility.VISION,
  ModelUtility.IMAGE_GEN,
  ModelUtility.POLITICAL_LEFT,
  ModelUtility.POLITICAL_RIGHT,
  ModelUtility.CONTROVERSIAL,
  ModelUtility.ADULT_IMPLIED,
  ModelUtility.ADULT_EXPLICIT,
  ModelUtility.VIOLENCE,
  ModelUtility.HARMFUL,
  ModelUtility.ILLEGAL_INFO,
  ModelUtility.MEDICAL_ADVICE,
  ModelUtility.OFFENSIVE_LANGUAGE,
  ModelUtility.ROLEPLAY_DARK,
  ModelUtility.CONSPIRACY,
  ModelUtility.LEGACY,
  ModelUtility.UNCENSORED,
] as const;
