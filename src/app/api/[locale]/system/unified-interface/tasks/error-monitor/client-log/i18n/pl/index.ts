export const translations = {
  category: "System",

  post: {
    title: "Zgłoś błąd klienta",
    description:
      "Zapisz błąd lub ostrzeżenie po stronie klienta w dzienniku błędów",
    tags: {
      monitoring: "Monitoring",
    },
    fields: {
      level: {
        label: "Poziom",
        description: "Poziom logu: error lub warn",
      },
      message: {
        label: "Wiadomość",
        description: "Treść błędu",
        placeholder: "Coś poszło nie tak",
      },
      metadata: {
        label: "Metadane",
        description: "Dodatkowy kontekst strukturalny",
      },
    },
    response: {
      ok: {
        title: "Zaakceptowano",
      },
    },
    success: {
      title: "Zapisano",
      description: "Błąd klienta zapisany",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe żądanie",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagane uwierzytelnienie",
      },
      forbidden: {
        title: "Zabronione",
        description: "Odmowa dostępu",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Zasób nie istnieje",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się zapisać błędu",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        titleChanges: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt danych",
      },
    },
  },
};
