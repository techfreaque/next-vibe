import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Leistungs-Trace stoppen",
  description:
    "Stoppt die aktive Leistungs-Trace-Aufzeichnung auf der ausgewählten Seite und gibt Leistungsmetriken zurück",
  form: {
    label: "Leistungs-Trace stoppen",
    description: "Stoppe die aktive Leistungs-Trace-Aufzeichnung",
    fields: {},
  },
  response: {
    success: "Leistungs-Trace erfolgreich gestoppt",
    result: "Ergebnis des Leistungs-Trace-Stopps mit Metriken",
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
      description: "Ein Netzwerkfehler ist beim Stoppen des Leistungs-Traces aufgetreten",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Sie sind nicht berechtigt, Leistungs-Traces zu stoppen",
    },
    forbidden: {
      title: "Verboten",
      description: "Stoppen von Leistungs-Traces ist verboten",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Die angeforderte Ressource wurde nicht gefunden",
    },
    serverError: {
      title: "Serverfehler",
      description: "Ein interner Serverfehler ist beim Stoppen des Leistungs-Traces aufgetreten",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unbekannter Fehler ist beim Stoppen des Leistungs-Traces aufgetreten",
    },
    unsavedChanges: {
      title: "Nicht gespeicherte Änderungen",
      description: "Sie haben nicht gespeicherte Änderungen, die verloren gehen können",
    },
    conflict: {
      title: "Konflikt",
      description: "Ein Konflikt ist beim Stoppen des Leistungs-Traces aufgetreten",
    },
  },
  success: {
    title: "Leistungs-Trace erfolgreich gestoppt",
    description: "Der Leistungs-Trace wurde erfolgreich gestoppt",
  },
};
