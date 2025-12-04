import type { translations as enTranslations } from "../en";

import { translations as idTranslations } from "../../[id]/i18n/pl";

export const translations: typeof enTranslations = {
  id: idTranslations,
  tags: {
    memories: "Wspomnienia",
  },
  category: "Czat",
  get: {
    title: "Lista wspomnień",
    description: "Pobiera wszystkie wspomnienia dla bieżącego użytkownika",
    container: {
      title: "Lista wspomnień",
      description: "Wyświetl wszystkie zapisane wspomnienia",
    },
    response: {
      memories: {
        memory: {
          title: "Wspomnienie",
          id: { content: "ID wspomnienia" },
          content: { content: "Treść" },
          tags: { content: "Tagi" },
          sequenceNumber: { content: "Numer sekwencji" },
          priority: { content: "Priorytet" },
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
  post: {
    title: "Dodaj wspomnienie",
    description: "Tworzy nowe wspomnienie dla bieżącego użytkownika",
    container: {
      title: "Dodaj wspomnienie",
      description: "Zapisz nowy fakt lub preferencję",
    },
    content: {
      label: "Treść wspomnienia",
      description:
        "Fakt do zapamiętania (np. 'Zawód: Inżynier oprogramowania')",
    },
    tags: {
      label: "Tagi",
      description: "Tagi do kategoryzacji (np. zawód, preferencje)",
    },
    priority: {
      label: "Priorytet",
      description: "Wspomnienia o wyższym priorytecie pojawiają się pierwsze (0-100)",
    },
    response: {
      id: { content: "ID wspomnienia" },
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
        description: "Musisz być zalogowany, aby dodać wspomnienia",
      },
      forbidden: {
        title: "Zabroniony",
        description: "Nie masz uprawnień do dodawania wspomnień",
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
      description: "Wspomnienie dodane pomyślnie",
    },
  },
};
