export const translations = {
  get: {
    title: "Czytaj plik",
    description:
      "Otwórz dowolny plik — notatki, wątki, wspomnienia, skille czy zadania.",
    dynamicTitle: "{{path}}",
    status: {
      loading: "Odczytywanie...",
      done: "Załadowano",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "Ścieżka",
        description:
          "Który plik. Polskie korzenie: /wspomnienia/, /dokumenty/. Przykład: /dokumenty/notatki/pomysly.md",
      },
      maxLines: {
        label: "Max linii",
        description: "Pokaż tylko tyle linii",
      },
    },
    submitButton: {
      label: "Czytaj",
      loadingText: "Czytanie...",
    },
    response: {
      path: { content: "Ścieżka" },
      content: { content: "Treść" },
      size: { text: "Rozmiar" },
      truncated: { text: "Skrócono" },
      readonly: { text: "Tylko odczyt" },
      nodeType: { text: "Typ" },
      updatedAt: { content: "Zaktualizowano" },
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
        description: "Nie możesz tego czytać",
      },
      notFound: { title: "Nie znaleziono", description: "Nic pod tą ścieżką" },
      server: { title: "Błąd serwera", description: "Coś poszło nie tak" },
      unknown: { title: "Błąd", description: "Coś poszło nie tak" },
      unsavedChanges: {
        title: "Niezapisane",
        description: "Najpierw zapisz lub odrzuć",
      },
      conflict: { title: "Konflikt", description: "Wersje się nie zgadzają" },
    },
    success: {
      title: "Wczytano",
      description: "Plik załadowany",
    },
  },
};
