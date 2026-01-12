import { translations as taskManagementTranslations } from "../../task-management/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
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
    dryRun: {
      title: "Testlauf",
      description: "Migrationen vorab anzeigen ohne sie anzuwenden",
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
    generationFailed: "Migrationen konnten nicht generiert werden: {{message}}",
    generationFailedWithCode:
      "Migrationsgenerierung fehlgeschlagen mit Code {{code}}: {{output}}",
    migrationFailed: "Migrationen konnten nicht ausgeführt werden: {{message}}",
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
  taskManagement: taskManagementTranslations,
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
};
