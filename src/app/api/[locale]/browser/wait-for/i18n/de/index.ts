import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Warten auf",
  description: "Warten, bis der angegebene Text auf der ausgewählten Seite erscheint",

  form: {
    label: "Auf Text warten",
    description: "Warten, bis ein bestimmter Text auf der Seite erscheint",
    fields: {
      text: {
        label: "Text",
        description: "Text, der auf der Seite erscheinen soll",
        placeholder: "Text eingeben, auf den gewartet werden soll",
      },
      timeout: {
        label: "Timeout",
        description: "Maximale Wartezeit in Millisekunden. Bei 0 wird der Standard-Timeout verwendet",
        placeholder: "Timeout eingeben (ms)",
      },
    },
  },

  response: {
    success: "Wartevorgang erfolgreich",
    result: "Ergebnis des Wartevorgangs",
    error: "Fehlermeldung",
    executionId: "Ausführungs-ID zur Verfolgung",
  },

  errors: {
    validation: {
      title: "Validierungsfehler",
      description: "Bitte überprüfen Sie Ihre Eingabe und versuchen Sie es erneut",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Ein Netzwerkfehler ist während des Wartevorgangs aufgetreten",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Sie sind nicht berechtigt, Wartevorgänge durchzuführen",
    },
    forbidden: {
      title: "Verboten",
      description: "Wartevorgang ist verboten",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Die angeforderte Ressource wurde nicht gefunden",
    },
    serverError: {
      title: "Serverfehler",
      description: "Ein interner Serverfehler ist während des Wartevorgangs aufgetreten",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unbekannter Fehler ist während des Wartevorgangs aufgetreten",
    },
    unsavedChanges: {
      title: "Nicht gespeicherte Änderungen",
      description: "Sie haben nicht gespeicherte Änderungen, die verloren gehen können",
    },
    conflict: {
      title: "Konflikt",
      description: "Ein Konflikt ist während des Wartevorgangs aufgetreten",
    },
  },

  success: {
    title: "Wartevorgang erfolgreich",
    description: "Der angegebene Text ist auf der Seite erschienen",
  },
};
