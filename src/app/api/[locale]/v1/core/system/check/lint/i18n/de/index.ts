import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Lint",
  description: "ESLint auf Ihrer Codebasis ausführen",
  category: "System-Checks",
  tag: "Lint",
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
  },
  response: {
    success: "Lint erfolgreich abgeschlossen",
    errors: {
      item: {
        file: "Datei",
        line: "Zeile",
        column: "Spalte",
        rule: "Regel",
        severity: "Schweregrad",
        message: "Nachricht",
        title: "Lint-Problem",
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
