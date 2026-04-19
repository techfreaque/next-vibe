/**
 * Media Model Presets
 *
 * Named preset constants for all non-chat model selections used in skill variants.
 * Skills import these instead of writing inline selection objects.
 *
 * Design principles:
 * - imageGen / musicGen / videoGen / vision: tier-based (open-cheap, open-smart, mainstream-smart, etc.)
 *   sorted cheapest within tier first
 * - voice (TTS): character-based (female-warm, male-deep, neutral, etc.)
 *   pinned to a specific voice since persona consistency matters more than price
 * - stt: price-sorted cheapest available (both models are cheap, accuracy matters equally)
 *
 * Usage:
 *   imageGenModelSelection: IMAGE_GEN.openCheap
 *   voiceModelSelection: VOICE.femaleWarm
 *   sttModelSelection: STT.cheap
 */

import { AudioVisionModelId } from "@/app/api/[locale]/agent/ai-stream/vision-models";
import type { ImageGenModelSelection } from "@/app/api/[locale]/agent/image-generation/models";
import type { MusicGenModelSelection } from "@/app/api/[locale]/agent/music-generation/models";
import type { SttModelSelection } from "@/app/api/[locale]/agent/speech-to-text/models";
import { SttModelId } from "@/app/api/[locale]/agent/speech-to-text/models";
import type { VoiceModelSelection } from "@/app/api/[locale]/agent/text-to-speech/models";
import { TtsModelId } from "@/app/api/[locale]/agent/text-to-speech/models";
import type { VideoGenModelSelection } from "@/app/api/[locale]/agent/video-generation/models";
import type { AudioVisionModelSelection } from "@/app/api/[locale]/agent/ai-stream/vision-models";

import {
  ContentLevel,
  IntelligenceLevel,
  ModelSelectionType,
  ModelSortDirection,
  ModelSortField,
} from "../../enum";

// ─── Image Generation ────────────────────────────────────────────────────────
// Open = allows artistic/non-mainstream content; Mainstream = safe/filtered only.
// Cheap = lowest credit cost within tier; Smart = best quality within tier.

export const IMAGE_GEN = {
  /** Cheapest open-content image model. Good default for most skills. */
  openCheap: {
    selectionType: ModelSelectionType.FILTERS,
    contentRange: { min: ContentLevel.OPEN, max: ContentLevel.OPEN },
    sortBy: ModelSortField.PRICE,
    sortDirection: ModelSortDirection.ASC,
  } satisfies ImageGenModelSelection,

  /** Best-quality open-content image model, price as tiebreaker. */
  openSmart: {
    selectionType: ModelSelectionType.FILTERS,
    contentRange: { min: ContentLevel.OPEN, max: ContentLevel.OPEN },
    intelligenceRange: { min: IntelligenceLevel.SMART },
    sortBy: ModelSortField.INTELLIGENCE,
    sortDirection: ModelSortDirection.DESC,
    sortBy2: ModelSortField.PRICE,
    sortDirection2: ModelSortDirection.ASC,
  } satisfies ImageGenModelSelection,

  /** Cheapest mainstream-only image model. Use for family-safe / professional skills. */
  mainstreamCheap: {
    selectionType: ModelSelectionType.FILTERS,
    contentRange: { max: ContentLevel.MAINSTREAM },
    sortBy: ModelSortField.PRICE,
    sortDirection: ModelSortDirection.ASC,
  } satisfies ImageGenModelSelection,

  /** Best-quality mainstream-only image model. Use for professional / business skills. */
  mainstreamSmart: {
    selectionType: ModelSelectionType.FILTERS,
    contentRange: { max: ContentLevel.MAINSTREAM },
    intelligenceRange: { min: IntelligenceLevel.SMART },
    sortBy: ModelSortField.INTELLIGENCE,
    sortDirection: ModelSortDirection.DESC,
    sortBy2: ModelSortField.PRICE,
    sortDirection2: ModelSortDirection.ASC,
  } satisfies ImageGenModelSelection,

  /** Unrestricted — no content filter. Use only for explicitly uncensored skills. */
  uncensoredCheap: {
    selectionType: ModelSelectionType.FILTERS,
    sortBy: ModelSortField.PRICE,
    sortDirection: ModelSortDirection.ASC,
  } satisfies ImageGenModelSelection,

  /** Unrestricted best-quality. Use only for explicitly uncensored creative skills. */
  uncensoredSmart: {
    selectionType: ModelSelectionType.FILTERS,
    intelligenceRange: { min: IntelligenceLevel.SMART },
    sortBy: ModelSortField.INTELLIGENCE,
    sortDirection: ModelSortDirection.DESC,
    sortBy2: ModelSortField.PRICE,
    sortDirection2: ModelSortDirection.ASC,
  } satisfies ImageGenModelSelection,
} as const;

