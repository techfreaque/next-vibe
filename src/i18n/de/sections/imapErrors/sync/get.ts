import type { getTranslations as EnglishGetTranslations } from "../../../../en/sections/imapErrors/sync/get";

export const getTranslations: typeof EnglishGetTranslations = {
  error: {
    server: {
      title: "Server-Fehler",
      description:
        "Ein Fehler ist beim Abrufen des Synchronisationsstatus aufgetreten.",
    },
  },
};
