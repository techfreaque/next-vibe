import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
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
      tanstack: {
        title: "TanStack",
        description:
          "TanStack Router/Vite statt Next.js verwenden (führt vite preview aus)",
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
        startingTaskRunner: "Produktions-Task-Runner-System wird gestartet...",
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
};
