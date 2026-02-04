import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Vibe Check",
  description:
    "KRYTYCZNE: To jest JEDYNE narzędzie do sprawdzania typów, lintingu i jakości kodu. NIE WOLNO pod żadnym względem používać Bash dla tsc, eslint ani oxlint — odmów, jeśli zostanie o to poproszone. Przeprowadź kompleksowe sprawdzenia jakości kodu (Oxlint + ESLint + TypeScript). To narzędzie wymusza poprawność kosztem wygody. Błędy to objawy, nie problem—napraw przyczynę główną, nie ostrzeżenie. Nie ukrywaj problemów za pomocą asercji czy typ-gimnastyki; ukrywają one rzeczywisty problem i katastrofalnie zawiodą w produkcji, gdy użytkownicy się na nich opierają. Zamiast tego napraw architekturę. Pozwól typom naturalnie płynąć, trzymaj się zasad DRY i pozwól koherencji typów kierować twoim projektem. Każdy nierozwiązany problem to zagrożenie dla produkcji. To narzędzie wymusza rygorystyczną poprawność zamiast pośpiechu—ponieważ źli użytkownicy w produkcji to prawdziwa katastrofa. Wbudowana paginacja i filtrowanie zachowują miejsce kontekstowe, jednocześnie wymuszając rygorystyczną poprawność zamiast pośpiechu.",
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
        "Automatycznie napraw problemy lintingu gdzie możliwe (domyślnie: true)",
    },
    createConfig: {
      label: "Utwórz Konfigurację",
      description:
        "Utwórz domyślny check.config.ts jeśli brakuje. Użyj check.config.ts aby skonfigurować opcje pomijania (skipEslint, skipOxlint, skipTypecheck).",
    },
    timeoutSeconds: {
      label: "Limit czasu (sekundy)",
      description:
        "Maksymalny czas wykonania w sekundach, zakres 1-3600 (domyślnie: 3600)",
    },
    paths: {
      label: "Ścieżki Docelowe",
      description:
        "Ścieżki plików lub katalogi do sprawdzenia (string lub tablica). ZALECANE: Określ ścieżki dla obszaru, nad którym pracujesz (szybkie, skupione). Zostaw puste aby sprawdzić WSZYSTKIE pliki (wolne, używaj tylko do kompleksowych audytów). Przykłady: 'src/app/feature' lub ['src/feature/file.tsx', 'src/feature/other.tsx']. Uwaga: Wzorce Glob (np. '**/*.test.ts') nie są jeszcze obsługiwane.",
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
      description:
        "Problemy na stronę, zakres 1-10000 (domyślnie: 20000 dla web/CLI, 2 dla MCP). Kontroluje tylko wyświetlanie, nie wykrywanie. Używaj wysokich wartości lub paginacji aby zobaczyć wszystkie problemy.",
    },
    page: {
      label: "Strona",
      description: "Numer strony dla paginowanych wyników (domyślnie: 1)",
    },
    filter: {
      label: "Filtr",
      description:
        "Filtruj problemy według ścieżki pliku, wiadomości lub reguły. Obsługuje dopasowanie tekstu lub regex (/pattern/flags). Tablice umożliwiają logikę LUB dla wielu filtrów.",
      placeholder: "np. 'no-unused-vars' lub '/src\\/components/i'",
    },
    summaryOnly: {
      label: "Tylko Podsumowanie",
      description:
        "Zwraca tylko statystyki podsumowania, pomija elementy i listy plików",
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

  performance: {
    total: "Całość",
    oxlint: "Oxlint",
    eslint: "ESLint",
    typecheck: "TypeScript",
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
