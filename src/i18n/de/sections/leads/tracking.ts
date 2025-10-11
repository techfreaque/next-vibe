import type { trackingTranslations as EnglishTrackingTranslations } from "../../../en/sections/leads/tracking";

export const trackingTranslations: typeof EnglishTrackingTranslations = {
  errors: {
    missingId: "Lead-ID ist für das Tracking erforderlich",
    invalidIdFormat: "Lead-ID muss ein gültiges UUID-Format haben",
    invalidCampaignIdFormat: "Kampagnen-ID muss ein gültiges UUID-Format haben",
    invalidUrl: "Ungültiges URL-Format angegeben",
  },
};
