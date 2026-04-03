/**
 * Model Selection Types and Model Interfaces
 * Schemas and types for model selection, model definitions, and model options
 */

import { z } from "zod";

import type { IconKey } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import {
  ContentLevel,
  type ContentLevelValue,
  IntelligenceLevel,
  type IntelligenceLevelValue,
  ModelSelectionType,
  ModelSortDirection,
  ModelSortField,
  PriceLevel,
  SpeedLevel,
  type SpeedLevelValue,
} from "@/app/api/[locale]/agent/chat/skills/enum";
import type { AgentTranslationKey } from "../i18n";
import type { ApiProvider } from "./models";

import { ChatModelId } from "@/app/api/[locale]/agent/ai-stream/models";
import {
  AudioVisionModelId,
  ImageVisionModelId,
  VideoVisionModelId,
} from "@/app/api/[locale]/agent/ai-stream/vision-models";
import { ImageGenModelId } from "@/app/api/[locale]/agent/image-generation/models";
import { type Modality, type ModelUtilityValue } from "./enum";
import { MusicGenModelId } from "@/app/api/[locale]/agent/music-generation/models";
import { SttModelId } from "@/app/api/[locale]/agent/speech-to-text/models";
import { TtsModelId } from "@/app/api/[locale]/agent/text-to-speech/models";
import { VideoGenModelId } from "@/app/api/[locale]/agent/video-generation/models";

// ============================================
// MODEL SELECTION SCHEMAS
// ============================================

/**
 * Shared filter properties schema
 * These are preserved across all selection types so users don't lose their settings
 */
const sharedFilterPropsSchema = z.object({
  intelligenceRange: z
    .object({
      min: z.enum(IntelligenceLevel).optional(),
      max: z.enum(IntelligenceLevel).optional(),
    })
    .optional(),
  priceRange: z
    .object({
      min: z.enum(PriceLevel).optional(),
      max: z.enum(PriceLevel).optional(),
    })
    .optional(),
  contentRange: z
    .object({
      min: z.enum(ContentLevel).optional(),
      max: z.enum(ContentLevel).optional(),
    })
    .optional(),
  speedRange: z
    .object({
      min: z.enum(SpeedLevel).optional(),
      max: z.enum(SpeedLevel).optional(),
    })
    .optional(),
  sortBy: z.enum(ModelSortField).optional(),
  sortDirection: z.enum(ModelSortDirection).optional(),
  sortBy2: z.enum(ModelSortField).optional(),
  sortDirection2: z.enum(ModelSortDirection).optional(),
});

/**
 * Filter-based Model Selection Schema
 * System selects model based on filters (intelligence, price, content, speed)
 */
export const filtersModelSelectionSchema = z
  .object({
    selectionType: z.literal(ModelSelectionType.FILTERS),
  })
  .merge(sharedFilterPropsSchema);
export type FiltersModelSelection = z.infer<typeof filtersModelSelectionSchema>;

/**
 * Chat-specific manual model selection - manualModelId constrained to chat model IDs.
 */
export const chatManualModelSelectionSchema = z
  .object({
    selectionType: z.literal(ModelSelectionType.MANUAL),
    manualModelId: z.enum(ChatModelId),
  })
  .merge(sharedFilterPropsSchema);
export type ChatManualModelSelection = z.infer<
  typeof chatManualModelSelectionSchema
>;

/**
 * Chat model selection schema (MANUAL | FILTERS, chat model IDs only).
 * Use for the main LLM/chat role.
 */
export const chatModelSelectionSchema = z.discriminatedUnion("selectionType", [
  chatManualModelSelectionSchema,
  filtersModelSelectionSchema,
]);
/** Chat-role model selection (MANUAL with chat model IDs, or FILTERS) */
export type ChatModelSelection = z.infer<typeof chatModelSelectionSchema>;

/**
 * Voice/TTS model selection - manualModelId constrained to TTS model IDs
 */
