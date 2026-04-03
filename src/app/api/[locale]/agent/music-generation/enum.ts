/**
 * Music Generation Enums
 */

import { createEnumOptions } from "next-vibe/system/unified-interface/shared/field/enum";

import { scopedTranslation } from "./i18n";

export const {
  enum: MusicDuration,
  options: MusicDurationOptions,
  Value: MusicDurationValue,
} = createEnumOptions(scopedTranslation, {
  SHORT: "post.duration.short",
  MEDIUM: "post.duration.medium",
  LONG: "post.duration.long",
});

export const DEFAULT_MUSIC_DURATION = MusicDuration.MEDIUM;

/** Duration in seconds mapped from enum values */
export const MUSIC_DURATION_SECONDS: Record<string, number> = {
  [MusicDuration.SHORT]: 8,
  [MusicDuration.MEDIUM]: 20,
  [MusicDuration.LONG]: 30,
};
