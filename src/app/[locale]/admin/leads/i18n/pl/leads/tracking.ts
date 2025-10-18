import type { translations as EnglishTrackingTranslations } from "../../en/leads/tracking";

export const translations: typeof EnglishTrackingTranslations = {
  errors: {
    missingId: "ID leada jest wymagane do śledzenia",
    invalidIdFormat: "ID leada musi być w prawidłowym formacie UUID",
    invalidCampaignIdFormat: "ID kampanii musi być w prawidłowym formacie UUID",
    invalidUrl: "Nieprawidłowy format URL",
  },
};
