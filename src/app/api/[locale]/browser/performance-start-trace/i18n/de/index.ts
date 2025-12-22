import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Leistungs-Trace starten",
  description:
    "Startet eine Leistungs-Trace-Aufzeichnung auf der ausgewählten Seite zur Analyse von Leistungsmetriken und Core Web Vitals",
  form: {
    label: "Leistungs-Trace starten",
    description:
      "Beginne mit der Aufzeichnung von Leistungsmetriken für die Browser-Seite",
    fields: {
      reload: {
        label: "Seite neu laden",
        description:
          "Bestimmt, ob die Seite automatisch neu geladen werden soll, sobald die Aufzeichnung gestartet wurde",
        placeholder: "true",
      },
      autoStop: {
        label: "Automatisch stoppen",
        description:
          "Bestimmt, ob die Trace-Aufzeichnung automatisch gestoppt werden soll",
        placeholder: "true",
      },
    },
  },
  response: {
    success: "Leistungs-Trace erfolgreich gestartet",
    result: "Ergebnis des Leistungs-Trace-Starts",
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
        "Ein Netzwerkfehler ist beim Starten des Leistungs-Traces aufgetreten",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Sie sind nicht berechtigt, Leistungs-Traces zu starten",
    },
    forbidden: {
      title: "Verboten",
      description: "Starten von Leistungs-Traces ist verboten",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Die angeforderte Ressource wurde nicht gefunden",
    },
    serverError: {
      title: "Serverfehler",
      description:
        "Ein interner Serverfehler ist beim Starten des Leistungs-Traces aufgetreten",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description:
        "Ein unbekannter Fehler ist beim Starten des Leistungs-Traces aufgetreten",
    },
    unsavedChanges: {
      title: "Nicht gespeicherte Änderungen",
      description:
        "Sie haben nicht gespeicherte Änderungen, die verloren gehen können",
    },
    conflict: {
      title: "Konflikt",
      description:
        "Ein Konflikt ist beim Starten des Leistungs-Traces aufgetreten",
    },
  },
  success: {
    title: "Leistungs-Trace erfolgreich gestartet",
    description: "Der Leistungs-Trace wurde erfolgreich gestartet",
  },
};
