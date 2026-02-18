import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Synchronizuj foldery IMAP",
  description: "Synchronizuj foldery z konta IMAP",

  container: {
    title: "Konfiguracja synchronizacji folderów",
    description: "Skonfiguruj parametry synchronizacji folderów IMAP",
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
    description: "Wymuś ponowną synchronizację wszystkich folderów",
  },

  response: {
    foldersProcessed: "Przetworzone foldery",
    foldersAdded: "Dodane foldery",
    foldersUpdated: "Zaktualizowane foldery",
    foldersDeleted: "Usunięte foldery",
    duration: "Czas trwania (ms)",
    success: "Sukces",
  },

  info: {
    start: "Rozpoczynanie synchronizacji folderów",
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
    description: "Synchronizacja folderów IMAP zakończona pomyślnie",
  },
  widget: {
    title: "Synchronizuj foldery",
    result: "Wynik synchronizacji",
    duration: "Czas trwania",
  },
};
