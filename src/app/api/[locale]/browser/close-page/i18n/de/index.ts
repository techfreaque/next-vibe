/**
 * Close Page Tool translations (German)
 */

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Seite schließen",
  description:
    "Schließt die Seite nach ihrem Index. Die letzte offene Seite kann nicht geschlossen werden",

  form: {
    label: "Seite schließen",
    description: "Eine Browser-Seite nach ihrem Index schließen",
    fields: {
      pageIdx: {
        label: "Seiten-Index",
        description:
          "Der Index der zu schließenden Seite. Rufen Sie list_pages auf, um Seiten aufzulisten",
        placeholder: "Seiten-Index eingeben (z.B. 0)",
      },
    },
  },

  response: {
    success: "Seite erfolgreich geschlossen",
    result: "Ergebnis der Seiten-Schließung",
    error: "Fehlermeldung",
    executionId: "Ausführungs-ID zur Verfolgung",
  },

  errors: {
    validation: {
      title: "Validierungsfehler",
      description:
        "Bitte überprüfen Sie Ihre Eingabe und versuchen Sie es erneut",
    },
    network: {
      title: "Netzwerkfehler",
      description:
        "Ein Netzwerkfehler ist beim Schließen der Seite aufgetreten",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Sie sind nicht berechtigt, Seiten zu schließen",
    },
    forbidden: {
      title: "Verboten",
      description: "Das Schließen der Seite ist verboten",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Die angeforderte Seite wurde nicht gefunden",
    },
    serverError: {
      title: "Serverfehler",
      description:
        "Ein interner Serverfehler ist beim Schließen der Seite aufgetreten",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description:
        "Ein unbekannter Fehler ist beim Schließen der Seite aufgetreten",
    },
    unsavedChanges: {
      title: "Nicht gespeicherte Änderungen",
      description:
        "Sie haben nicht gespeicherte Änderungen, die verloren gehen können",
    },
    conflict: {
      title: "Konflikt",
      description: "Ein Konflikt ist beim Schließen der Seite aufgetreten",
    },
  },

  success: {
    title: "Seite erfolgreich geschlossen",
    description: "Die Seite wurde erfolgreich geschlossen",
  },
};
