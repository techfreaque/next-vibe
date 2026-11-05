import type { translations as enTranslations } from "../en";
export const translations: typeof enTranslations = {
  get: {
    title: "Debug System Prompt",
    titleShort: "Debug prompt",
    description:
      "Pokazuje dokładny system prompt, który AI dostaje w danym kontekście — folder, skill, wątek, wiadomość.",
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
        options: {
          private: "Prywatny",
          shared: "Udostępniony",
          public: "Publiczny",
          incognito: "Incognito",
          background: "W tle",
          remote: "Zdalny",
        },
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
      imageGenModelSelection: {
        label: "Wybór modelu obrazów",
        description:
          "Wybór modelu generowania obrazów z aktywnego ulubionego/UI czatu (puste = domyślny użytkownika)",
        placeholder: "puste = domyślny użytkownika",
      },
      musicGenModelSelection: {
        label: "Wybór modelu muzyki",
        description:
          "Wybór modelu generowania muzyki z aktywnego ulubionego/UI czatu (puste = domyślny użytkownika)",
        placeholder: "puste = domyślny użytkownika",
      },
      videoGenModelSelection: {
        label: "Wybór modelu wideo",
        description:
          "Wybór modelu generowania wideo z aktywnego ulubionego/UI czatu (puste = domyślny użytkownika)",
        placeholder: "puste = domyślny użytkownika",
      },
    },
    response: {
      systemPrompt: { text: "System Prompt" },
      trailingSystemMessage: { text: "Trailing Context" },
      charCount: { text: "Znaki" },
      tokenEstimate: { text: "~Tokeny" },
      cortexDiagnostics: { text: "Diagnostyka Cortex Embeddings" },
      messageContextLines: { text: "Linie kontekstu wiadomości" },
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
    widget: {
      emptyTitle: "Wybierz kontekst",
      emptyMessage: "Wybierz folder, opcjonalnie wiadomość, i zbuduj prompt.",
      chars: "Znaki",
      tokens: "~Tokeny",
      cortexFailed:
        "Embedding Cortex nie powiódł się — brak klucza API lub błąd dostawcy.",
      cortexNoNodes:
        "Embedding wygenerowany, ale żaden węzeł Cortex nie ma jeszcze embeddingów.",
      cortexPassing: "{{passing}} z {{total}} trafień powyżej progu",
      noTrailing: "Brak kontekstu końcowego dla tego zapytania.",
    },
    success: {
      title: "Prompt gotowy",
      description: "System prompt wyrenderowany pomyślnie",
    },
  },
};
