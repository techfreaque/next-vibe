import { translations as campaignStarterConfigTranslations } from "../../campaign-starter-config/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Zarządzanie Kampaniami",

  campaignStarterConfig: campaignStarterConfigTranslations,
  tag: "Starter kampanii",
  task: {
    description:
      "Uruchamia kampanie dla nowych leadów, przenosząc je do statusu OCZEKUJĄCE",
  },
  post: {
    title: "Starter kampanii",
    description: "Uruchom kampanie dla nowych leadów",
    container: {
      title: "Konfiguracja startera kampanii",
      description: "Skonfiguruj parametry startera kampanii",
    },
    fields: {
      dryRun: {
        label: "Próbny przebieg",
        description: "Uruchom bez wprowadzania zmian",
      },
    },
    response: {
      leadsProcessed: "Przetworzone leady",
      leadsStarted: "Uruchomione leady",
      leadsSkipped: "Pominięte leady",
      executionTimeMs: "Czas wykonania (ms)",
    },
    errors: {
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Wymagane uwierzytelnienie",
      },
      forbidden: {
        title: "Zabroniony",
        description: "Dostęp zabroniony",
      },
      server: {
        title: "Błąd serwera",
        description:
          "Wystąpił błąd podczas przetwarzania żądania startera kampanii",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
    },
    success: {
      title: "Starter kampanii zakończony",
      description: "Starter kampanii został uruchomiony pomyślnie",
    },
  },
  widget: {
    title: "Uruchom starter kampanii",
    description:
      "Ręcznie uruchom starter kampanii, aby przetworzyć kwalifikujące się leady i rozpocząć sekwencje e-mail.",
    runButton: "Uruchom kampanie",
    running: "Uruchamianie...",
    done: "Gotowe",
  },
  errors: {
    server: {
      title: "Błąd serwera",
      description:
        "Wystąpił błąd podczas przetwarzania żądania startera kampanii",
    },
  },
};
