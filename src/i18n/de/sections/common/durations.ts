import type { durationsTranslations as EnglishDurationsTranslations } from "../../../en/sections/common/durations";

export const durationsTranslations: typeof EnglishDurationsTranslations = {
  businessForm: {
    completion: "~{{minutes}} Minuten",
    completionEmail: "~{{minutes}} Minuten",
  },
  consultation: {
    duration: "{{minDuration}}-{{maxDuration}} Minuten",
    durationEmail: "{{minDuration}}-{{maxDuration}} Minuten",
  },
};
