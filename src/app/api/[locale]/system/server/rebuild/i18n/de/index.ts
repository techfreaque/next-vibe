import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Server-Management",
  tags: {
    rebuild: "Rebuild",
  },
  post: {
    title: "Neu bauen & Neustarten",
    description:
      "Anwendung neu bauen und den laufenden Next.js-Server hot-restarten. Führt 6 Schritte sequentiell aus: 1) Code-Generierung, 2) Vibe-Check (Code-Qualitäts-Gate), 3) Next.js-Produktions-Build, 4) Datenbank-Migrationen, 5) Datenbank-Seeding, 6) Hot-Restart via SIGUSR1. Der Vibe-Check blockiert den Build bei Fehlern — verwende 'vibe check' oder das MCP-Check-Tool für Details. WARNUNG: Die HTTP-Antwort kann abgeschnitten werden, da der Server vor Abschluss der Antwort neu startet.",
    form: {
      title: "Neu bauen & Neustarten",
      description: "Anwendung neu bauen und Server neustarten",
    },
    fields: {
      success: { title: "Ergebnis" },
      errors: { title: "Fehler" },
      duration: { title: "Dauer" },
      steps: { title: "Schritte" },
    },
    steps: {
      codegen: "Code-Generierung",
      vibeCheck: "Vibe-Check",
      nextBuild: "Next.js-Build",
      migrate: "Migrationen",
      seed: "Seeding",
      restart: "Neustart",
      codegenFailed: "Code-Generierung fehlgeschlagen: {{error}}",
      vibeCheckFailed:
        "Vibe-Check: {{errors}} Fehler, {{warnings}} Warnungen. Verwende 'vibe check' oder das MCP-Check-Tool für Details.",
      vibeCheckError: "Vibe-Check fehlgeschlagen: {{error}}",
      buildFailed: "Next.js-Build fehlgeschlagen: {{error}}",
      migrationFailed: "Migration fehlgeschlagen: {{error}}",
      seedingFailed: "Seeding fehlgeschlagen: {{error}}",
      restartFailed: "Server-Neustart fehlgeschlagen: {{error}}",
    },
    errors: {
      validation: {
        title: "Validierung fehlgeschlagen",
        description: "Ungültige Rebuild-Parameter angegeben",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkverbindung während Rebuild fehlgeschlagen",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Sie müssen angemeldet sein, um die Anwendung neu zu bauen",
      },
      forbidden: {
        title: "Verboten",
        description: "Sie haben keine Berechtigung, die Anwendung neu zu bauen",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Rebuild-Ressourcen nicht gefunden",
      },
      server: {
        title: "Server-Fehler",
        description:
          "Ein interner Server-Fehler ist während des Rebuilds aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description:
          "Ein unbekannter Fehler ist während des Rebuilds aufgetreten",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Rebuild läuft bereits",
      },
    },
    success: {
      title: "Rebuild abgeschlossen",
      description: "Anwendung neu gebaut und Server erfolgreich neugestartet",
    },
    widget: {
      rebuildComplete: "Rebuild abgeschlossen",
      rebuildFailed: "Rebuild fehlgeschlagen",
      errors: "Fehler:",
      runRebuild: "Rebuild starten",
      runAgain: "Erneut ausführen",
      skipped: "übersprungen",
    },
  },
};
