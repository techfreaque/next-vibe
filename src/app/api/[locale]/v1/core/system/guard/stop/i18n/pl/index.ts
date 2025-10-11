import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Zatrzymaj Guard",
  description: "Zatrzymaj środowiska guard dla projektów VSCode",
  tag: "guard",

  container: {
    title: "Konfiguracja Zatrzymania Guard",
    description: "Skonfiguruj parametry do zatrzymania środowisk guard",
  },

  fields: {
    projectPath: {
      title: "Ścieżka Projektu",
      description: "Ścieżka do katalogu projektu",
      placeholder: "/ścieżka/do/twojego/projektu",
    },
    guardId: {
      title: "ID Guard",
      description: "Określone ID guard do zatrzymania",
      placeholder: "guard_projekt_abc123",
    },
    stopAll: {
      title: "Zatrzymaj Wszystkie Guards",
      description: "Zatrzymaj wszystkie działające środowiska guard",
    },
    force: {
      title: "Wymuś Zatrzymanie",
      description: "Wymuś zatrzymanie nawet jeśli guard nie odpowiada",
    },
    success: {
      title: "Operacja Udana",
    },
    output: {
      title: "Wyjście Polecenia",
    },
    stoppedGuards: {
      title: "Zatrzymane Guards",
    },
    totalStopped: {
      title: "Łącznie Zatrzymanych",
    },
  },

  errors: {
    validation: {
      title: "Błąd Walidacji",
      description: "Nieprawidłowe parametry żądania",
    },
    internal: {
      title: "Błąd Wewnętrzny",
      description: "Wystąpił błąd wewnętrzny serwera",
    },
    unauthorized: {
      title: "Brak Autoryzacji",
      description: "Wymagana autoryzacja",
    },
    forbidden: {
      title: "Zabronione",
      description: "Dostęp zabroniony",
    },
    notFound: {
      title: "Nie Znaleziono",
      description: "Zasób nie został znaleziony",
    },
    conflict: {
      title: "Konflikt",
      description: "Wystąpił konflikt danych",
    },
  },

  success: {
    title: "Sukces",
    description: "Operacja zatrzymania guard zakończona pomyślnie",
  },
};
