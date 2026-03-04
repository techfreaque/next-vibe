import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    folders: "Foldery",
  },

  patch: {
    title: "Zmień nazwę folderu",
    description: "Zmień nazwę istniejącego folderu",
    id: {
      label: "ID folderu",
      description: "Unikalny identyfikator folderu do zmiany nazwy",
    },
    name: {
      label: "Nazwa",
      description: "Nowa nazwa folderu",
    },
    icon: {
      label: "Ikona",
      description: "Nazwa ikony Lucide lub Simple Icons",
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
        description: "Musisz być zalogowany, aby zmieniać nazwy folderów",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień do zmiany nazwy tego folderu",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Żądany folder nie został znaleziony",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił błąd podczas zmiany nazwy folderu",
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
        description: "Folder o tej nazwie już istnieje",
      },
    },
    success: {
      title: "Sukces",
      description: "Nazwa folderu zmieniona pomyślnie",
    },
  },
};
