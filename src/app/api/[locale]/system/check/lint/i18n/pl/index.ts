import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Lint",
  description: "Uruchom ESLint na swojej bazie kodu",
  category: "Sprawdzenia systemu",
  tag: "Lint",
  status: {
    passed: "Zaliczony",
    failed: "Nieudany",
    running: "Uruchomiony",
    skipped: "Pominięty",
  },
  severity: {
    error: "Błąd",
    warning: "Ostrzeżenie",
    info: "Info",
  },
  fixAction: {
    autoFix: "Automatyczna naprawa",
    manualFix: "Ręczna naprawa",
    ignore: "Ignoruj",
  },
  container: {
    title: "Konfiguracja Lint",
    description: "Skonfiguruj parametry lint",
  },
  fields: {
    path: {
      label: "Ścieżka",
      description: "Ścieżka do sprawdzenia",
      placeholder: "Wprowadź ścieżkę do sprawdzenia",
    },
    verbose: {
      label: "Szczegółowy",
      description: "Włącz szczegółowe wyjście",
    },
    fix: {
      label: "Automatyczna naprawa",
      description: "Automatycznie napraw problemy",
    },
    timeoutSeconds: {
      label: "Limit czasu (sekundy)",
      description: "Maksymalny czas wykonania",
    },
    cacheDir: {
      label: "Katalog pamięci podręcznej",
      description: "Katalog dla plików pamięci podręcznej",
    },
    createConfig: {
      label: "Utwórz konfigurację",
      description: "Automatycznie utwórz plik konfiguracyjny, jeśli brakuje",
    },
    limit: {
      label: "Limit",
      description: "Maksymalna liczba problemów do wyświetlenia",
    },
    page: {
      label: "Strona",
      description: "Numer strony do paginacji",
    },
    maxFilesInSummary: {
      label: "Maks. plików w podsumowaniu",
      description: "Maksymalna liczba plików w podsumowaniu",
    },
    skipSorting: {
      label: "Pomiń sortowanie",
      description: "Pomiń sortowanie problemów (wydajność)",
    },
  },
  response: {
    issues: {
      title: "Problemy",
      emptyState: {
        description: "Nie znaleziono problemów",
      },
    },
    success: "Lint zakończony pomyślnie",
    errors: {
      item: {
        file: "Plik",
        line: "Linia",
        column: "Kolumna",
        rule: "Reguła",
        severity: "Poziom",
        message: "Wiadomość",
        title: "Problem Lint",
        type: "Typ",
      },
    },
  },
  errors: {
    validation: {
      title: "Błąd walidacji",
      description: "Nieprawidłowe parametry żądania",
    },
    internal: {
      title: "Błąd wewnętrzny",
      description: "Wystąpił błąd wewnętrzny",
    },
    unauthorized: {
      title: "Brak autoryzacji",
      description: "Wymagana autoryzacja",
    },
    forbidden: {
      title: "Zabronione",
      description: "Dostęp zabroniony",
    },
  },
  success: {
    title: "Sukces",
    description: "Lint zakończony pomyślnie",
  },
  post: {
    title: "Lint",
    description: "Uruchom ESLint na swojej bazie kodu",
    form: {
      title: "Konfiguracja Lint",
      description: "Skonfiguruj parametry lint",
    },
    response: {
      title: "Odpowiedź",
      description: "Dane odpowiedzi lint",
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
    },
    success: {
      title: "Sukces",
      description: "Operacja zakończona pomyślnie",
    },
  },
};
