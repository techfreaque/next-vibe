export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    users: "Użytkownicy",
  },
  get: {
    title: "Lista użytkowników organizacji",
    description: "Wyświetla wszystkich użytkowników organizacji Corvina.",
    orgId: {
      label: "ID organizacji",
      description: "Liczbowy identyfikator organizacji Corvina.",
    },
    page: {
      label: "Strona",
      description: "Numer strony (od zera).",
    },
    pageSize: {
      label: "Rozmiar strony",
      description: "Liczba użytkowników na stronie (maks. 100).",
    },
    response: {
      users: {
        id: "ID",
        username: "Nazwa użytkownika",
        email: "E-mail",
        firstName: "Imię",
        lastName: "Nazwisko",
        country: "Kraj",
        defaultHomePage: "Strona startowa",
        serviceAccount: "Konto serwisowe",
        groupPoliciesEnabled: "Zasady grupy",
        userImpersonation: "Personifikacja",
        mfaEnabled: "MFA",
        owner: "Właściciel",
        ownerRef: "Ref właściciela",
      },
      totalElements: "Łączna liczba użytkowników",
      totalPages: "Łączna liczba stron",
      last: "Ostatnia strona",
    },
    widget: {
      title: "Użytkownicy",
      emptyState: "Brak użytkowników.",
      badges: {
        serviceAccount: "Konto serwisowe",
        mfaEnabled: "MFA włączone",
        mfaDisabled: "Bez MFA",
        impersonation: "Personifikacja",
      },
    },
    enums: {
      userOwner: {
        organization: "Organizacja",
        app: "Aplikacja",
      },
    },
    errors: {
      validation: {
        title: "Nieprawidłowe żądanie",
        description: "Żądanie do Corvina było nieprawidłowe.",
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
        description: "Klucz API nie ma dostępu do listy użytkowników.",
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
        description: "Corvina zwróciła wewnętrzny błąd serwera.",
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
      description: "Użytkownicy pobrani pomyślnie.",
    },
  },
};
