export const translations = {
  get: {
    title: "Szukaj",
    description: "Znajdź pliki po nazwie lub treści. Przeszukuje wszystko.",
    dynamicTitle: "{{query}}",
    status: {
      loading: "Wyszukiwanie...",
      done: "Znaleziono",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      query: {
        label: "Szukaj",
        description: "Czego szukać",
      },
      path: {
        label: "W folderze",
        description: "Szukaj tylko tutaj (domyślnie: wszędzie)",
      },
      maxResults: {
        label: "Limit",
        description: "Ile wyników (domyślnie: 20)",
      },
    },
    submitButton: {
      label: "Szukaj",
      loadingText: "Szukanie...",
    },
    noResults: "Brak wyników",
    response: {
      query: { content: "Szukano" },
      results: {
        path: { content: "Ścieżka" },
        name: { content: "Nazwa" },
        nodeType: { text: "Typ" },
        excerpt: { content: "Trafienie" },
        score: { text: "Trafność" },
        updatedAt: { content: "Zmieniono" },
      },
      total: { text: "Znaleziono" },
      searchMode: { text: "Tryb" },
    },
    errors: {
      validation: {
        title: "Błędne dane",
        description: "Sprawdź tekst wyszukiwania",
      },
      network: { title: "Offline", description: "Brak połączenia z serwerem" },
      unauthorized: {
        title: "Niezalogowany",
        description: "Najpierw się zaloguj",
      },
      forbidden: { title: "Brak dostępu", description: "Nie możesz tu szukać" },
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
      title: "Gotowe",
      description: "Wyszukiwanie zakończone",
    },
  },
};
