import type { syncTranslations as EnglishSyncTranslations } from "../../../../en/sections/imapErrors/folders/sync";

export const syncTranslations: typeof EnglishSyncTranslations = {
  error: {
    unauthorized: {
      title: "Brak autoryzacji",
      description: "Nie masz uprawnień do synchronizacji folderów.",
    },
    server: {
      title: "Błąd serwera",
      description: "Wystąpił błąd podczas synchronizacji folderów.",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieznany błąd podczas synchronizacji folderów.",
    },
    missing_account: {
      title: "Wymagane konto",
      description: "ID konta jest wymagane do synchronizacji folderów.",
    },
  },
  success: {
    title: "Foldery zsynchronizowane",
    description: "Foldery zostały pomyślnie zsynchronizowane.",
  },
};
