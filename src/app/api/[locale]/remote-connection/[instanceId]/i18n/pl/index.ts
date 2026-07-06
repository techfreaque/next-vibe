import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Konto",
  tags: {
    remoteConnection: "Połączenie zdalne",
  },
  widget: {
    title: "Połączenie zdalne",
    signInDescription: "Zaloguj się, aby skonfigurować połączenie zdalne",
    back: "Wróć",
    statusSection: "Status",
    connected: {
      title: "Połączono",
      badge: "Aktywne",
      connectedTo: "Adres zdalny",
      transport: "Transport (wychodzący)",
      remoteTransport: "Transport (przychodzący)",
      remoteInstance: "Zdalna instancja",
      capabilities: "Wersja capabilities",
      lastSynced: "Ostatnia synchronizacja",
      wsConnected: "WS połączono",
      refresh: "Odśwież",
    },
    notConnected: {
      title: "Brak połączenia",
      description:
        "Połącz się z kontem w chmurze (np. unbottled.ai), aby synchronizować wspomnienia i korzystać z narzędzi AI z terminala — z dowolnego miejsca.",
      benefit1:
        "Wspomnienia synchronizują się automatycznie między tym urządzeniem a kontem w chmurze",
      benefit2: "Uruchamiaj narzędzia AI z wiersza poleceń za pomocą",
      benefit2Code: "vibe --thea",
      benefit3: "Lokalna instancja i chmura pozostają zsynchronizowane",
    },
    behaviorSection: "Zachowanie",
    syncSection: "Synchronizacja i dostęp",
    syncScope: {
      memories: "Wspomnienia",
      documents: "Dokumenty",
      skills: "Umiejętności",
      favorites: "Ulubione",
      threads: "Wątki",
    },
    cortexSection: "Cortex",
    cortexDescription: "Przeglądaj wspólny system plików tego połączenia.",
    cortexLink: "Otwórz Cortex",
    sshSection: "SSH i terminal",
    sshDescription: "Konfiguracje SSH i sesje terminala przez to połączenie.",
    sshLink: "Otwórz połączenia SSH",
    reauthButton: "Ponowna autoryzacja",
    renameButton: "Zmień nazwę",
    editButton: "Edytuj",
    disconnectButton: "Rozłącz",
    disconnectConfirmTitle: "Rozłączyć tę instancję?",
    disconnectConfirmDescription:
      "Połączenie zostanie usunięte. Możesz je przywrócić w dowolnym momencie.",
    disconnectConfirmCancel: "Anuluj",
    disconnectConfirmProceed: "Rozłącz",
  },
  get: {
    title: "Status połączenia zdalnego",
    titleShort: "Połączenie",
    description: "Pełny status i ustawienia określonego połączenia zdalnego",
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
  patch: {
    title: "Zaktualizuj połączenie zdalne",
    titleShort: "Zaktualizuj",
    description:
      "Zmień nazwę, ponownie autoryzuj lub konfiguruj transport i synchronizację",
    newInstanceId: {
      label: "Nowa nazwa",
      description:
        "Zmień nazwę połączenia. Aktualizuje lokalną etykietę i synchronizuje ze zdalnym.",
    },
    email: {
      label: "E-mail",
      description: "Twój e-mail konta na zdalnej instancji",
    },
    password: {
      label: "Hasło",
      description: "Twoje hasło konta na zdalnej instancji",
    },
    transportMode: {
      label: "Tryb transportu",
      description:
        "Jak to połączenie komunikuje się. reverse-ws: stały wychodzący WS (otwiera się natychmiast po zapisie). direct-http: bezpośrednie wywołania HTTP.",
      options: {
        reverseWs: "Reverse WS",
        directHttp: "Bezpośredni HTTP",
      },
    },
    isInferenceProvider: {
      label: "Dostawca wnioskowania",
      description:
        "Pozwól temu połączeniu obsługiwać wnioskowanie AI — zdalna instancja uruchamia pętlę LLM przez odwrotny WS.",
    },
    forceSystemProvider: {
      label: "Wymuś dostawcę systemowego",
      description:
        "Nadpisanie administratora: kieruj wszystkie strumienie AI przez to połączenie, pomijając koszt i reguły użytkowników. Tylko jedno naraz.",
    },
    syncScope: {
      label: "Zakres synchronizacji",
      description:
        "Które dane synchronizują się przez to połączenie: wspomnienia, dokumenty, umiejętności, ulubione, wątki.",
      memories: "Wspomnienia",
      documents: "Dokumenty",
      skills: "Umiejętności",
      favorites: "Ulubione",
      threads: "Wątki",
    },
    reconnectNow: {
      label: "Połącz ponownie",
      description:
        "Zamknij i wznów połączenie — uruchamia synchronizację pull-on-connect.",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe żądanie",
      },
      network: { title: "Błąd sieci", description: "Nie udało się połączyć" },
      unauthorized: {
        title: "Nie zalogowano",
        description: "Wymagane uwierzytelnienie",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Wymagana rola administratora dla tego pola",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Połączenie nie istnieje",
      },
      server: {
        title: "Błąd serwera",
        description: "Aktualizacja nie powiodła się",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
      conflict: { title: "Konflikt", description: "Wystąpił konflikt" },
    },
    success: {
      title: "Zaktualizowano połączenie",
      description: "Ustawienia zapisane pomyślnie",
    },
  },
  delete: {
    title: "Rozłącz",
    titleShort: "Rozłącz",
    description: "Usuń to zdalne połączenie i zamknij kanał WebSocket",
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe żądanie",
      },
      network: { title: "Błąd sieci", description: "Nie udało się połączyć" },
      unauthorized: {
        title: "Nie zalogowano",
        description: "Wymagane uwierzytelnienie",
      },
      forbidden: { title: "Brak dostępu", description: "Brak uprawnień" },
      notFound: {
        title: "Nie znaleziono",
        description: "Połączenie nie istnieje",
      },
      server: {
        title: "Błąd serwera",
        description: "Rozłączenie nie powiodło się",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
      conflict: { title: "Konflikt", description: "Wystąpił konflikt" },
    },
    success: {
      title: "Rozłączono",
      description: "Zdalne połączenie usunięte pomyślnie",
    },
  },
};
