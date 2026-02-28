import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Czat",
  tags: {
    memories: "Wspomnienia",
  },

  search: {
    get: {
      title: "Szukaj wspomnień",
      dynamicTitle: "Memory Search: {{query}}",
      dynamicTitleWithCount: "Memory Search: {{query}} ({{count}})",
      description:
        "Przeszukuje wspomnienia po treści tekstowej. Zwraca pasujące wspomnienia z fragmentami treści. Obsługuje filtrowanie po tagach i uwzględnianie zarchiwizowanych wspomnień.",
      container: {
        title: "Szukaj wspomnień",
        description: "Znajdź wspomnienia po treści lub tagach",
      },
      query: {
        label: "Zapytanie",
        description:
          "Tekst do wyszukania w treści wspomnień (bez rozróżniania wielkości liter)",
      },
      includeArchived: {
        label: "Uwzględnij zarchiwizowane",
        description:
          "Uwzględnij zarchiwizowane wspomnienia w wynikach wyszukiwania (domyślnie: nie)",
      },
      tags: {
        label: "Filtruj po tagach",
        description:
          "Zwróć tylko wspomnienia, które mają co najmniej jeden z tych tagów",
      },
      response: {
        results: {
          memory: {
            title: "Wspomnienie",
            memoryNumber: { text: "#" },
            content: { content: "Treść" },
            tags: { content: "Tagi" },
            priority: { text: "Priorytet" },
            isArchived: { text: "Zarchiwizowane" },
            createdAt: { content: "Utworzono" },
          },
        },
        total: { content: "Łączna liczba wyników" },
      },
      errors: {
        validationFailed: {
          title: "Walidacja nie powiodła się",
          description: "Zapytanie wyszukiwania jest nieprawidłowe",
        },
        network: {
          title: "Błąd sieci",
          description: "Nie udało się połączyć z serwerem",
        },
        unauthorized: {
          title: "Nieautoryzowany",
          description: "Musisz być zalogowany, aby szukać wspomnień",
        },
        forbidden: {
          title: "Zabroniony",
          description: "Nie masz uprawnień do wyszukiwania wspomnień",
        },
        notFound: {
          title: "Nie znaleziono",
          description: "Żądany zasób nie został znaleziony",
        },
        serverError: {
          title: "Błąd serwera",
          description: "Wystąpił błąd podczas wyszukiwania wspomnień",
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
          description: "Wystąpił konflikt z bieżącym stanem",
        },
      },
      success: {
        title: "Sukces",
        description: "Wyszukiwanie wspomnień zakończone pomyślnie",
      },
    },
  },
};
