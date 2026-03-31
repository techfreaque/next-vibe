/**
 * Model Access Enums
 * Contains model utility enums and related types
 */

import { createEnumOptions } from "next-vibe/system/unified-interface/shared/field/enum";

import { scopedTranslation } from "./i18n";

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
} = createEnumOptions(scopedTranslation, {
  // Core capabilities
  CHAT: "modelUtilities.chat",
  CODING: "modelUtilities.coding",
  CREATIVE: "modelUtilities.creative",
  ANALYSIS: "modelUtilities.analysis",
  REASONING: "modelUtilities.reasoning",
  ROLEPLAY: "modelUtilities.roleplay",

  // Performance traits
  FAST: "modelUtilities.fast",
  SMART: "modelUtilities.smart",
  VISION: "modelUtilities.vision",
  IMAGE_GEN: "modelUtilities.imageGen",
  MUSIC_GEN: "modelUtilities.musicGen",

  // Content handling (what model CAN do)
  POLITICAL_LEFT: "modelUtilities.politicalLeft",
  POLITICAL_RIGHT: "modelUtilities.politicalRight",
  CONTROVERSIAL: "modelUtilities.controversial",
  ADULT_IMPLIED: "modelUtilities.adultImplied",
  ADULT_EXPLICIT: "modelUtilities.adultExplicit",
  VIOLENCE: "modelUtilities.violence",
  HARMFUL: "modelUtilities.harmful",
  ILLEGAL_INFO: "modelUtilities.illegalInfo",
  MEDICAL_ADVICE: "modelUtilities.medicalAdvice",
  OFFENSIVE_LANGUAGE: "modelUtilities.offensiveLanguage",
  ROLEPLAY_DARK: "modelUtilities.roleplayDark",
  CONSPIRACY: "modelUtilities.conspiracy",

  // Modality-specific
  TTS: "modelUtilities.tts",
  STT: "modelUtilities.stt",
  VIDEO_GEN: "modelUtilities.videoGen",

  // Meta
  LEGACY: "modelUtilities.legacy",
  UNCENSORED: "modelUtilities.uncensored",
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
  ModelUtility.MUSIC_GEN,
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
  ModelUtility.TTS,
  ModelUtility.STT,
  ModelUtility.VIDEO_GEN,
  ModelUtility.LEGACY,
  ModelUtility.UNCENSORED,
] as const;

// ============================================
// MODALITY TYPES
// ============================================

export type ModelRole =
  | "llm"
  | "tts"
  | "stt"
  | "image-gen"
  | "video-gen"
  | "audio-gen"
  | "embedding"
  | "router";

export type Modality = "text" | "audio" | "image" | "video" | "file";

// ============================================
// CHAT MODE
// ============================================

export type ChatMode = "text" | "voice" | "call";

export const CHAT_MODE_IDS = [
  "text",
  "voice",
  "call",
] as const satisfies ChatMode[];

export const ChatModeOptions: Array<{ value: ChatMode; label: string }> = [
  // eslint-disable-next-line i18next/no-literal-string -- UI labels for chat mode
  { value: "text", label: "Text" },
  // eslint-disable-next-line i18next/no-literal-string -- UI labels for chat mode
  { value: "voice", label: "Voice" },
  // eslint-disable-next-line i18next/no-literal-string -- UI labels for chat mode
  { value: "call", label: "Call" },
];
