/**
 * Model Selection Types
 * Schemas and types for model selection
 */

import { z } from "zod";

import {
  ContentLevel,
  IntelligenceLevel,
  ModelSelectionType,
  ModelSortDirection,
  ModelSortField,
  PriceLevel,
  SpeedLevel,
} from "@/app/api/[locale]/agent/chat/skills/enum";
import {
  IMAGE_GEN_MODEL_IDS,
  ModelId,
  MUSIC_GEN_MODEL_IDS,
  STT_MODEL_IDS,
  TTS_MODEL_IDS,
  VIDEO_GEN_MODEL_IDS,
} from "@/app/api/[locale]/agent/models/models";

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
 * Manual Model Selection Schema
 * User manually selects a specific model
 * Preserves filter/sort props for when user switches back to filter mode
 */
export const manualModelSelectionSchema = z
  .object({
    selectionType: z.literal(ModelSelectionType.MANUAL),
    manualModelId: z.enum(ModelId),
  })
  .merge(sharedFilterPropsSchema);

/**
 * Filter-based Model Selection Schema
 * System selects model based on filters (intelligence, price, content, speed)
 */
export const filtersModelSelectionSchema = z
  .object({
    selectionType: z.literal(ModelSelectionType.FILTERS),
  })
  .merge(sharedFilterPropsSchema);

/**
 * Model Selection Schema without CHARACTER_BASED support
 * For characters - only includes FILTERS and MANUAL modes
 */
export const modelSelectionSchemaSimple = z.discriminatedUnion(
  "selectionType",
  [manualModelSelectionSchema, filtersModelSelectionSchema],
);

/**
 * Skill variant schema (variant-level model selection)
 */
export const skillVariantSchema = z.object({
  id: z.string(),
  modelSelection: modelSelectionSchemaSimple,
  isDefault: z.boolean().optional(),
});

/**
 * Type exports for convenience
 */
export type ManualModelSelection = z.infer<typeof manualModelSelectionSchema>;
export type FiltersModelSelection = z.infer<typeof filtersModelSelectionSchema>;

export type ModelSelectionSimple = z.infer<typeof modelSelectionSchemaSimple>;
export type SkillVariantData = z.infer<typeof skillVariantSchema>;

/**
 * Voice/TTS model selection - manualModelId constrained to TTS model IDs
 */
export const voiceModelSelectionSchema = z.discriminatedUnion("selectionType", [
  z
    .object({
      selectionType: z.literal(ModelSelectionType.MANUAL),
      manualModelId: z.enum(TTS_MODEL_IDS),
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
      manualModelId: z.enum(STT_MODEL_IDS),
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
        manualModelId: z.enum(IMAGE_GEN_MODEL_IDS),
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
        manualModelId: z.enum(MUSIC_GEN_MODEL_IDS),
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
        manualModelId: z.enum(VIDEO_GEN_MODEL_IDS),
      })
      .merge(sharedFilterPropsSchema),
    filtersModelSelectionSchema,
  ],
);
export type VideoGenModelSelection = z.infer<
  typeof videoGenModelSelectionSchema
>;

/**
 * Vision bridge model selection - manualModelId accepts any ModelId (LLMs with image input
 * are a runtime-filtered subset; VisionModelId resolves to ModelId since VISION_MODEL_IDS
 * is dynamically computed). TypeScript type is VisionModelId (= ModelId).
 */
export const visionModelSelectionSchema = z.discriminatedUnion(
  "selectionType",
  [
    z
      .object({
        selectionType: z.literal(ModelSelectionType.MANUAL),
        manualModelId: z.nativeEnum(ModelId),
      })
      .merge(sharedFilterPropsSchema),
    filtersModelSelectionSchema,
  ],
);
export type VisionModelSelection = z.infer<typeof visionModelSelectionSchema>;
