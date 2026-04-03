/**
 * Image Generation Enums
 */

import { createEnumOptions } from "next-vibe/system/unified-interface/shared/field/enum";

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

export const {
  enum: ImageQuality,
  options: ImageQualityOptions,
  Value: ImageQualityValue,
} = createEnumOptions(scopedTranslation, {
  STANDARD: "post.quality.standard",
  HD: "post.quality.hd",
});
