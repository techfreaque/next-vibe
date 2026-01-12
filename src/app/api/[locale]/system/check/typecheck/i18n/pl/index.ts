import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  // Main endpoint properties
  title: "Sprawdzanie typów TypeScript",
  description:
    "Uruchom sprawdzanie typów TypeScript dla określonych plików lub katalogów",
  category: "Sprawdzenia systemowe",
  tag: "sprawdzanie-typów",

  // Enum translations
  status: {
    passed: "Zaliczone",
    failed: "Nieudane",
    running: "W trakcie",
    skipped: "Pominięte",
  },
  severity: {
    error: "Błąd",
    warning: "Ostrzeżenie",
    info: "Info",
  },
  mode: {
    full: "Pełny",
    incremental: "Przyrostowy",
    watch: "Obserwuj",
  },

  // Container
  container: {
    title: "Konfiguracja sprawdzania typów TypeScript",
    description:
      "Skonfiguruj parametry dla uruchomienia sprawdzania typów TypeScript",
  },

  // Request fields
  fields: {
    path: {
      label: "Ścieżka",
      description:
        "Ścieżka pliku lub katalogu do sprawdzenia (opcjonalne, domyślnie bieżący katalog)",
      placeholder: "src/components",
    },
    verbose: {
      label: "Szczegółowy",
      description: "Włącz szczegółowe wyjście z dodatkowymi informacjami",
    },
    disableFilter: {
      label: "Wyłącz filtr",
      description: "Wyłącz filtrowanie i pokaż wszystkie problemy TypeScript",
    },
    createConfig: {
      label: "Utwórz konfigurację",
      description: "Automatycznie utwórz plik konfiguracyjny, jeśli brakuje",
    },
    timeout: {
      label: "Limit czasu (sekundy)",
      description: "Maksymalny czas wykonania w sekundach",
    },
    limit: {
      label: "Limit",
      description: "Maksymalna liczba problemów do wyświetlenia",
    },
    page: {
      label: "Strona",
      description: "Numer strony do paginacji",
    },
    skipSorting: {
      label: "Pomiń sortowanie",
      description: "Pomiń sortowanie problemów (wydajność)",
    },
  },

  // Response fields
  response: {
    issues: {
      title: "Problemy",
      emptyState: {
        description: "Nie znaleziono problemów",
      },
    },
    success: "Sprawdzanie typów TypeScript zakończone pomyślnie",
    successMessage: "Sprawdzanie typów TypeScript zakończone pomyślnie",
    issue: {
      title: "Problem TypeScript",
      description: "Indywidualny problem sprawdzania typów TypeScript",
      file: "Ścieżka pliku, w którym znaleziono problem",
      line: "Numer linii problemu",
      column: "Numer kolumny problemu",
      code: "Kod błędu TypeScript",
      severity: "Poziom ważności problemu",
      type: "Typ problemu",
      message: "Komunikat opisu problemu",
    },
  },

  // Error messages
  errors: {
    validation: {
      title: "Błąd walidacji",
      description: "Podano nieprawidłowe parametry żądania",
    },
    internal: {
      title: "Błąd wewnętrzny",
      description: "Wystąpił wewnętrzny błąd serwera podczas sprawdzania typów",
    },
    unauthorized: {
      title: "Brak autoryzacji",
      description: "Wymagana autoryzacja, aby uzyskać dostęp do tego endpointu",
    },
    forbidden: {
      title: "Zabronione",
      description: "Dostęp do tego endpointu jest zabroniony",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Określony zasób nie został znaleziony",
    },
    server: {
      title: "Błąd serwera",
      description: "Wystąpił wewnętrzny błąd serwera",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieznany błąd",
    },
    unsaved: {
      title: "Niezapisane zmiany",
      description: "Istnieją niezapisane zmiany, które muszą zostać obsłużone",
    },
    conflict: {
      title: "Konflikt",
      description: "Wystąpił konflikt danych",
    },
    noTsFiles: {
      title: "Nie znaleziono plików TypeScript",
      message: "Nie znaleziono plików TypeScript w określonej ścieżce",
    },
    invalidCommand: {
      title: "Nieprawidłowe polecenie",
      message:
        "Polecenie sprawdzania TypeScript jest nieprawidłowe lub brakuje",
    },
  },

  // Success messages
  success: {
    title: "Sprawdzanie typów zakończone",
    description: "Sprawdzanie typów TypeScript zakończone pomyślnie",
  },
};
