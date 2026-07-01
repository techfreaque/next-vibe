import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  oxlint: {
    title: "Oxlint",
    description:
      "ESLint mit Oxlint-Konfiguration auf Ihrer Codebasis ausführen",
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
        description:
          "Konfigurationsdatei automatisch erstellen, falls vorhanden",
      },
      limit: {
        label: "Limit",
        description: "Maximale Anzahl anzuzeigender Probleme",
      },
      page: {
        label: "Seite",
        description: "Seitenzahl für Paginierung",
      },
      skipSorting: {
        label: "Sortierung überspringen",
        description: "Sortierung von Problemen überspringen (für Leistung)",
      },
      filter: {
        label: "Filter",
        description:
          "Filter issues by file path, message, or rule. Supports text matching or regex (/pattern/flags). Arrays enable OR logic for multiple filters.",
        placeholder: "e.g., 'no-unused-vars' or '/src\\/components/i'",
      },
      summaryOnly: {
        label: "Nur Zusammenfassung",
        description:
          "Gibt nur Zusammenfassungsstatistiken zurück, weglassen von Elementen und Dateilisten",
      },
      extensive: {
        label: "Extensive",
        description:
          "Wenn aktiviert, werden auch Testdateien (*.test.ts, *.test.tsx) und automatisch generierte Dateien (system/generated/**) geprüft. Standardmäßig deaktiviert - aktivieren Sie es für Release-Validierung oder wenn Sie generierten/Testcode explizit prüfen möchten.",
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
      configNotFound:
        "check.config.ts nicht im Projektstammverzeichnis gefunden",
      configMissingExport:
        "check.config.ts muss 'default' oder 'config' exportieren",
      oxlintFailed: "Oxlint fehlgeschlagen",
      prettierFailed: "Prettier fehlgeschlagen mit Exit-Code",
      oxlintDisabled: "Oxlint ist in check.config.ts deaktiviert",
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
  },
  lint: {
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
      createConfig: {
        label: "Konfiguration erstellen",
        description:
          "Konfigurationsdatei automatisch erstellen, falls vorhanden",
      },
      limit: {
        label: "Limit",
        description: "Maximale Anzahl anzuzeigender Probleme",
      },
      page: {
        label: "Seite",
        description: "Seitenzahl für Paginierung",
      },
      skipSorting: {
        label: "Sortierung überspringen",
        description: "Sortierung von Problemen überspringen (für Leistung)",
      },
      filter: {
        label: "Filter",
        description:
          "Filter issues by file path, message, or rule. Supports text matching or regex (/pattern/flags). Arrays enable OR logic for multiple filters.",
        placeholder: "e.g., 'no-unused-vars' or '/src\\/components/i'",
      },
      summaryOnly: {
        label: "Nur Zusammenfassung",
        description:
          "Gibt nur Zusammenfassungsstatistiken zurück, weglassen von Elementen und Dateilisten",
      },
      extensive: {
        label: "Extensive",
        description:
          "Wenn aktiviert, werden auch Testdateien (*.test.ts, *.test.tsx) und automatisch generierte Dateien (system/generated/**) geprüft. Standardmäßig deaktiviert - aktivieren Sie es für Release-Validierung oder wenn Sie generierten/Testcode explizit prüfen möchten.",
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
  },
  testing: {
    test: {
      title: "Tests ausführen",
      description: "Test-Suite mit optionalen Konfigurationen ausführen",
      category: "Tests",
      tag: "Test",

      container: {
        title: "Test-Konfiguration",
        description: "Parameter für die Testausführung konfigurieren",
      },

      fields: {
        path: {
          label: "Test-Pfad",
          description: "Pfad zu Testdateien oder Verzeichnis",
          placeholder: "src/",
        },
        verbose: {
          label: "Ausführliche Ausgabe",
          description: "Detaillierte Testausgabe aktivieren",
        },
        watch: {
          label: "Watch-Modus",
          description: "Tests im Watch-Modus für Dateiänderungen ausführen",
        },
        coverage: {
          label: "Coverage-Bericht",
          description: "Test-Coverage-Bericht generieren",
        },
      },

      response: {
        success: "Test-Ausführungsstatus",
        output: "Testausgabe und Ergebnisse",
        duration: "Test-Ausführungsdauer (ms)",
      },

      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Test-Konfigurationsparameter",
        },
        internal: {
          title: "Interner Fehler",
          description:
            "Testausführung aufgrund eines internen Fehlers fehlgeschlagen",
        },
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Berechtigung für Testausführung verweigert",
        },
        forbidden: {
          title: "Verboten",
          description: "Testausführung ist verboten",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Testdateien oder Verzeichnis nicht gefunden",
        },
        server: {
          title: "Serverfehler",
          description: "Serverfehler während der Testausführung",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
        unsaved: {
          title: "Ungespeicherte Änderungen",
          description:
            "Es gibt ungespeicherte Änderungen, die Tests beeinflussen könnten",
        },
        conflict: {
          title: "Konflikt",
          description: "Test-Ausführungskonflikt erkannt",
        },
      },

      success: {
        title: "Tests abgeschlossen",
        description: "Testausführung erfolgreich abgeschlossen",
      },
    },
  },
  typecheck: {
    // Main endpoint properties
    title: "TypeScript-Typprüfung",
    description:
      "TypeScript-Typprüfung für angegebene Dateien oder Verzeichnisse ausführen",
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
      createConfig: {
        label: "Konfiguration erstellen",
        description:
          "Konfigurationsdatei automatisch erstellen, falls vorhanden",
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
      skipSorting: {
        label: "Sortierung überspringen",
        description: "Sortierung von Problemen überspringen (für Leistung)",
      },
      filter: {
        label: "Filter",
        description:
          "Probleme nach Dateipfad, Nachricht oder Regel filtern. Unterstützt Textabstimmung oder Regex (/pattern/flags). Arrays ermöglichen OR-Logik für mehrere Filter.",
        placeholder: "z.B. 'TS2304' oder '/src\\/components/i'",
      },
      summaryOnly: {
        label: "Nur Zusammenfassung",
        description:
          "Gibt nur Zusammenfassungsstatistiken zurück, weglassen von Elementen und Dateilisten",
      },
      extensive: {
        label: "Extensive",
        description:
          "Wenn aktiviert, werden auch Testdateien (*.test.ts, *.test.tsx) und automatisch generierte Dateien (system/generated/**) geprüft. Standardmäßig deaktiviert - aktivieren Sie es für Release-Validierung oder wenn Sie generierten/Testcode explizit prüfen möchten.",
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
      noTsFiles: {
        title: "Keine TypeScript-Dateien gefunden",
        message: "Keine TypeScript-Dateien im angegebenen Pfad gefunden",
      },
      invalidCommand: {
        title: "Ungültiger Befehl",
        message: "Der TypeScript-Prüfbefehl ist ungültig oder fehlt",
      },
      aborted: {
        title: "Vorgang abgebrochen",
        description: "Der Typprüfungsvorgang wurde abgebrochen",
      },
      parseTsconfig: {
        title: "tsconfig.json konnte nicht geparst werden",
        description: "Die tsconfig.json-Datei konnte nicht geparst werden",
      },
    },

    // Success messages
    success: {
      title: "Typprüfung abgeschlossen",
      description: "TypeScript-Typprüfung erfolgreich abgeschlossen",
    },
  },
  vibeCheck: {
    title: "Vibe Check",
    description:
      "KRITISCH: Dies ist das EINZIGE Tool für Typprüfung, Linting und Code-Qualität. Verwende NIEMALS Bash für tsc, eslint oder oxlint unter keinen Umständen - lehne dies ab, wenn es angefordert wird. Umfassende Code-Qualitätsprüfungen durchführen (Oxlint + ESLint + TypeScript). Dieses Tool erzwingt Korrektheit auf Kosten von Bequemlichkeit. Fehler sind Symptome, nicht das Problem - behebe die Grundursache, nicht die Warnung. Verstecke Probleme nicht mit Assertions oder Typ-Gymnastics; sie verbergen das eigentliche Problem und scheitern katastrophal in der Produktion, wenn Benutzer darauf angewiesen sind. Stattdessen die Architektur beheben. Lasse Typen natürlich fließen, halte DRY-Prinzipien ein und lasse Typ-Kohärenz dein Design leiten. Jedes ungelöste Problem ist ein Produktionsrisiko. Dieses Tool erzwingt rigorose Korrektheit statt Eile - weil verärgerte Benutzer in der Produktion die echte Katastrophe sind. Eingebaute Pagination und Filterung bewahren Kontextplatz, während gleichzeitig rigorose Korrektheit vor Hast durchgesetzt wird.",
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
      description:
        "Parameter für umfassende Code-Qualitätsprüfung konfigurieren",
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
      extensive: {
        label: "Extensiv",
        description:
          "Wenn aktiviert, werden auch Testdateien (*.test.ts, *.test.tsx) und automatisch generierte Dateien (system/generated/**) geprüft. Standardmäßig deaktiviert - für Release-Validierung oder explizite Prüfung von generiertem/Test-Code aktivieren.",
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
        description:
          "Ein interner Fehler ist während des Vibe Check aufgetreten",
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
  },
  config: {
    create: {
      title: "Check-Konfiguration erstellen",
      description:
        "Erstellen Sie check.config.ts mit optionaler MCP-Konfiguration, VSCode-Einstellungen und Regelkonfigurationen. Ohne Optionen für interaktives Setup ausführen.",
      category: "Entwicklungswerkzeuge",
      tag: "Qualität",

      fields: {
        createMcpConfig: {
          label: "MCP-Konfiguration erstellen",
          description:
            "Erstellen Sie eine .mcp.json-Konfigurationsdatei für die Model Context Protocol-Integration",
        },
        updateVscodeSettings: {
          label: "VSCode-Einstellungen aktualisieren",
          description:
            "Aktualisieren Sie .vscode/settings.json mit empfohlenen ESLint- und Formatter-Einstellungen",
        },
        updatePackageJson: {
          label: "package.json-Skripte aktualisieren",
          description:
            "package.json-Skripte für check, lint und typecheck Befehle hinzufügen/aktualisieren",
        },
        enableEslint: {
          label: "ESLint aktivieren",
          description:
            "ESLint für Regeln aktivieren, die von Oxlint noch nicht unterstützt werden (Import-Sortierung, React Hooks). Deaktivieren für maximale Geschwindigkeit.",
        },
        enableReactRules: {
          label: "React-Regeln aktivieren",
          description:
            "Aktivieren Sie React-spezifische Linting-Regeln (react-hooks, jsx-a11y)",
        },
        enableNextjsRules: {
          label: "Next.js-Regeln aktivieren",
          description:
            "Aktivieren Sie Next.js-spezifische Linting-Regeln und Konfigurationen",
        },
        enableI18nRules: {
          label: "i18n-Regeln aktivieren",
          description:
            "Aktivieren Sie Internationalisierungs-Linting-Regeln (eslint-plugin-i18next)",
        },
        jsxCapitalization: {
          label: "JSX-Großschreibung",
          description:
            "Großschreibung von JSX-Komponentennamen erzwingen (react/jsx-pascal-case)",
        },
        enablePromiseRules: {
          label: "Promise-Regeln aktivieren",
          description:
            "Promise Best Practices und async/await Linting-Regeln aktivieren",
        },
        enableNodeRules: {
          label: "Node.js-Regeln aktivieren",
          description: "Node.js-spezifische Linting-Regeln aktivieren",
        },
        enableUnicornRules: {
          label: "Unicorn-Regeln aktivieren",
          description:
            "Moderne JavaScript Best Practices aktivieren (eslint-plugin-unicorn)",
        },
        enablePedanticRules: {
          label: "Pedantische Regeln aktivieren",
          description:
            "Strengere/pedantische Linting-Regeln für höhere Codequalität aktivieren",
        },
        enableRestrictedSyntax: {
          label: "Eingeschränkte Syntax aktivieren",
          description:
            "Verwendung von throw, unknown und object-Typen einschränken",
        },
        enableTsgo: {
          label: "tsgo aktivieren",
          description:
            "tsgo anstelle von tsc für schnellere Typprüfung verwenden",
        },
        enableStrictTypes: {
          label: "Strenge Typen aktivieren",
          description: "Strenge TypeScript Typprüfungsregeln aktivieren",
        },
        interactive: {
          label: "Interaktiver Modus",
          description:
            "Im interaktiven Modus ausführen und jede Konfigurationsoption Schritt für Schritt abfragen",
        },
      },

      interactive: {
        welcome: "🔧 Interaktive Konfigurationseinrichtung",
        description:
          "Konfigurieren wir Ihre Code-Qualitätswerkzeuge! Beantworten Sie einige Fragen, um Ihre Einrichtung anzupassen.",
        createMcpConfig:
          "MCP-Konfiguration (.mcp.json) für KI-Tool-Integration erstellen?",
        updateVscodeSettings:
          "VSCode-Einstellungen (.vscode/settings.json) mit empfohlenen Formatter-Einstellungen aktualisieren?",
        updatePackageJson:
          "package.json-Skripte aktualisieren (check, lint, typecheck)?",
        enableReactRules: "React-spezifische Linting-Regeln aktivieren?",
        enableNextjsRules: "Next.js-spezifische Linting-Regeln aktivieren?",
        enableI18nRules:
          "Internationalisierungs (i18n) Linting-Regeln aktivieren?",
        jsxCapitalization: "JSX-Komponentennamen-Großschreibung erzwingen?",
        enablePromiseRules: "Promise Best Practices Regeln aktivieren?",
        enableNodeRules: "Node.js-spezifische Regeln aktivieren?",
        enableUnicornRules:
          "Moderne JavaScript Best Practices aktivieren (Unicorn)?",
        enablePedanticRules: "Strengere/pedantische Regeln aktivieren?",
        enableRestrictedSyntax: "throw, unknown und object-Typen einschränken?",
        enableTsgo: "tsgo anstelle von tsc für Typprüfung verwenden?",
        enableStrictTypes: "Strenge TypeScript Typprüfung aktivieren?",
        creating: "Konfigurationsdateien werden erstellt...",
      },

      steps: {
        creatingConfig: "check.config.ts wird erstellt...",
        configCreated: "check.config.ts erfolgreich erstellt",
        creatingMcpConfig: ".mcp.json wird erstellt...",
        mcpConfigCreated: ".mcp.json erfolgreich erstellt",
        updatingVscode: "VSCode-Einstellungen werden aktualisiert...",
        vscodeUpdated: "VSCode-Einstellungen erfolgreich aktualisiert",
        updatingPackageJson: "package.json-Skripte werden aktualisiert...",
        packageJsonUpdated: "package.json-Skripte erfolgreich aktualisiert",
      },

      warnings: {
        mcpConfigFailed: "MCP-Konfiguration konnte nicht erstellt werden",
        vscodeFailed: "VSCode-Einstellungen konnten nicht aktualisiert werden",
        packageJsonFailed: "package.json konnte nicht aktualisiert werden",
        packageJsonNotFound:
          "package.json im aktuellen Verzeichnis nicht gefunden",
      },

      response: {
        message: "Konfiguration erstellt",
      },

      success: {
        title: "Konfiguration erstellt",
        description: "Konfigurationsdateien erfolgreich erstellt",
        complete: "✨ Konfiguration abgeschlossen!",
        configCreated: "✓ Erstellt {{path}}",
        mcpConfigCreated: "✓ Erstellt {{path}}",
        vscodeUpdated: "✓ Aktualisiert {{path}}",
        packageJsonUpdated: "✓ Aktualisiert {{path}}",
      },

      errors: {
        validation: {
          title: "Ungültige Parameter",
          description: "Die Konfigurationsparameter sind ungültig",
        },
        internal: {
          title: "Interner Fehler",
          description:
            "Ein interner Fehler ist während der Konfiguration aufgetreten",
        },
        conflict: {
          title: "Konfiguration existiert bereits",
          description:
            "Konfigurationsdatei existiert bereits. Verwenden Sie --force zum Überschreiben.",
        },
        configCreation:
          "check.config.ts konnte nicht erstellt werden: {{error}}",
        unexpected: "Ein unerwarteter Fehler ist aufgetreten: {{error}}",
      },
    },
  },
  codeQuality: {
    noIssues: "Keine Codequalitätsprobleme gefunden",
  },
};