export const voiceModelSelectionSchema = z.discriminatedUnion("selectionType", [
  z
    .object({
      selectionType: z.literal(ModelSelectionType.MANUAL),
      manualModelId: z.enum(TtsModelId),
    })
    .merge(sharedFilterPropsSchema),
  filtersModelSelectionSchema,
]);
export type VoiceModelSelection = z.infer<typeof voiceModelSelectionSchema>;

/**
 * STT model selection - manualModelId constrained to STT model IDs
 */
export const sttModelSelectionSchema = z.discriminatedUnion("selectionType", [
  z
    .object({
      selectionType: z.literal(ModelSelectionType.MANUAL),
      manualModelId: z.enum(SttModelId),
    })
    .merge(sharedFilterPropsSchema),
  filtersModelSelectionSchema,
]);
export type SttModelSelection = z.infer<typeof sttModelSelectionSchema>;

/**
 * Image generation model selection - manualModelId constrained to image-gen model IDs
 */
export const imageGenModelSelectionSchema = z.discriminatedUnion(
  "selectionType",
  [
    z
      .object({
        selectionType: z.literal(ModelSelectionType.MANUAL),
        manualModelId: z.enum(ImageGenModelId),
      })
      .merge(sharedFilterPropsSchema),
    filtersModelSelectionSchema,
  ],
);
export type ImageGenModelSelection = z.infer<
  typeof imageGenModelSelectionSchema
>;

/**
 * Music/audio generation model selection - manualModelId constrained to audio-gen model IDs
 */
export const musicGenModelSelectionSchema = z.discriminatedUnion(
  "selectionType",
  [
    z
      .object({
        selectionType: z.literal(ModelSelectionType.MANUAL),
        manualModelId: z.enum(MusicGenModelId),
      })
      .merge(sharedFilterPropsSchema),
    filtersModelSelectionSchema,
  ],
);
export type MusicGenModelSelection = z.infer<
  typeof musicGenModelSelectionSchema
>;

/**
 * Video generation model selection - manualModelId constrained to video-gen model IDs
 */
export const videoGenModelSelectionSchema = z.discriminatedUnion(
  "selectionType",
  [
    z
      .object({
        selectionType: z.literal(ModelSelectionType.MANUAL),
        manualModelId: z.enum(VideoGenModelId),
      })
      .merge(sharedFilterPropsSchema),
    filtersModelSelectionSchema,
  ],
);
export type VideoGenModelSelection = z.infer<
  typeof videoGenModelSelectionSchema
>;

export const imageVisionModelSelectionSchema = z.discriminatedUnion(
  "selectionType",
  [
    z
      .object({
        selectionType: z.literal(ModelSelectionType.MANUAL),
        manualModelId: z.enum(ImageVisionModelId),
      })
      .merge(sharedFilterPropsSchema),
    filtersModelSelectionSchema,
  ],
);
export type ImageVisionModelSelection = z.infer<
  typeof imageVisionModelSelectionSchema
>;

export const videoVisionModelSelectionSchema = z.discriminatedUnion(
  "selectionType",
  [
    z
      .object({
        selectionType: z.literal(ModelSelectionType.MANUAL),
        manualModelId: z.enum(VideoVisionModelId),
      })
      .merge(sharedFilterPropsSchema),
    filtersModelSelectionSchema,
  ],
);
export type VideoVisionModelSelection = z.infer<
  typeof videoVisionModelSelectionSchema
>;

export const audioVisionModelSelectionSchema = z.discriminatedUnion(
  "selectionType",
  [
    z
      .object({
        selectionType: z.literal(ModelSelectionType.MANUAL),
        manualModelId: z.enum(AudioVisionModelId),
      })
      .merge(sharedFilterPropsSchema),
    filtersModelSelectionSchema,
  ],
);
export type AudioVisionModelSelection = z.infer<
  typeof audioVisionModelSelectionSchema
>;

/**
 * Skill variant schema (variant-level model selection, per-role).
 * Each role gets its own typed field - no cross-role mixing.
 */
