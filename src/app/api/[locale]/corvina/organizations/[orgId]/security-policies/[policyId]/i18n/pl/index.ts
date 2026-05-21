export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    organizations: "Organizacje",
    securityPolicies: "Zasady bezpieczeństwa",
  },
  get: {
    title: "Pobierz zasadę bezpieczeństwa",
    description: "Pobiera pojedynczą grupę zasad bezpieczeństwa po ID.",
    orgId: {
      label: "ID organizacji",
      description: "Liczbowy identyfikator organizacji Corvina.",
    },
    policyId: {
      label: "ID zasady",
      description: "Liczbowy identyfikator grupy zasad bezpieczeństwa.",
    },
    response: {
      id: "ID",
      name: "Nazwa",
      type: "Typ",
      organizationId: "ID organizacji",
      orgResourceId: "ID zasobu organizacji",
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
        description: "Brak dostępu do tej zasady.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Brak zasady o tym ID.",
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
    success: {
      title: "Sukces",
      description: "Zasada bezpieczeństwa pobrana pomyślnie.",
    },
    widget: { prefix: "Zasada" },
  },
  put: {
    title: "Aktualizuj zasadę bezpieczeństwa",
    description: "Aktualizuje grupę zasad bezpieczeństwa.",
    orgId: {
      label: "ID organizacji",
      description: "Liczbowy identyfikator organizacji Corvina.",
    },
    policyId: {
      label: "ID zasady",
      description: "Liczbowy identyfikator grupy zasad bezpieczeństwa.",
    },
    name: {
      label: "Nazwa",
      description: "Nowa nazwa zasady bezpieczeństwa.",
      placeholder: "moja-zasada",
    },
    descriptionField: {
      label: "Opis",
      description: "Opcjonalny opis.",
      placeholder: "Ogranicza dostęp do…",
    },
    response: {
      id: "ID",
      name: "Nazwa",
      type: "Typ",
      organizationId: "ID organizacji",
      orgResourceId: "ID zasobu organizacji",
    },
    submitButton: { label: "Zapisz zmiany", loadingText: "Zapisywanie…" },
    errors: {
      validation: {
        title: "Nieprawidłowa aktualizacja",
        description: "Corvina odrzuciła aktualizację.",
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
        description: "Brak dostępu do zapisu tej zasady.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Brak zasady o tym ID.",
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
    success: {
      title: "Zapisano",
      description: "Zasada bezpieczeństwa zaktualizowana pomyślnie.",
    },
    widget: { prefix: "Zaktualizowano zasadę" },
  },
  delete: {
    title: "Usuń zasadę bezpieczeństwa",
    description: "Usuwa grupę zasad bezpieczeństwa.",
    orgId: {
      label: "ID organizacji",
      description: "Liczbowy identyfikator organizacji Corvina.",
    },
    policyId: {
      label: "ID zasady",
      description: "ID grupy zasad bezpieczeństwa do usunięcia.",
    },
    response: {
      id: "ID",
      name: "Nazwa",
      type: "Typ",
      organizationId: "ID organizacji",
      orgResourceId: "ID zasobu organizacji",
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
        description: "Brak uprawnień do usunięcia zasady.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Brak zasady o tym ID.",
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
    success: {
      title: "Usunięto",
      description: "Zasada bezpieczeństwa usunięta pomyślnie.",
    },
    widget: { prefix: "Usunięto zasadę" },
  },
};
