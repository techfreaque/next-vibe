import { translations as campaignStarterTranslations } from "../../campaign-starter/i18n/pl";
import { translations as emailCampaignsTranslations } from "../../email-campaigns/i18n/pl";
import { translations as emailsTranslations } from "../../emails/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Zarządzanie Kampaniami",
  tags: {
    campaigns: "Kampanie",
    management: "Zarządzanie",
  },
  campaignStarter: campaignStarterTranslations,
  emailCampaigns: emailCampaignsTranslations,
  emails: emailsTranslations,
};
