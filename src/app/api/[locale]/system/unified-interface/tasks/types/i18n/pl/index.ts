import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Typy Zadań",
    description: "Pobierz definicje typów zadań i metadane",
    container: {
      title: "Zarządzanie Typami Zadań",
      description: "Zarządzaj i pobieraj definicje typów zadań",
    },
    fields: {
      operation: {
        label: "Operacja",
        description: "Typ operacji do wykonania",
      },
      category: {
        label: "Kategoria",
        description: "Kategoria zadania do filtrowania",
      },
      format: {
        label: "Format",
        description: "Format wyjściowy dla odpowiedzi",
      },
    },
    operation: {
      list: "Lista Typów",
      validate: "Waliduj Typy",
      export: "Eksportuj Typy",
    },
    category: {
      cron: "Zadania Cron",
      side: "Zadania Poboczne",
      config: "Konfiguracja",
      execution: "Wykonanie",
    },
    format: {
      json: "JSON",
      typescript: "TypeScript",
      schema: "Schemat",
    },
    response: {
      success: {
        title: "Sukces",
      },
      types: {
        title: "Typy",
      },
      metadata: {
        title: "Metadane",
      },
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
      internal: {
        title: "Błąd wewnętrzny",
        description: "Wystąpił wewnętrzny błąd serwera",
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
      unsaved: {
        title: "Niezapisane zmiany",
        description: "Istnieją niezapisane zmiany",
      },
    },
    success: {
      title: "Sukces",
      description: "Operacja zakończona pomyślnie",
    },
  },
};
