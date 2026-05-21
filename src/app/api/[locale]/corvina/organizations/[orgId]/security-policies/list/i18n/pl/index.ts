export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    organizations: "Organizacje",
    securityPolicies: "Zasady bezpieczeństwa",
  },
  get: {
    title: "Lista zasad bezpieczeństwa",
    description: "Pobiera wszystkie zasady bezpieczeństwa organizacji Corvina.",
    orgId: {
      label: "ID organizacji",
      description: "Liczbowy identyfikator organizacji Corvina.",
    },
    response: {
      policies: {
        title: "Zasady bezpieczeństwa",
        description: "Grupy zasad bezpieczeństwa tej organizacji.",
        id: "ID",
        name: "Nazwa",
        type: "Typ",
        organizationId: "ID organizacji",
        orgResourceId: "ID zasobu organizacji",
      },
      totalElements: "Łącznie",
      totalPages: "Strony",
      last: "Ostatnia strona",
    },
    widget: {
      title: "Zasady bezpieczeństwa",
      noPoliciesFound: "Brak zasad bezpieczeństwa",
    },
    enums: {
      policyType: {
        standard: "Standardowy",
        selfDevice: "Własne urządzenie",
        allDevices: "Wszystkie urządzenia",
      },
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
        description: "Brak dostępu do zasad bezpieczeństwa.",
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
    success: {
      title: "Sukces",
      description: "Zasady bezpieczeństwa pobrane pomyślnie.",
    },
  },
};
