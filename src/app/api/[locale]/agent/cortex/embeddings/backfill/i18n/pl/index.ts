export const translations = {
  post: {
    title: "Uzupełnij embeddingi",
    description: "Wygeneruj embeddingi dla wszystkich węzłów bez wektorów.",
    status: {
      loading: "Osadzanie...",
      done: "Gotowe",
    },
    tags: {
      cortex: "Cortex",
    },
    widget: {
      hint: "Wygeneruj embeddingi dla wszystkich węzłów, które ich nie mają. To może chwilę potrwać.",
    },
    fields: {
      force: {
        label: "Wymuś ponowne osadzanie",
        description:
          "Wyczyść wszystkie embeddingi i wygeneruj od nowa (tylko treść). Użyj gdy format się zmienił.",
      },
    },
    submitButton: {
      label: "Rozpocznij",
      loadingText: "Przetwarzanie...",
    },
    response: {
      materialized: { text: "Zmaterializowane" },
      processed: { text: "Osadzone" },
      failed: { text: "Nieudane" },
      skipped: { text: "Pominięte" },
    },
    errors: {
      validation: {
        title: "Błędne dane",
        description: "Nieprawidłowe żądanie",
      },
      network: {
        title: "Offline",
        description: "Brak połączenia z serwerem",
      },
      unauthorized: {
        title: "Niezalogowany",
        description: "Najpierw się zaloguj",
      },
      forbidden: {
        title: "Tylko admin",
        description: "Wymagane uprawnienia admina",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Zasób nie istnieje",
      },
      server: {
        title: "Błąd serwera",
        description: "Usługa embeddingów zawiodła",
      },
      unknown: {
        title: "Błąd",
        description: "Coś poszło nie tak",
      },
      unsavedChanges: {
        title: "Niezapisane",
        description: "Najpierw zapisz lub odrzuć",
      },
      conflict: {
        title: "Już działa",
        description: "Backfill jest już w trakcie",
      },
    },
    success: {
      title: "Backfill zakończony",
      description: "Wszystkie embeddingi przetworzone",
    },
  },
};
