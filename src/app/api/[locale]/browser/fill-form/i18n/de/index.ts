import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Formular ausfüllen",
  description: "Mehrere Formularelemente gleichzeitig ausfüllen",

  form: {
    label: "Formularelemente ausfüllen",
    description: "Mehrere Formularelemente gleichzeitig ausfüllen",
    fields: {
      elements: {
        label: "Formularelemente",
        description: "Array von Elementen aus dem Snapshot zum Ausfüllen",
        placeholder: "Formularelemente eingeben (JSON-Array)",
        uid: {
          label: "Element-UID",
          description: "Die eindeutige Kennung des auszufüllenden Elements",
        },
        value: {
          label: "Wert",
          description: "Der in das Element einzutragende Wert",
        },
      },
    },
  },

  response: {
    success: "Formularausfüllen erfolgreich",
    result: {
      title: "Ergebnis",
      description: "Ergebnis des Formularausfüllens",
      filled: "Alle ausgefüllt",
      filledCount: "Anzahl ausgefüllt",
      elements: {
        uid: "Element-UID",
        filled: "Erfolgreich ausgefüllt",
      },
    },
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
      description: "Ein Netzwerkfehler ist während des Formularausfüllens aufgetreten",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Sie sind nicht berechtigt, Formularausfüllvorgänge durchzuführen",
    },
    forbidden: {
      title: "Verboten",
      description: "Formularausfüllen ist verboten",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Die angeforderte Ressource wurde nicht gefunden",
    },
    serverError: {
      title: "Serverfehler",
      description: "Ein interner Serverfehler ist während des Formularausfüllens aufgetreten",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unbekannter Fehler ist während des Formularausfüllens aufgetreten",
    },
    unsavedChanges: {
      title: "Nicht gespeicherte Änderungen",
      description: "Sie haben nicht gespeicherte Änderungen, die verloren gehen können",
    },
    conflict: {
      title: "Konflikt",
      description: "Ein Konflikt ist während des Formularausfüllens aufgetreten",
    },
  },

  success: {
    title: "Formularausfüllen erfolgreich",
    description: "Alle Formularelemente wurden erfolgreich ausgefüllt",
  },
};
