export const translations = {
  post: {
    title: "Utwórz użytkownika Linux",
    description: "Utwórz nowe konto użytkownika OS na hoście",
    fields: {
      username: {
        label: "Nazwa użytkownika",
        description: "Małe litery alfanumeryczne + myślnik, 1-32 znaki",
        placeholder: "alice",
      },
      groups: {
        label: "Grupy",
        description: "Dodatkowe grupy dla użytkownika",
        placeholder: "docker,www-data",
      },
      shell: {
        label: "Shell",
        description: "Shell logowania",
        placeholder: "/bin/bash",
      },
      homeDir: {
        label: "Katalog domowy",
        description: "Ścieżka katalogu domowego (domyślnie: /home/nazwa)",
        placeholder: "/home/alice",
      },
      sudoAccess: {
        label: "Dostęp sudo",
        description: "Dodaj do grupy sudo (niezalecane)",
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
      forbidden: { title: "Zabronione", description: "Wymagany LOCAL_MODE" },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się utworzyć użytkownika",
      },
      notFound: { title: "Nie znaleziono", description: "Nie znaleziono" },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      unsavedChanges: { title: "Niezapisane zmiany" },
      conflict: {
        title: "Konflikt",
        description: "Nazwa użytkownika już istnieje",
      },
      network: { title: "Błąd sieci", description: "Wystąpił błąd sieci" },
      timeout: { title: "Timeout", description: "Przekroczono limit czasu" },
    },
    success: {
      title: "Użytkownik utworzony",
      description: "Konto użytkownika OS utworzone pomyślnie",
    },
  },
  widget: {
    title: "Utwórz użytkownika Linux",
    createButton: "Utwórz użytkownika",
    creating: "Tworzenie...",
    sudoWarning:
      "Przyznanie dostępu sudo jest zagrożeniem bezpieczeństwa. Używaj ostrożnie.",
  },
};
