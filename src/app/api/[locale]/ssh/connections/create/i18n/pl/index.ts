export const translations = {
  post: {
    title: "Utwórz połączenie SSH",
    description: "Zapisz nową konfigurację połączenia SSH",
    fields: {
      label: {
        label: "Nazwa",
        description: "Przyjazna nazwa połączenia",
        placeholder: "prod-web-01",
      },
      host: {
        label: "Host",
        description: "Hostname lub IP serwera SSH",
        placeholder: "192.168.1.1",
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
        placeholder: "",
      },
      secret: {
        label: "Sekret",
        description: "Hasło lub klucz prywatny PEM",
        placeholder: "",
      },
      passphrase: {
        label: "Hasło klucza",
        description: "Hasło klucza PEM (jeśli zaszyfrowany)",
        placeholder: "",
      },
      isDefault: {
        label: "Domyślne połączenie",
        description: "Używaj jako domyślne dla sesji AI",
        placeholder: "",
      },
      notes: {
        label: "Notatki",
        description: "Opcjonalne notatki o połączeniu",
        placeholder: "",
      },
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
        description: "Nie udało się utworzyć połączenia",
      },
      notFound: { title: "Nie znaleziono", description: "Nie znaleziono" },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      unsavedChanges: { title: "Niezapisane zmiany" },
      conflict: {
        title: "Konflikt",
        description: "Połączenie o tej nazwie już istnieje",
      },
      network: { title: "Błąd sieci", description: "Wystąpił błąd sieci" },
      timeout: { title: "Timeout", description: "Przekroczono limit czasu" },
    },
    success: {
      title: "Połączenie utworzone",
      description: "Połączenie SSH zapisane pomyślnie",
    },
  },
  widget: {
    title: "Nowe połączenie SSH",
    createButton: "Zapisz połączenie",
    creating: "Zapisywanie...",
    testFirst: "Przetestuj połączenie przed zapisaniem",
  },
};