export const skillVariantSchema = z.object({
  id: z.string(),
  /** Main LLM/chat model selection */
  modelSelection: chatModelSelectionSchema,
  /** Image generation model selection for this variant */
  imageGenModelSelection: imageGenModelSelectionSchema.optional(),
  /** Music/audio generation model selection for this variant */
  musicGenModelSelection: musicGenModelSelectionSchema.optional(),
  /** Video generation model selection for this variant */
  videoGenModelSelection: videoGenModelSelectionSchema.optional(),
  /** TTS voice model selection for this variant */
  voiceModelSelection: voiceModelSelectionSchema.optional(),
  /** STT model selection for this variant */
  sttModelSelection: sttModelSelectionSchema.optional(),
  /** Image vision bridge model selection for this variant */
  imageVisionModelSelection: imageVisionModelSelectionSchema.optional(),
  /** Video vision bridge model selection for this variant */
  videoVisionModelSelection: videoVisionModelSelectionSchema.optional(),
  /** Audio vision bridge model selection for this variant */
  audioVisionModelSelection: audioVisionModelSelectionSchema.optional(),
  isDefault: z.boolean().optional(),
});
export type SkillVariantData = z.infer<typeof skillVariantSchema>;

/**
 * Union of all role-specific model selection types.
 * Used when a component needs to handle any selection regardless of model role.
 */
export type AnyRoleModelSelection =
  | ChatModelSelection
  | VoiceModelSelection
  | SttModelSelection
  | ImageGenModelSelection
  | MusicGenModelSelection
  | VideoGenModelSelection
  | ImageVisionModelSelection
  | VideoVisionModelSelection
  | AudioVisionModelSelection
  | FiltersModelSelection;

// ============================================
// MODEL INTERFACES
// (moved from model-base.ts)
// ============================================

/**
 * Model Features - Binary capabilities (slimmed down; modality handled via inputs/outputs)
 */
export interface ModelFeatures {
  streaming: boolean;
  toolCalling: boolean;
}

/**
 * Model type discriminant - determines which interface the UI renders
 * and which backend endpoint to route to.
 */
export type ModelType = "text" | "image" | "video" | "audio";

/**
 * Optional voice metadata for TTS models
 */
export interface TtsVoiceMeta {
  gender?: "male" | "female" | "neutral";
  preview?: string;
  language?: string;
  style?: string;
}

/**
 * Provider-specific config for a model variant
 */
export interface ModelProviderConfigTokenBased {
  id: ChatModelId | ImageGenModelId;
  apiProvider: ApiProvider;
  providerModel: string;
  creditCost: (
    modelOption: AnyModelOption,
    actualInputTokens: number,
    actualOutputTokens: number,
    cachedInputTokens?: number,
    cacheWriteTokens?: number,
  ) => number;
  inputTokenCost: number;
  outputTokenCost: number;
  cacheReadTokenCost?: number;
  cacheWriteTokenCost?: number;
  adminOnly?: boolean;
}
export interface ModelProviderConfigCreditBased {
  id: ChatModelId;
  apiProvider: ApiProvider;
  providerModel: string;
  creditCost: number;
  inputTokenCost?: never;
  outputTokenCost?: never;
  adminOnly?: boolean;
}
export interface ModelProviderConfigImageBased {
  id: ImageGenModelId;
  apiProvider: ApiProvider;
  providerModel: string;
  /** Fixed credits per generated image */
  creditCostPerImage: number;
  creditCost?: never;
  inputTokenCost?: never;
  outputTokenCost?: never;
  adminOnly?: boolean;
}
export interface ModelProviderConfigVideoBased {
  id: VideoGenModelId;
  apiProvider: ApiProvider;
  providerModel: string;
  /** Credits per second of generated video */
  creditCostPerSecond: number;
  /** Default duration for upfront balance check */
  defaultDurationSeconds: number;
  creditCost?: never;
  inputTokenCost?: never;
  outputTokenCost?: never;
  adminOnly?: boolean;
}
export interface ModelProviderConfigAudioBased {
  id: MusicGenModelId;
  apiProvider: ApiProvider;
  providerModel: string;
  /** Fixed credits per generated audio clip */
  creditCostPerClip: number;
  /** Default duration in seconds for upfront balance check */
  defaultDurationSeconds: number;
  creditCost?: never;
  inputTokenCost?: never;
  outputTokenCost?: never;
  adminOnly?: boolean;
}
export interface ModelProviderConfigTtsBased {
  id: TtsModelId;
  apiProvider: ApiProvider;
  providerModel: string;
  creditCostPerCharacter: number;
  adminOnly?: boolean;
}
export interface ModelProviderConfigSttBased {
  id: SttModelId;
  apiProvider: ApiProvider;
  providerModel: string;
  creditCostPerSecond: number;
  adminOnly?: boolean;
}
export type ModelProviderConfig =
  | ModelProviderConfigTokenBased
  | ModelProviderConfigCreditBased
  | ModelProviderConfigImageBased
  | ModelProviderConfigVideoBased
  | ModelProviderConfigAudioBased
  | ModelProviderConfigTtsBased
  | ModelProviderConfigSttBased;

