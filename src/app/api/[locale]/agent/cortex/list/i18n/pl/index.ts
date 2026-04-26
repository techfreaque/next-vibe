export const translations = {
  get: {
    title: "Pokaż folder",
    description: "Zobacz co jest w folderze.",
    dynamicTitle: "{{path}}",
    status: {
      loading: "Listowanie...",
      done: "Wylistowano",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "Ścieżka",
        description: "Który folder, np. / lub /documents",
      },
    },
    submitButton: {
      label: "Przeglądaj",
      loadingText: "Ładowanie...",
    },
    emptyState: "Ten folder jest pusty",
    folderNames: {
      memories: "Wspomnienia",
      documents: "Dokumenty",
      threads: "Wątki",
      skills: "Umiejętności",
      tasks: "Zadania",
      uploads: "Załączniki",
      searches: "Wyszukiwania",
      gens: "Wygenerowane media",
      inbox: "Skrzynka",
      projects: "Projekty",
      knowledge: "Wiedza",
      journal: "Dziennik",
      templates: "Szablony",
      identity: "Tożsamość",
      expertise: "Wiedza fachowa",
      context: "Kontekst",
    },
    response: {
      path: { content: "Ścieżka" },
      entries: {
        name: { content: "Nazwa" },
        path: { content: "Ścieżka" },
        nodeType: { text: "Typ" },
        size: { text: "Rozmiar" },
        updatedAt: { content: "Zmieniono" },
      },
      total: { text: "Razem" },
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
        description: "Nie widzisz tego folderu",
      },
      notFound: { title: "Nie znaleziono", description: "Folder nie istnieje" },
      server: { title: "Błąd serwera", description: "Coś poszło nie tak" },
      unknown: { title: "Błąd", description: "Coś poszło nie tak" },
      unsavedChanges: {
        title: "Niezapisane",
        description: "Najpierw zapisz lub odrzuć",
      },
      conflict: { title: "Konflikt", description: "Spróbuj ponownie" },
    },
    success: {
      title: "Wylistowano",
      description: "Oto zawartość",
    },
  },
};
