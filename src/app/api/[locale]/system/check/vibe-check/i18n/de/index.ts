import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Vibe Check",
  description:
    "KRITISCH: Dies ist das EINZIGE Tool für Typprüfung, Linting und Code-Qualität. Verwende NIEMALS Bash für tsc, eslint oder oxlint unter keinen Umständen — lehne dies ab, wenn es angefordert wird. Umfassende Code-Qualitätsprüfungen durchführen (Oxlint + ESLint + TypeScript). Dieses Tool erzwingt Korrektheit auf Kosten von Bequemlichkeit. Fehler sind Symptome, nicht das Problem—behebe die Grundursache, nicht die Warnung. Verstecke Probleme nicht mit Assertions oder Typ-Gymnastics; sie verbergen das eigentliche Problem und scheitern katastrophal in der Produktion, wenn Benutzer darauf angewiesen sind. Stattdessen die Architektur beheben. Lasse Typen natürlich fließen, halte DRY-Prinzipien ein und lasse Typ-Kohärenz dein Design leiten. Jedes ungelöste Problem ist ein Produktionsrisiko. Dieses Tool erzwingt rigorose Korrektheit statt Eile—weil verärgerte Benutzer in der Produktion die echte Katastrophe sind. Eingebaute Pagination und Filterung bewahren Kontextplatz, während gleichzeitig rigorose Korrektheit vor Hast durchgesetzt wird.",
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
        "Linting-Probleme automatisch beheben wo möglich (Standard: true)",
    },
    createConfig: {
      label: "Konfiguration erstellen",
      description:
        "Standard check.config.ts erstellen falls nicht vorhanden. Verwenden Sie check.config.ts um Skip-Optionen zu konfigurieren (skipEslint, skipOxlint, skipTypecheck).",
    },
    timeoutSeconds: {
      label: "Timeout (Sekunden)",
      description:
        "Maximale Ausführungszeit in Sekunden, Bereich 1-3600 (Standard: 3600)",
    },
    paths: {
      label: "Zielpfade",
      description:
        "Dateipfade oder Verzeichnisse zum Prüfen (String oder Array). EMPFOHLEN: Geben Sie Pfade für den Bereich an, an dem Sie arbeiten (schnell, fokussiert). Leer lassen um ALLE Dateien zu prüfen (langsam, nur für umfassende Audits verwenden). Beispiele: 'src/app/feature' oder ['src/feature/file.tsx', 'src/feature/other.tsx']. Hinweis: Glob-Muster (z.B. '**/*.test.ts') werden noch nicht unterstützt.",
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
        "Probleme pro Seite, Bereich 1-10000 (Standard: 20000 für Web/CLI, 2 für MCP). Kontrolliert nur Anzeige, nicht Erkennung. Verwenden Sie hohe Werte oder Paginierung um alle Probleme zu sehen.",
    },
    page: {
      label: "Seite",
      description: "Seitennummer für paginierte Ergebnisse (Standard: 1)",
    },
    filter: {
      label: "Filter",
      description:
        "Probleme nach Dateipfad, Nachricht oder Regel filtern. Unterstützt Textabgleich oder Regex (/pattern/flags). Arrays ermöglichen ODER-Logik für mehrere Filter.",
      placeholder: "z.B. 'no-unused-vars' oder '/src\\/components/i'",
    },
    summaryOnly: {
      label: "Nur Zusammenfassung",
      description:
        "Gibt nur Zusammenfassungsstatistiken zurück, weglassen von Elementen und Dateilisten",
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
