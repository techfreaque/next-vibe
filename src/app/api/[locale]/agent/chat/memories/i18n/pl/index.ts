import { translations as idTranslations } from "../../[id]/i18n/pl";
import { translations as createTranslations } from "../../create/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  create: createTranslations,
  id: idTranslations,
  tags: {
    memories: "Wspomnienia",
  },
  category: "Czat",
  searchPlaceholder: "Szukaj wspomnień według treści lub tagów...",
  showing: "Pokazuje {{count}} z {{total}} wspomnień",
  stats: {
    total: "Łącznie",
    highPriority: "Wysoki priorytet",
    avgPriority: "Śr. priorytet",
    size: "Rozmiar",
  },
  get: {
    title: "Lista wspomnień",
    description: "Pobiera wszystkie wspomnienia dla bieżącego użytkownika",
    container: {
      title: "Wspomnienia",
    },
    createButton: {
      label: "Utwórz wspomnienie",
    },
    stats: {
      title: "Przegląd",
    },
    emptyState: "Brak wspomnień. Utwórz swoje pierwsze wspomnienie.",
    emptySearch: "Nie znaleziono wspomnień pasujących do wyszukiwania.",
    columns: {
      memoryNumber: "#",
      content: "Treść",
      priority: "Priorytet",
      tags: "Tagi",
      createdAt: "Utworzono",
    },
    response: {
      memories: {
        memory: {
          title: "Wspomnienie",
          memoryNumber: { text: "#" },
          content: { content: "Treść" },
          tags: { content: "Tagi" },
          priority: { text: "Priorytet" },
          createdAt: { content: "Utworzono" },
        },
      },
    },
    errors: {
      validation: {
        title: "Walidacja nie powiodła się",
        description: "Dane żądania są nieprawidłowe",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie udało się połączyć z serwerem",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Musisz być zalogowany, aby wyświetlić wspomnienia",
      },
      forbidden: {
        title: "Zabroniony",
        description: "Nie masz uprawnień do dostępu do tego zasobu",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Żądany zasób nie został znaleziony",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił nieoczekiwany błąd",
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
      description: "Wspomnienia pobrane pomyślnie",
    },
  },
};
