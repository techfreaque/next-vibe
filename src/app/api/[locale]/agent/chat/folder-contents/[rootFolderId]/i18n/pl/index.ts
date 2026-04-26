export const translations = {
  category: "Chat",
  tags: {
    folderContents: "Zawartość folderu",
  },
  config: {
    folders: {
      private: "Prywatny",
      shared: "Udostępniony",
      public: "Publiczny",
      background: "W tle",
      incognito: "Incognito",
    },
  },
  get: {
    title: "Pobierz zawartość folderu",
    description:
      "Pobierz scaloną listę folderów i wątków dla danego poziomu folderu",
    rootFolderId: {
      label: "Folder główny",
      description: "Folder główny (prywatny, udostępniony, publiczny itp.)",
    },
    subFolderId: {
      label: "Podfolder",
      description: "ID podfolderu (null dla poziomu głównego)",
    },
    response: {
      items: {
        item: {
          type: { content: "Typ elementu" },
          sortOrder: { content: "Kolejność sortowania" },
          id: { content: "ID" },
          userId: { content: "ID użytkownika" },
          rootFolderId: { content: "Folder główny" },
          name: { content: "Nazwa" },
          icon: { content: "Ikona" },
          color: { content: "Kolor" },
          parentId: { content: "Folder nadrzędny" },
          expanded: { content: "Rozwinięty" },
          canManage: { content: "Może zarządzać" },
          canCreateThread: { content: "Może tworzyć wątek" },
          canModerate: { content: "Może moderować" },
          canDelete: { content: "Może usuwać" },
          canManagePermissions: { content: "Może zarządzać uprawnieniami" },
          title: { content: "Tytuł wątku" },
          folderId: { content: "Folder" },
          status: { content: "Status" },
          preview: { content: "Podgląd" },
          pinned: { content: "Przypięty" },
          archived: { content: "Zarchiwizowany" },
          canEdit: { content: "Może edytować" },
          canPost: { content: "Może pisać" },
          streamingState: { content: "Stan strumieniowania" },
          createdAt: { content: "Utworzono" },
          updatedAt: { content: "Zaktualizowano" },
        },
      },
      rootFolderPermissions: {
        title: "Uprawnienia folderu głównego",
        description: "Uprawnienia dla folderu głównego",
        canCreateThread: { content: "Może tworzyć wątek" },
        canCreateFolder: { content: "Może tworzyć folder" },
      },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe ID folderu",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Wymagane logowanie",
      },
      forbidden: { title: "Zabronione", description: "Brak uprawnień" },
      notFound: { title: "Nie znaleziono", description: "Folder nie istnieje" },
      server: { title: "Błąd serwera", description: "Błąd podczas pobierania" },
      network: { title: "Błąd sieci", description: "Błąd połączenia" },
      unknown: { title: "Nieznany błąd", description: "Nieoczekiwany błąd" },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
      conflict: { title: "Konflikt", description: "Wystąpił konflikt" },
    },
    success: {
      title: "Sukces",
      description: "Zawartość folderu pobrana pomyślnie",
    },
    backButton: {
      label: "Wstecz",
    },
  },
};
