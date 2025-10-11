import type { syncTranslations as EnglishSyncTranslations } from "../../../../en/sections/imapErrors/messages/sync";

export const syncTranslations: typeof EnglishSyncTranslations = {
  error: {
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Sie sind nicht berechtigt, Nachrichten zu synchronisieren.",
    },
    server: {
      title: "Server-Fehler",
      description:
        "Ein Fehler ist während der Nachrichtensynchronisation aufgetreten.",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description:
        "Ein unbekannter Fehler ist während der Nachrichtensynchronisation aufgetreten.",
    },
  },
  success: {
    title: "Nachrichten synchronisiert",
    description: "Nachrichten wurden erfolgreich synchronisiert.",
  },
};
