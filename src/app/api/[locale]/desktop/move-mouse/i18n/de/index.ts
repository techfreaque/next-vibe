import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Maus bewegen",
  description: "Den Mauszeiger zu absoluten Bildschirmkoordinaten bewegen",
  form: {
    label: "Maus bewegen",
    description: "Den Mauszeiger zur angegebenen Bildschirmposition bewegen",
    fields: {
      x: {
        label: "X-Koordinate",
        description:
          "Horizontale Bildschirmkoordinate in Pixeln (vom linken Rand)",
        placeholder: "100",
      },
      y: {
        label: "Y-Koordinate",
        description:
          "Vertikale Bildschirmkoordinate in Pixeln (vom oberen Rand)",
        placeholder: "200",
      },
    },
  },
  response: {
    success: "Maus erfolgreich bewegt",
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
      description: "Ein Netzwerkfehler ist beim Bewegen der Maus aufgetreten",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description:
        "Sie sind nicht berechtigt, die Maus auf dem Desktop zu bewegen",
    },
    forbidden: {
      title: "Verboten",
      description: "Das Bewegen der Maus auf dem Desktop ist verboten",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Die angeforderte Ressource wurde nicht gefunden",
    },
    serverError: {
      title: "Serverfehler",
      description:
        "Ein interner Serverfehler ist beim Bewegen der Maus aufgetreten",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description:
        "Ein unbekannter Fehler ist beim Bewegen der Maus aufgetreten",
    },
    unsavedChanges: {
      title: "Nicht gespeicherte Änderungen",
      description:
        "Sie haben nicht gespeicherte Änderungen, die verloren gehen können",
    },
    conflict: {
      title: "Konflikt",
      description: "Ein Konflikt ist beim Bewegen der Maus aufgetreten",
    },
    notImplemented: {
      title: "Nicht implementiert",
      description:
        "Diese Funktion ist auf Ihrem Betriebssystem nicht verfügbar",
    },
  },
  success: {
    title: "Maus bewegt",
    description: "Der Mauszeiger wurde erfolgreich bewegt",
  },
  category: "Desktop",
  tags: {
    desktopAutomation: "Desktop-Automatisierung",
    inputAutomation: "Eingabe-Automatisierung",
  },
};
