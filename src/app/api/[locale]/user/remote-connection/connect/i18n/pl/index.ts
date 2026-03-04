export const translations = {
  category: "Konto",
  tags: {
    remoteConnection: "Połączenie zdalne",
  },
  post: {
    title: "Połącz z kontem zdalnym",
    description:
      "Połącz swoje konto ze zdalną instancją, aby synchronizować wspomnienia",
    instanceId: {
      label: "ID instancji",
      description: "Krótki unikalny identyfikator tej maszyny",
      placeholder: "hermes",
      validation: {
        invalid: "Używaj tylko małych liter, cyfr i myślników",
      },
    },
    friendlyName: {
      label: "Nazwa wyświetlana",
      description: "Przyjazna nazwa wyświetlana w interfejsie",
      placeholder: "Mój laptop",
    },
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
};