export interface ModelProvider {
  name: string;
  icon: IconKey;
}

export type ModelProviderId =
  | "openAI"
  | "google"
  | "mistralAI"
  | "moonshotAI"
  | "deepSeek"
  | "alibaba"
  | "xAI"
  | "uncensoredAI"
  | "anthropic"
  | "zAi"
  | "veniceAI"
  | "freedomGPT"
  | "gabAI"
  | "blackForestLabs"
  | "stabilityAI"
  | "meta"
  | "udio"
  | "miniMax"
  | "xiaomi"
  | "byteDanceSeed"
  | "elevenlabs"
  | "deepgram"
  | "sourceful"
  | "modelsLab"
  | "byteplus"
  | "klingai"
  | "ltx"
  | "minimax"
  | "runway"
  | "sync"
  | "xai";

/**
 * Minimal env availability shape required by model count helpers.
 */
export interface ModelProviderEnvAvailability {
  openRouter: boolean;
  claudeCode: boolean;
  uncensoredAI: boolean;
  freedomGPT: boolean;
  gabAI: boolean;
  veniceAI: boolean;
  openAiImages: boolean;
  replicate: boolean;
  falAi: boolean;
  modelsLab: boolean;
}

/**
 * Model definition - canonical source of truth for each conceptual model.
 */
export interface ModelDefinition {
  name: string;
  by: ModelProviderId;
  description: AgentTranslationKey;
  parameterCount: number | undefined;
  contextWindow: number;
  icon: IconKey;
  providers: ModelProviderConfig[];
  utilities: (typeof ModelUtilityValue)[];
  supportsTools: boolean;
  intelligence: typeof IntelligenceLevelValue;
  speed: typeof SpeedLevelValue;
  content: typeof ContentLevelValue;
  features: ModelFeatures;
  weaknesses?: (typeof ModelUtilityValue)[];
  /** Native input modalities this model accepts */
  inputs: Modality[];
  /** Native output modalities this model produces */
  outputs: Modality[];
  /** Optional voice metadata for TTS models */
  voiceMeta?: TtsVoiceMeta;
}

/**
 * Configuration interface for AI model options.
 */
