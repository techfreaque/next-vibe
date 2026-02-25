import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    folders: "Foldery",
  },
  title: "Utwórz folder",
  description: "Utwórz nowy folder",
  config: {
    folders: {
      private: "Prywatne Czaty",
      shared: "Udostępnione Czaty",
      public: "Publiczne Czaty",
      incognito: "Czaty Incognito",
    },
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
      id: { content: "ID folderu" },
      userId: { content: "ID użytkownika" },
      rootFolderId: { content: "Folder główny" },
      name: { content: "Nazwa folderu" },
      icon: { content: "Ikona" },
      color: { content: "Kolor" },
      parentId: { content: "ID folderu nadrzędnego" },
      expanded: { content: "Stan rozwinięcia" },
      sortOrder: { content: "Kolejność sortowania" },
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
  submitButton: {
    label: "Utwórz folder",
    loadingText: "Tworzenie...",
  },
  success: {
    title: "Sukces",
    description: "Folder utworzony pomyślnie",
  },
};
