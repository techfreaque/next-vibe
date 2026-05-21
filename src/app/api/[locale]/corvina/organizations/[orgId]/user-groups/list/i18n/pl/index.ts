export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    organizations: "Organizacje",
    userGroups: "Grupy użytkowników",
  },
  get: {
    title: "Lista grup użytkowników",
    description: "Pobiera wszystkie grupy użytkowników organizacji Corvina.",
    orgId: {
      label: "ID organizacji",
      description: "Liczbowy identyfikator organizacji Corvina.",
    },
    response: {
      groups: {
        title: "Grupy użytkowników",
        description: "Grupy użytkowników należące do tej organizacji.",
        id: "ID",
        name: "Nazwa",
        organizationId: "ID organizacji",
        type: "Typ",
        owner: "Właściciel",
        membershipRole: "Rola członkostwa",
      },
      totalElements: "Łącznie",
      totalPages: "Strony",
      last: "Ostatnia strona",
    },
    widget: {
      title: "Grupy użytkowników",
      noGroupsFound: "Brak grup użytkowników",
    },
    enums: {
      groupType: {
        standard: "Standardowy",
        selfUserAny: "Własny użytkownik (dowolny)",
        selfUser: "Własny użytkownik",
        allUser: "Wszyscy użytkownicy",
        selfUserService: "Własny użytkownik (usługa)",
        all: "Wszyscy",
      },
      groupOwner: {
        organization: "Organizacja",
        app: "Aplikacja",
      },
      membershipRole: {
        user: "Użytkownik",
        admin: "Administrator",
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
        description: "Klucz API nie ma dostępu do grup użytkowników.",
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
      description: "Grupy użytkowników pobrane pomyślnie.",
    },
  },
};