export interface ModelOptionBase {
  id: string;
  name: string;
  provider: ModelProviderId;
  apiProvider: ApiProvider;
  description: AgentTranslationKey;
  parameterCount: number | undefined;
  contextWindow: number;
  icon: IconKey;
  providerModel: string;
  utilities: (typeof ModelUtilityValue)[];
  supportsTools: boolean;
  intelligence: typeof IntelligenceLevelValue;
  speed: typeof SpeedLevelValue;
  content: typeof ContentLevelValue;
  features: ModelFeatures;
  weaknesses?: (typeof ModelUtilityValue)[];
  adminOnly?: boolean;
  inputs: Modality[];
  outputs: Modality[];
  voiceMeta?: TtsVoiceMeta;
}
export interface ModelOptionTokenBased extends ModelOptionBase {
  id: ChatModelId | ImageGenModelId;
  creditCost: (
    modelOption: AnyModelOption,
    actualInputTokens: number,
    actualOutputTokens: number,
    cachedInputTokens?: number,
    cacheWriteTokens?: number,
  ) => number;
  inputTokenCost: number;
  outputTokenCost: number;
  cacheReadTokenCost?: number;
  cacheWriteTokenCost?: number;
}
export interface ModelOptionCreditBased extends ModelOptionBase {
  id: ChatModelId;
  creditCost: number;
  inputTokenCost?: never;
  outputTokenCost?: never;
}
export interface ModelOptionImageBased extends ModelOptionBase {
  id: ImageGenModelId;
  creditCostPerImage: number;
  creditCost?: never;
  inputTokenCost?: never;
  outputTokenCost?: never;
}
export interface ModelOptionVideoBased extends ModelOptionBase {
  id: VideoGenModelId;
  creditCostPerSecond: number;
  defaultDurationSeconds: number;
  creditCost?: never;
  inputTokenCost?: never;
  outputTokenCost?: never;
}
export interface ModelOptionAudioBased extends ModelOptionBase {
  id: MusicGenModelId;
  creditCostPerClip: number;
  defaultDurationSeconds: number;
  creditCost?: never;
  inputTokenCost?: never;
  outputTokenCost?: never;
}
export interface ModelOptionTtsBased extends ModelOptionBase {
  id: TtsModelId;
  creditCostPerCharacter: number;
  creditCost?: never;
  inputTokenCost?: never;
  outputTokenCost?: never;
}
export interface ModelOptionSttBased extends ModelOptionBase {
  id: SttModelId;
  creditCostPerSecond: number;
  creditCost?: never;
  inputTokenCost?: never;
  outputTokenCost?: never;
}

/** ModelOption for chat/LLM models */
export type ChatModelOption =
  | (ModelOptionTokenBased & { id: ChatModelId })
  | (ModelOptionCreditBased & { id: ChatModelId });
/** ModelOption for image-vision-capable chat models */
export type ImageVisionModelOption =
  | (ModelOptionTokenBased & { id: ImageVisionModelId })
  | (ModelOptionCreditBased & { id: ImageVisionModelId });
/** ModelOption for video-vision-capable chat models */
export type VideoVisionModelOption =
  | (ModelOptionTokenBased & { id: VideoVisionModelId })
  | (ModelOptionCreditBased & { id: VideoVisionModelId });
/** ModelOption for audio-vision-capable chat models */
export type AudioVisionModelOption =
  | (ModelOptionTokenBased & { id: AudioVisionModelId })
  | (ModelOptionCreditBased & { id: AudioVisionModelId });
/** ModelOption for STT models */
export type SttModelOption = ModelOptionSttBased & { id: SttModelId };
/** ModelOption for TTS models */
export type TtsModelOption = ModelOptionTtsBased & { id: TtsModelId };
/** ModelOption for image-gen models (includes token-based multimodal image+chat models) */
export type ImageGenModelOption = (
  | ModelOptionImageBased
  | ModelOptionTokenBased
) & { id: ImageGenModelId };
/** ModelOption for music/audio-gen models */
export type MusicGenModelOption = ModelOptionAudioBased & {
  id: MusicGenModelId;
};
/** ModelOption for video-gen models */
export type VideoGenModelOption = ModelOptionVideoBased & {
  id: VideoGenModelId;
};

/** Union of all role-specific model options across all modalities. */
export type AnyModelOption =
  | ChatModelOption
  | SttModelOption
  | TtsModelOption
  | ImageGenModelOption
  | MusicGenModelOption
  | VideoGenModelOption;
