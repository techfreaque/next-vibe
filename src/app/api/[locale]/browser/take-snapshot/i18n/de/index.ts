import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Snapshot aufnehmen",
  description:
    "Nimmt einen Text-Snapshot der aktuell ausgewählten Seite basierend auf dem Accessibility-Baum auf",
  form: {
    label: "Snapshot aufnehmen",
    description:
      "Einen Text-Snapshot der Browser-Seite basierend auf dem a11y-Baum aufnehmen",
    fields: {
      verbose: {
        label: "Ausführlich",
        description:
          "Ob alle verfügbaren Informationen im vollständigen a11y-Baum enthalten sein sollen (Standard: false)",
        placeholder: "false",
      },
      filePath: {
        label: "Dateipfad",
        description:
          "Der absolute Pfad oder ein Pfad relativ zum aktuellen Arbeitsverzeichnis, um den Snapshot zu speichern, anstatt ihn an die Antwort anzuhängen",
        placeholder: "/pfad/zum/snapshot.txt",
      },
    },
  },
  response: {
    success: "Snapshot erfolgreich aufgenommen",
    result: "Ergebnis der Snapshot-Aufnahme",
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
        "Ein Netzwerkfehler ist beim Aufnehmen des Snapshots aufgetreten",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Sie sind nicht berechtigt, Snapshots aufzunehmen",
    },
    forbidden: {
      title: "Verboten",
      description: "Aufnehmen von Snapshots ist verboten",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Die angeforderte Ressource wurde nicht gefunden",
    },
    serverError: {
      title: "Serverfehler",
      description:
        "Ein interner Serverfehler ist beim Aufnehmen des Snapshots aufgetreten",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description:
        "Ein unbekannter Fehler ist beim Aufnehmen des Snapshots aufgetreten",
    },
    unsavedChanges: {
      title: "Nicht gespeicherte Änderungen",
      description:
        "Sie haben nicht gespeicherte Änderungen, die verloren gehen können",
    },
    conflict: {
      title: "Konflikt",
      description: "Ein Konflikt ist beim Aufnehmen des Snapshots aufgetreten",
    },
  },
  success: {
    title: "Snapshot erfolgreich aufgenommen",
    description: "Der Snapshot wurde erfolgreich aufgenommen",
  },
};
