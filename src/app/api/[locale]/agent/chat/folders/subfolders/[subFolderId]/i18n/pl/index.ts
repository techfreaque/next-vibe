export const translations = {
  category: "Chat",
  tags: {
    folders: "Foldery",
  },

  get: {
    title: "Pobierz folder",
    description: "Pobierz folder po ID",
    container: {
      title: "Folder",
      description: "Szczegóły folderu",
    },
    id: {
      label: "ID folderu",
      description: "Unikalny identyfikator folderu",
    },
    response: {
      folder: {
        id: { content: "ID" },
        name: { content: "Nazwa" },
        icon: { content: "Ikona" },
        color: { content: "Kolor" },
        parentId: { content: "ID nadrzędnego" },
        rootFolderId: { content: "Folder główny" },
        expanded: { content: "Rozwinięty" },
        sortOrder: { content: "Kolejność sortowania" },
        createdAt: { content: "Utworzono" },
        updatedAt: { content: "Zaktualizowano" },
      },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Podane dane są nieprawidłowe",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Musisz być zalogowany",
      },
      forbidden: { title: "Zabroniony", description: "Nie masz uprawnień" },
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
      conflict: { title: "Konflikt", description: "Wystąpił konflikt" },
    },
    success: { title: "Sukces", description: "Folder pobrany pomyślnie" },
  },

  delete: {
    title: "Usuń folder",
    description: "Usuń folder po ID",
    container: {
      title: "Usuń folder",
      description: "Potwierdź usunięcie folderu",
    },
    id: {
      label: "ID folderu",
      description: "Unikalny identyfikator folderu do usunięcia",
    },
    response: {
      id: { content: "ID" },
      name: { content: "Nazwa" },
      updatedAt: { content: "Usunięto" },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Podane dane są nieprawidłowe",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Musisz być zalogowany",
      },
      forbidden: { title: "Zabroniony", description: "Nie masz uprawnień" },
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
      conflict: { title: "Konflikt", description: "Nie można usunąć folderu" },
    },
    success: { title: "Sukces", description: "Folder usunięty pomyślnie" },
    backButton: { label: "Wstecz" },
    submitButton: { label: "Usuń folder", loadingText: "Usuwanie..." },
  },

  errors: {
    not_implemented_on_native: "{{method}} nie jest zaimplementowane na native",
  },
};
