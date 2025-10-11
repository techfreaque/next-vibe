import type { syncTranslations as EnglishSyncTranslations } from "../../../../en/sections/imapErrors/messages/sync";

export const syncTranslations: typeof EnglishSyncTranslations = {
  error: {
    unauthorized: {
      title: "Brak autoryzacji",
      description: "Nie masz uprawnień do synchronizacji wiadomości.",
    },
    server: {
      title: "Błąd serwera",
      description: "Wystąpił błąd podczas synchronizacji wiadomości.",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieznany błąd podczas synchronizacji wiadomości.",
    },
  },
  success: {
    title: "Wiadomości zsynchronizowane",
    description: "Wiadomości zostały pomyślnie zsynchronizowane.",
  },
};
