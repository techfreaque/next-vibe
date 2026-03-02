import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    folders: "Foldery",
  },

  patch: {
    title: "Aktualizuj folder",
    description: "Zaktualizuj istniejący folder",
    container: {
      title: "Aktualizuj folder",
      description: "Modyfikuj właściwości folderu",
    },
    id: {
      label: "ID folderu",
      description: "Unikalny identyfikator folderu do aktualizacji",
    },
    sections: {
      updates: {
        title: "Aktualizacje folderu",
        description: "Pola do aktualizacji",
      },
    },
    name: {
      label: "Nazwa",
      description: "Nazwa folderu",
    },
    icon: {
      label: "Ikona",
      description: "Nazwa ikony Lucide lub Simple Icons",
    },
    color: {
      label: "Kolor",
      description: "Kod koloru hex do wizualnego rozróżnienia",
    },
    parentId: {
      label: "Folder nadrzędny",
      description:
        "Przenieś folder do innego folderu nadrzędnego (null dla głównego)",
    },
    expanded: {
      label: "Rozwinięty",
      description: "Czy folder jest rozwinięty w interfejsie użytkownika",
    },
    sortOrder: {
      label: "Kolejność sortowania",
      description: "Kolejność sortowania folderów",
    },
    rolesView: {
      label: "Role wyświetlania",
      description: "Role, które mogą wyświetlać ten folder",
    },
    rolesManage: {
      label: "Role zarządzania",
      description: "Role, które mogą zarządzać ustawieniami folderu",
    },
    rolesCreateThread: {
      label: "Role tworzenia wątków",
      description: "Role, które mogą tworzyć wątki w tym folderze",
    },
    rolesPost: {
      label: "Role publikowania",
      description: "Role, które mogą publikować wiadomości",
    },
    rolesModerate: {
      label: "Role moderacyjne",
      description: "Role, które mogą moderować treści",
    },
    rolesAdmin: {
      label: "Role administratora",
      description: "Role z pełnym dostępem administracyjnym",
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
        description: "Musisz być zalogowany, aby aktualizować foldery",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień do aktualizacji tego folderu",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Żądany folder nie został znaleziony",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił błąd podczas aktualizacji folderu",
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
      description: "Folder zaktualizowany pomyślnie",
    },
  },
};
