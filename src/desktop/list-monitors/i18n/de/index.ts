import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Monitore auflisten",
  description:
    "Alle verbundenen Monitore mit Auflösung, Position und Index auflisten",
  form: {
    label: "Monitore auflisten",
    description:
      "Alle angeschlossenen Bildschirme aufzählen. Monitornamen für gezielte Screenshots verwenden.",
    fields: {},
  },
  response: {
    success: "Monitore erfolgreich aufgelistet",
    monitors: "Array der verbundenen Monitore",
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
        "Ein Netzwerkfehler ist beim Auflisten der Monitore aufgetreten",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Sie sind nicht berechtigt, Monitore aufzulisten",
    },
    forbidden: {
      title: "Verboten",
      description: "Das Auflisten von Monitoren ist verboten",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Die angeforderte Ressource wurde nicht gefunden",
    },
    serverError: {
      title: "Serverfehler",
      description:
        "Ein interner Serverfehler ist beim Auflisten der Monitore aufgetreten",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description:
        "Ein unbekannter Fehler ist beim Auflisten der Monitore aufgetreten",
    },
    unsavedChanges: {
      title: "Nicht gespeicherte Änderungen",
      description:
        "Sie haben nicht gespeicherte Änderungen, die verloren gehen können",
    },
    conflict: {
      title: "Konflikt",
      description: "Ein Konflikt ist beim Auflisten der Monitore aufgetreten",
    },
    notImplemented: {
      title: "Nicht implementiert",
      description:
        "Monitor-Auflistung ist auf Ihrem Betriebssystem nicht verfügbar",
    },
  },
  success: {
    title: "Monitore aufgelistet",
    description: "Alle verbundenen Monitore wurden erfolgreich aufgelistet",
  },
  category: "Desktop",
  tags: {
    desktopAutomation: "Desktop-Automatisierung",
    captureAutomation: "Erfassungs-Automatisierung",
  },
};
