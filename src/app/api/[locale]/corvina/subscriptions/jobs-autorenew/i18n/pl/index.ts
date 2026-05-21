export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    subscriptions: "Subskrypcje",
  },
  get: {
    title: "Wyzwól automatyczne odnawianie",
    description:
      "Uruchamia zadanie automatycznego odnawiania subskrypcji. Tylko dla super-administratorów.",
    now: {
      label: "Czas referencyjny",
      description:
        "Opcjonalna sygnatura czasowa epoch (ms) jako aktualny czas dla zadania.",
      placeholder: "1704067200000",
    },
    response: {
      result: "Wynik zadania",
    },
    widget: {
      title: "Zadanie automatycznego odnawiania",
      back: "Wstecz",
      noResult: "Brak zwróconego wyniku.",
    },
    submitButton: {
      label: "Uruchom zadanie",
      loadingText: "Uruchamianie...",
    },
    errors: {
      validation: {
        title: "Nieprawidłowe żądanie",
        description: "Parametry żądania są nieprawidłowe.",
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
        description: "Wymagane uprawnienia super-administratora.",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono punktu końcowego zadania.",
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
      title: "Zadanie uruchomione",
      description: "Zadanie automatycznego odnawiania uruchomione pomyślnie.",
    },
  },
};
