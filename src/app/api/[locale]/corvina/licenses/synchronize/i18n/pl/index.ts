export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    licenses: "Licencje",
  },
  post: {
    title: "Synchronizuj zasoby",
    description:
      "Uruchamia synchronizację zużycia zasobów między Corvina a podłączonymi platformami.",
    orgResourceId: {
      label: "ID zasobu org.",
      description: "Ogranicz synchronizację do konkretnej organizacji.",
    },
    dryRun: {
      label: "Próbne uruchomienie",
      description: "Zasymuluj synchronizację bez wprowadzania zmian.",
    },
    submitButton: {
      label: "Synchronizuj",
      loadingText: "Synchronizowanie...",
    },
    response: {
      synchronized: "Status",
    },
    widget: {
      title: "Synchronizuj zasoby",
      back: "Wstecz",
      success: "Synchronizacja zakończona.",
    },
    errors: {
      validation: {
        title: "Nieprawidłowe żądanie",
        description: "Żądanie synchronizacji jest nieprawidłowe.",
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
        description:
          "Klucz API nie ma uprawnień do uruchamiania synchronizacji.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Żądany zasób nie został znaleziony.",
      },
      conflict: {
        title: "Konflikt",
        description: "Corvina zgłosiła konflikt podczas synchronizacji.",
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
      title: "Zsynchronizowano",
      description: "Synchronizacja zasobów uruchomiona pomyślnie.",
    },
  },
};
