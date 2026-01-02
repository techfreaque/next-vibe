import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Oxlint",
  description: "ESLint mit Oxlint-Konfiguration auf Ihrer Codebasis ausführen",
  category: "System-Checks",
  tag: "Oxlint",
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
  fixAction: {
    autoFix: "Automatisch beheben",
    manualFix: "Manuell beheben",
    ignore: "Ignorieren",
  },
  container: {
    title: "Lint-Konfiguration",
    description: "Lint-Parameter konfigurieren",
  },
  fields: {
    path: {
      label: "Pfad",
      description: "Zu überprüfender Pfad",
      placeholder: "Pfad zum Überprüfen eingeben",
    },
    verbose: {
      label: "Ausführlich",
      description: "Ausführliche Ausgabe aktivieren",
    },
    fix: {
      label: "Automatische Korrektur",
      description: "Probleme automatisch beheben",
    },
    timeoutSeconds: {
      label: "Timeout (Sekunden)",
      description: "Maximale Ausführungszeit",
    },
    cacheDir: {
      label: "Cache-Verzeichnis",
      description: "Verzeichnis für Cache-Dateien",
    },
    createConfig: {
      label: "Konfiguration erstellen",
      description: "Konfigurationsdatei automatisch erstellen, falls vorhanden",
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
  response: {
    issues: {
      title: "Probleme",
      emptyState: {
        description: "Keine Probleme gefunden",
      },
    },
    success: "Lint erfolgreich abgeschlossen",
    configMissing: "Konfigurationsdatei fehlt",
    configPath: "Konfigurationsdateipfad",
    errors: {
      item: {
        file: "Datei",
        line: "Zeile",
        column: "Spalte",
        rule: "Regel",
        severity: "Schweregrad",
        message: "Nachricht",
        title: "Lint-Problem",
        type: "Typ",
      },
    },
  },
  errors: {
    validation: {
      title: "Validierungsfehler",
      description: "Ungültige Anfrageparameter",
    },
    internal: {
      title: "Interner Fehler",
      description: "Ein interner Fehler ist aufgetreten",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Authentifizierung erforderlich",
    },
    forbidden: {
      title: "Verboten",
      description: "Zugriff verboten",
    },
    configNotFound: "check.config.ts nicht im Projektstammverzeichnis gefunden",
    configMissingExport: "check.config.ts muss 'default' oder 'config' exportieren",
    oxlintFailed: "Oxlint fehlgeschlagen",
    prettierFailed: "Prettier fehlgeschlagen mit Exit-Code",
  },
  success: {
    title: "Erfolg",
    description: "Lint erfolgreich abgeschlossen",
  },
  post: {
    title: "Lint",
    description: "ESLint auf Ihrer Codebasis ausführen",
    form: {
      title: "Lint-Konfiguration",
      description: "Lint-Parameter konfigurieren",
    },
    response: {
      title: "Antwort",
      description: "Lint-Antwortdaten",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Ressource nicht gefunden",
      },
      conflict: {
        title: "Konflikt",
        description: "Datenkonflikt aufgetreten",
      },
    },
    success: {
      title: "Erfolg",
      description: "Vorgang erfolgreich abgeschlossen",
    },
  },
};
