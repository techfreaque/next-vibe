import type { errorTranslations as EnglishErrorTranslations } from "../../../../en/sections/imapErrors/sync/error";

export const errorTranslations: typeof EnglishErrorTranslations = {
  unauthorized: {
    title: "Nicht autorisiert",
    description:
      "Sie sind nicht berechtigt, eine Synchronisation durchzuführen.",
  },
  server: {
    title: "Server-Fehler",
    description: "Ein Fehler ist während der Synchronisation aufgetreten.",
  },
  unknown: {
    title: "Unbekannter Fehler",
    description:
      "Ein unbekannter Fehler ist während der Synchronisation aufgetreten.",
  },
};
