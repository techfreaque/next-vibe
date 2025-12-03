import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Synchronizuj wiadomości IMAP",
  description: "Synchronizuj wiadomości z folderów konta IMAP",

  container: {
    title: "Konfiguracja synchronizacji wiadomości",
    description: "Skonfiguruj parametry synchronizacji wiadomości IMAP",
  },

  accountId: {
    label: "ID konta",
    description: "Identyfikator konta IMAP",
    placeholder: "Wprowadź ID konta IMAP",
  },

  folderId: {
    label: "ID folderu",
    description: "Konkretny folder do synchronizacji (opcjonalny)",
    placeholder: "Wprowadź ID folderu aby zsynchronizować konkretny folder",
  },

  force: {
    label: "Wymuś synchronizację",
    description: "Wymuś ponowną synchronizację wszystkich wiadomości",
  },

  response: {
    success: "Sukces",
    message: "Komunikat statusu synchronizacji",

    results: {
      title: "Wyniki synchronizacji",
      description: "Statystyki synchronizacji wiadomości",
      messagesProcessed: "Przetworzone wiadomości",
      messagesAdded: "Dodane wiadomości",
      messagesUpdated: "Zaktualizowane wiadomości",
      messagesDeleted: "Usunięte wiadomości",
      duration: "Czas trwania (ms)",
    },

    errors: {
      title: "Błędy synchronizacji",
      description: "Błędy napotkane podczas synchronizacji",
      error: {
        title: "Szczegóły błędu",
        description: "Informacje o pojedynczym błędzie",
        code: "Kod błędu",
        message: "Komunikat błędu",
      },
    },
  },

  errors: {
    validation: {
      title: "Walidacja nie powiodła się",
      description: "Parametry żądania są nieprawidłowe",
    },
    unauthorized: {
      title: "Brak autoryzacji",
      description: "Wymagana autoryzacja do dostępu do tego punktu końcowego",
    },
    forbidden: {
      title: "Dostęp zabroniony",
      description: "Niewystarczające uprawnienia do wykonania tej operacji",
    },
    server: {
      title: "Błąd serwera",
      description: "Wystąpił wewnętrzny błąd serwera podczas synchronizacji",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieoczekiwany błąd",
    },
    conflict: {
      title: "Błąd konfliktu",
      description: "Wystąpił konflikt danych podczas synchronizacji",
    },
    network: {
      title: "Błąd sieci",
      description: "Wystąpił błąd sieci podczas synchronizacji",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Żądany zasób nie został znaleziony",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Istnieją niezapisane zmiany",
    },
  },

  success: {
    title: "Synchronizacja zakończona",
    description: "Synchronizacja wiadomości IMAP zakończona pomyślnie",
  },
};
