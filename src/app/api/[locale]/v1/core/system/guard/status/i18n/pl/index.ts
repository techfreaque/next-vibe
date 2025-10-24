import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Guard",
  post: {
    title: "Status Strażnika",
    description: "Sprawdź status środowiska strażnika",
    tag: "Status",
    container: {
      title: "Konfiguracja Statusu Strażnika",
      description: "Skonfiguruj parametry sprawdzania statusu",
    },
    fields: {
      projectPath: {
        title: "Ścieżka Projektu",
        description: "Ścieżka do projektu strażnika",
        placeholder: "/ścieżka/do/projektu",
      },
      guardId: {
        title: "ID Strażnika",
        description: "Unikalny identyfikator strażnika",
        placeholder: "guard-123",
      },
      listAll: {
        title: "Wyświetl Wszystkich Strażników",
        description: "Wyświetl wszystkie środowiska strażników",
      },
      success: {
        title: "Sukces",
      },
      output: {
        title: "Wynik",
      },
      guards: {
        title: "Strażnicy",
      },
      totalGuards: {
        title: "Łącznie Strażników",
      },
      activeGuards: {
        title: "Aktywni Strażnicy",
      },
    },
    form: {
      title: "Konfiguracja Statusu",
      description: "Skonfiguruj parametry statusu",
    },
    response: {
      title: "Odpowiedź",
      description: "Dane odpowiedzi",
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autoryzacja",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił wewnętrzny błąd serwera",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp zabroniony",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Zasób nie został znaleziony",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt danych",
      },
      internal: {
        title: "Błąd wewnętrzny",
        description: "Wystąpił wewnętrzny błąd serwera",
      },
    },
    success: {
      title: "Sukces",
      description: "Operacja zakończona pomyślnie",
    },
  },
};
