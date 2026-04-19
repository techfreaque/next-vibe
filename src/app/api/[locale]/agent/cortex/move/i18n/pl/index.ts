export const translations = {
  post: {
    title: "Przenieś",
    description: "Przenieś lub zmień nazwę pliku albo folderu.",
    dynamicTitle: "{{from}} → {{to}}",
    status: {
      loading: "Przenoszenie...",
      done: "Przeniesiono",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      from: {
        label: "Skąd",
        description: "Obecna ścieżka",
      },
      to: {
        label: "Dokąd",
        description: "Nowa ścieżka",
      },
    },
    submitButton: {
      label: "Przenieś",
      loadingText: "Przenoszenie...",
    },
    response: {
      from: { content: "Skąd" },
      to: { content: "Dokąd" },
      nodesAffected: { text: "Przeniesiono" },
    },
    errors: {
      validation: { title: "Błędne dane", description: "Sprawdź obie ścieżki" },
      network: { title: "Offline", description: "Brak połączenia z serwerem" },
      unauthorized: {
        title: "Niezalogowany",
        description: "Najpierw się zaloguj",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Nie możesz tego przenieść",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nic pod ścieżką źródłową",
      },
      server: { title: "Błąd serwera", description: "Coś poszło nie tak" },
      unknown: { title: "Błąd", description: "Coś poszło nie tak" },
      unsavedChanges: {
        title: "Niezapisane",
        description: "Najpierw zapisz lub odrzuć",
      },
      conflict: {
        title: "Zajęte",
        description: "Pod ścieżką docelową już coś jest",
      },
    },
    success: {
      title: "Przeniesiono",
      description: "Gotowe",
    },
  },
};
