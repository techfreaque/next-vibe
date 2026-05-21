export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    organizations: "Organizacje",
    apiKeys: "Klucze API",
  },
  get: {
    title: "Lista kluczy API",
    description: "Pobiera wszystkie klucze API organizacji Corvina.",
    orgId: {
      label: "ID organizacji",
      description: "Liczbowy identyfikator organizacji Corvina.",
    },
    response: {
      keys: {
        title: "Klucze API",
        description: "Klucze API należące do tej organizacji.",
        id: "ID",
        userId: "ID użytkownika",
        organizationId: "ID organizacji",
        key: "Klucz",
      },
    },
    widget: {
      title: "Klucze API",
      noKeysFound: "Brak kluczy API",
      keyMasked: "Klucz (zamaskowany)",
      loading: "Ładowanie…",
    },
    errors: {
      validation: {
        title: "Nieprawidłowe żądanie",
        description: "Żądanie było nieprawidłowe.",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można połączyć się z API Corvina.",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Corvina odrzuciła klucz API.",
      },
      forbidden: {
        title: "Zabronione",
        description: "Brak dostępu do kluczy API.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Organizacja o tym ID nie istnieje.",
      },
      conflict: {
        title: "Konflikt",
        description: "Corvina zgłosiła konflikt.",
      },
      server: {
        title: "Błąd serwera",
        description: "Corvina zwróciła błąd serwera.",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Występują niezapisane zmiany.",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd.",
      },
    },
    success: { title: "Sukces", description: "Klucze API pobrane pomyślnie." },
  },
  post: {
    title: "Utwórz klucz API",
    description: "Tworzy nowy klucz API dla użytkownika organizacji Corvina.",
    orgId: {
      label: "ID organizacji",
      description: "Liczbowy identyfikator organizacji Corvina.",
    },
    username: {
      label: "Nazwa użytkownika",
      description: "Nazwa użytkownika do utworzenia klucza API.",
      placeholder: "jan.kowalski",
    },
    response: {
      id: "ID",
      userId: "ID użytkownika",
      organizationId: "ID organizacji",
      key: "Klucz API",
    },
    submitButton: { label: "Utwórz klucz", loadingText: "Tworzenie…" },
    errors: {
      validation: {
        title: "Nieprawidłowe żądanie",
        description: "Żądanie było nieprawidłowe.",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można połączyć się z API Corvina.",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Corvina odrzuciła klucz API.",
      },
      forbidden: {
        title: "Zabronione",
        description: "Brak uprawnień do tworzenia kluczy API.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Organizacja lub użytkownik o tym ID nie istnieje.",
      },
      conflict: {
        title: "Konflikt",
        description: "Klucz API dla tego użytkownika już istnieje.",
      },
      server: {
        title: "Błąd serwera",
        description: "Corvina zwróciła błąd serwera.",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Występują niezapisane zmiany.",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd.",
      },
    },
    success: {
      title: "Utworzono",
      description:
        "Klucz API utworzony. Zapisz go teraz — nie będzie ponownie widoczny.",
    },
  },
};
