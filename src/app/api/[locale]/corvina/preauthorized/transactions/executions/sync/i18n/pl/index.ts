export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    preauthorized: "Transakcje preautoryzowane",
  },
  post: {
    title: "Synchronizuj wykonania preautoryzowanych transakcji",
    description:
      "Wyzwala synchronizację stanów wykonania wszystkich preautoryzowanych transakcji.",
    response: {
      synchronized: "Zsynchronizowano",
    },
    errors: {
      validation: {
        title: "Nieprawidłowe żądanie",
        description: "Żądanie do Corvina było błędne.",
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
        description: "Brak uprawnień do synchronizacji.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono zasobu.",
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
        description: "Istnieją niezapisane zmiany.",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd.",
      },
    },
    success: {
      title: "Synchronizacja zakończona",
      description: "Stany wykonania zsynchronizowane pomyślnie.",
    },
    submitButton: {
      label: "Synchronizuj wykonania",
      loadingText: "Synchronizowanie...",
    },
    widget: {
      back: "Wróć",
      synced: "Stany wykonania zsynchronizowane.",
    },
  },
};
