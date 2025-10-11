import type { translations as enTranslations } from "../en";

/**
 * Template Stats API translations for German
 */

export const translations: typeof enTranslations = {
  // Common category and tags (shared from main template API)
  category: "Vorlagen-API",
  tags: {
    statistics: "Statistiken",
    analytics: "Analysen",
  },

  // Main stats endpoint
  title: "Vorlagenstatistiken abrufen",
  description: "Grundlegende Vorlagenstatistiken und Analysen abrufen",
  form: {
    title: "Statistikparameter",
    description: "Filter für Vorlagenstatistiken konfigurieren",
  },

  // Field labels
  status: {
    label: "Statusfilter",
    description: "Vorlagen nach ihrem Status filtern",
    placeholder: "Einen oder mehrere Status auswählen",
  },
  tagFilter: {
    label: "Tag-Filter",
    description: "Vorlagen nach Tags filtern",
    placeholder: "Ein oder mehrere Tags auswählen",
  },
  dateFrom: {
    label: "Startdatum",
    description: "Startdatum für den Statistikzeitraum",
    placeholder: "Startdatum auswählen",
  },
  dateTo: {
    label: "Enddatum",
    description: "Enddatum für den Statistikzeitraum",
    placeholder: "Enddatum auswählen",
  },

  // Response
  response: {
    title: "Statistikergebnisse",
    description: "Vorlagenstatistiken für den ausgewählten Zeitraum",
  },

  // Errors
  errors: {
    validation: {
      title: "Ungültige Parameter",
      description: "Die angegebenen Filterparameter sind ungültig",
    },
    unauthorized: {
      title: "Nicht Autorisiert",
      description:
        "Sie haben keine Berechtigung zum Anzeigen von Vorlagenstatistiken",
    },
    forbidden: {
      title: "Zugriff Verboten",
      description: "Der Zugriff auf Vorlagenstatistiken ist verboten",
    },
    notFound: {
      title: "Nicht Gefunden",
      description:
        "Die angeforderten Statistiken konnten nicht gefunden werden",
    },
    server: {
      title: "Serverfehler",
      description:
        "Beim Abrufen der Vorlagenstatistiken ist ein Fehler aufgetreten",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Verbindung zum Statistikdienst nicht möglich",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unerwarteter Fehler ist aufgetreten",
    },
    unsavedChanges: {
      title: "Ungespeicherte Änderungen",
      description: "Sie haben ungespeicherte Änderungen, die verloren gehen",
    },
    conflict: {
      title: "Konflikt",
      description:
        "Bei der Verarbeitung Ihrer Anfrage ist ein Konflikt aufgetreten",
    },
  },

  // Success
  success: {
    title: "Statistiken Abgerufen",
    description: "Vorlagenstatistiken erfolgreich abgerufen",
  },
};
