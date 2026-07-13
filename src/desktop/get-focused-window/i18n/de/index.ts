import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Fokussiertes Fenster abrufen",
  description: "Informationen über das aktuell fokussierte Fenster abrufen",
  form: {
    label: "Fokussiertes Fenster abrufen",
    description: "Fenster-ID, Titel und PID des aktiven Fensters abrufen",
    fields: {},
  },
  response: {
    success: "Informationen zum fokussierten Fenster erfolgreich abgerufen",
    windowId: "X11-Fenster-ID des fokussierten Fensters",
    windowTitle: "Titeltext des fokussierten Fensters",
    pid: "Prozess-ID des fokussierten Fensters",
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
        "Ein Netzwerkfehler ist beim Abrufen des fokussierten Fensters aufgetreten",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Sie sind nicht berechtigt, Fensterinformationen abzurufen",
    },
    forbidden: {
      title: "Verboten",
      description: "Das Abrufen von Fensterinformationen ist verboten",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Kein fokussiertes Fenster gefunden",
    },
    serverError: {
      title: "Serverfehler",
      description:
        "Ein interner Serverfehler ist beim Abrufen des fokussierten Fensters aufgetreten",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description:
        "Ein unbekannter Fehler ist beim Abrufen des fokussierten Fensters aufgetreten",
    },
    unsavedChanges: {
      title: "Nicht gespeicherte Änderungen",
      description:
        "Sie haben nicht gespeicherte Änderungen, die verloren gehen können",
    },
    conflict: {
      title: "Konflikt",
      description:
        "Ein Konflikt ist beim Abrufen des fokussierten Fensters aufgetreten",
    },
    notImplemented: {
      title: "Nicht implementiert",
      description:
        "Diese Funktion ist auf Ihrem Betriebssystem nicht verfügbar",
    },
  },
  success: {
    title: "Fokussiertes Fenster abgerufen",
    description:
      "Die Informationen zum fokussierten Fenster wurden erfolgreich abgerufen",
  },
  category: "Desktop",
  tags: {
    desktopAutomation: "Desktop-Automatisierung",
    windowManagement: "Fensterverwaltung",
  },
};
