import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Datenbankoperationen",
  generate: {
    category: "Datenbankoperationen",
    tag: "migration",
    post: {
      title: "Migrationen generieren",
      description: "Drizzle-Migrationsdateien aus Schema-Änderungen generieren",
      form: {
        title: "Generierungskonfiguration",
        description: "Optionen für die Migrationsgenerierung konfigurieren",
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Parameter",
        },
        network: {
          title: "Generierung fehlgeschlagen",
          description: "drizzle-kit generate fehlgeschlagen",
        },
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung erforderlich",
        },
        forbidden: {
          title: "Verboten",
          description: "Unzureichende Berechtigungen",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Ressourcen nicht gefunden",
        },
        server: { title: "Serverfehler", description: "Interner Serverfehler" },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unbekannter Fehler ist aufgetreten",
        },
        conflict: { title: "Konflikt", description: "Konflikt erkannt" },
      },
      success: {
        title: "Generierung erfolgreich",
        description: "Migrationsdateien erfolgreich generiert",
      },
    },
    fields: {
      success: { title: "Erfolgsstatus" },
      output: { title: "Ausgabe" },
      duration: { title: "Dauer (ms)" },
    },
  },
  migrate: {
    category: "Datenbankoperationen",

    tag: "migration",
    post: {
      title: "Datenbankmigration",
      description: "Datenbankmigrationen ausführen",
      form: {
        title: "Migrationskonfiguration",
        description: "Datenbankmigrations-Optionen konfigurieren",
      },
      response: {
        title: "Migrationsantwort",
        description: "Ergebnisse der Migrationsoperation",
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Migrationsparameter",
        },
        internal: {
          title: "Interner Fehler",
          description: "Migrationsvorgang fehlgeschlagen",
        },
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung für Migrationsvorgänge erforderlich",
        },
        forbidden: {
          title: "Verboten",
          description: "Unzureichende Berechtigungen für Migrationsvorgänge",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Migrationsressourcen nicht gefunden",
        },
        server: {
          title: "Serverfehler",
          description: "Interner Serverfehler während der Migration",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description:
            "Ein unbekannter Fehler ist während der Migration aufgetreten",
        },
        conflict: {
          title: "Konflikt",
          description: "Migrationskonflikt erkannt",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Netzwerkfehler während des Migrationsvorgangs",
        },
      },
      success: {
        title: "Migration erfolgreich",
        description: "Datenbankmigration erfolgreich abgeschlossen",
      },
    },
    fields: {
      generate: {
        title: "Migrationen generieren",
        description: "Neue Migrationsdateien aus Schema-Änderungen generieren",
      },
      redo: {
        title: "Letzte Migration wiederholen",
        description: "Letzte Migration zurücksetzen und erneut anwenden",
      },
      schema: {
        title: "Datenbankschema",
        description: "Ziel-Datenbankschema (Standard: public)",
      },
      success: {
        title: "Erfolgsstatus",
      },
      migrationsRun: {
        title: "Ausgeführte Migrationen",
      },
      migrationsGenerated: {
        title: "Generierte Migrationen",
      },
      output: {
        title: "Ausgabe",
      },
      duration: {
        title: "Dauer (ms)",
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Migrationsparameter",
      },
      internal: {
        title: "Interner Fehler",
        description: "Migrationsvorgang fehlgeschlagen",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung für Migrationsvorgänge erforderlich",
      },
      forbidden: {
        title: "Verboten",
        description: "Unzureichende Berechtigungen für Migrationsvorgänge",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Migrationsressourcen nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler während der Migration",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description:
          "Ein unbekannter Fehler ist während der Migration aufgetreten",
      },
      conflict: {
        title: "Konflikt",
        description: "Migrationskonflikt erkannt",
      },
      generationFailed:
        "Migrationen konnten nicht generiert werden: {{message}}",
      generationFailedWithCode:
        "Migrationsgenerierung fehlgeschlagen mit Code {{code}}: {{output}}",
      migrationFailed:
        "Migrationen konnten nicht ausgeführt werden: {{message}}",
    },
    success: {
      title: "Migration erfolgreich",
      description: "Datenbankmigration erfolgreich abgeschlossen",
    },
    status: {
      pending: "Ausstehend",
      running: "Läuft",
      success: "Erfolg",
      failed: "Fehlgeschlagen",
      rolledBack: "Zurückgesetzt",
    },
    direction: {
      up: "Aufwärts",
      down: "Abwärts",
    },
    environment: {
      development: "Entwicklung",
      staging: "Staging",
      production: "Produktion",
    },
    messages: {
      dryRun: "TESTLAUF: Würde Migrationen ausführen",
      generatingMigrations: "Migrationsgenerierung:\n{{output}}\n",
      noMigrationsFolder: "Kein Migrationsordner gefunden",
      noMigrationFiles: "Keine Migrationsdateien gefunden",
      executedMigrations: "{{count}} Migrationen erfolgreich ausgeführt",
      redoNotImplemented: "Wiederholungsfunktion würde hier implementiert",
      repairCompleted: "Migrationsreparatur erfolgreich abgeschlossen",
      repairDryRun: "Testlauf: Migrationsreparatur würde durchgeführt",
      trackingReset: "Migrationsverfolgung erfolgreich zurückgesetzt",
      productionCompleted: "Produktionsmigrationen erfolgreich abgeschlossen",
      productionWithBackup: " (mit Backup)",
      syncCompleted:
        "Migrationssynchronisierung erfolgreich abgeschlossen ({{direction}})",
      failedToGenerate: "Fehler beim Generieren von Migrationen: {{error}}",
      failedToExecute: "Fehler beim Ausführen von Migrationen: {{error}}",
      failedToRedo: "Fehler beim Wiederholen der Migration: {{error}}",
    },
  },
  ping: {
    category: "Datenbankoperationen",
    tag: "datenbank",
    post: {
      title: "Datenbank-Ping",
      description: "Datenbankverbindung und -status prüfen",
      form: {
        title: "Ping-Konfiguration",
        description: "Datenbank-Ping-Parameter konfigurieren",
      },
      response: {
        title: "Antwort",
        description: "Ping-Antwortdaten",
      },
      errors: {
        unauthorized: {
          title: "Nicht autorisiert",
          description:
            "Authentifizierung für Datenbankoperationen erforderlich",
        },
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Ping-Anfrageparameter",
        },
        server: {
          title: "Serverfehler",
          description: "Interner Serverfehler beim Datenbank-Ping",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description:
            "Ein unbekannter Fehler ist beim Datenbank-Ping aufgetreten",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Netzwerkfehler beim Verbinden mit der Datenbank",
        },
        forbidden: {
          title: "Verboten",
          description: "Zugriff verboten - unzureichende Berechtigungen",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Datenbankressource nicht gefunden",
        },
        conflict: {
          title: "Konflikt",
          description: "Datenkonflikt während der Operation aufgetreten",
        },
      },
      success: {
        title: "Datenbank-Ping erfolgreich",
        description: "Erfolgreich mit Datenbank verbunden",
      },
    },
    fields: {
      silent: {
        title: "Stiller Modus",
        description: "Ping ohne Ausgabemeldungen ausführen",
      },
      keepConnectionOpen: {
        title: "Verbindung offen halten",
        description: "Datenbankverbindung nach Ping offen halten",
      },
      success: {
        title: "Erfolgsstatus",
        content: "Erfolg",
      },
      isAccessible: {
        title: "Datenbank erreichbar",
        content: "Erreichbar",
      },
      output: {
        title: "Ausgabemeldung",
        content: "Ausgabe",
      },
      connectionInfo: {
        title: "Verbindungsinformationen",
        totalConnections: {
          content: "Gesamtverbindungen",
        },
        idleConnections: {
          content: "Inaktive Verbindungen",
        },
        waitingClients: {
          content: "Wartende Clients",
        },
      },
    },
    status: {
      success: "Erfolg",
      failed: "Fehlgeschlagen",
      timeout: "Zeitüberschreitung",
      error: "Fehler",
    },
    connectionType: {
      primary: "Primär",
      replica: "Replik",
      cache: "Cache",
    },
  },
  seed: {
    category: "Datenbankoperationen",

    tag: "seed",
    post: {
      title: "Datenbank-Seed",
      description: "Datenbank mit Daten befüllen",
      form: {
        title: "Seed-Konfiguration",
        description: "Seed-Parameter konfigurieren",
      },
      response: {
        title: "Seed-Antwort",
        description: "Ergebnisse der Datenbank-Seed-Operation",
      },
      errors: {
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung für Datenbank-Seed erforderlich",
        },
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Seed-Parameter angegeben",
        },
        server: {
          title: "Serverfehler",
          description: "Interner Serverfehler beim Seeding",
        },
        internal: {
          title: "Interner Fehler",
          description: "Datenbank-Seed-Vorgang fehlgeschlagen",
        },
        database: {
          title: "Datenbankfehler",
          description: "Datenbankfehler beim Seeding aufgetreten",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unbekannter Fehler ist beim Seeding aufgetreten",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Netzwerkfehler beim Seeding",
        },
        forbidden: {
          title: "Verboten",
          description: "Unzureichende Berechtigungen für Datenbank-Seed",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Seed-Ressourcen nicht gefunden",
        },
        conflict: {
          title: "Konflikt",
          description: "Datenkonflikt beim Seeding erkannt",
        },
      },
      success: {
        title: "Datenbank geseeded",
        description: "Datenbank-Seeding erfolgreich abgeschlossen",
      },
    },
    fields: {
      environment: {
        title: "Umgebung",
        description: "Ziel-Seed-Umgebung (dev, test, prod)",
      },
      success: {
        title: "Erfolgsstatus",
      },
      seedsExecuted: {
        title: "Ausgeführte Seeds",
      },
      collections: {
        title: "Seed-Sammlungen",
        item: {
          title: "Sammlung",
        },
        name: {
          title: "Sammlungsname",
        },
        status: {
          title: "Status",
        },
        recordsCreated: {
          title: "Erstellte Datensätze",
        },
      },
      totalRecords: {
        title: "Gesamte Datensätze",
      },
      duration: {
        title: "Dauer (ms)",
      },
    },
  },
  sql: {
    category: "Datenbankoperationen",

    tag: "sql",
    post: {
      title: "SQL ausführen",
      description: "SQL-Abfragen auf der Datenbank ausführen",
      form: {
        title: "SQL-Abfragekonfiguration",
        description: "SQL-Abfrageparameter konfigurieren",
      },
      response: {
        title: "Abfrageantwort",
        description: "SQL-Abfrage-Ausführungsergebnisse",
      },
      errors: {
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung für SQL-Ausführung erforderlich",
        },
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige SQL-Abfrage oder Parameter",
        },
        server: {
          title: "Serverfehler",
          description: "Interner Serverfehler bei SQL-Ausführung",
        },
        internal: {
          title: "Interner Fehler",
          description: "SQL-Abfrage-Ausführung fehlgeschlagen",
        },
        database: {
          title: "Datenbankfehler",
          description: "Datenbankfehler bei Abfrageausführung aufgetreten",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description:
            "Ein unbekannter Fehler ist bei SQL-Ausführung aufgetreten",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Netzwerkfehler bei SQL-Ausführung",
        },
        forbidden: {
          title: "Verboten",
          description: "Unzureichende Berechtigungen für SQL-Ausführung",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "SQL-Ressourcen nicht gefunden",
        },
        conflict: {
          title: "Konflikt",
          description: "SQL-Konflikt erkannt",
        },
      },
      success: {
        title: "Abfrage ausgeführt",
        description: "SQL-Abfrage erfolgreich ausgeführt",
      },
    },
    fields: {
      query: {
        title: "SQL-Abfrage",
        description: "Die auszuführende SQL-Abfrage",
      },
      queryFile: {
        title: "Abfragedateipfad",
        description: "Pfad zu einer auszuführenden SQL-Datei",
        placeholder: "/pfad/zur/abfrage.sql",
      },
      dryRun: {
        title: "Testlauf",
        description: "Abfrage ohne Ausführung anzeigen",
      },
      verbose: {
        title: "Ausführliche Ausgabe",
        description: "Detaillierte Abfrageinformationen anzeigen",
      },
      limit: {
        title: "Zeilenlimit",
        description: "Maximale Anzahl zurückzugebender Zeilen (1-1000)",
      },
      success: {
        title: "Erfolgsstatus",
      },
      output: {
        title: "Ausgabe",
      },
      results: {
        title: "Abfrageergebnisse",
      },
      rowCount: {
        title: "Zeilenanzahl",
      },
      queryType: {
        title: "Abfragetyp",
      },
    },
  },
  studio: {
    category: "Datenbankoperationen",

    tag: "studio",
    post: {
      title: "Datenbank-Studio",
      description: "Datenbank-Studio für visuelle Datenbankverwaltung öffnen",
      form: {
        title: "Studio-Konfiguration",
        description: "Datenbank-Studio-Parameter konfigurieren",
      },
      response: {
        title: "Studio-Antwort",
        description: "Datenbank-Studio-Startergebnisse",
      },
      errors: {
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung für Datenbank-Studio erforderlich",
        },
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Studio-Parameter",
        },
        server: {
          title: "Serverfehler",
          description: "Interner Serverfehler beim Studio-Start",
        },
        internal: {
          title: "Interner Fehler",
          description: "Datenbank-Studio-Start fehlgeschlagen",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unbekannter Fehler beim Studio-Start aufgetreten",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Netzwerkfehler beim Studio-Start",
        },
        forbidden: {
          title: "Verboten",
          description: "Unzureichende Berechtigungen für Datenbank-Studio",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Studio-Ressourcen nicht gefunden",
        },
        conflict: {
          title: "Konflikt",
          description: "Studio-Port-Konflikt erkannt",
        },
      },
      success: {
        title: "Studio gestartet",
        description: "Datenbank-Studio erfolgreich gestartet",
      },
    },
    fields: {
      port: {
        title: "Port",
        description: "Portnummer für Datenbank-Studio (1024-65535)",
      },
      openBrowser: {
        title: "Browser öffnen",
        description: "Studio automatisch im Browser öffnen",
      },
      success: {
        title: "Erfolgsstatus",
      },
      url: {
        title: "Studio-URL",
      },
      portUsed: {
        title: "Tatsächlich verwendeter Port",
      },
      output: {
        title: "Start-Ausgabe",
      },
      duration: {
        title: "Start-Dauer",
      },
    },
  },
  utils: {
    category: "Datenbankoperationen",

    dockerOperations: {
      title: "Docker-Operationen",
      description: "Docker-Befehle ausführen und Container verwalten",
      category: "Docker",
      tags: {
        docker: "Docker",
        utils: "Utilities",
        dockeroperations: "Docker-Operationen",
      },
      container: {
        title: "Docker-Operationen",
        description:
          "Docker-Befehle mit ordnungsgemäßer Fehlerbehandlung ausführen",
      },
      fields: {
        command: {
          label: "Docker-Befehl",
          description: "Der auszuführende Docker-Befehl",
          placeholder: "docker ps",
        },
        options: {
          label: "Ausführungsoptionen",
          description: "Konfigurationsoptionen für die Befehlsausführung",
          placeholder: "Timeout- und Protokollierungsoptionen konfigurieren",
        },
      },
      response: {
        success: {
          label: "Befehl erfolgreich",
        },
        output: {
          label: "Befehlsausgabe",
        },
        error: {
          label: "Fehlerdetails",
        },
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Docker-Befehlsparameter",
        },
        unauthorized: {
          title: "Unberechtigt",
          description: "Authentifizierung für Docker-Operationen erforderlich",
        },
        forbidden: {
          title: "Verboten",
          description: "Unzureichende Berechtigungen für Docker-Operationen",
        },
        internal: {
          title: "Docker-Fehler",
          description: "Docker-Befehlsausführung fehlgeschlagen",
        },
        timeout: {
          title: "Befehl-Timeout",
          description: "Docker-Befehl hat Timeout-Limit überschritten",
        },
        executionFailed: {
          title: "Ausführung fehlgeschlagen",
          description: "Docker-Befehlsausführung fehlgeschlagen",
        },
        composeDownFailed: {
          title: "Compose Down fehlgeschlagen",
          description: "Docker Compose Down-Operation fehlgeschlagen",
        },
        composeUpFailed: {
          title: "Compose Up fehlgeschlagen",
          description: "Docker Compose Up-Operation fehlgeschlagen",
        },
      },
      success: {
        title: "Docker-Befehl erfolgreich",
        description: "Docker-Befehl erfolgreich ausgeführt",
      },
      messages: {
        executingCommand: "Docker-Befehl wird ausgeführt: {command}",
        timeoutError: "Docker-Befehl Timeout nach {timeout}ms: {command}",
        commandFailed:
          "Docker-Befehl fehlgeschlagen mit Code {code}: {command}",
        executionFailed: "Fehler beim Ausführen des Docker-Befehls: {command}",
        commandError: "Docker-Befehl Fehler: {error}",
      },
    },
    title: "Datenbank-Utilities",
    description: "Hilfsfunktionen für Datenbankoperationen",
    tag: "utils",
    includeDetails: {
      title: "Details einschließen",
      description: "Detaillierte Informationen in der Antwort einschließen",
    },
    checkConnections: {
      title: "Verbindungen prüfen",
      description: "Datenbankverbindungsstatus prüfen",
    },
    status: {
      title: "Gesundheitsstatus",
    },
    timestamp: {
      title: "Zeitstempel",
    },
    connections: {
      title: "Verbindungsstatus",
      primary: "Primärverbindung",
      replica: "Replikaverbindung",
    },
    details: {
      title: "Datenbankdetails",
      version: "Version",
      uptime: "Betriebszeit (Sekunden)",
      activeConnections: "Aktive Verbindungen",
      maxConnections: "Maximale Verbindungen",
    },
    errors: {
      health_check_failed: "Datenbank-Gesundheitscheck fehlgeschlagen",
      connection_failed: "Datenbankverbindung fehlgeschlagen",
      stats_failed: "Fehler beim Abrufen der Datenbankstatistiken",
      docker_check_failed: "Docker-Verfügbarkeitspr üfung fehlgeschlagen",
      reset_failed: "Datenbank-Zurücksetzung fehlgeschlagen",
      manage_failed: "Datenbank-Verwaltungsvorgang fehlgeschlagen",
      reset_operation_failed: "Zurücksetzungsvorgang fehlgeschlagen",
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Datenbank-Utility-Parameter",
      },
      unauthorized: {
        title: "Unberechtigt",
        description: "Authentifizierung für Datenbank-Utilities erforderlich",
      },
      internal: {
        title: "Interner Fehler",
        description: "Datenbank-Utility-Operation fehlgeschlagen",
      },
    },
    success: {
      title: "Datenbank-Utilities erfolgreich",
      description: "Datenbank-Utility-Operationen erfolgreich abgeschlossen",
    },
    docker: {
      executing_command: "Docker-Befehl ausführen: {{command}}",
      command_timeout:
        "Docker-Befehl nach {{timeout}}ms abgebrochen: {{command}}",
      command_failed:
        "Docker-Befehl fehlgeschlagen mit Code {{code}}: {{command}}",
      execution_failed: "Fehler beim Ausführen des Docker-Befehls: {{command}}",
      command_error: "Docker-Befehlsfehler: {{error}}",
      stopping_containers: "Docker-Container werden gestoppt...",
      starting_containers: "Docker-Container werden gestartet...",
    },
  },
};
