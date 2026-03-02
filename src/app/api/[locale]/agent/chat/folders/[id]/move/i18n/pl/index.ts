import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    folders: "Foldery",
  },

  patch: {
    title: "Przenieś folder",
    description: "Przenieś folder do innego folderu nadrzędnego",
    id: {
      label: "ID folderu",
      description: "Unikalny identyfikator folderu do przeniesienia",
    },
    parentId: {
      label: "Folder nadrzędny",
      description:
        "Przenieś folder do innego folderu nadrzędnego (null dla głównego)",
    },
    response: {
      folder: {
        id: {
          content: "ID",
        },
        updatedAt: {
          content: "Zaktualizowano",
        },
      },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Podane dane są nieprawidłowe",
        circularReference:
          "Nie można ustawić folderu jako własnego folderu nadrzędnego",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Musisz być zalogowany, aby przenosić foldery",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień do przeniesienia tego folderu",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Żądany folder nie został znaleziony",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił błąd podczas przenoszenia folderu",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można połączyć się z serwerem",
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
        description: "Nie można przenieść folderu w to miejsce",
      },
    },
    success: {
      title: "Sukces",
      description: "Folder przeniesiony pomyślnie",
    },
  },
};
