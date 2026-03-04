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
    title: "Połączenie zdalne",
    description: "Pobierz status swojego połączenia zdalnego",
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
        description: "Brak skonfigurowanego połączenia zdalnego",
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
  connect: {
    title: "Połącz z kontem zdalnym",
    description:
      "Połącz swoje konto ze zdalną instancją, aby synchronizować wspomnienia",
    remoteUrl: {
      label: "Zdalny URL",
      description:
        "Adres webowy twojego zdalnego konta (np. https://unbottled.ai)",
      placeholder: "https://unbottled.ai",
      validation: {
        required: "Proszę podać zdalny URL",
        invalid: "Proszę podać prawidłowy URL (np. https://unbottled.ai)",
      },
    },
    email: {
      label: "Email",
      description: "Twój adres email na zdalnej instancji",
      placeholder: "ty@przykład.pl",
      validation: {
        required: "Proszę podać email",
        invalid: "Proszę podać prawidłowy adres email",
      },
    },
    password: {
      label: "Hasło",
      description: "Twoje hasło na zdalnej instancji",
      placeholder: "••••••••",
      validation: {
        required: "Proszę podać hasło",
      },
    },
    actions: {
      submit: "Połącz",
      submitting: "Łączenie...",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Proszę sprawdzić dane i spróbować ponownie",
      },
      network: {
        title: "Połączenie nieudane",
        description: "Nie można połączyć z serwerem zdalnym. Sprawdź URL",
      },
      unauthorized: {
        title: "Logowanie nieudane",
        description: "Nieprawidłowy email lub hasło do zdalnego konta",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Twoje konto nie ma uprawnień do połączenia",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono serwera zdalnego pod tym adresem",
      },
      server: {
        title: "Błąd serwera zdalnego",
        description: "Serwer zdalny napotkał błąd",
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
        title: "Już połączono",
        description: "Jesteś już połączony ze zdalną instancją",
      },
      noLeadId: {
        title: "Błąd połączenia",
        description: "Nie udało się nawiązać sesji z serwerem zdalnym",
      },
    },
    success: {
      title: "Połączono!",
      description: "Twoje konto jest teraz połączone ze zdalną instancją",
    },
  },
  disconnect: {
    title: "Rozłącz",
    description: "Rozłącz się ze swoją zdalną instancją",
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe żądanie",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie udało się połączyć z serwerem",
      },
      unauthorized: {
        title: "Nie zalogowano",
        description: "Musisz być zalogowany, aby się rozłączyć",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Nie masz uprawnień do rozłączenia",
      },
      notFound: {
        title: "Niepołączono",
        description: "Brak połączenia zdalnego do rozłączenia",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił błąd podczas rozłączania",
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
      title: "Rozłączono",
      description: "Twoje połączenie zdalne zostało usunięte",
    },
  },
};
