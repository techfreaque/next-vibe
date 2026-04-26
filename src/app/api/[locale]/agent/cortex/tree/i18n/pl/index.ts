export const translations = {
  get: {
    title: "Drzewo",
    description: "Cała struktura folderów na jeden rzut oka.",
    dynamicTitle: "{{path}}",
    status: {
      loading: "Skanowanie...",
      done: "Zeskanowano",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "Ścieżka",
        description: "Zacznij stąd (domyślnie: korzeń)",
      },
      depth: {
        label: "Głębokość",
        description: "Ile poziomów w głąb",
      },
    },
    submitButton: {
      label: "Pokaż drzewo",
      loadingText: "Ładowanie...",
    },
    response: {
      tree: { content: "Drzewo" },
      totalFiles: { text: "Pliki" },
      totalDirs: { text: "Foldery" },
    },
    errors: {
      validation: {
        title: "Błędne dane",
        description: "Sprawdź ścieżkę i głębokość",
      },
      network: { title: "Offline", description: "Brak połączenia z serwerem" },
      unauthorized: {
        title: "Niezalogowany",
        description: "Najpierw się zaloguj",
      },
      forbidden: { title: "Brak dostępu", description: "Nie widzisz tego" },
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
      title: "Drzewo",
      description: "Oto struktura",
    },
  },
};
