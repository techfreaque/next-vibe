import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Fenster auflisten",
  description: "Alle offenen Fenster auf dem Desktop auflisten",
  form: {
    label: "Fenster auflisten",
    description:
      "Eine Liste aller offenen Fenster mit IDs, Titeln und Positionen abrufen",
    fields: {},
  },
  response: {
    success: "Fensterliste erfolgreich abgerufen",
    windows: "Liste der offenen Fenster",
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
        "Ein Netzwerkfehler ist beim Auflisten der Fenster aufgetreten",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Sie sind nicht berechtigt, Fenster aufzulisten",
    },
    forbidden: {
      title: "Verboten",
      description: "Das Auflisten von Fenstern ist verboten",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Keine Fenster gefunden",
    },
    serverError: {
      title: "Serverfehler",
      description:
        "Ein interner Serverfehler ist beim Auflisten der Fenster aufgetreten",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description:
        "Ein unbekannter Fehler ist beim Auflisten der Fenster aufgetreten",
    },
    unsavedChanges: {
      title: "Nicht gespeicherte Änderungen",
      description:
        "Sie haben nicht gespeicherte Änderungen, die verloren gehen können",
    },
    conflict: {
      title: "Konflikt",
      description: "Ein Konflikt ist beim Auflisten der Fenster aufgetreten",
    },
    notImplemented: {
      title: "Nicht implementiert",
      description:
        "Diese Funktion ist auf Ihrem Betriebssystem nicht verfügbar",
    },
  },
  success: {
    title: "Fenster aufgelistet",
    description: "Die Fensterliste wurde erfolgreich abgerufen",
  },
  category: "Desktop",
  tags: {
    desktopAutomation: "Desktop-Automatisierung",
    windowManagement: "Fensterverwaltung",
  },
};
