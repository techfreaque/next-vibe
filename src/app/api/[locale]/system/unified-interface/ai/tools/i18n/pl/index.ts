import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Pobierz dostępne narzędzia AI",
    description:
      "Pobierz listę narzędzi AI dostępnych dla bieżącego użytkownika",
    response: {
      title: "Odpowiedź narzędzi AI",
      description: "Lista dostępnych narzędzi AI",
    },
    fields: {
      tools: {
        title: "Dostępne narzędzia",
      },
    },
    success: {
      title: "Narzędzia pobrane pomyślnie",
      description: "Dostępne narzędzia AI pobrane",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie udało się połączyć z serwerem",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Wymagane uwierzytelnienie",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień do narzędzi AI",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono punktu końcowego narzędzi AI",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się pobrać narzędzi",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt podczas pobierania narzędzi AI",
      },
    },
  },
  category: "Narzędzia AI",
  tags: {
    tools: "narzędzia",
  },
};
