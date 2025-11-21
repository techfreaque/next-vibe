import type { translations as enTranslations } from "../en";
import { translations as permissionsTranslations } from "../../permissions/i18n/pl";

export const translations: typeof enTranslations = {
  permissions: permissionsTranslations,
  get: {
    title: "Pobierz folder",
    description: "Pobierz określony folder według ID",
    container: {
      title: "Szczegóły folderu",
      description: "Wyświetl informacje o folderze",
    },
    id: {
      label: "ID folderu",
      description: "Unikalny identyfikator folderu",
    },
    response: {
      title: "Folder",
      description: "Szczegóły żądanego folderu",
      folder: {
        title: "Folder",
        id: {
          content: "ID",
        },
        userId: {
          content: "ID użytkownika",
        },
        name: {
          content: "Nazwa",
        },
        icon: {
          content: "Ikona",
        },
        color: {
          content: "Kolor",
        },
        parentId: {
          content: "Folder nadrzędny",
        },
        expanded: {
          content: "Rozwinięty",
        },
        sortOrder: {
          content: "Kolejność sortowania",
        },
        metadata: {
          content: "Metadane",
        },
        createdAt: {
          content: "Utworzono",
        },
        updatedAt: {
          content: "Zaktualizowano",
        },
      },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Podane ID folderu jest nieprawidłowe",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Musisz być zalogowany, aby wyświetlać foldery",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień do wyświetlania tego folderu",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Żądany folder nie został znaleziony",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił błąd podczas pobierania folderu",
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
        description: "Wystąpił konflikt podczas przetwarzania żądania",
      },
    },
    success: {
      title: "Sukces",
      description: "Folder pobrany pomyślnie",
    },
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
    metadata: {
      label: "Metadane",
      description: "Dodatkowe metadane folderu",
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
      title: "Zaktualizowany folder",
      description: "Szczegóły zaktualizowanego folderu",
      folder: {
        title: "Folder",
        id: {
          content: "ID",
        },
        userId: {
          content: "ID użytkownika",
        },
        name: {
          content: "Nazwa",
        },
        icon: {
          content: "Ikona",
        },
        color: {
          content: "Kolor",
        },
        parentId: {
          content: "Folder nadrzędny",
        },
        expanded: {
          content: "Rozwinięty",
        },
        sortOrder: {
          content: "Kolejność sortowania",
        },
        metadata: {
          content: "Metadane",
        },
        createdAt: {
          content: "Utworzono",
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
  delete: {
    title: "Usuń folder",
    description: "Usuń folder i całą jego zawartość",
    container: {
      title: "Usuń folder",
      description: "Usuń folder na stałe",
    },
    id: {
      label: "ID folderu",
      description: "Unikalny identyfikator folderu do usunięcia",
    },
    response: {
      title: "Wynik usunięcia",
      description: "Potwierdzenie usunięcia folderu",
      success: {
        content: "Sukces",
      },
      deletedFolderId: {
        content: "ID usuniętego folderu",
      },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Podane ID folderu jest nieprawidłowe",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Musisz być zalogowany, aby usuwać foldery",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień do usunięcia tego folderu",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Żądany folder nie został znaleziony",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił błąd podczas usuwania folderu",
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
        description: "Nie można usunąć folderu z aktywną zawartością",
      },
    },
    success: {
      title: "Sukces",
      description: "Folder usunięty pomyślnie",
    },
  },
} as const;
