/**
 * Music Generation Enums
 */

import { createEnumOptions } from "next-vibe/system/unified-interface/shared/field/enum";

import type { AgentEnvAvailability } from "../env-availability";
import { ModelId, getAllModelOptions } from "../models/models";
import { isProviderAvailable } from "../models/widget/model-selector";
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

export const MUSIC_DURATION_VALUES = [
  MusicDuration.SHORT,
  MusicDuration.MEDIUM,
  MusicDuration.LONG,
] as const;

/** Duration in seconds mapped from enum values */
export const MUSIC_DURATION_SECONDS: Record<string, number> = {
  [MusicDuration.SHORT]: 8,
  [MusicDuration.MEDIUM]: 20,
  [MusicDuration.LONG]: 30,
};

/** Valid music model IDs - subset of ModelId for music generation */
export const MUSIC_MODEL_IDS = [
  ModelId.MUSICGEN_STEREO,
  ModelId.STABLE_AUDIO,
  ModelId.UDIO_V2,
] as const;

export type MusicModelId = (typeof MUSIC_MODEL_IDS)[number];

/** Static options array (all models, no availability filtering) */
export const MusicModelOptions = getAllModelOptions()
  .filter((m) => (MUSIC_MODEL_IDS as readonly string[]).includes(m.id))
  // eslint-disable-next-line i18next/no-literal-string
  .map((m) => ({ value: m.id, label: m.name }));

/**
 * Dynamic model options that respect provider availability.
 * - Admins: all models shown, unavailable ones are disabled.
 * - Non-admins: unavailable models are hidden.
 */
export function getMusicModelOptions(
  envAvailability: AgentEnvAvailability | undefined,
  isAdmin: boolean,
): { value: string; label: string; disabled?: boolean }[] {
  return getAllModelOptions()
    .filter((m) => (MUSIC_MODEL_IDS as readonly string[]).includes(m.id))
    .flatMap((m) => {
      const available = isProviderAvailable(m, envAvailability);
      if (!available && !isAdmin) {
        return [];
      }
      // eslint-disable-next-line i18next/no-literal-string
      return [{ value: m.id, label: m.name, disabled: !available }];
    });
}
