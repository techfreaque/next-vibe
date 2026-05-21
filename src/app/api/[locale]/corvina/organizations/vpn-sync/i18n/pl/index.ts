export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    organizations: "Organizacje",
  },
  post: {
    title: "Synchronizuj VPN organizacji",
    description: "Uruchamia synchronizację VPN dla organizacji.",
    orgResourceId: {
      label: "ID zasobu organizacji",
      description: "Opcjonalne ID zasobu organizacji do synchronizacji.",
      placeholder: "org.resource.id",
    },
    rootOrgResourceId: {
      label: "ID zasobu organizacji głównej",
      description: "Opcjonalne ID zasobu organizacji głównej.",
      placeholder: "root.org.resource.id",
    },
    response: {
      result: "Wynik",
    },
    widget: {
      title: "Synchronizuj VPN",
      back: "Wstecz",
    },
    submitButton: {
      label: "Synchronizuj VPN",
      loadingText: "Synchronizowanie...",
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
        title: "Brak dostępu",
        description: "Brak uprawnień do synchronizacji VPN organizacji.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono organizacji.",
      },
      conflict: {
        title: "Konflikt",
        description: "Corvina zgłosiła konflikt.",
      },
      server: {
        title: "Błąd serwera",
        description: "Corvina zwróciła błąd wewnętrzny serwera.",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Istnieją niezapisane zmiany.",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd.",
      },
    },
    success: {
      title: "VPN zsynchronizowany",
      description: "VPN organizacji zsynchronizowany pomyślnie.",
    },
  },
};
