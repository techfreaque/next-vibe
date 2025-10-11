import type { syncTranslations as EnglishSyncTranslations } from "../../../../en/sections/imapErrors/folders/sync";

export const syncTranslations: typeof EnglishSyncTranslations = {
  error: {
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Sie sind nicht berechtigt, Ordner zu synchronisieren.",
    },
    server: {
      title: "Server-Fehler",
      description:
        "Ein Fehler ist während der Ordnersynchronisation aufgetreten.",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description:
        "Ein unbekannter Fehler ist während der Ordnersynchronisation aufgetreten.",
    },
    missing_account: {
      title: "Konto erforderlich",
      description: "Konto-ID ist für die Ordner-Synchronisation erforderlich.",
    },
  },
  success: {
    title: "Ordner synchronisiert",
    description: "Ordner wurden erfolgreich synchronisiert.",
  },
};
