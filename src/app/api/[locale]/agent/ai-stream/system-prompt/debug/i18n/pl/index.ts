export const translations = {
  get: {
    title: "Debug System Prompt",
    description:
      "Renderuje pełny system prompt dla danego kontekstu użytkownika. Tylko admin/dev.",
    status: {
      loading: "Generowanie...",
      done: "Gotowe",
    },
    tags: {
      debug: "Debug",
    },
    fields: {
      rootFolderId: {
        label: "Folder główny",
        description:
          "Symulowany kontekst folderu (private, public, incognito, cron, shared, remote)",
        placeholder: "private",
      },
      userRole: {
        label: "Rola użytkownika",
        description: "Symulowana rola: public | customer | admin",
        placeholder: "admin",
      },
      userMessage: {
        label: "Wiadomość użytkownika",
        description: "Symulowana wiadomość do wyszukiwania embeddings w Cortex",
        placeholder: "O czym rozmawialiśmy ostatnio?",
      },
      threadId: {
        label: "ID wątku",
        description: "Opcjonalne ID wątku dla kontekstu",
        placeholder: "UUID lub puste",
      },
      userId: {
        label: "ID użytkownika",
        description:
          "Opcjonalne ID użytkownika do załadowania danych Cortex (domyślnie: własny)",
        placeholder: "UUID lub puste",
      },
      skillId: {
        label: "ID umiejętności",
        description: "Opcjonalne ID umiejętności do wstrzyknięcia w prompt",
        placeholder: "UUID umiejętności lub puste",
      },
      subFolderId: {
        label: "ID podfolderu",
        description: "Opcjonalne UUID podfolderu",
        placeholder: "UUID lub puste",
      },
    },
    response: {
      systemPrompt: { text: "System Prompt" },
      trailingSystemMessage: { text: "Trailing Context" },
      charCount: { text: "Znaki" },
      tokenEstimate: { text: "~Tokeny" },
      cortexDiagnostics: { text: "Diagnostyka Cortex Embeddings" },
    },
    errors: {
      validation: { title: "Błędne dane", description: "Sprawdź parametry" },
      network: { title: "Offline", description: "Brak połączenia z serwerem" },
      unauthorized: {
        title: "Niezalogowany",
        description: "Najpierw się zaloguj",
      },
      forbidden: {
        title: "Tylko admin",
        description: "Wymagany dostęp administratora",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Użytkownik lub zasób nie istnieje",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się zbudować promptu",
      },
      unknown: { title: "Błąd", description: "Coś poszło nie tak" },
      unsavedChanges: {
        title: "Niezapisane",
        description: "Zapisz lub odrzuć zmiany",
      },
      conflict: { title: "Konflikt", description: "Niespójny stan" },
    },
    success: {
      title: "Prompt gotowy",
      description: "System prompt wyrenderowany pomyślnie",
    },
  },
};
