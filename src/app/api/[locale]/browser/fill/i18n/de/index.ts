import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Ausfüllen",
  description:
    "Text in ein Eingabefeld, Textbereich eingeben oder Option aus einem Select-Element auswählen",

  form: {
    label: "Element ausfüllen",
    description: "Text in ein Formularelement eingeben",
    fields: {
      uid: {
        label: "Element-UID",
        description: "Die UID eines Elements auf der Seite aus dem Seiteninhalt-Snapshot",
        placeholder: "Element-UID eingeben",
      },
      value: {
        label: "Wert",
        description: "Der einzugebende Wert",
        placeholder: "Auszufüllenden Wert eingeben",
      },
    },
  },

  response: {
    success: "Ausfüllvorgang erfolgreich",
    result: "Ergebnis des Ausfüllvorgangs",
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
      description: "Ein Netzwerkfehler ist während des Ausfüllvorgangs aufgetreten",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Sie sind nicht berechtigt, Ausfüllvorgänge durchzuführen",
    },
    forbidden: {
      title: "Verboten",
      description: "Ausfüllvorgang ist verboten",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Die angeforderte Ressource wurde nicht gefunden",
    },
    serverError: {
      title: "Serverfehler",
      description: "Ein interner Serverfehler ist während des Ausfüllvorgangs aufgetreten",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unbekannter Fehler ist während des Ausfüllvorgangs aufgetreten",
    },
    unsavedChanges: {
      title: "Nicht gespeicherte Änderungen",
      description: "Sie haben nicht gespeicherte Änderungen, die verloren gehen können",
    },
    conflict: {
      title: "Konflikt",
      description: "Ein Konflikt ist während des Ausfüllvorgangs aufgetreten",
    },
  },

  success: {
    title: "Ausfüllvorgang erfolgreich",
    description: "Das Element wurde erfolgreich ausgefüllt",
  },
};
