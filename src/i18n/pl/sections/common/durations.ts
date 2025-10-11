import type { durationsTranslations as EnglishDurationsTranslations } from "../../../en/sections/common/durations";

export const durationsTranslations: typeof EnglishDurationsTranslations = {
  businessForm: {
    completion: "~{{minutes}} minut",
    completionEmail: "~{{minutes}} minut",
  },
  consultation: {
    duration: "{{minDuration}}-{{maxDuration}} minut",
    durationEmail: "{{minDuration}}-{{maxDuration}} minut",
  },
};
