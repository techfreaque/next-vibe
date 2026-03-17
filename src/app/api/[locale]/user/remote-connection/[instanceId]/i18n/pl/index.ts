import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Konto",
  tags: {
    remoteConnection: "Połączenie zdalne",
  },
  widget: {
    title: "Połączenie zdalne",
    signInDescription: "Zaloguj się, aby skonfigurować połączenie zdalne",
    connected: {
      title: "Połączono z kontem w chmurze",
      badge: "Aktywne",
      description:
        "Twoje wspomnienia i narzędzia AI synchronizują się automatycznie z kontem w chmurze.",
      connectedTo: "Połączono z",
      lastSynced: "Ostatnia synchronizacja",
      refresh: "Odśwież",
      reauth: "Ponowna autoryzacja",
      rename: "Zmień nazwę",
      disconnect: "Rozłącz",
    },
    notConnected: {
      title: "Połącz konto w chmurze",
      description:
        "Połącz się ze swoim kontem w chmurze (np. unbottled.ai), aby synchronizować wspomnienia i korzystać z narzędzi AI z terminala — z dowolnego miejsca.",
      benefit1:
        "Twoje wspomnienia synchronizują się automatycznie między tym urządzeniem a kontem w chmurze",
      benefit2: "Uruchamiaj narzędzia AI z wiersza poleceń za pomocą",
      benefit2Code: "vibe --remote",
      benefit3:
        "Twoje konto w chmurze i lokalna instancja pozostają zsynchronizowane",
    },
  },
  get: {
    title: "Status połączenia zdalnego",
    description: "Pobierz status określonego połączenia zdalnego",
    instanceId: {
      label: "ID instancji",
      description: "Instancja połączenia do wyświetlenia",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie udało się połączyć z serwerem",
      },
      unauthorized: {
        title: "Nie zalogowano",
        description: "Musisz być zalogowany, aby zobaczyć połączenie zdalne",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Nie masz uprawnień do wyświetlenia tego",
      },
      notFound: {
        title: "Niepołączono",
        description: "Nie znaleziono połączenia zdalnego dla tej instancji",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił błąd podczas pobierania połączenia",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt",
      },
    },
    success: {
      title: "Pobrano połączenie",
      description: "Status połączenia zdalnego pobrany pomyślnie",
    },
  },
};
