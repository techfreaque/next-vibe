import type { translations as enTranslations } from "../en";

/**
*

* Enhanced Template Stats API translations for Polish
*/

export const translations: typeof enTranslations = {
  enhancedStats: {
    title: "Pobierz rozszerzone statystyki szablonów",
    description: "Pobierz kompleksowe statystyki szablonów z zaawansowanym filtrowaniem",
    category: "API szablonów",
    tags: {
      analytics: "Analityka",
      statistics: "Statystyki",
    },
    form: {
      title: "Żądanie statystyk",
      description: "Skonfiguruj parametry dla statystyk szablonów",
    },

    // Time period options
    timePeriod: {
      label: "Okres czasu",
      description: "Wybierz okres czasu dla statystyk",
      placeholder: "Wybierz okresy czasu",
      day: "Dzień",
      week: "Tydzień",
      month: "Miesiąc",
      quarter: "Kwartał",
      year: "Rok",
    },

    // Date range preset options
    dateRangePreset: {
      label: "Predefiniowany zakres dat",
      description: "Wybierz predefiniowany zakres dat",
      placeholder: "Wybierz zakres dat",
      last_7_days: "Ostatnie 7 dni",
      last_30_days: "Ostatnie 30 dni",
      last_90_days: "Ostatnie 90 dni",
      last_12_months: "Ostatnie 12 miesięcy",
      this_month: "Ten miesiąc",
      last_month: "Poprzedni miesiąc",
      this_quarter: "Ten kwartał",
      last_quarter: "Poprzedni kwartał",
      this_year: "Ten rok",
      last_year: "Poprzedni rok",
    },

    // Chart type options
    chartType: {
      label: "Typ wykresu",
      description: "Wybierz typ wizualizacji",
      placeholder: "Wybierz typy wykresów",
      line: "Wykres liniowy",
      bar: "Wykres słupkowy",
      pie: "Wykres kołowy",
    },

    // Date filters
    dateFrom: {
      label: "Od daty",
      description: "Data początkowa dla statystyk",
      placeholder: "Wybierz datę początkową",
    },
    dateTo: {
      label: "Do daty",
      description: "Data końcowa dla statystyk",
      placeholder: "Wybierz datę końcową",
    },

    // Status filter
    status: {
      label: "Status szablonu",
      description: "Filtruj według statusu szablonu",
      placeholder: "Wybierz statusy",
    },

    // User filter
    userId: {
      label: "ID użytkownika",
      description: "Filtruj według konkretnego użytkownika",
      placeholder: "Wprowadź ID użytkownika",
    },

    // Tags filter
    tagsFilter: {
      label: "Tagi",
      description: "Filtruj według tagów szablonu",
      placeholder: "Wybierz tagi",
    },

    // Content filters
    hasDescription: {
      label: "Ma opis",
      description: "Filtruj szablony z opisami",
    },
    hasContent: {
      label: "Ma zawartość",
      description: "Filtruj szablony z zawartością",
    },
    contentLengthMin: {
      label: "Minimalna długość zawartości",
      description: "Minimalna liczba znaków",
      placeholder: "Wprowadź minimalną długość",
    },
    contentLengthMax: {
      label: "Maksymalna długość zawartości",
      description: "Maksymalna liczba znaków",
      placeholder: "Wprowadź maksymalną długość",
    },

    // Date range filters
    createdAfter: {
      label: "Utworzono po",
      description: "Szablony utworzone po tej dacie",
      placeholder: "Wybierz datę",
    },
    createdBefore: {
      label: "Utworzono przed",
      description: "Szablony utworzone przed tą datą",
      placeholder: "Wybierz datę",
    },
    updatedAfter: {
      label: "Zaktualizowano po",
      description: "Szablony zaktualizowane po tej dacie",
      placeholder: "Wybierz datę",
    },
    updatedBefore: {
      label: "Zaktualizowano przed",
      description: "Szablony zaktualizowane przed tą datą",
      placeholder: "Wybierz datę",
    },

    // Search and display
    search: {
      label: "Szukaj",
      description: "Szukaj w nazwach i opisach szablonów",
      placeholder: "Wprowadź frazę wyszukiwania",
    },
    includeComparison: {
      label: "Uwzględnij porównanie",
      description: "Porównaj z poprzednim okresem",
    },
    comparisonPeriod: {
      label: "Okres porównawczy",
      description: "Okres do porównania",
      placeholder: "Wybierz okres porównawczy",
    },

    // Response
    response: {
      title: "Statystyki szablonów",
      description: "Kompleksowe statystyki użycia szablonów",
    },

    // Debug messages
    debug: {
      getting: "Pobieranie rozszerzonych statystyk szablonów",
      retrieved: "Rozszerzone statystyki szablonów pobrane pomyślnie",
    },

    // Errors
    errors: {
      validation: {
        title: "Nieprawidłowe parametry",
        description: "Podane parametry nie są prawidłowe",
      },
      unauthorized: {
        title: "Nieautoryzowany dostęp",
        description: "Nie masz uprawnień do przeglądania statystyk",
      },
      forbidden: {
        title: "Dostęp zabroniony",
        description: "Nie masz uprawnień do dostępu do tych statystyk",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się wygenerować statystyk",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można połączyć się z serwerem",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany, które zostaną utracone",
      },
      conflict: {
        title: "Błąd konfliktu",
        description: "Operacja koliduje z aktualnym stanem",
      },
    },

    // Success
    success: {
      title: "Statystyki wygenerowane",
      description: "Statystyki szablonów wygenerowane pomyślnie",
    },
  },
};