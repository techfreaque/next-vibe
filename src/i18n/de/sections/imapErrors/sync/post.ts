import type { postTranslations as EnglishPostTranslations } from "../../../../en/sections/imapErrors/sync/post";

export const postTranslations: typeof EnglishPostTranslations = {
  error: {
    invalid_accounts: {
      title: "Ungültige Konten",
      description:
        "Ein oder mehrere angegebene Konten konnten nicht gefunden werden.",
    },
    server: {
      title: "Server-Fehler",
      description: "Ein Fehler ist während der Synchronisation aufgetreten.",
    },
  },
};
