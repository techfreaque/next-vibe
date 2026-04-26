import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Klicken",
  description:
    "Maus zu absoluten Koordinaten bewegen und einen Mausklick ausführen",
  form: {
    label: "Klicken",
    description: "Maus zu den angegebenen Koordinaten bewegen und klicken",
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
      button: {
        label: "Maustaste",
        description: "Maustaste für den Klick (links, mitte, rechts)",
        placeholder: "links",
        options: {
          left: "Links",
          middle: "Mitte",
          right: "Rechts",
        },
      },
      doubleClick: {
        label: "Doppelklick",
        description: "Doppelklick statt einfachem Klick ausführen",
        placeholder: "false",
      },
    },
  },
  response: {
    success: "Klick erfolgreich ausgeführt",
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
        "Ein Netzwerkfehler ist beim Ausführen des Klicks aufgetreten",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Sie sind nicht berechtigt, Desktop-Klicks auszuführen",
    },
    forbidden: {
      title: "Verboten",
      description: "Das Ausführen von Desktop-Klicks ist verboten",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Die angeforderte Ressource wurde nicht gefunden",
    },
    serverError: {
      title: "Serverfehler",
      description:
        "Ein interner Serverfehler ist beim Ausführen des Klicks aufgetreten",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description:
        "Ein unbekannter Fehler ist beim Ausführen des Klicks aufgetreten",
    },
    unsavedChanges: {
      title: "Nicht gespeicherte Änderungen",
      description:
        "Sie haben nicht gespeicherte Änderungen, die verloren gehen können",
    },
    conflict: {
      title: "Konflikt",
      description: "Ein Konflikt ist beim Ausführen des Klicks aufgetreten",
    },
    notImplemented: {
      title: "Nicht implementiert",
      description:
        "Diese Funktion ist auf Ihrem Betriebssystem nicht verfügbar",
    },
  },
  success: {
    title: "Klick ausgeführt",
    description: "Der Mausklick wurde erfolgreich ausgeführt",
  },
  category: "Desktop",
  tags: {
    desktopAutomation: "Desktop-Automatisierung",
    inputAutomation: "Eingabe-Automatisierung",
  },
};
