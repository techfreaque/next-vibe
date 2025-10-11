import type { campaignStarterTranslations as EnglishCampaignStarterTranslations } from "../../../../../en/sections/leads/admin/campaignStarter";
import { formTranslations } from "./form";
import { settingsTranslations } from "./settings";

export const campaignStarterTranslations: typeof EnglishCampaignStarterTranslations =
  {
    form: formTranslations,
    settings: settingsTranslations,
    title: "Kampagnen-Starter-Konfiguration",
    description:
      "Konfigurieren Sie die Kampagnen-Starter-Cron-Job-Einstellungen",
  };
