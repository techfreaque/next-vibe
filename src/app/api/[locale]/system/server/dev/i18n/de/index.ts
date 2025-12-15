import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
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
};
