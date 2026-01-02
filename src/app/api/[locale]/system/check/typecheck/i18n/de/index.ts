import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  // Main endpoint properties
  title: "TypeScript-Typprüfung",
  description: "TypeScript-Typprüfung für angegebene Dateien oder Verzeichnisse ausführen",
  category: "Systemprüfungen",
  tag: "typprüfung",

  // Enum translations
  status: {
    passed: "Bestanden",
    failed: "Fehlgeschlagen",
    running: "Läuft",
    skipped: "Übersprungen",
  },
  severity: {
    error: "Fehler",
    warning: "Warnung",
    info: "Info",
  },
  mode: {
    full: "Vollständig",
    incremental: "Inkrementell",
    watch: "Überwachen",
  },

  // Container
  container: {
    title: "TypeScript-Typprüfung Konfiguration",
    description: "Parameter für die Ausführung der TypeScript-Typprüfung konfigurieren",
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
      description: "Detaillierte Ausgabe mit zusätzlichen Informationen aktivieren",
    },
    disableFilter: {
      label: "Filter deaktivieren",
      description: "Filterung deaktivieren und alle TypeScript-Probleme anzeigen",
    },
    createConfig: {
      label: "Konfiguration erstellen",
      description: "Konfigurationsdatei automatisch erstellen, falls vorhanden",
    },
    timeout: {
      label: "Timeout (Sekunden)",
      description: "Maximale Ausführungszeit in Sekunden",
    },
    limit: {
      label: "Limit",
      description: "Maximale Anzahl anzuzeigender Probleme",
    },
    page: {
      label: "Seite",
      description: "Seitenzahl für Paginierung",
    },
    maxFilesInSummary: {
      label: "Max. Dateien in Zusammenfassung",
      description: "Maximale Anzahl von Dateien in der Zusammenfassung",
    },
    skipSorting: {
      label: "Sortierung überspringen",
      description: "Sortierung von Problemen überspringen (für Leistung)",
    },
  },

  // Response fields
  response: {
    issues: {
      title: "Probleme",
      emptyState: {
        description: "Keine Probleme gefunden",
      },
    },
    success: "TypeScript-Typprüfung erfolgreich abgeschlossen",
    successMessage: "TypeScript-Typprüfung erfolgreich abgeschlossen",
    issue: {
      title: "TypeScript-Problem",
      description: "Einzelnes TypeScript-Typprüfungsproblem",
      file: "Dateipfad, in dem das Problem gefunden wurde",
      line: "Zeilennummer des Problems",
      column: "Spaltennummer des Problems",
      code: "TypeScript-Fehlercode",
      severity: "Schweregrad des Problems",
      type: "Problemtyp",
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
      description: "Ein interner Serverfehler ist während der Typprüfung aufgetreten",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Authentifizierung erforderlich für den Zugriff auf diesen Endpunkt",
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
      description: "Es gibt ungespeicherte Änderungen, die behandelt werden müssen",
    },
    conflict: {
      title: "Konflikt",
      description: "Ein Datenkonflikt ist aufgetreten",
    },
    noTsFiles: {
      title: "Keine TypeScript-Dateien gefunden",
      message: "Keine TypeScript-Dateien im angegebenen Pfad gefunden",
    },
    invalidCommand: {
      title: "Ungültiger Befehl",
      message: "Der TypeScript-Prüfbefehl ist ungültig oder fehlt",
    },
  },

  // Success messages
  success: {
    title: "Typprüfung abgeschlossen",
    description: "TypeScript-Typprüfung erfolgreich abgeschlossen",
  },
};
