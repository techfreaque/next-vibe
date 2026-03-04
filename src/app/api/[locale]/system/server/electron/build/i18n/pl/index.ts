import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Electron",
  tags: {
    electronBuild: "Electron Build",
  },
  post: {
    title: "Zbuduj aplikację Electron",
    description:
      "Kompiluj main/preload przez bun, uruchom vibe build, następnie spakuj przez electron-builder",
    form: {
      title: "Konfiguracja buildu Electron",
      description: "Skonfiguruj parametry buildu Electron",
    },
    response: {
      title: "Odpowiedź",
      description: "Dane odpowiedzi buildu",
    },
    fields: {
      viBuild: {
        title: "Uruchom vibe build",
        description: "Uruchom vibe build (Next.js + migracje) przed pakowaniem",
      },
      generate: {
        title: "Generuj endpointy",
        description: "Wygeneruj ponownie indeks endpointów przed buildem",
      },
      platform: {
        title: "Platforma docelowa",
        description: "Na którą platformę pakować",
        options: {
          current: "Bieżący system",
          linux: "Linux",
          mac: "macOS",
          win: "Windows",
          all: "Wszystkie platformy",
        },
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
      description: "Aplikacja Electron zbudowana pomyślnie",
    },
  },
};
