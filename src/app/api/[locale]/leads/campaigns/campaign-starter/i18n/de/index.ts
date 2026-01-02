import { translations as campaignStarterConfigTranslations } from "../../campaign-starter-config/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  campaignStarterConfig: campaignStarterConfigTranslations,
  errors: {
    server: {
      title: "Serverfehler",
      description: "Bei der Verarbeitung der Kampagnenstarter-Anfrage ist ein Fehler aufgetreten",
    },
  },
};
