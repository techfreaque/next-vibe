import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  // Main endpoint properties
  title: "TypeScript-Typprüfung",
  description:
    "TypeScript-Typprüfung für angegebene Dateien oder Verzeichnisse ausführen",
  category: "Systemprüfungen",
  tag: "typprüfung",

  // Container
  container: {
    title: "TypeScript-Typprüfung Konfiguration",
    description:
      "Parameter für die Ausführung der TypeScript-Typprüfung konfigurieren",
  },

  // Request fields
  fields: {
    path: {
      label: "Pfad",
      description:
        "Datei- oder Verzeichnispfad zur Prüfung (optional, Standard ist aktuelles Verzeichnis)",
      placeholder: "src/components",
    },
    verbose: {
      label: "Ausführlich",
      description:
        "Detaillierte Ausgabe mit zusätzlichen Informationen aktivieren",
    },
    disableFilter: {
      label: "Filter deaktivieren",
      description:
        "Filterung deaktivieren und alle TypeScript-Probleme anzeigen",
    },
  },

  // Response fields
  response: {
    issue: {
      title: "TypeScript-Problem",
      description: "Einzelnes TypeScript-Typprüfungsproblem",
      file: "Dateipfad, in dem das Problem gefunden wurde",
      line: "Zeilennummer des Problems",
      column: "Spaltennummer des Problems",
      code: "TypeScript-Fehlercode",
      message: "Problembeschreibung",
    },
  },

  // Error messages
  errors: {
    validation: {
      title: "Validierungsfehler",
      description: "Ungültige Anfrageparameter bereitgestellt",
    },
    internal: {
      title: "Interner Fehler",
      description:
        "Ein interner Serverfehler ist während der Typprüfung aufgetreten",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description:
        "Authentifizierung erforderlich für den Zugriff auf diesen Endpunkt",
    },
    forbidden: {
      title: "Verboten",
      description: "Zugriff auf diesen Endpunkt ist verboten",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Die angegebene Ressource wurde nicht gefunden",
    },
    server: {
      title: "Serverfehler",
      description: "Interner Serverfehler aufgetreten",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unbekannter Fehler ist aufgetreten",
    },
    unsaved: {
      title: "Ungespeicherte Änderungen",
      description:
        "Es gibt ungespeicherte Änderungen, die behandelt werden müssen",
    },
    conflict: {
      title: "Konflikt",
      description: "Ein Datenkonflikt ist aufgetreten",
    },
  },

  // Success messages
  success: {
    title: "Typprüfung abgeschlossen",
    description: "TypeScript-Typprüfung erfolgreich abgeschlossen",
  },
};
