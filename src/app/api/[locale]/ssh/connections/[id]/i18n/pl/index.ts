export const translations = {
  category: "SSH",

  enums: {
    authType: {
      password: "Hasło",
      privateKey: "Klucz prywatny (PEM)",
      keyAgent: "Agent SSH",
      local: "Lokalny komputer",
    },
  },

  errors: {
    connectionNotFound: "Połączenie nie znalezione",
    encryptionFailed:
      "Szyfrowanie nieudane - SSH_SECRET_KEY może być nieprawidłowy",
  },

  get: {
    title: "Połączenie SSH",
    description: "Wyświetl szczegóły połączenia SSH",
    fields: {
      id: { label: "ID połączenia", description: "Połączenie do wyświetlenia" },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagany dostęp administratora",
      },
      forbidden: { title: "Zabronione", description: "Brak uprawnień" },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się załadować połączenia",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Połączenie nie znalezione",
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
      network: { title: "Błąd sieci", description: "Wystąpił błąd sieci" },
    },
    success: {
      title: "Połączenie załadowane",
      description: "Szczegóły połączenia pobrane",
    },
  },
  patch: {
    title: "Aktualizuj połączenie SSH",
    description: "Zaktualizuj ustawienia połączenia SSH",
    fields: {
      id: { label: "ID połączenia", description: "Połączenie do aktualizacji" },
      label: {
        label: "Nazwa",
        description: "Wyświetlana nazwa tego połączenia",
        placeholder: "prod-web-01",
      },
      host: {
        label: "Host",
        description: "Nazwa hosta lub adres IP",
        placeholder: "1.2.3.4",
      },
      port: { label: "Port", description: "Port SSH", placeholder: "22" },
      username: {
        label: "Nazwa użytkownika",
        description: "Użytkownik SSH",
        placeholder: "deploy",
      },
      authType: {
        label: "Typ uwierzytelniania",
        description: "Metoda uwierzytelniania",
      },
      secret: {
        label: "Hasło / Klucz prywatny",
        description: "Pozostaw puste aby zachować istniejące hasło",
      },
      passphrase: {
        label: "Hasło klucza",
        description:
          "Pozostaw puste aby zachować lub wyczyścić istniejące hasło klucza",
      },
      isDefault: {
        label: "Ustaw jako domyślne",
        description: "Użyj tego połączenia domyślnie dla sesji terminala",
      },
      notes: {
        label: "Notatki",
        description: "Opcjonalne notatki o tym połączeniu",
      },
    },
    response: {
      updatedAt: { title: "Zaktualizowano" },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagany dostęp administratora",
      },
      forbidden: { title: "Zabronione", description: "Brak uprawnień" },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się zaktualizować połączenia",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Połączenie nie znalezione",
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
      network: { title: "Błąd sieci", description: "Wystąpił błąd sieci" },
    },
    success: {
      title: "Połączenie zaktualizowane",
      description: "Połączenie zaktualizowane pomyślnie",
    },
  },
  delete: {
    title: "Usuń połączenie SSH",
    description: "Usuń połączenie SSH",
    fields: {
      id: { label: "ID połączenia", description: "Połączenie do usunięcia" },
    },
    response: {
      deleted: { title: "Usunięto" },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagany dostęp administratora",
      },
      forbidden: { title: "Zabronione", description: "Brak uprawnień" },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się usunąć połączenia",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Połączenie nie znalezione",
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
      network: { title: "Błąd sieci", description: "Wystąpił błąd sieci" },
    },
    success: {
      title: "Połączenie usunięte",
      description: "Połączenie usunięte pomyślnie",
    },
  },
  widget: {
    title: "Szczegóły połączenia",
    host: "Host",
    user: "Użytkownik",
    auth: "Autoryzacja",
    notes: "Notatki",
    saveButton: "Zapisz zmiany",
    deleteButton: "Usuń połączenie",
    testButton: "Testuj połączenie",
    confirmDelete: "Usunąć to połączenie? Tej operacji nie można cofnąć.",
  },
};
