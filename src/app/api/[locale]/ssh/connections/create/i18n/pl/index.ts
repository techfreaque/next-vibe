export const translations = {
  category: "SSH",

  enums: {
    authType: {
      password: "Hasło",
      privateKey: "Klucz prywatny (PEM)",
      keyAgent: "Agent SSH",
    },
  },

  errors: {
    sshSecretKeyNotSet:
      "Zmienna JWT_SECRET_KEY nie jest ustawiona. Dodaj 32-bajtową wartość hex.",
    encryptionFailed:
      "Szyfrowanie nie powiodło się - JWT_SECRET_KEY może być nieprawidłowy",
    noRowReturned: "Brak wiersza zwróconego z wstawienia",
  },

  post: {
    title: "Utwórz połączenie SSH",
    description:
      "Zapisz nowe połączenie SSH. Dane uwierzytelniające są szyfrowane przez AES-256-GCM.",
    fields: {
      label: {
        label: "Nazwa",
        description: "Przyjazna nazwa do identyfikacji tego połączenia",
        placeholder: "prod-web-01",
      },
      host: {
        label: "Hostname / IP",
        description: "Hostname lub adres IP serwera SSH",
        placeholder: "192.168.1.1",
      },
      port: {
        label: "Port",
        description: "Port serwera SSH (domyślnie: 22)",
        placeholder: "22",
      },
      username: {
        label: "Nazwa użytkownika",
        description: "Użytkownik SSH do uwierzytelnienia",
        placeholder: "deploy",
      },
      authType: {
        label: "Metoda uwierzytelniania",
        description:
          "Hasło: zwykłe logowanie hasłem. Klucz prywatny: plik klucza PEM. Agent SSH: użyj agenta systemowego (SSH_AUTH_SOCK).",
      },
      secret: {
        label: "Hasło / Klucz prywatny",
        description:
          "Dla hasła: podaj hasło. Dla klucza prywatnego: wklej cały klucz PEM. Dla agenta SSH: zostaw puste.",
        placeholder: "",
      },
      passphrase: {
        label: "Hasło klucza",
        description:
          "Jeśli klucz prywatny jest chroniony hasłem, wpisz je tutaj. Zostaw puste jeśli klucz jest nieszyfrowany.",
        placeholder: "",
      },
      isDefault: {
        label: "Ustaw jako domyślne połączenie",
        description:
          "Używaj tego połączenia domyślnie dla sesji AI, terminala i poleceń.",
      },
      notes: {
        label: "Notatki",
        description: "Opcjonalne wewnętrzne notatki o tym połączeniu",
        placeholder: "VPS za NAT, wymagany host pośredni",
      },
    },
    response: {
      id: { title: "ID połączenia" },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Sprawdź pola formularza i spróbuj ponownie",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagany dostęp administratora",
      },
      forbidden: {
        title: "Zabronione",
        description: "Brak uprawnień do tworzenia połączeń",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się zapisać połączenia",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Zasób nie znaleziony",
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
        title: "Nazwa już zajęta",
        description: "Połączenie o tej nazwie już istnieje",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można połączyć z serwerem",
      },
      timeout: { title: "Timeout", description: "Przekroczono limit czasu" },
    },
    success: {
      title: "Połączenie zapisane",
      description: "Połączenie SSH zapisane pomyślnie",
    },
    submitButton: {
      text: "Zapisz połączenie",
      loadingText: "Zapisywanie...",
    },
  },
  widget: {
    title: "Nowe połączenie SSH",
    createButton: "Zapisz połączenie",
    creating: "Zapisywanie...",
    testFirst: "Przetestuj połączenie przed zapisaniem",
  },
};
