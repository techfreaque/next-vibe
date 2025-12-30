import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Vibe Check",
  description:
    "Umfassende Code-Qualitätsprüfungen durchführen (Oxlint + ESLint + TypeScript). WICHTIG: Verwenden Sie dies anstelle von direktem 'eslint', 'tsc' oder 'oxlint' - vibe-check führt alle Prüfungen parallel aus und ist deutlich schneller. Das Ziel ist es, ALLE Probleme zu beheben, nicht nur einige. Konfigurieren Sie welche Prüfungen ausgeführt werden sollen in check.config.ts (skipLint, skipEslint, skipOxlint, skipTypecheck).",
  category: "Entwicklungstools",
  tag: "qualität",

  // Enum translations
  checkType: {
    lint: "Lint",
    typecheck: "Typprüfung",
    test: "Test",
    structure: "Struktur",
    migration: "Migration",
    all: "Alle",
  },
  status: {
    pending: "Ausstehend",
    running: "Läuft",
    passed: "Bestanden",
    failed: "Fehlgeschlagen",
    warning: "Warnung",
    skipped: "Übersprungen",
  },
  severity: {
    error: "Fehler",
    warning: "Warnung",
    info: "Info",
    suggestion: "Vorschlag",
  },
  fixAction: {
    autoFix: "Automatisch beheben",
    manualFix: "Manuell beheben",
    ignore: "Ignorieren",
    review: "Überprüfen",
  },

  container: {
    title: "Vibe Check Konfiguration",
    description: "Parameter für umfassende Code-Qualitätsprüfung konfigurieren",
  },

  fields: {
    fix: {
      label: "Probleme automatisch beheben",
      description:
        "Linting-Probleme automatisch beheben, die auto-fixbar sind. Verwenden Sie dies, wenn Sie Probleme automatisch beheben möchten.",
    },
    createConfig: {
      label: "Konfiguration erstellen",
      description:
        "Standard check.config.ts Konfigurationsdatei erstellen falls nicht vorhanden. Verwenden Sie check.config.ts um Skip-Optionen zu konfigurieren (skipEslint, skipOxlint, skipTypecheck).",
    },
    timeoutSeconds: {
      label: "Timeout (Sekunden)",
      description: "Maximale Ausführungszeit in Sekunden (1-3600)",
    },
    paths: {
      label: "Zielpfade",
      description:
        'Spezifische Dateipfade oder Verzeichnisse zum Prüfen (String oder Array von Strings). Leer lassen um ALLE Dateien im Projekt zu prüfen (empfohlen für umfassende Qualitätsprüfungen). Beispiele: "src/app" oder ["src/components", "src/utils"]. Nur Pfade angeben wenn Sie sich auf eine Teilmenge konzentrieren müssen.',
      placeholder: "z.B. src/app oder src/components/Button.tsx",
      options: {
        src: "Quellverzeichnis (src/)",
        components: "Komponenten (src/components)",
        utils: "Utilities (src/utils)",
        pages: "Seiten (src/pages)",
        app: "App-Verzeichnis (src/app)",
      },
    },
    limit: {
      label: "Limit",
      description:
        "Anzahl der Probleme pro Seite (1-10000, Standard: 100). WICHTIG: Dies kontrolliert nur die Anzeige, nicht die Erkennung. Verwenden Sie hohe Werte (1000+) oder Paginierung um ALLE Probleme zu sehen - das Ziel ist es, alles zu beheben, nicht nur die erste Seite.",
    },
    page: {
      label: "Seite",
      description: "Seitennummer für paginierte Ergebnisse (beginnt bei 1)",
    },
    maxFilesInSummary: {
      label: "Max. Dateien in Zusammenfassung",
      description:
        "Maximale Anzahl der Dateien in der betroffenen Dateiliste (1-1000)",
    },
  },

  response: {
    success: "Vibe Check erfolgreich abgeschlossen",
    issues: {
      title: "Code-Qualitätsprobleme",
      emptyState: {
        description: "Keine Probleme gefunden - Ihr Code hat gute Vibes!",
      },
    },
    summary: {
      title: "Prüfzusammenfassung",
      description: "Übersicht der Code-Qualitätsprüfungsergebnisse",
      totalIssues: "Gesamtzahl Probleme",
      totalFiles: "Gesamtzahl Dateien mit Problemen",
      totalErrors: "Gesamtzahl Fehler",
      displayedIssues: "Angezeigte Probleme",
      displayedFiles: "Angezeigte Dateien",
      truncatedMessage: "Ausgabe gekürzt um Grenzwerte einzuhalten",
      currentPage: "Aktuelle Seite",
      totalPages: "Gesamtzahl Seiten",
      files: {
        title: "Betroffene Dateien",
        file: "Dateipfad",
        errors: "Fehler",
        warnings: "Warnungen",
        total: "Gesamtzahl Probleme",
      },
    },
  },

  performance: {
    total: "Gesamt",
    oxlint: "Oxlint",
    eslint: "ESLint",
    typecheck: "TypeScript",
  },

  errors: {
    validation: {
      title: "Ungültige Parameter",
      description: "Die Vibe Check Parameter sind ungültig",
    },
    internal: {
      title: "Interner Fehler",
      description: "Ein interner Fehler ist während des Vibe Check aufgetreten",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Sie haben keine Berechtigung, Vibe Check auszuführen",
    },
    forbidden: {
      title: "Verboten",
      description: "Zugriff auf Vibe Check ist verboten",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Vibe Check Ressource nicht gefunden",
    },
    server: {
      title: "Serverfehler",
      description: "Serverfehler während des Vibe Check aufgetreten",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description:
        "Ein unbekannter Fehler ist während des Vibe Check aufgetreten",
    },
    unsaved: {
      title: "Ungespeicherte Änderungen",
      description:
        "Sie haben ungespeicherte Änderungen, die den Vibe Check beeinträchtigen könnten",
    },
    conflict: {
      title: "Konflikt",
      description: "Ein Konflikt ist während des Vibe Check aufgetreten",
    },
  },

  success: {
    title: "Vibe Check Abgeschlossen",
    description: "Vibe Check erfolgreich abgeschlossen",
  },
};
