/**
 * Click Tool translations (German)
 */

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Element klicken",
  description: "Klickt auf das angegebene Element",

  form: {
    label: "Element klicken",
    description: "Klicken Sie auf ein bestimmtes Element auf der Seite",
    fields: {
      uid: {
        label: "Element-UID",
        description:
          "Die UID eines Elements auf der Seite aus dem Seiteninhalt-Snapshot",
        placeholder: "Element-UID eingeben",
      },
      dblClick: {
        label: "Doppelklick",
        description: "Auf true setzen für Doppelklicks. Standard ist false",
      },
    },
  },

  response: {
    success: "Klickvorgang erfolgreich",
    result: "Ergebnis des Klickvorgangs",
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
        "Ein Netzwerkfehler ist während des Klickvorgangs aufgetreten",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Sie sind nicht berechtigt, Klickvorgänge durchzuführen",
    },
    forbidden: {
      title: "Verboten",
      description: "Klickvorgang ist verboten",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Das angeforderte Element wurde nicht gefunden",
    },
    serverError: {
      title: "Serverfehler",
      description:
        "Ein interner Serverfehler ist während des Klickvorgangs aufgetreten",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description:
        "Ein unbekannter Fehler ist während des Klickvorgangs aufgetreten",
    },
    unsavedChanges: {
      title: "Nicht gespeicherte Änderungen",
      description:
        "Sie haben nicht gespeicherte Änderungen, die verloren gehen können",
    },
    conflict: {
      title: "Konflikt",
      description: "Ein Konflikt ist während des Klickvorgangs aufgetreten",
    },
  },

  success: {
    title: "Klickvorgang erfolgreich",
    description: "Das Element wurde erfolgreich geklickt",
  },
};
