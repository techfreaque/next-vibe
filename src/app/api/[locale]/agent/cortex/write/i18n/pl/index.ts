export const translations = {
  post: {
    title: "Zapisz plik",
    description: "Zapisz plik. Podaj ścieżkę i treść — gotowe.",
    dynamicTitle: "Zapisano: {{path}}",
    status: {
      loading: "Zapisywanie...",
      done: "Zapisano",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "Ścieżka",
        description: "Gdzie zapisać, np. /documents/notatki/pomysly.md",
      },
      content: {
        label: "Treść",
        description: "Co zapisać (Markdown)",
      },
      createParents: {
        label: "Twórz foldery",
        description: "Utwórz brakujące foldery po drodze",
      },
    },
    submitButton: {
      label: "Zapisz",
      loadingText: "Zapisywanie...",
    },
    response: {
      path: { content: "Ścieżka" },
      size: { text: "Rozmiar" },
      created: { text: "Nowy plik" },
      updated: { text: "Zaktualizowano" },
      updatedAt: { content: "Zaktualizowano" },
    },
    errors: {
      validation: {
        title: "Błędne dane",
        description: "Sprawdź ścieżkę i treść",
      },
      network: { title: "Offline", description: "Brak połączenia z serwerem" },
      unauthorized: {
        title: "Niezalogowany",
        description: "Najpierw się zaloguj",
      },
      forbidden: {
        title: "Tylko odczyt",
        description: "Ta ścieżka jest tylko do odczytu",
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
      conflict: { title: "Już istnieje", description: "Coś tam już jest" },
    },
    success: {
      title: "Zapisano",
      description: "Plik zapisany",
    },
  },
};