// ─── Music Generation ─────────────────────────────────────────────────────────

export const MUSIC_GEN = {
  /** Cheapest open-content music model. */
  openCheap: {
    selectionType: ModelSelectionType.FILTERS,
    contentRange: { min: ContentLevel.OPEN },
    sortBy: ModelSortField.PRICE,
    sortDirection: ModelSortDirection.ASC,
  } satisfies MusicGenModelSelection,

  /** Best-quality open-content music model. */
  openSmart: {
    selectionType: ModelSelectionType.FILTERS,
    contentRange: { min: ContentLevel.OPEN },
    intelligenceRange: { min: IntelligenceLevel.SMART },
    sortBy: ModelSortField.INTELLIGENCE,
    sortDirection: ModelSortDirection.DESC,
    sortBy2: ModelSortField.PRICE,
    sortDirection2: ModelSortDirection.ASC,
  } satisfies MusicGenModelSelection,

  /** Cheapest mainstream-only music model. */
  mainstreamCheap: {
    selectionType: ModelSelectionType.FILTERS,
    contentRange: { max: ContentLevel.MAINSTREAM },
    sortBy: ModelSortField.PRICE,
    sortDirection: ModelSortDirection.ASC,
  } satisfies MusicGenModelSelection,

  /** Best-quality mainstream-only music model. */
  mainstreamSmart: {
    selectionType: ModelSelectionType.FILTERS,
    contentRange: { max: ContentLevel.MAINSTREAM },
    intelligenceRange: { min: IntelligenceLevel.SMART },
    sortBy: ModelSortField.INTELLIGENCE,
    sortDirection: ModelSortDirection.DESC,
    sortBy2: ModelSortField.PRICE,
    sortDirection2: ModelSortDirection.ASC,
  } satisfies MusicGenModelSelection,

  /** Unrestricted cheapest music model. */
  uncensoredCheap: {
    selectionType: ModelSelectionType.FILTERS,
    sortBy: ModelSortField.PRICE,
    sortDirection: ModelSortDirection.ASC,
  } satisfies MusicGenModelSelection,
} as const;

// ─── Video Generation ─────────────────────────────────────────────────────────
// Note: all current video models are OPEN content, none MAINSTREAM.
// Cheap/smart distinction is the main differentiator.

export const VIDEO_GEN = {
  /** Cheapest available video model. */
  cheap: {
    selectionType: ModelSelectionType.FILTERS,
    sortBy: ModelSortField.PRICE,
    sortDirection: ModelSortDirection.ASC,
  } satisfies VideoGenModelSelection,

  /** Best-quality video model, price as tiebreaker. */
  smart: {
    selectionType: ModelSelectionType.FILTERS,
    intelligenceRange: { min: IntelligenceLevel.SMART },
    sortBy: ModelSortField.INTELLIGENCE,
    sortDirection: ModelSortDirection.DESC,
    sortBy2: ModelSortField.PRICE,
    sortDirection2: ModelSortDirection.ASC,
  } satisfies VideoGenModelSelection,
} as const;

