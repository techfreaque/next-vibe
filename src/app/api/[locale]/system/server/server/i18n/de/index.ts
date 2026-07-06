import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "System Server",
  enum: {
    processStatus: {
      running: "Läuft",
      stopped: "Gestoppt",
      error: "Fehler",
    },
    environment: {
      development: "Entwicklung",
      production: "Produktion",
      testing: "Test",
      staging: "Staging",
    },
    mode: {
      development: "Entwicklung",
      production: "Produktion",
    },
    framework: {
      next: "Next.js",
      tanstack: "TanStack/Vite",
    },
  },
  build: {
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
        framework: {
          title: "Framework",
          description: "Frontend-Framework/Bundler",
        },
        webpack: {
          title: "Webpack verwenden",
          description:
            "Webpack statt Turbopack verwenden. Geringerer Speicherverbrauch (~7,5 GB vs ~12 GB). Standardmäßig aktiv in Docker-Produktions-Builds.",
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
        steps: {
          title: "Build-Schritte",
        },
        label: {
          title: "Schritt",
        },
        ok: {
          title: "Erfolgreich",
        },
        skipped: {
          title: "Übersprungen",
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
          description:
            "Sie haben keine Berechtigung, die Anwendung zu erstellen",
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
          description:
            "Der Next.js-Build-Prozess ist fehlgeschlagen: {{error}}",
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
          prodDbStart:
            "🚀 Produktions-Datenbankoperationen werden ausgeführt...",
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
  },
  dev: {
    category: "System Server",

    post: {
      title: "Titel",
      description: "Endpunkt-Beschreibung",
      form: {
        title: "Konfiguration",
        description: "Parameter konfigurieren",
      },
      response: {
        title: "Antwort",
        description: "Antwortdaten",
      },
      fields: {
        debug: {
          title: "Debug-Modus",
          description: "Debug-Modus für ausführliche Ausgabe aktivieren",
        },
        skipDbSetup: {
          title: "DB-Setup überspringen",
          description: "Datenbankeinrichtungsschritte überspringen",
        },
        skipNextCommand: {
          title: "Next-Befehl überspringen",
          description: "Next.js-Entwicklungsserver nicht starten",
        },
        skipDbReset: {
          title: "DB-Reset überspringen",
          description: "Datenbank-Reset-Operation überspringen",
        },

        port: {
          title: "Port",
          description: "Portnummer für den Entwicklungsserver",
        },
        skipGeneratorWatcher: {
          title: "Generator-Watcher überspringen",
          description: "Automatischen Code-Generator-Watcher überspringen",
        },
        generatorWatcherInterval: {
          title: "Generator-Intervall",
          description: "Intervall für Generator-Watcher in Millisekunden",
        },
        skipTaskRunner: {
          title: "Task-Runner überspringen",
          description: "Task-Runner-System nicht starten",
        },
        skipMigrations: {
          title: "Migrationen überspringen",
          description: "Datenbankmigrationen überspringen",
        },
        skipMigrationGeneration: {
          title: "Migrationsgenerierung überspringen",
          description: "Automatische Migrationsgenerierung überspringen",
        },
        skipSeeding: {
          title: "Seeding überspringen",
          description: "Datenbank-Seeding mit Anfangsdaten überspringen",
        },
        framework: {
          title: "Framework",
          description: "Frontend-Framework/Bundler",
        },
        profile: {
          title: "Profiling",
          description:
            "Profiling aktivieren: setzt NEXT_TURBOPACK_TRACING=1 (Trace-Datei unter .next/dev/trace-turbopack) und NEXT_CPU_PROF=1 (schreibt .cpuprofile beim Beenden)",
        },
        fixtureMode: {
          title: "Fixture-Modus",
          description:
            "HTTP-Fixture-Caching aktivieren (VIBE_FIXTURE_MODE=true). Fängt externe API-Aufrufe ab und speichert/repliziert sie aus src/generated/ai-fixtures/http-cache/. Für E2E-Tests gegen diesen Server als Remote.",
        },
        success: {
          title: "Erfolg",
        },
        output: {
          title: "Ausgabe",
        },
        duration: {
          title: "Dauer",
        },
        serverUrl: {
          title: "Server-URL",
        },
        databaseStatus: {
          title: "Datenbankstatus",
        },
        processes: {
          title: "Prozesse",
        },
        errors: {
          title: "Fehler",
        },
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
  health: {
    category: "System Server",

    tag: "Gesundheit",
    get: {
      title: "Gesundheitsprüfung",
      description: "Server-Gesundheitsstatus und Diagnose abrufen",
      form: {
        title: "Gesundheitsprüfungsoptionen",
        description: "Gesundheitsprüfungsparameter konfigurieren",
      },
      fields: {
        detailed: {
          title: "Detaillierter Bericht",
          description: "Detaillierte Systeminformationen einschließen",
        },
        includeDatabase: {
          title: "Datenbank einschließen",
          description: "Datenbank-Gesundheitsprüfungen einschließen",
        },
        includeTasks: {
          title: "Aufgaben einschließen",
          description: "Task-Runner-Gesundheitsprüfungen einschließen",
        },
        includeSystem: {
          title: "System einschließen",
          description: "System-Ressourceninformationen einschließen",
        },
      },
      response: {
        status: {
          title: "Status",
          description: "Gesamtgesundheitsstatus",
        },
        timestamp: {
          title: "Zeitstempel",
          description: "Zeit der Gesundheitsprüfung",
        },
        uptime: {
          title: "Betriebszeit",
          description: "Server-Betriebszeit in Sekunden",
        },
        environment: {
          title: "Umgebung",
          description: "Server-Umgebungsinformationen",
          name: {
            title: "Umgebungsname",
          },
          nodeEnv: {
            title: "Node-Umgebung",
          },
          platform: {
            title: "Plattform",
          },
          supportsTaskRunners: {
            title: "Unterstützt Task-Runner",
          },
        },
        database: {
          title: "Datenbankstatus",
          description: "Datenbankverbindungsstatus",
          status: {
            title: "Verbindungsstatus",
          },
          responseTime: {
            title: "Antwortzeit (ms)",
          },
          error: {
            title: "Fehlermeldung",
          },
        },
        tasks: {
          title: "Aufgabenstatus",
          description: "Task-Runner-Status",
          runnerStatus: {
            title: "Runner-Status",
          },
          activeTasks: {
            title: "Aktive Aufgaben",
          },
          totalTasks: {
            title: "Gesamtaufgaben",
          },
          errors: {
            title: "Fehleranzahl",
          },
          lastError: {
            title: "Letzter Fehler",
          },
        },
        system: {
          title: "Systeminfo",
          description: "System-Ressourceninformationen",
          memory: {
            title: "Speicherverbrauch",
            description: "System-Speicherinformationen",
            used: {
              title: "Verwendeter Speicher",
            },
            total: {
              title: "Gesamtspeicher",
            },
            percentage: {
              title: "Speicherverbrauch %",
            },
          },
          cpu: {
            title: "CPU-Verbrauch",
            description: "System-CPU-Informationen",
            usage: {
              title: "CPU-Verbrauch %",
            },
            loadAverage: {
              title: "Durchschnittslast",
            },
          },
          disk: {
            title: "Festplattenverbrauch",
            description: "System-Festplatteninformationen",
            available: {
              title: "Verfügbarer Speicherplatz",
            },
            total: {
              title: "Gesamtspeicherplatz",
            },
            percentage: {
              title: "Festplattenverbrauch %",
            },
          },
        },
        checks: {
          title: "Gesundheitsprüfungen",
          description: "Einzelne Komponenten-Gesundheitsprüfungen",
          item: {
            title: "Gesundheitsprüfung",
            description: "Einzelnes Gesundheitsprüfungsergebnis",
            name: {
              title: "Prüfungsname",
            },
            status: {
              title: "Prüfungsstatus",
            },
            message: {
              title: "Prüfungsmeldung",
            },
            duration: {
              title: "Dauer (ms)",
            },
          },
        },
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
          description: "Interner Serverfehler aufgetreten",
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
        unsavedChanges: {
          title: "Ungespeicherte Änderungen",
          description: "Es gibt ungespeicherte Änderungen",
        },
      },
      success: {
        title: "Erfolg",
        description: "Gesundheitsprüfung erfolgreich abgeschlossen",
      },
    },
  },
  start: {
    category: "Server-Verwaltung",
    tags: {
      start: "Starten",
    },
    post: {
      title: "Titel",
      description: "Endpunkt-Beschreibung",
      form: {
        title: "Konfiguration",
        description: "Parameter konfigurieren",
      },
      response: {
        title: "Antwort",
        description: "Antwortdaten",
      },
      fields: {
        skipPre: {
          title: "Vor-Aufgaben überspringen",
          description: "Vor-Aufgaben vor dem Serverstart überspringen",
        },
        skipNextCommand: {
          title: "Next.js-Befehl überspringen",
          description: "Next.js-Startbefehl überspringen",
        },
        mode: {
          title: "Server-Modus",
          description:
            "Welche Subsysteme ausgeführt werden: all (Standard), web (nur Next.js + WS), tasks (nur Task Runner)",
          options: {
            all: "Alle (Standard)",
            web: "Nur Web (Next.js + WebSocket)",
            tasks: "Nur Tasks (Cron Runner)",
          },
        },
        seed: {
          title: "Seeding ausführen",
          description: "Datenbank-Seeding beim Start ausführen",
        },
        dbSetup: {
          title: "Datenbankeinrichtung",
          description:
            "Datenbankeinrichtung und Migrationen beim Start ausführen",
        },
        taskRunner: {
          title: "Task Runner",
          description: "Task-Runner-System starten",
        },
        nextServer: {
          title: "Next.js-Server",
          description: "Next.js-Server starten",
        },
        port: {
          title: "Port",
          description: "Portnummer für den Server",
        },
        profile: {
          title: "Profiling",
          description:
            "Profiling aktivieren: setzt NEXT_CPU_PROF=1 (schreibt .cpuprofile beim Beenden) für den Produktions-Next.js-Server",
        },
        framework: {
          title: "Framework",
          description: "Frontend-Framework/Bundler",
        },
        skipTaskRunner: {
          title: "Task Runner überspringen",
          description: "Task Runner überspringen",
        },
        success: {
          title: "Erfolgreich",
        },
        serverStarted: {
          title: "Server gestartet",
        },
        output: {
          title: "Ausgabe",
        },
        serverInfo: {
          title: "Server-Informationen",
        },
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
        tanstackBuildNotFound:
          "Kein TanStack Start Build gefunden - wurde 'vibe build --tanstack' ausgeführt?",
        tanstackServerExited: "TanStack Start Server wurde sofort beendet",
        nextBuildNotFound:
          "Kein .next-prod Build gefunden - wurde 'vibe build' ausgeführt?",
        startFailed: "Server konnte nicht gestartet werden",
      },
      success: {
        title: "Erfolg",
        description: "Vorgang erfolgreich abgeschlossen",
      },
      repository: {
        messages: {
          startingServer: "🚀 Produktionsserver wird gestartet...",
          environment: "✅ Umgebung:",
          runningPreTasks: "Vor-Aufgaben werden ausgeführt...",
          runningMigrations: "Datenbank-Migrationen werden ausgeführt...",
          migrationsCompleted: "✅ Datenbank-Migrationen abgeschlossen",
          failedMigrations: "Migrationen fehlgeschlagen",
          seedingDatabase: "Datenbank wird mit Daten gefüllt...",
          seedingCompleted: "✅ Datenbank-Seeding abgeschlossen",
          failedSeeding: "Datenbank-Seeding fehlgeschlagen:",
          startingTaskRunner:
            "Produktions-Task-Runner-System wird gestartet...",
          taskRunnerStarted: "✅ Produktions-Task-Runner gestartet mit",
          taskRunnerStartedSuffix: " Aufgaben",
          failedTaskRunner: "Task-Runner konnte nicht gestartet werden",
          taskRunnerSkipped:
            "Produktions-Task-Runner übersprungen (--skip-task-runner Flag verwendet)",
          skipNextStart:
            "Next.js-Start wird übersprungen (wird von package.json behandelt)",
          serverWillStart: "Produktionsserver wird von package.json gestartet",
          serverAvailable: "Server wird verfügbar sein unter http://localhost:",
          startupPrepared: "✅ Produktionsserver-Start erfolgreich vorbereitet",
          failedStart: "❌ Produktionsserver-Start fehlgeschlagen:",
          gracefulShutdown:
            "Graceful Shutdown für Produktions-Task-Runner angefordert",
        },
      },
    },
  },
};
