import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    threads: "Wątki",
  },
  patch: {
    title: "Zmień nazwę wątku",
    description: "Zaktualizuj tytuł i podgląd wątku czatu",
    container: {
      title: "Zmień nazwę wątku",
      description: "Ustaw nowy tytuł lub tekst podglądu dla wątku",
    },
    threadId: {
      label: "ID wątku",
      description: "ID wątku do zmiany nazwy",
    },
    threadTitle: {
      label: "Tytuł",
      description: "Nowy tytuł wątku",
      placeholder: "Wpisz tytuł wątku...",
    },
    preview: {
      label: "Podgląd",
      description: "Krótki opis lub tekst podglądu wątku",
      placeholder: "Wpisz tekst podglądu...",
    },
    response: {
      threadId: {
        content: "ID wątku",
      },
      title: {
        content: "Tytuł",
      },
      preview: {
        content: "Podgląd",
      },
      updatedAt: {
        content: "Zaktualizowano",
      },
    },
    errors: {
      validation: {
        title: "Nieprawidłowe dane",
        description:
          "Sprawdź, czy ID wątku jest poprawnym UUID i czy podano co najmniej jedno pole",
      },
      unauthorized: {
        title: "Nie zalogowano",
        description: "Zaloguj się, aby zmieniać nazwy wątków",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Nie masz uprawnień do zmiany nazwy tego wątku",
      },
      notFound: {
        title: "Wątek nie znaleziony",
        description: "Nie istnieje wątek o tym ID",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się zmienić nazwy wątku",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można połączyć się z serwerem",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Coś poszło nie tak",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Są niezapisane zmiany",
      },
      conflict: {
        title: "Konflikt",
        description: "Wątek został zmodyfikowany przez kogoś innego",
      },
    },
    success: {
      title: "Wątek przemianowany",
      description: "Tytuł i podgląd wątku zostały zaktualizowane",
    },
  },
};