// ─── Voice (TTS) ─────────────────────────────────────────────────────────────
// Voice presets are pinned to specific voices — persona consistency matters
// more than dynamic price selection. Voices differ in character, not just quality.
//
// Available voices (from ttsModelDefinitions voiceMeta):
//   OPENAI_ALLOY    — neutral, conversational
//   OPENAI_NOVA     — female, warm
//   OPENAI_ONYX     — male, deep
//   OPENAI_ECHO     — male
//   OPENAI_SHIMMER  — female
//   OPENAI_FABLE    — male, expressive
//   ELEVENLABS_RACHEL — female, calm
//   ELEVENLABS_JOSH   — male, deep
//   ELEVENLABS_BELLA  — female, friendly
//   ELEVENLABS_ADAM   — male, authoritative

export const VOICE = {
  /** Neutral, conversational. Safe default for general-purpose skills. */
  neutral: {
    selectionType: ModelSelectionType.MANUAL,
    manualModelId: TtsModelId.OPENAI_ALLOY,
  } satisfies VoiceModelSelection,

  /** Female, warm. Suits companion / friendly / Thea-style personas. */
  femaleWarm: {
    selectionType: ModelSelectionType.MANUAL,
    manualModelId: TtsModelId.OPENAI_NOVA,
  } satisfies VoiceModelSelection,

  /** Male, deep. Suits authoritative / Hermes-style assistant personas. */
  maleDeep: {
    selectionType: ModelSelectionType.MANUAL,
    manualModelId: TtsModelId.OPENAI_ONYX,
  } satisfies VoiceModelSelection,

  /** Male, expressive. Suits storyteller / roleplay / creative personas. */
  maleExpressive: {
    selectionType: ModelSelectionType.MANUAL,
    manualModelId: TtsModelId.OPENAI_FABLE,
  } satisfies VoiceModelSelection,

  /** Female, calm. Suits writing assistant / editor / teacher personas. */
  femaleCalmEl: {
    selectionType: ModelSelectionType.MANUAL,
    manualModelId: TtsModelId.ELEVENLABS_RACHEL,
  } satisfies VoiceModelSelection,

  /** Female, friendly. Suits social / marketer / coach personas. */
  femaleFriendly: {
    selectionType: ModelSelectionType.MANUAL,
    manualModelId: TtsModelId.ELEVENLABS_BELLA,
  } satisfies VoiceModelSelection,

  /** Male, authoritative. Suits legal / financial / professional personas. */
  maleAuthoritative: {
    selectionType: ModelSelectionType.MANUAL,
    manualModelId: TtsModelId.ELEVENLABS_ADAM,
  } satisfies VoiceModelSelection,
} as const;

// ─── Speech-to-Text ───────────────────────────────────────────────────────────
// Both available models (Whisper, Deepgram Nova 2) are comparable quality/price.
// Use cheapest available as the default.

export const STT = {
  /** Cheapest available STT model. Suitable for all skills. */
  cheap: {
    selectionType: ModelSelectionType.FILTERS,
    sortBy: ModelSortField.PRICE,
    sortDirection: ModelSortDirection.ASC,
  } satisfies SttModelSelection,

  /** OpenAI Whisper — pinned for skills needing consistent STT behavior. */
  whisper: {
    selectionType: ModelSelectionType.MANUAL,
    manualModelId: SttModelId.OPENAI_WHISPER,
  } satisfies SttModelSelection,
} as const;

// ─── Audio Vision ─────────────────────────────────────────────────────────────
// Models that analyze audio input (music, speech, sounds).
// Gemini 2.5 Flash is the primary capable model.

export const AUDIO_VISION = {
  /** Cheapest audio analysis model. */
  cheap: {
    selectionType: ModelSelectionType.FILTERS,
    sortBy: ModelSortField.PRICE,
    sortDirection: ModelSortDirection.ASC,
  } satisfies AudioVisionModelSelection,

  /** Gemini 2.5 Flash — pinned for quality-sensitive audio analysis. */
  geminiFlash: {
    selectionType: ModelSelectionType.MANUAL,
    manualModelId: AudioVisionModelId.GEMINI_2_5_FLASH,
  } satisfies AudioVisionModelSelection,
} as const;
