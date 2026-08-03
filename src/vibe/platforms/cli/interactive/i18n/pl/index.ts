import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  capture: {
    title: "Przechwycenie ramki interaktywnej",
    titleShort: "Przechwyć ramkę",
    description:
      "Odczytaj aktualną wyrenderowaną ramkę z uruchomionej sesji interaktywnej vibe",
    form: {
      fields: {
        pid: {
          label: "PID sesji",
          description:
            "PID sesji interaktywnej. Automatyczne wykrywanie gdy pominięty.",
        },
      },
    },
    response: {
      fields: {
        content: "Zawartość ramki",
        logs: "Logi błędów",
        pid: "PID sesji",
      },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autentykacja",
      },
      server: {
        title: "Błąd serwera",
        description: "Wewnętrzny błąd serwera",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci",
      },
      forbidden: {
        title: "Zabronione",
        description: "Brak dostępu",
      },
      notFound: {
        title: "Brak sesji",
        description: "Nie znaleziono aktywnej sesji interaktywnej",
        noSession:
          "Żadna sesja interaktywna nie działa. Uruchom ją: vibe <alias> -i --agent-control",
        deadSession: "Sesja o PID {{pid}} już nie działa.",
        frameNotFound:
          "Sesja {{pid}} nie wyrenderowała jeszcze ramki. Poczekaj chwilę i spróbuj ponownie.",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      conflict: {
        title: "Konflikt",
        description: "Konflikt sesji",
      },
    },
    success: {
      title: "Ramka przechwycona",
      description: "Aktualna ramka pobrana pomyślnie",
    },
  },
  sendKeys: {
    title: "Wyślij klawisze do sesji interaktywnej",
    titleShort: "Wyślij klawisze",
    description:
      "Wstrzyknij klawisze do uruchomionej sesji interaktywnej vibe i zwróć zaktualizowaną ramkę",
    form: {
      fields: {
        keys: {
          label: "Klawisze",
          description:
            "Klawisz: Enter, Tab, Escape, Up, Down, Left, Right, Backspace, Space lub tekst",
        },
        pid: {
          label: "PID sesji",
          description:
            "PID sesji interaktywnej. Automatyczne wykrywanie gdy pominięty.",
        },
        waitMs: {
          label: "Oczekiwanie (ms)",
          description:
            "Milisekundy oczekiwania po wstrzyknięciu klawiszy przed odczytem ramki. Domyślnie 500.",
        },
      },
    },
    response: {
      fields: {
        content: "Zawartość ramki",
        logs: "Logi błędów",
        pid: "PID sesji",
      },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autentykacja",
      },
      server: {
        title: "Błąd serwera",
        description: "Wewnętrzny błąd serwera",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie znaleziono aktywnej sesji interaktywnej",
      },
      notFound: {
        title: "Brak sesji",
        description: "Nie znaleziono aktywnej sesji interaktywnej",
        noSession:
          "Żadna sesja interaktywna nie działa. Uruchom ją: vibe <alias> -i --agent-control",
        deadSession: "Sesja o PID {{pid}} już nie działa.",
        keysNotFound:
          "Sesja {{pid}} nie przyjmuje jeszcze klawiszy. Poczekaj chwilę i spróbuj ponownie.",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      conflict: {
        title: "Konflikt",
        description: "Konflikt sesji",
      },
    },
    success: {
      title: "Klawisze wysłane",
      description: "Klawisze wysłane i ramka zaktualizowana",
    },
  },
};
