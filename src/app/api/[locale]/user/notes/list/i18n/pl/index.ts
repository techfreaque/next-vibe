import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Lista notatek użytkownika",
    description:
      "Wyświetl notatki CRM dla użytkownika, z filtrowaniem po typie i widoczności",
    fields: {
      userId: {
        label: "ID użytkownika",
        description: "Czyje notatki wyświetlić",
        placeholder: "UUID użytkownika",
      },
      type: {
        label: "Typ",
        description: "Filtruj po typie aktywności",
        placeholder: "Wszystkie typy",
      },
      isPrivate: {
        label: "Tylko prywatne",
        description: "Pokaż tylko swoje prywatne notatki",
      },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Sprawdź filtry i spróbuj ponownie",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Musisz być zalogowany",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Nie masz dostępu do tych notatek",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Użytkownik nie istnieje",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt",
      },
      network: {
        title: "Błąd sieci",
        description: "Żądanie sieciowe nie powiodło się",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Są niezapisane zmiany",
      },
      internal: {
        title: "Błąd wewnętrzny",
        description: "Błąd serwera — spróbuj ponownie",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
    },
    success: {
      title: "Notatki załadowane",
      description: "Notatki pobrane pomyślnie",
    },
    widget: {
      addNote: "Dodaj notatkę",
      total: "Łącznie",
      empty: "Brak notatek",
      delete: "Usuń",
      private: "Prywatna",
      ago: "temu",
    },
    response: {
      notes: "Notatki",
      total: "Łącznie",
      note: {
        id: "ID notatki",
        userId: "ID użytkownika",
        authorUserId: "ID autora",
        type: "Typ",
        content: "Treść",
        isPrivate: "Prywatna",
        createdAt: "Utworzono",
        updatedAt: "Zaktualizowano",
      },
    },
  },
  tag: "CRM",
};
