export const translations = {
  post: {
    title: "Nowy folder",
    description: "Utwórz folder.",
    dynamicTitle: "{{path}}",
    status: {
      loading: "Tworzenie...",
      done: "Utworzono",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "Ścieżka",
        description:
          "Ścieżka folderu. Polskie korzenie: /dokumenty/. Przykład: /dokumenty/projekty/moja-apka",
      },
      viewType: {
        label: "Widok",
        description: "Jak wyświetlać (lista, kanban, kalendarz, siatka)",
      },
      createParents: {
        label: "Twórz foldery",
        description: "Utwórz też brakujące foldery nadrzędne",
      },
    },
    submitButton: {
      label: "Utwórz",
      loadingText: "Tworzenie...",
    },
    response: {
      path: { content: "Ścieżka" },
      created: { text: "Utworzono" },
      alreadyExists: { text: "Już istnieje" },
    },
    errors: {
      validation: { title: "Błędne dane", description: "Sprawdź ścieżkę" },
      network: { title: "Offline", description: "Brak połączenia z serwerem" },
      unauthorized: {
        title: "Niezalogowany",
        description: "Najpierw się zaloguj",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Nie możesz tu tworzyć folderów",
      },
      notFound: {
        title: "Brak folderu",
        description: "Folder nadrzędny nie istnieje",
      },
      server: { title: "Błąd serwera", description: "Coś poszło nie tak" },
      unknown: { title: "Błąd", description: "Coś poszło nie tak" },
      unsavedChanges: {
        title: "Niezapisane",
        description: "Najpierw zapisz lub odrzuć",
      },
      conflict: { title: "Już istnieje", description: "Folder już tam jest" },
    },
    success: {
      title: "Utworzono",
      description: "Folder gotowy",
    },
  },
};
