import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Zarządzanie serwerem",
  tags: {
    rebuild: "Rebuild",
  },
  post: {
    title: "Przebuduj i uruchom ponownie",
    description:
      "Przebuduj aplikację i uruchom ponownie serwer Next.js bez pełnego przestoju",
    form: {
      title: "Konfiguracja przebudowy",
      description: "Skonfiguruj opcje przebudowy i ponownego uruchomienia",
    },
    fields: {
      generate: {
        title: "Generuj kod",
        description: "Uruchom generowanie kodu przed budowaniem",
      },
      nextBuild: {
        title: "Build Next.js",
        description: "Uruchom produkcyjny build Next.js",
      },
      migrate: {
        title: "Uruchom migracje",
        description: "Uruchom migracje bazy danych po buildzie",
      },
      seed: {
        title: "Uruchom seeding",
        description: "Uruchom seeding bazy danych po migracjach",
      },
      restart: {
        title: "Uruchom ponownie serwer",
        description:
          "Wyślij SIGUSR1 do działającego procesu vibe start, aby ponownie uruchomić Next.js",
      },
      force: {
        title: "Wymuś przebudowę",
        description: "Kontynuuj przebudowę nawet w przypadku błędów",
      },
      success: {
        title: "Przebudowa udana",
      },
      output: {
        title: "Wyjście przebudowy",
      },
      duration: {
        title: "Czas przebudowy (ms)",
      },
      errors: {
        title: "Błędy przebudowy",
      },
      restarted: {
        title: "Serwer uruchomiony ponownie",
      },
    },
    errors: {
      validation: {
        title: "Walidacja nieudana",
        description: "Podano nieprawidłowe parametry przebudowy",
      },
      network: {
        title: "Błąd sieci",
        description: "Połączenie sieciowe nie powiodło się podczas przebudowy",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Musisz być zalogowany, aby przebudować aplikację",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień do przebudowy aplikacji",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Zasoby przebudowy nie znalezione",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił wewnętrzny błąd serwera podczas przebudowy",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd podczas przebudowy",
      },
      conflict: {
        title: "Konflikt",
        description: "Przebudowa jest już w toku",
      },
    },
    success: {
      title: "Przebudowa zakończona",
      description:
        "Aplikacja przebudowana i serwer uruchomiony ponownie pomyślnie",
    },
  },
};
