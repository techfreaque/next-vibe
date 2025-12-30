import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Vibe Check",
  description:
    "Przeprowadź kompleksowe sprawdzenia jakości kodu, w tym linting i sprawdzanie typów",
  category: "Narzędzia Deweloperskie",
  tag: "jakość",

  // Enum translations
  checkType: {
    lint: "Lint",
    typecheck: "Sprawdzanie typów",
    test: "Test",
    structure: "Struktura",
    migration: "Migracja",
    all: "Wszystkie",
  },
  status: {
    pending: "Oczekujące",
    running: "W trakcie",
    passed: "Zaliczone",
    failed: "Nieudane",
    warning: "Ostrzeżenie",
    skipped: "Pominięte",
  },
  severity: {
    error: "Błąd",
    warning: "Ostrzeżenie",
    info: "Info",
    suggestion: "Sugestia",
  },
  fixAction: {
    autoFix: "Automatyczna naprawa",
    manualFix: "Ręczna naprawa",
    ignore: "Ignoruj",
    review: "Przejrzyj",
  },

  container: {
    title: "Konfiguracja Vibe Check",
    description:
      "Skonfiguruj parametry dla kompleksowego sprawdzania jakości kodu",
  },

  fields: {
    fix: {
      label: "Automatyczne Naprawianie Problemów",
      description:
        "Automatycznie napraw problemy lintingu, które można rozwiązać automatycznie",
    },
    skipLint: {
      label: "Pomiń Wszystkie Lintingi",
      description: "Pomiń sprawdzenia ESLint i Oxlint",
    },
    skipEslint: {
      label: "Pomiń ESLint",
      description: "Pomiń sprawdzenia ESLint (Oxlint będzie nadal działać)",
    },
    skipOxlint: {
      label: "Pomiń Oxlint",
      description: "Pomiń sprawdzenia Oxlint (ESLint będzie nadal działać)",
    },
    skipTypecheck: {
      label: "Pomiń Sprawdzanie Typów",
      description: "Pomiń sprawdzanie typów TypeScript",
    },
    createConfig: {
      label: "Utwórz Konfigurację",
      description:
        "Utwórz domyślny plik konfiguracyjny check.config.ts jeśli brakuje",
    },
    timeoutSeconds: {
      label: "Limit czasu (sekundy)",
      description: "Maksymalny czas wykonania w sekundach (1-3600)",
    },
    skipTrpcCheck: {
      label: "Pomiń Sprawdzanie tRPC",
      description: "Pomiń walidację tras tRPC",
    },
    quiet: {
      label: "Tryb Cichy",
      description: "Zmniejsz szczegółowość wyjścia",
    },
    paths: {
      label: "Ścieżki Docelowe",
      description:
        'Konkretne ścieżki plików lub katalogi do sprawdzenia (string lub tablica stringów, zostaw puste aby sprawdzić wszystkie pliki). Przykłady: "src/app" lub ["src/components", "src/utils"]',
      placeholder: "np. src/app lub src/components/Button.tsx",
      options: {
        src: "Katalog Źródłowy (src/)",
        components: "Komponenty (src/components)",
        utils: "Narzędzia (src/utils)",
        pages: "Strony (src/pages)",
        app: "Katalog App (src/app)",
      },
    },
    limit: {
      label: "Limit",
      description: "Liczba problemów na stronę (1-10000, domyślnie: 100)",
    },
    page: {
      label: "Strona",
      description: "Numer strony dla paginowanych wyników (zaczyna się od 1)",
    },
    maxFilesInSummary: {
      label: "Maks. Plików w Podsumowaniu",
      description:
        "Maksymalna liczba plików na liście dotkniętych plików (1-1000)",
    },
  },

  response: {
    success: "Vibe Check zakończony pomyślnie",
    issues: {
      title: "Problemy z Jakością Kodu",
      emptyState: {
        description: "Nie znaleziono problemów - Twój kod ma dobre vibes!",
      },
    },
    summary: {
      title: "Podsumowanie Sprawdzenia",
      description: "Przegląd wyników sprawdzenia jakości kodu",
      totalIssues: "Wszystkie Problemy",
      totalFiles: "Wszystkie Pliki z Problemami",
      totalErrors: "Wszystkie Błędy",
      displayedIssues: "Pokazane Problemy",
      displayedFiles: "Pokazane Pliki",
      truncatedMessage: "Wynik skrócony do limitów",
      currentPage: "Bieżąca Strona",
      totalPages: "Wszystkie Strony",
      files: {
        title: "Dotknięte Pliki",
        file: "Ścieżka Pliku",
        errors: "Błędy",
        warnings: "Ostrzeżenia",
        total: "Wszystkie Problemy",
      },
    },
  },

  errors: {
    validation: {
      title: "Nieprawidłowe Parametry",
      description: "Parametry Vibe Check są nieprawidłowe",
    },
    internal: {
      title: "Błąd Wewnętrzny",
      description: "Wystąpił błąd wewnętrzny podczas Vibe Check",
    },
    unauthorized: {
      title: "Brak Autoryzacji",
      description: "Nie masz uprawnień do uruchomienia Vibe Check",
    },
    forbidden: {
      title: "Zabronione",
      description: "Dostęp do Vibe Check jest zabroniony",
    },
    notFound: {
      title: "Nie Znaleziono",
      description: "Zasób Vibe Check nie został znaleziony",
    },
    server: {
      title: "Błąd Serwera",
      description: "Wystąpił błąd serwera podczas Vibe Check",
    },
    unknown: {
      title: "Nieznany Błąd",
      description: "Wystąpił nieznany błąd podczas Vibe Check",
    },
    unsaved: {
      title: "Niezapisane Zmiany",
      description: "Masz niezapisane zmiany, które mogą wpłynąć na Vibe Check",
    },
    conflict: {
      title: "Konflikt",
      description: "Wystąpił konflikt podczas Vibe Check",
    },
  },

  success: {
    title: "Vibe Check Zakończony",
    description: "Vibe Check zakończony pomyślnie",
  },
};
