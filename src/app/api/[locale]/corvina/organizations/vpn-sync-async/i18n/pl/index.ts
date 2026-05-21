export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    organizations: "Organizacje",
  },
  post: {
    title: "Synchronizuj VPN organizacji (asynchronicznie)",
    description:
      "Uruchamia asynchroniczne zadanie synchronizacji VPN dla organizacji.",
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
      id: "ID zadania",
      orgResourceId: "ID zasobu organizacji",
      rootOrgResourceId: "ID zasobu organizacji głównej",
      status: "Status",
      error: "Błąd",
    },
    widget: {
      title: "Synchronizuj VPN (async)",
      back: "Wstecz",
    },
    submitButton: {
      label: "Uruchom async sync",
      loadingText: "Uruchamianie...",
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
        description: "Brak uprawnień do asynchronicznej synchronizacji VPN.",
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
      title: "Async sync uruchomiony",
      description:
        "Zadanie synchronizacji VPN zostało utworzone. Użyj ID zadania do śledzenia postępu.",
    },
  },
};
