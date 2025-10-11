import { translations as campaignStarterTranslations } from "../../campaign-starter/i18n/de";
import { translations as emailCampaignsTranslations } from "../../email-campaigns/i18n/de";
import { translations as emailsTranslations } from "../../emails/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Kampagnen-Verwaltung",
  tags: {
    campaigns: "Kampagnen",
    management: "Verwaltung",
  },
  campaignStarter: campaignStarterTranslations,
  emailCampaigns: emailCampaignsTranslations,
  emails: emailsTranslations,
};
