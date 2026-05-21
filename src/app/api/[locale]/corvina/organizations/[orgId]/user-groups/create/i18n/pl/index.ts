export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    organizations: "Organizacje",
    userGroups: "Grupy użytkowników",
  },
  post: {
    title: "Utwórz grupę użytkowników",
    endpointDescription:
      "Tworzy nową grupę użytkowników w organizacji Corvina.",
    orgId: {
      label: "ID organizacji",
      description: "Liczbowy identyfikator organizacji Corvina.",
    },
    name: {
      label: "Nazwa",
      description: "Unikalna nazwa grupy użytkowników.",
      placeholder: "moja-grupa",
    },
    description: {
      label: "Opis",
      description: "Opcjonalny opis tej grupy.",
      placeholder: "Zespół odpowiedzialny za…",
    },
    groupPoliciesEnabled: {
      label: "Zasady grupy włączone",
      description: "Włącz zasady bezpieczeństwa na poziomie grupy.",
    },
    response: {
      id: "ID",
      name: "Nazwa",
      organizationId: "ID organizacji",
      type: "Typ",
      owner: "Właściciel",
      membershipRole: "Rola członkostwa",
    },
    submitButton: {
      label: "Utwórz grupę",
      loadingText: "Tworzenie…",
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
        description: "Klucz API nie ma uprawnień do tworzenia grup.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Organizacja o tym ID nie istnieje.",
      },
      conflict: {
        title: "Konflikt",
        description: "Grupa o tej nazwie już istnieje.",
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
      title: "Utworzono",
      description: "Grupa użytkowników utworzona pomyślnie.",
    },
  },
};
