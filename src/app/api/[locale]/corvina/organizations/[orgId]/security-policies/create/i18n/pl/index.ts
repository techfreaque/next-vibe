export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    organizations: "Organizacje",
    securityPolicies: "Zasady bezpieczeństwa",
  },
  post: {
    title: "Utwórz zasadę bezpieczeństwa",
    description:
      "Tworzy nową grupę zasad bezpieczeństwa w organizacji Corvina.",
    orgId: {
      label: "ID organizacji",
      description: "Liczbowy identyfikator organizacji Corvina.",
    },
    name: {
      label: "Nazwa",
      description: "Unikalna nazwa zasady bezpieczeństwa.",
      placeholder: "moja-zasada",
    },
    descriptionField: {
      label: "Opis",
      description: "Opcjonalny opis.",
      placeholder: "Ogranicza dostęp do…",
    },
    deviceHwIds: {
      label: "ID sprzętu urządzeń",
      description: "Lista ID sprzętu urządzeń oddzielona przecinkami.",
      placeholder: "AABBCCDD, 11223344",
    },
    response: {
      id: "ID",
      name: "Nazwa",
      type: "Typ",
      organizationId: "ID organizacji",
      orgResourceId: "ID zasobu organizacji",
    },
    submitButton: { label: "Utwórz zasadę", loadingText: "Tworzenie…" },
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
        description: "Brak uprawnień do tworzenia zasad bezpieczeństwa.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Organizacja o tym ID nie istnieje.",
      },
      conflict: {
        title: "Konflikt",
        description: "Zasada o tej nazwie już istnieje.",
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
      description: "Zasada bezpieczeństwa utworzona pomyślnie.",
    },
  },
};
