import type { getTranslations as EnglishGetTranslations } from "../../../../en/sections/imapErrors/folders/get";

export const getTranslations: typeof EnglishGetTranslations = {
  error: {
    not_found: {
      title: "Ordner nicht gefunden",
      description: "Der angeforderte Ordner konnte nicht gefunden werden.",
    },
    server: {
      title: "Server-Fehler",
      description: "Ein Fehler ist beim Abrufen der Ordner aufgetreten.",
    },
  },
};
