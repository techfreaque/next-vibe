import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Skript auswerten",
  description:
    "Eine JavaScript-Funktion in der aktuell ausgewählten Seite auswerten",
  form: {
    label: "Skript auswerten",
    description: "JavaScript in der Browser-Seite ausführen",
    fields: {
      function: {
        label: "Funktion",
        description: "JavaScript-Funktionsdeklaration zum Ausführen",
        placeholder: "() => { return document.title; }",
      },
      args: {
        label: "Argumente",
        description:
          "Optionale Liste von Argumenten (Element-UIDs) zur Übergabe an die Funktion",
        placeholder: '[{"uid": "element-uid"}]',
        uid: {
          label: "Element-UID",
          description: "Die eindeutige Kennung eines Elements auf der Seite",
        },
      },
    },
  },
  response: {
    success: "Skript-Auswertung erfolgreich",
    result: {
      title: "Ergebnis",
      description: "Ergebnis der Skript-Auswertung",
      executed: "Ausgeführt",
      result: "Rückgabewert",
    },
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
        "Ein Netzwerkfehler ist während der Skript-Auswertung aufgetreten",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Sie sind nicht berechtigt, Skripte auszuwerten",
    },
    forbidden: {
      title: "Verboten",
      description: "Skript-Auswertung ist verboten",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Die angeforderte Ressource wurde nicht gefunden",
    },
    serverError: {
      title: "Serverfehler",
      description:
        "Ein interner Serverfehler ist während der Skript-Auswertung aufgetreten",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description:
        "Ein unbekannter Fehler ist während der Skript-Auswertung aufgetreten",
    },
    unsavedChanges: {
      title: "Nicht gespeicherte Änderungen",
      description:
        "Sie haben nicht gespeicherte Änderungen, die verloren gehen können",
    },
    conflict: {
      title: "Konflikt",
      description: "Ein Konflikt ist während der Skript-Auswertung aufgetreten",
    },
  },
  success: {
    title: "Skript erfolgreich ausgewertet",
    description: "Das JavaScript wurde erfolgreich ausgeführt",
  },
};
