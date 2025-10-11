import type { listTranslations as EnglishListTranslations } from "../../../../en/sections/imapErrors/folders/list";

export const listTranslations: typeof EnglishListTranslations = {
  error: {
    validation: {
      title: "Validierungsfehler",
      description: "Ungültige Parameter für die Ordnerauflistung angegeben.",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Sie sind nicht berechtigt, Ordner aufzulisten.",
    },
    server: {
      title: "Server-Fehler",
      description: "Ein Fehler ist beim Auflisten der Ordner aufgetreten.",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description:
        "Ein unbekannter Fehler ist beim Auflisten der Ordner aufgetreten.",
    },
  },
  success: {
    title: "Ordner aufgelistet",
    description: "Ordner wurden erfolgreich aufgelistet.",
  },
};
