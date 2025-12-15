import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Vibe Check",
  description:
    "Umfassende Code-Qualitätsprüfungen durchführen einschließlich Linting, Typprüfung und Route-Validierung",
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
      description: "Probleme automatisch beheben, die gelöst werden können",
    },
    skipLint: {
      label: "Linting überspringen",
      description: "ESLint-Prüfungen während Vibe Check überspringen",
    },
    skipTypecheck: {
      label: "Typprüfung überspringen",
      description: "TypeScript-Typprüfung überspringen",
    },
    createConfig: {
      label: "Konfiguration erstellen",
      description: "Standard check.config.ts erstellen falls nicht vorhanden",
    },
    timeoutSeconds: {
      label: "Timeout (Sekunden)",
      description: "Maximale Ausführungszeit",
    },
    skipTrpcCheck: {
      label: "tRPC Check überspringen",
      description: "tRPC-Route-Validierung überspringen",
    },
    quiet: {
      label: "Ruhiger Modus",
      description: "Ausgabe-Ausführlichkeit reduzieren",
    },
    paths: {
      label: "Zielpfade",
      description: "Spezifische Pfade zum Prüfen (leer lassen für alle)",
      placeholder: "Pfade zum Prüfen auswählen oder leer lassen für alle",
      options: {
        src: "Quellverzeichnis (src/)",
        components: "Komponenten (src/components)",
        utils: "Utilities (src/utils)",
        pages: "Seiten (src/pages)",
        app: "App-Verzeichnis (src/app)",
      },
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
