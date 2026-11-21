/**
 * Stored request settings of a Studio generation: the form values minus the
 * Studio flag and uploaded files, so "Run again" can prefill the same form.
 *
 * Client-safe: no server-only imports.
 */

import { z } from "zod";

export const studioSettingsSchema = z.record(z.string(), z.json());

export type StudioSettings = z.infer<typeof studioSettingsSchema>;

type StudioSettingValue = StudioSettings[string];

/** Drops the Studio flag and unset values; callers leave out files. */
export function toStudioSettings(
  data: Partial<Record<string, StudioSettingValue | undefined>>,
): StudioSettings {
  const settings: StudioSettings = {};
  for (const [key, value] of Object.entries(data)) {
    if (key !== "saveToStudio" && value !== undefined) {
      settings[key] = value;
    }
  }
  return settings;
}
