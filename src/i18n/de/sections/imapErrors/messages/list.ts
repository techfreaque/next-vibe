import type { listTranslations as EnglishListTranslations } from "../../../../en/sections/imapErrors/messages/list";

export const listTranslations: typeof EnglishListTranslations = {
  error: {
    validation: {
      title: "Validierungsfehler",
      description:
        "Ungültige Parameter für die Nachrichtenauflistung angegeben.",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Sie sind nicht berechtigt, Nachrichten aufzulisten.",
    },
    server: {
      title: "Server-Fehler",
      description: "Ein Fehler ist beim Auflisten der Nachrichten aufgetreten.",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description:
        "Ein unbekannter Fehler ist beim Auflisten der Nachrichten aufgetreten.",
    },
  },
  success: {
    title: "Nachrichten aufgelistet",
    description: "Nachrichten wurden erfolgreich aufgelistet.",
  },
};
