export const translations = {
  delete: {
    title: "Usuń",
    description: "Usuń plik lub folder. Bez odwrotu.",
    dynamicTitle: "{{path}}",
    status: {
      loading: "Usuwanie...",
      done: "Usunięto",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "Ścieżka",
        description: "Co usunąć",
      },
      recursive: {
        label: "Z zawartością",
        description: "Usuń też wszystko w środku",
      },
    },
    submitButton: {
      label: "Usuń",
      loadingText: "Usuwanie...",
    },
    response: {
      path: { content: "Ścieżka" },
      nodesDeleted: { text: "Usunięto" },
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
        description: "Nie możesz tego usunąć",
      },
      notFound: { title: "Nie znaleziono", description: "Nic pod tą ścieżką" },
      server: { title: "Błąd serwera", description: "Coś poszło nie tak" },
      unknown: { title: "Błąd", description: "Coś poszło nie tak" },
      unsavedChanges: {
        title: "Niezapisane",
        description: "Najpierw zapisz lub odrzuć",
      },
      conflict: {
        title: "Niepusty",
        description: "Folder nie jest pusty — włącz Z zawartością",
      },
    },
    success: {
      title: "Usunięto",
      description: "Zrobione",
    },
  },
};
