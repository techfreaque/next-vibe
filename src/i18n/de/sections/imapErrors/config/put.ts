import type { putTranslations as EnglishPutTranslations } from "../../../../en/sections/imapErrors/config/put";

export const putTranslations: typeof EnglishPutTranslations = {
  error: {
    unauthorized: {
      title: "Nicht autorisiert",
      description:
        "Sie sind nicht berechtigt, die Konfiguration zu aktualisieren.",
    },
    server: {
      title: "Server-Fehler",
      description:
        "Ein Fehler ist beim Aktualisieren der Konfiguration aufgetreten.",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description:
        "Ein unbekannter Fehler ist beim Aktualisieren der Konfiguration aufgetreten.",
    },
  },
  success: {
    title: "Konfiguration aktualisiert",
    description: "IMAP-Konfiguration wurde erfolgreich aktualisiert.",
  },
};
