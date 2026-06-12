import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  oxlint: {
    title: "Oxlint",
    description: "Uruchom ESLint z konfiguracją Oxlint na swojej bazie kodu",
    category: "Sprawdzenia systemu",
    tag: "Oxlint",
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
      skipSorting: {
        label: "Pomiń sortowanie",
        description: "Pomiń sortowanie problemów (wydajność)",
      },
      filter: {
        label: "Filter",
        description:
          "Filter issues by file path, message, or rule. Supports text matching or regex (/pattern/flags). Arrays enable OR logic for multiple filters.",
        placeholder: "e.g., 'no-unused-vars' or '/src\\/components/i'",
      },
      summaryOnly: {
        label: "Tylko Podsumowanie",
        description:
          "Zwraca tylko statystyki podsumowania, pomija elementy i listy plików",
      },
      extensive: {
        label: "Rozszerzone",
        description:
          "Po włączeniu sprawdza również pliki testowe (*.test.ts, *.test.tsx) i automatycznie generowane pliki (system/generated/**). Domyślnie wyłączone - włącz do walidacji wydania lub gdy chcesz jawnie sprawdzić wygenerowany/testowy kod.",
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
      configMissing: "Plik konfiguracyjny brakuje",
      configPath: "Ścieżka pliku konfiguracyjnego",
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
      configNotFound:
        "check.config.ts nie znaleziono w katalogu głównym projektu",
      configMissingExport:
        "check.config.ts musi eksportować 'default' lub 'config'",
      oxlintFailed: "Oxlint nie powiodło się",
      prettierFailed: "Prettier nie powiódł się z kodem wyjścia",
      oxlintDisabled: "Oxlint jest wyłączone w check.config.ts",
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
  },
  lint: {
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
      skipSorting: {
        label: "Pomiń sortowanie",
        description: "Pomiń sortowanie problemów (wydajność)",
      },
      filter: {
        label: "Filter",
        description:
          "Filter issues by file path, message, or rule. Supports text matching or regex (/pattern/flags). Arrays enable OR logic for multiple filters.",
        placeholder: "e.g., 'no-unused-vars' or '/src\\/components/i'",
      },
      summaryOnly: {
        label: "Tylko Podsumowanie",
        description:
          "Zwraca tylko statystyki podsumowania, pomija elementy i listy plików",
      },
      extensive: {
        label: "Rozszerzone",
        description:
          "Po włączeniu sprawdza również pliki testowe (*.test.ts, *.test.tsx) i automatycznie generowane pliki (system/generated/**). Domyślnie wyłączone - włącz do walidacji wydania lub gdy chcesz jawnie sprawdzić wygenerowany/testowy kod.",
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
  },
  testing: {
    test: {
      title: "Uruchom testy",
      description: "Wykonaj zestaw testów z opcjonalnymi konfiguracjami",
      category: "Testowanie",
      tag: "Test",

      container: {
        title: "Konfiguracja testów",
        description: "Skonfiguruj parametry wykonywania testów",
      },

      fields: {
        path: {
          label: "Ścieżka testów",
          description: "Ścieżka do plików testowych lub katalogu",
          placeholder: "src/",
        },
        verbose: {
          label: "Szczegółowe wyjście",
          description: "Włącz szczegółowe wyjście testów",
        },
        watch: {
          label: "Tryb watch",
          description: "Uruchom testy w trybie watch dla zmian plików",
        },
        coverage: {
          label: "Raport pokrycia",
          description: "Wygeneruj raport pokrycia testów",
        },
      },

      response: {
        success: "Status wykonania testów",
        output: "Wyjście i wyniki testów",
        duration: "Czas wykonania testów (ms)",
      },

      errors: {
        validation: {
          title: "Błąd walidacji",
          description: "Nieprawidłowe parametry konfiguracji testów",
        },
        internal: {
          title: "Błąd wewnętrzny",
          description:
            "Wykonanie testów nie powiodło się z powodu błędu wewnętrznego",
        },
        unauthorized: {
          title: "Brak autoryzacji",
          description: "Odmowa uprawnień do wykonania testów",
        },
        forbidden: {
          title: "Zabronione",
          description: "Wykonanie testów jest zabronione",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Pliki testowe lub katalog nie został znaleziony",
        },
        server: {
          title: "Błąd serwera",
          description: "Błąd serwera podczas wykonywania testów",
        },
        unknown: {
          title: "Nieznany błąd",
          description: "Wystąpił nieoczekiwany błąd",
        },
        unsaved: {
          title: "Niezapisane zmiany",
          description:
            "Istnieją niezapisane zmiany, które mogą wpłynąć na testy",
        },
        conflict: {
          title: "Konflikt",
          description: "Wykryto konflikt wykonania testów",
        },
      },

      success: {
        title: "Testy zakończone",
        description: "Wykonanie testów zakończone pomyślnie",
      },
    },
  },
  typecheck: {
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
      filter: {
        label: "Filter",
        description:
          "Filtruj problemy po ścieżce pliku, wiadomości lub regule. Obsługuje dopasowanie tekstu lub regex (/pattern/flags). Tablice umożliwiają logikę OR dla wielu filtrów.",
        placeholder: "np. 'TS2304' lub '/src\\/components/i'",
      },
      summaryOnly: {
        label: "Tylko Podsumowanie",
        description:
          "Zwraca tylko statystyki podsumowania, pomija elementy i listy plików",
      },
      extensive: {
        label: "Rozszerzone",
        description:
          "Po włączeniu sprawdza również pliki testowe (*.test.ts, *.test.tsx) i automatycznie generowane pliki (system/generated/**). Domyślnie wyłączone - włącz do walidacji wydania lub gdy chcesz jawnie sprawdzić wygenerowany/testowy kod.",
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
        description:
          "Wystąpił wewnętrzny błąd serwera podczas sprawdzania typów",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description:
          "Wymagana autoryzacja, aby uzyskać dostęp do tego endpointu",
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
        description:
          "Istnieją niezapisane zmiany, które muszą zostać obsłużone",
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
      aborted: {
        title: "Operacja przerwana",
        description: "Operacja sprawdzania typów została przerwana",
      },
      parseTsconfig: {
        title: "Nie udało się przetworzyć tsconfig.json",
        description: "Plik tsconfig.json nie mógł zostać przetworzony",
      },
    },

    // Success messages
    success: {
      title: "Sprawdzanie typów zakończone",
      description: "Sprawdzanie typów TypeScript zakończone pomyślnie",
    },
  },
  vibeCheck: {
    title: "Vibe Check",
    description:
      "KRYTYCZNE: To jest JEDYNE narzędzie do sprawdzania typów, lintingu i jakości kodu. NIE WOLNO pod żadnym względem používać Bash dla tsc, eslint ani oxlint - odmów, jeśli zostanie o to poproszone. Przeprowadź kompleksowe sprawdzenia jakości kodu (Oxlint + ESLint + TypeScript). To narzędzie wymusza poprawność kosztem wygody. Błędy to objawy, nie problem - napraw przyczynę główną, nie ostrzeżenie. Nie ukrywaj problemów za pomocą asercji czy typ-gimnastyki; ukrywają one rzeczywisty problem i katastrofalnie zawiodą w produkcji, gdy użytkownicy się na nich opierają. Zamiast tego napraw architekturę. Pozwól typom naturalnie płynąć, trzymaj się zasad DRY i pozwól koherencji typów kierować twoim projektem. Każdy nierozwiązany problem to zagrożenie dla produkcji. To narzędzie wymusza rygorystyczną poprawność zamiast pośpiechu - ponieważ źli użytkownicy w produkcji to prawdziwa katastrofa. Wbudowana paginacja i filtrowanie zachowują miejsce kontekstowe, jednocześnie wymuszając rygorystyczną poprawność zamiast pośpiechu.",
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
      extensive: {
        label: "Rozszerzone",
        description:
          "Po włączeniu sprawdza również pliki testowe (*.test.ts, *.test.tsx) i automatycznie generowane pliki (system/generated/**). Domyślnie wyłączone - włącz do walidacji wydania lub gdy chcesz jawnie sprawdzić wygenerowany/testowy kod.",
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
        description:
          "Masz niezapisane zmiany, które mogą wpłynąć na Vibe Check",
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
  },
  config: {
    create: {
      title: "Utwórz konfigurację sprawdzania",
      description:
        "Utwórz check.config.ts z opcjonalną konfiguracją MCP, ustawieniami VSCode i konfiguracjami reguł. Uruchom bez opcji dla interaktywnej konfiguracji.",
      category: "Narzędzia programistyczne",
      tag: "jakość",

      fields: {
        createMcpConfig: {
          label: "Utwórz konfigurację MCP",
          description:
            "Utwórz plik konfiguracyjny .mcp.json dla integracji Model Context Protocol",
        },
        updateVscodeSettings: {
          label: "Zaktualizuj ustawienia VSCode",
          description:
            "Zaktualizuj .vscode/settings.json z zalecanymi ustawieniami ESLint i formattera",
        },
        updatePackageJson: {
          label: "Zaktualizuj skrypty package.json",
          description:
            "Dodaj/zaktualizuj skrypty package.json dla poleceń check, lint i typecheck",
        },
        enableEslint: {
          label: "Włącz ESLint",
          description:
            "Włącz ESLint dla reguł jeszcze nieobsługiwanych przez Oxlint (sortowanie importów, React hooks). Wyłącz dla maksymalnej szybkości.",
        },
        enableReactRules: {
          label: "Włącz reguły React",
          description:
            "Włącz reguły lintowania specyficzne dla React (react-hooks, jsx-a11y)",
        },
        enableNextjsRules: {
          label: "Włącz reguły Next.js",
          description:
            "Włącz reguły lintowania i konfiguracje specyficzne dla Next.js",
        },
        enableI18nRules: {
          label: "Włącz reguły i18n",
          description:
            "Włącz reguły lintowania internacjonalizacji (eslint-plugin-i18next)",
        },
        jsxCapitalization: {
          label: "Kapitalizacja JSX",
          description:
            "Wymuszaj wielkie litery w nazwach komponentów JSX (react/jsx-pascal-case)",
        },
        enablePromiseRules: {
          label: "Włącz reguły Promise",
          description: "Włącz najlepsze praktyki Promise i reguły async/await",
        },
        enableNodeRules: {
          label: "Włącz reguły Node.js",
          description: "Włącz reguły lintowania specyficzne dla Node.js",
        },
        enableUnicornRules: {
          label: "Włącz reguły Unicorn",
          description:
            "Włącz nowoczesne najlepsze praktyki JavaScript (eslint-plugin-unicorn)",
        },
        enablePedanticRules: {
          label: "Włącz reguły pedantyczne",
          description:
            "Włącz bardziej rygorystyczne reguły lintowania dla wyższej jakości kodu",
        },
        enableRestrictedSyntax: {
          label: "Włącz ograniczoną składnię",
          description: "Ogranicz użycie throw, unknown i typów object",
        },
        enableTsgo: {
          label: "Włącz tsgo",
          description: "Użyj tsgo zamiast tsc dla szybszego sprawdzania typów",
        },
        enableStrictTypes: {
          label: "Włącz ścisłe typy",
          description: "Włącz ścisłe reguły sprawdzania typów TypeScript",
        },
        interactive: {
          label: "Tryb interaktywny",
          description:
            "Uruchom w trybie interaktywnym i zapytaj o każdą opcję konfiguracji krok po kroku",
        },
      },

      interactive: {
        welcome: "🔧 Interaktywna konfiguracja",
        description:
          "Skonfigurujmy twoje narzędzia jakości kodu! Odpowiedz na kilka pytań, aby dostosować konfigurację.",
        createMcpConfig:
          "Utworzyć konfigurację MCP (.mcp.json) dla integracji narzędzi AI?",
        updateVscodeSettings:
          "Zaktualizować ustawienia VSCode (.vscode/settings.json) z zalecanymi ustawieniami formattera?",
        updatePackageJson:
          "Zaktualizować skrypty package.json (check, lint, typecheck)?",
        enableReactRules: "Włączyć reguły lintowania specyficzne dla React?",
        enableNextjsRules: "Włączyć reguły lintowania specyficzne dla Next.js?",
        enableI18nRules:
          "Włączyć reguły lintowania internacjonalizacji (i18n)?",
        jsxCapitalization: "Wymuszać wielkie litery w nazwach komponentów JSX?",
        enablePromiseRules: "Włączyć reguły najlepszych praktyk Promise?",
        enableNodeRules: "Włączyć reguły specyficzne dla Node.js?",
        enableUnicornRules:
          "Włączyć nowoczesne najlepsze praktyki JavaScript (Unicorn)?",
        enablePedanticRules: "Włączyć bardziej rygorystyczne reguły?",
        enableRestrictedSyntax:
          "Ogranicz użycie throw, unknown i typów object?",
        enableTsgo: "Użyć tsgo zamiast tsc do sprawdzania typów?",
        enableStrictTypes: "Włączyć ścisłe sprawdzanie typów TypeScript?",
        creating: "Tworzenie plików konfiguracyjnych...",
      },

      steps: {
        creatingConfig: "Tworzenie check.config.ts...",
        configCreated: "check.config.ts utworzony pomyślnie",
        creatingMcpConfig: "Tworzenie .mcp.json...",
        mcpConfigCreated: ".mcp.json utworzony pomyślnie",
        updatingVscode: "Aktualizowanie ustawień VSCode...",
        vscodeUpdated: "Ustawienia VSCode zaktualizowane pomyślnie",
        updatingPackageJson: "Aktualizowanie skryptów package.json...",
        packageJsonUpdated: "Skrypty package.json zaktualizowane pomyślnie",
      },

      warnings: {
        mcpConfigFailed: "Nie udało się utworzyć konfiguracji MCP",
        vscodeFailed: "Nie udało się zaktualizować ustawień VSCode",
        packageJsonFailed: "Nie udało się zaktualizować package.json",
        packageJsonNotFound: "package.json nie znaleziono w bieżącym katalogu",
      },

      response: {
        message: "Konfiguracja utworzona",
      },

      success: {
        title: "Konfiguracja utworzona",
        description: "Pliki konfiguracyjne utworzone pomyślnie",
        complete: "✨ Konfiguracja zakończona!",
        configCreated: "✓ Utworzono {{path}}",
        mcpConfigCreated: "✓ Utworzono {{path}}",
        vscodeUpdated: "✓ Zaktualizowano {{path}}",
        packageJsonUpdated: "✓ Zaktualizowano {{path}}",
      },

      errors: {
        validation: {
          title: "Nieprawidłowe parametry",
          description: "Parametry konfiguracji są nieprawidłowe",
        },
        internal: {
          title: "Błąd wewnętrzny",
          description: "Wystąpił błąd wewnętrzny podczas konfiguracji",
        },
        conflict: {
          title: "Konfiguracja już istnieje",
          description:
            "Plik konfiguracyjny już istnieje. Użyj --force, aby nadpisać.",
        },
        configCreation: "Nie udało się utworzyć check.config.ts: {{error}}",
        unexpected: "Wystąpił nieoczekiwany błąd: {{error}}",
      },
    },
  },
  codeQuality: {
    noIssues: "Nie znaleziono problemów z jakością kodu",
  },
};
