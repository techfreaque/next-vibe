/**
 * Video Generation Enums
 */

import { createEnumOptions } from "next-vibe/system/unified-interface/shared/field/enum";

import { scopedTranslation } from "./i18n";

export const {
  enum: VideoDuration,
  options: VideoDurationOptions,
  Value: VideoDurationValue,
} = createEnumOptions(scopedTranslation, {
  SHORT: "post.duration.short",
  MEDIUM: "post.duration.medium",
  LONG: "post.duration.long",
});

export const DEFAULT_VIDEO_DURATION = VideoDuration.SHORT;

export const VIDEO_DURATION_VALUES = [
  VideoDuration.SHORT,
  VideoDuration.MEDIUM,
  VideoDuration.LONG,
] as const;

/** Duration in seconds mapped from enum values */
export const VIDEO_DURATION_SECONDS: Record<string, number> = {
  [VideoDuration.SHORT]: 5,
  [VideoDuration.MEDIUM]: 10,
  [VideoDuration.LONG]: 15,
};
