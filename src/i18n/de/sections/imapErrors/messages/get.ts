import type { getTranslations as EnglishGetTranslations } from "../../../../en/sections/imapErrors/messages/get";

export const getTranslations: typeof EnglishGetTranslations = {
  error: {
    not_found: {
      title: "Nachricht nicht gefunden",
      description: "Die angeforderte Nachricht konnte nicht gefunden werden.",
    },
    server: {
      title: "Server-Fehler",
      description: "Ein Fehler ist beim Abrufen der Nachrichten aufgetreten.",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Sie sind nicht berechtigt, diese Nachricht anzuzeigen.",
    },
    forbidden: {
      title: "Verboten",
      description: "Der Zugriff auf diese Nachricht ist verboten.",
    },
    validation: {
      title: "Validierungsfehler",
      description: "Die Nachrichtendaten sind ungültig.",
    },
  },
  success: {
    title: "Nachricht abgerufen",
    description: "Nachricht wurde erfolgreich abgerufen.",
  },
};
