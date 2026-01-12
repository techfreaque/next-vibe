/**
 * Drag Tool translations (German)
 */

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Element ziehen",
  description: "Ein Element auf ein anderes Element ziehen",

  form: {
    label: "Element ziehen",
    description: "Ein Element auf ein anderes Element ziehen",
    fields: {
      from_uid: {
        label: "Quell-Element UID",
        description: "Die UID des zu ziehenden Elements",
        placeholder: "Quell-Element UID eingeben",
      },
      to_uid: {
        label: "Ziel-Element UID",
        description: "Die UID des Zielelements",
        placeholder: "Ziel-Element UID eingeben",
      },
    },
  },

  response: {
    success: "Ziehvorgang erfolgreich",
    result: "Ergebnis des Ziehvorgangs",
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
        "Ein Netzwerkfehler ist während des Ziehvorgangs aufgetreten",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Sie sind nicht berechtigt, Ziehvorgänge durchzuführen",
    },
    forbidden: {
      title: "Verboten",
      description: "Ziehvorgang ist verboten",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Das angeforderte Element wurde nicht gefunden",
    },
    serverError: {
      title: "Serverfehler",
      description:
        "Ein interner Serverfehler ist während des Ziehvorgangs aufgetreten",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description:
        "Ein unbekannter Fehler ist während des Ziehvorgangs aufgetreten",
    },
    unsavedChanges: {
      title: "Nicht gespeicherte Änderungen",
      description:
        "Sie haben nicht gespeicherte Änderungen, die verloren gehen können",
    },
    conflict: {
      title: "Konflikt",
      description: "Ein Konflikt ist während des Ziehvorgangs aufgetreten",
    },
  },

  success: {
    title: "Ziehvorgang erfolgreich",
    description: "Das Element wurde erfolgreich gezogen",
  },
};
