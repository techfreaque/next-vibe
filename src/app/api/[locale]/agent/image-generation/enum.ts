/**
 * Image Generation Enums
 */

import { createEnumOptions } from "next-vibe/system/unified-interface/shared/field/enum";

import { getAllModelOptions, ModelId } from "../models/models";
import { scopedTranslation } from "./i18n";

export const {
  enum: ImageSize,
  options: ImageSizeOptions,
  Value: ImageSizeValue,
} = createEnumOptions(scopedTranslation, {
  SQUARE_1024: "post.size.square1024",
  LANDSCAPE_1792: "post.size.landscape1792",
  PORTRAIT_1792: "post.size.portrait1792",
});

export const IMAGE_SIZE_VALUES = [
  "post.size.square1024",
  "post.size.landscape1792",
  "post.size.portrait1792",
] as const;

export const {
  enum: ImageQuality,
  options: ImageQualityOptions,
  Value: ImageQualityValue,
} = createEnumOptions(scopedTranslation, {
  STANDARD: "post.quality.standard",
  HD: "post.quality.hd",
});

export const IMAGE_QUALITY_VALUES = [
  "post.quality.standard",
  "post.quality.hd",
] as const;

/** Valid image model IDs — subset of ModelId for image generation */
export const IMAGE_MODEL_IDS = [
  ModelId.DALL_E_3,
  ModelId.GPT_IMAGE_1,
  ModelId.FLUX_SCHNELL,
  ModelId.FLUX_PRO,
  ModelId.SDXL,
  ModelId.FLUX_2_MAX,
  ModelId.FLUX_2_KLEIN_4B,
  ModelId.RIVERFLOW_V2_PRO,
  ModelId.RIVERFLOW_V2_FAST,
  ModelId.RIVERFLOW_V2_MAX_PREVIEW,
  ModelId.RIVERFLOW_V2_STANDARD_PREVIEW,
  ModelId.SEEDREAM_4_5,
] as const;

export type ImageModelId = (typeof IMAGE_MODEL_IDS)[number];

/** Options array for UI select, built from existing model definitions */
export const ImageModelOptions = getAllModelOptions()
  .filter((m) => (IMAGE_MODEL_IDS as readonly string[]).includes(m.id))
  // eslint-disable-next-line i18next/no-literal-string
  .map((m) => ({ value: m.id, label: m.name }));
