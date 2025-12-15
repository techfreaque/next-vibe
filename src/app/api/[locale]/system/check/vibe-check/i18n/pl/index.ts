import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Vibe Check",
  description:
    "Przeprowadź kompleksowe sprawdzenia jakości kodu, w tym linting, sprawdzanie typów i walidację tras",
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
      description: "Automatycznie napraw problemy, które można rozwiązać",
    },
    skipLint: {
      label: "Pomiń Linting",
      description: "Pomiń sprawdzenia ESLint podczas Vibe Check",
    },
    skipTypecheck: {
      label: "Pomiń Sprawdzanie Typów",
      description: "Pomiń sprawdzanie typów TypeScript",
    },
    createConfig: {
      label: "Utwórz Konfigurację",
      description: "Utwórz domyślny check.config.ts jeśli brakuje",
    },
    timeoutSeconds: {
      label: "Limit czasu (sekundy)",
      description: "Maksymalny czas wykonania",
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
        "Konkretne ścieżki do sprawdzenia (zostaw puste dla wszystkich)",
      placeholder:
        "Wybierz ścieżki do sprawdzenia lub zostaw puste dla wszystkich",
      options: {
        src: "Katalog Źródłowy (src/)",
        components: "Komponenty (src/components)",
        utils: "Narzędzia (src/utils)",
        pages: "Strony (src/pages)",
        app: "Katalog App (src/app)",
      },
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
