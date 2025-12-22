import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Dialog behandeln",
  description: "Browser-Dialog behandeln (Warnung, Bestätigung, Eingabe)",

  form: {
    label: "Browser-Dialog behandeln",
    description: "Browser-Dialog akzeptieren oder ablehnen",
    fields: {
      action: {
        label: "Aktion",
        description: "Ob der Dialog abgelehnt oder akzeptiert werden soll",
        placeholder: "Aktion auswählen",
        options: {
          accept: "Akzeptieren",
          dismiss: "Ablehnen",
        },
      },
      promptText: {
        label: "Eingabetext",
        description: "Optionaler Eingabetext für den Dialog",
        placeholder: "Eingabetext eingeben (optional)",
      },
    },
  },

  response: {
    success: "Dialogbehandlung erfolgreich",
    result: "Ergebnis der Dialogbehandlung",
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
        "Ein Netzwerkfehler ist während der Dialogbehandlung aufgetreten",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description:
        "Sie sind nicht berechtigt, Dialogbehandlungen durchzuführen",
    },
    forbidden: {
      title: "Verboten",
      description: "Dialogbehandlung ist verboten",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Die angeforderte Ressource wurde nicht gefunden",
    },
    serverError: {
      title: "Serverfehler",
      description:
        "Ein interner Serverfehler ist während der Dialogbehandlung aufgetreten",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description:
        "Ein unbekannter Fehler ist während der Dialogbehandlung aufgetreten",
    },
    unsavedChanges: {
      title: "Nicht gespeicherte Änderungen",
      description:
        "Sie haben nicht gespeicherte Änderungen, die verloren gehen können",
    },
    conflict: {
      title: "Konflikt",
      description: "Ein Konflikt ist während der Dialogbehandlung aufgetreten",
    },
  },

  success: {
    title: "Dialogbehandlung erfolgreich",
    description: "Der Browser-Dialog wurde erfolgreich behandelt",
  },
};
