export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    organizations: "Organizacje",
    userGroups: "Grupy użytkowników",
  },
  get: {
    title: "Pobierz grupę użytkowników",
    description: "Pobiera pojedynczą grupę użytkowników po ID.",
    orgId: {
      label: "ID organizacji",
      description: "Liczbowy identyfikator organizacji Corvina.",
    },
    groupId: {
      label: "ID grupy",
      description: "Liczbowy identyfikator grupy użytkowników.",
    },
    response: {
      id: "ID",
      name: "Nazwa",
      organizationId: "ID organizacji",
      type: "Typ",
      owner: "Właściciel",
      membershipRole: "Rola członkostwa",
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
        description: "Brak dostępu do tej grupy.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Brak grupy o tym ID.",
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
      description: "Grupa użytkowników pobrana pomyślnie.",
    },
    widget: { prefix: "Grupa" },
  },
  put: {
    title: "Aktualizuj grupę użytkowników",
    description: "Aktualizuje członków i role grupy użytkowników.",
    orgId: {
      label: "ID organizacji",
      description: "Liczbowy identyfikator organizacji Corvina.",
    },
    groupId: {
      label: "ID grupy",
      description: "Liczbowy identyfikator grupy użytkowników.",
    },
    membersId: {
      label: "ID członków",
      description: "Lista ID użytkowników oddzielona przecinkami.",
      placeholder: "1, 2, 3",
    },
    rolesId: {
      label: "ID ról",
      description: "Lista ID ról oddzielona przecinkami.",
      placeholder: "10, 20",
    },
    response: {
      id: "ID",
      name: "Nazwa",
      organizationId: "ID organizacji",
      type: "Typ",
      owner: "Właściciel",
      membershipRole: "Rola członkostwa",
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
        description: "Brak dostępu do zapisu tej grupy.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Brak grupy o tym ID.",
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
      description: "Grupa użytkowników zaktualizowana pomyślnie.",
    },
    widget: { prefix: "Zaktualizowano grupę" },
  },
  delete: {
    title: "Usuń grupę użytkowników",
    description: "Usuwa grupę użytkowników z organizacji.",
    orgId: {
      label: "ID organizacji",
      description: "Liczbowy identyfikator organizacji Corvina.",
    },
    groupId: {
      label: "ID grupy",
      description: "ID grupy użytkowników do usunięcia.",
    },
    response: {
      id: "ID",
      name: "Nazwa",
      organizationId: "ID organizacji",
      type: "Typ",
      owner: "Właściciel",
      membershipRole: "Rola członkostwa",
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
        description: "Brak uprawnień do usunięcia grupy.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Brak grupy o tym ID.",
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
      description: "Grupa użytkowników usunięta pomyślnie.",
    },
    widget: { prefix: "Usunięto grupę" },
  },
};
