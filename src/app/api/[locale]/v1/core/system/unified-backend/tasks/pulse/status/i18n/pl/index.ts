import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Punkt końcowy API",
  tags: {
    status: "Status",
  },
  get: {
    title: "Status Pulsu",
    description: "Pobierz status monitorowania zdrowia pulsu",
    container: {
      title: "Status Zdrowia Pulsu",
      description: "Monitoruj zdrowie wykonywania pulsu i statystyki",
    },
    fields: {
      status: {
        title: "Status",
        label: "Status Pulsu",
        description: "Aktualny status zdrowia pulsu",
      },
      lastPulseAt: {
        title: "Ostatni Puls O",
        label: "Ostatni Puls",
        description: "Znacznik czasu ostatniego wykonania pulsu",
      },
      successRate: {
        title: "Wskaźnik Sukcesu",
        label: "Wskaźnik Sukcesu",
        description: "Procent udanych wykonań pulsu",
      },
      totalExecutions: {
        title: "Łączne Wykonania",
        label: "Łączne Wykonania",
        description: "Łączna liczba wykonań pulsu",
      },
    },
    examples: {
      basic: {
        title: "Podstawowe Żądanie Statusu",
      },
      success: {
        title: "Udana Odpowiedź Statusu",
      },
    },
    errors: {
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Wymagana autoryzacja",
      },
      internal: {
        title: "Błąd Wewnętrzny",
        description: "Wystąpił błąd wewnętrzny serwera",
      },
      unknown: {
        title: "Nieznany Błąd",
        description: "Wystąpił nieznany błąd",
      },
      network: {
        title: "Błąd Sieci",
        description: "Wystąpił błąd sieci",
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
      unsaved: {
        title: "Niezapisane Zmiany",
        description: "Istnieją niezapisane zmiany",
      },
      validation: {
        title: "Błąd Walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
    },
    success: {
      title: "Sukces",
      description: "Operacja zakończona pomyślnie",
    },
  },
};
