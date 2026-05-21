export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    organizations: "Organizacje",
  },
  get: {
    title: "Pobierz zadanie synchronizacji VPN",
    description: "Pobiera status asynchronicznego zadania synchronizacji VPN.",
    jobId: {
      label: "ID zadania",
      description: "ID asynchronicznego zadania synchronizacji VPN.",
    },
    response: {
      id: "ID zadania",
      orgResourceId: "ID zasobu organizacji",
      rootOrgResourceId: "ID zasobu organizacji głównej",
      status: "Status",
      error: "Błąd",
    },
    widget: {
      title: "Zadanie synchronizacji VPN",
      back: "Wstecz",
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
        description: "Brak uprawnień do wyświetlenia tego zadania VPN.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono zadania synchronizacji VPN o podanym ID.",
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
      title: "Zadanie pobrane",
      description: "Status zadania synchronizacji VPN pobrany pomyślnie.",
    },
  },
};
