import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Server-Management",
  tags: {
    build: "Build",
  },
  post: {
    title: "Anwendung erstellen",
    description: "Anwendung für Produktionsbereitstellung erstellen",
    form: {
      title: "Build-Konfiguration",
      description: "Build-Optionen und -Einstellungen konfigurieren",
    },
    fields: {
      package: {
        title: "Paket erstellen",
        description: "Paket vor der Anwendung erstellen",
      },
      skipNextCommand: {
        title: "Next.js-Befehl überspringen",
        description: "Next.js-Build-Befehl überspringen",
      },
      target: {
        title: "Build-Ziel",
        description: "Build-Ziel angeben (z.B. 'production', 'staging')",
      },
      skipGeneration: {
        title: "Code-Generierung überspringen",
        description: "API-Endpunkt-Generierung während Build überspringen",
      },
      generate: {
        title: "Code generieren",
        description: "Code-Generierung während des Builds ausführen",
      },
      generateEndpoints: {
        title: "Endpunkte generieren",
        description: "API-Endpunkt-Dateien während des Builds generieren",
      },
      generateSeeds: {
        title: "Seeds generieren",
        description: "Seed-Dateien während des Builds generieren",
      },
      nextBuild: {
        title: "Next.js-Build",
        description: "Next.js-Build-Prozess ausführen",
      },
      migrate: {
        title: "Migrationen ausführen",
        description: "Datenbank-Migrationen während des Builds ausführen",
      },
      seed: {
        title: "Seeding ausführen",
        description: "Datenbank-Seeding während des Builds ausführen",
      },
      force: {
        title: "Build erzwingen",
        description: "Build auch bei Fehlern fortsetzen",
      },
      skipEndpoints: {
        title: "Endpunkt-Generierung überspringen",
        description: "Generierung von Endpunkt-Dateien überspringen",
      },
      skipSeeds: {
        title: "Seed-Generierung überspringen",
        description: "Generierung von Seed-Dateien überspringen",
      },
      skipProdMigrations: {
        title: "Produktions-Migrationen überspringen",
        description: "Datenbank-Migrationen für Produktion überspringen",
      },
      skipProdSeeding: {
        title: "Produktions-Seeding überspringen",
        description: "Datenbank-Seeding für Produktion überspringen",
      },
      runProdDatabase: {
        title: "Produktions-Datenbankoperationen ausführen",
        description: "Produktions-Datenbankoperationen nach Build ausführen",
      },
      success: {
        title: "Build-Erfolg",
      },
      output: {
        title: "Build-Ausgabe",
      },
      duration: {
        title: "Build-Dauer (ms)",
      },
      errors: {
        title: "Build-Fehler",
      },
    },
    errors: {
      validation: {
        title: "Validierung fehlgeschlagen",
        description: "Ungültige Build-Parameter angegeben",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkverbindung während Build fehlgeschlagen",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Sie müssen angemeldet sein, um die Anwendung zu erstellen",
      },
      forbidden: {
        title: "Verboten",
        description: "Sie haben keine Berechtigung, die Anwendung zu erstellen",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Build-Ressourcen nicht gefunden",
      },
      server: {
        title: "Server-Fehler",
        description:
          "Ein interner Server-Fehler ist während des Builds aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description:
          "Ein unbekannter Fehler ist während des Builds aufgetreten",
      },
      conflict: {
        title: "Konflikt",
        description: "Build-Konflikt erkannt",
      },
      nextjs_build_failed: {
        title: "Next.js-Build fehlgeschlagen",
        description: "Der Next.js-Build-Prozess ist fehlgeschlagen: {{error}}",
      },
    },
    success: {
      title: "Build abgeschlossen",
      description: "Anwendungs-Build erfolgreich abgeschlossen",
    },
    repository: {
      messages: {
        buildStart: "🚀 Anwendungs-Build wird gestartet...",
        packageBuildStart: "Paket wird erstellt...",
        packageBuildSuccess: "✅ Paket-Build erfolgreich abgeschlossen",
        packageBuildFailed: "Paket-Build fehlgeschlagen",
        buildPrerequisites: "Build-Voraussetzungen werden ausgeführt...",
        skipGeneration:
          "API-Endpunkt-Generierung wird übersprungen (--skip-generation)",
        generatingEndpoints: "API-Endpunkte werden generiert...",
        generationSuccess: "✅ Code-Generierung erfolgreich abgeschlossen",
        generationFailed: "Code-Generierung fehlgeschlagen",
        skipNextBuild:
          "Next.js-Build wird übersprungen (wird von package.json behandelt)",
        buildingNextjs: "Next.js-Anwendung wird erstellt...",
        nextjsBuildSuccess: "✅ Next.js-Build erfolgreich abgeschlossen",
        nextjsBuildFailed: "Next.js-Build fehlgeschlagen",
        skipProdDb:
          "Produktions-Datenbankoperationen werden übersprungen (--run-prod-database=false)",
        buildFailed: "❌ Build fehlgeschlagen",
        schemaGenerationStart: "Datenbank-Schema wird generiert...",
        schemaGenerationSuccess:
          "✅ Datenbank-Schema-Generierung abgeschlossen",
        schemaGenerationFailed: "Datenbank-Schema-Generierung fehlgeschlagen",
        skipSchemaGeneration:
          "Datenbank-Schema-Generierung wird übersprungen (--run-prod-database=false)",
        reportsGenerationStart: "Alle Berichte werden generiert...",
        reportsGenerationSuccess: "✅ Alle Berichte erfolgreich generiert",
        reportsGenerationFailed: "Berichtsgenerierung fehlgeschlagen",
        prodDbStart: "🚀 Produktions-Datenbankoperationen werden ausgeführt...",
        prodDbSuccess:
          "🎉 Produktions-Datenbankoperationen erfolgreich abgeschlossen",
        prodDbFailed:
          "❌ Produktions-Build während Datenbankoperationen fehlgeschlagen",
        prodDbNotReady:
          "💡 Dieser Build ist NICHT für Produktionsbereitstellung bereit",
        deploymentReady:
          "🚀 Ihre Anwendung ist bereit für Produktionsbereitstellung!",
        dbConnectionError:
          "Datenbankverbindung fehlgeschlagen. Stellen Sie sicher, dass die Datenbank läuft und erreichbar ist.",
        dbStartSuggestion:
          "Versuchen Sie 'docker compose -f docker-compose-dev.yml up -d' auszuführen, um die Datenbank zu starten",
        nextBuildHandled:
          "✅ Next.js-Build wird vom yarn build-Befehl behandelt",
        failedProdMigrations:
          "Produktions-Migrationen konnten nicht ausgeführt werden",
      },
    },
  },
};
