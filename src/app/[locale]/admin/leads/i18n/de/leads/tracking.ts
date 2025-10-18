import type { translations as EnglishTrackingTranslations } from "../../en/leads/tracking";

export const translations: typeof EnglishTrackingTranslations = {
  errors: {
    missingId: "Lead-ID ist für das Tracking erforderlich",
    invalidIdFormat: "Lead-ID muss ein gültiges UUID-Format haben",
    invalidCampaignIdFormat: "Kampagnen-ID muss ein gültiges UUID-Format haben",
    invalidUrl: "Ungültiges URL-Format angegeben",
  },
};
