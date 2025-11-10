/**
 * Polish translations for folders endpoints
 */

import { translations as idTranslations } from "../../[id]/i18n/pl";
import { translations as rootPermissionsTranslations } from "../../root-permissions/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  id: idTranslations,
  rootPermissions: rootPermissionsTranslations,
  get: {
    title: "Lista folderów",
    description: "Pobierz wszystkie foldery dla bieżącego użytkownika",
    rootFolderId: {
      label: "Folder główny",
      description:
        "Filtruj według folderu głównego (private, shared, public, incognito)",
    },
    container: {
      title: "Lista folderów",
      description: "Hierarchiczna struktura folderów",
    },
    response: {
      title: "Odpowiedź folderów",
      description: "Lista wszystkich folderów",
      folders: {
        title: "Foldery",
        description: "Tablica obiektów folderów",
        folder: {
          title: "Folder",
          description: "Szczegóły pojedynczego folderu",
          id: { content: "ID folderu" },
          userId: { content: "ID użytkownika" },
          rootFolderId: { content: "Folder główny" },
          name: { content: "Nazwa folderu" },
          icon: { content: "Ikona" },
          color: { content: "Kolor" },
          parentId: { content: "ID folderu nadrzędnego" },
          expanded: { content: "Stan rozwinięcia" },
          sortOrder: { content: "Kolejność sortowania" },
          metadata: { content: "Metadane" },
          createdAt: { content: "Utworzono" },
          updatedAt: { content: "Zaktualizowano" },
        },
      },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Dane żądania są nieprawidłowe",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Musisz być zalogowany, aby uzyskać dostęp do folderów",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień do dostępu do tych folderów",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Żądany folder nie został znaleziony",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił błąd podczas pobierania folderów",
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
      description: "Foldery pobrane pomyślnie",
    },
  },
  post: {
    title: "Utwórz folder",
    description: "Utwórz nowy folder",
    container: {
      title: "Utwórz folder",
      description: "Utwórz nowy folder do organizowania wątków",
    },
    sections: {
      folder: {
        title: "Szczegóły folderu",
        description: "Podstawowe informacje o folderze",
        rootFolderId: {
          label: "Folder główny",
          description: "Folder główny (private, shared, public, incognito)",
        },
        name: {
          label: "Nazwa folderu",
          description: "Nazwa folderu",
        },
        icon: {
          label: "Ikona",
          description: "Ikona folderu (nazwa ikony lucide lub si)",
        },
        color: {
          label: "Kolor",
          description: "Kolor hex do wizualnego rozróżnienia",
        },
        parentId: {
          label: "Folder nadrzędny",
          description: "ID folderu nadrzędnego dla zagnieżdżonych folderów",
        },
      },
    },
    response: {
      title: "Utworzony folder",
      description: "Szczegóły nowo utworzonego folderu",
      folder: {
        title: "Folder",
        description: "Utworzony obiekt folderu",
        id: { content: "ID folderu" },
        userId: { content: "ID użytkownika" },
        rootFolderId: { content: "Folder główny" },
        name: { content: "Nazwa folderu" },
        icon: { content: "Ikona" },
        color: { content: "Kolor" },
        parentId: { content: "ID folderu nadrzędnego" },
        expanded: { content: "Stan rozwinięcia" },
        sortOrder: { content: "Kolejność sortowania" },
        metadata: { content: "Metadane" },
        createdAt: { content: "Utworzono" },
        updatedAt: { content: "Zaktualizowano" },
      },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Dane folderu są nieprawidłowe",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Musisz być zalogowany, aby tworzyć foldery",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie masz uprawnień do tworzenia folderów",
        incognitoNotAllowed:
          "Foldery incognito nie mogą być tworzone na serwerze",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Żądany zasób nie został znaleziony",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił błąd podczas tworzenia folderu",
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
      description: "Folder utworzony pomyślnie",
    },
  },
} as const;
