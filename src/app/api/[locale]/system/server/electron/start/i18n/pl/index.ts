import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Electron",
  tags: {
    electronStart: "Electron Start",
  },
  post: {
    title: "Uruchom aplikację Electron",
    description:
      "Skompiluj main/preload i uruchom okno Electron (tryb dev — bez pakowania)",
    form: {
      title: "Konfiguracja startu Electron",
      description: "Skonfiguruj sposób uruchamiania aplikacji Electron",
    },
    response: {
      title: "Odpowiedź",
      description: "Dane odpowiedzi startu",
    },
    fields: {
      port: {
        title: "Port",
        description: "Port na którym działa serwer vibe (domyślnie: 3000)",
      },
      vibeStart: {
        title: "Uruchom vibe start",
        description: "Uruchom vibe start w tle przed otwarciem okna",
      },
      success: {
        title: "Sukces",
      },
      output: {
        title: "Wyniki",
      },
      duration: {
        title: "Czas (ms)",
      },
      errors: {
        title: "Błędy",
      },
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagane uwierzytelnienie",
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
        description: "Zasób nie znaleziony",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt danych",
      },
    },
    success: {
      title: "Sukces",
      description: "Aplikacja Electron uruchomiona",
    },
  },
};
