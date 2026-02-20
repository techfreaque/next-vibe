import { translations as campaignStarterConfigTranslations } from "../../campaign-starter-config/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  campaignStarterConfig: campaignStarterConfigTranslations,
  task: {
    description:
      "Uruchamia kampanie dla nowych leadów, przenosząc je do statusu OCZEKUJĄCE",
  },
  errors: {
    server: {
      title: "Błąd serwera",
      description:
        "Wystąpił błąd podczas przetwarzania żądania startera kampanii",
    },
  },
};
