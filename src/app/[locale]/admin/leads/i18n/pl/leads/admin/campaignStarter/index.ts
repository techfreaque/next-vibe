import type { translations as enTranslations } from "../../../../en/leads/admin/campaignStarter";
import { translations as formTranslations } from "./form";
import { translations as settingsTranslations } from "./settings";

export const translations: typeof enTranslations = {
  form: formTranslations,
  settings: settingsTranslations,
  title: "Konfiguracja Startera Kampanii",
  description: "Konfiguruj ustawienia zadania cron startera kampanii",
};
