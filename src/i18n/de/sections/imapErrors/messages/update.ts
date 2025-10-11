import type { updateTranslations as EnglishUpdateTranslations } from "../../../../en/sections/imapErrors/messages/update";

export const updateTranslations: typeof EnglishUpdateTranslations = {
  error: {
    not_found: {
      title: "Nachricht nicht gefunden",
      description:
        "Die zu aktualisierende Nachricht konnte nicht gefunden werden.",
    },
    server: {
      title: "Server-Fehler",
      description:
        "Beim Aktualisieren der Nachricht ist ein Fehler aufgetreten.",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description:
        "Sie sind nicht berechtigt, diese Nachricht zu aktualisieren.",
    },
    forbidden: {
      title: "Verboten",
      description: "Das Aktualisieren dieser Nachricht ist verboten.",
    },
    validation: {
      title: "Validierungsfehler",
      description: "Die Aktualisierungsdaten sind ungültig.",
    },
  },
  success: {
    title: "Nachricht aktualisiert",
    description: "Nachricht wurde erfolgreich aktualisiert.",
  },
};
