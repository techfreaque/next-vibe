import { translations as taskManagementTranslations } from "../../task-management/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tag: "zurücksetzen",
  post: {
    title: "Datenbank zurücksetzen",
    description:
      "Datenbank durch Tabellen leeren, Schema löschen oder vollständige Initialisierung zurücksetzen",
    form: {
      title: "Zurücksetzungskonfiguration",
      description: "Datenbank-Zurücksetzungsoptionen konfigurieren",
    },
    response: {
      title: "Zurücksetzungsantwort",
      description: "Ergebnisse der Datenbank-Zurücksetzungsoperation",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Zurücksetzungsparameter angegeben",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung für Zurücksetzungsoperationen erforderlich",
      },
      forbidden: {
        title: "Verboten",
        description: "Unzureichende Berechtigungen für Zurücksetzungsoperationen",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Zurücksetzungsressourcen nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler während der Zurücksetzung",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler während der Zurücksetzungsoperation",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist während der Zurücksetzung aufgetreten",
      },
      conflict: {
        title: "Konflikt",
        description: "Zurücksetzungskonflikt erkannt",
      },
      database: {
        title: "Datenbankfehler",
        description: "Datenbankfehler während der Zurücksetzungsoperation",
      },
      migration: {
        title: "Migrationsfehler",
        description: "Fehler beim Ausführen der Migrationen nach der Zurücksetzung",
      },
      internal: {
        title: "Interner Fehler",
        description: "Zurücksetzungsoperation fehlgeschlagen",
      },
    },
    success: {
      title: "Zurücksetzung erfolgreich",
      description: "Datenbank-Zurücksetzung erfolgreich abgeschlossen",
    },
  },
  fields: {
    mode: {
      title: "Zurücksetzungsmodus",
      description: "Art der durchzuführenden Zurücksetzungsoperation",
      truncate: "Tabellen leeren",
      drop: "Löschen und neu erstellen",
      initialize: "Vollständige Initialisierung",
    },
    force: {
      title: "Zurücksetzung erzwingen",
      description: "Sicherheitsprüfungen überspringen (erforderlich für destruktive Operationen)",
    },
    skipMigrations: {
      title: "Migrationen überspringen",
      description: "Migrationen nach der Zurücksetzung überspringen",
    },
    skipSeeds: {
      title: "Seeds überspringen",
      description: "Seed-Daten nach der Zurücksetzung überspringen",
    },
    dryRun: {
      title: "Testlauf",
      description: "Vorschau der Zurücksetzung ohne Änderungen vorzunehmen",
    },
    success: {
      title: "Erfolgsstatus",
    },
    tablesAffected: {
      title: "Betroffene Tabellen",
    },
    migrationsRun: {
      title: "Ausgeführte Migrationen",
    },
    seedsRun: {
      title: "Ausgeführte Seeds",
    },
    output: {
      title: "Ausgabe",
    },
    operations: {
      title: "Operationen",
      item: {
        title: "Operation",
      },
      type: {
        title: "Operationstyp",
      },
      status: {
        title: "Status",
      },
      details: {
        title: "Details",
      },
      count: {
        title: "Anzahl",
      },
    },
    isDryRun: {
      title: "Testlauf-Modus",
    },
    requiresForce: {
      title: "Erfordert Erzwingung",
    },
    duration: {
      title: "Dauer (ms)",
    },
  },
  status: {
    pending: "Ausstehend",
    running: "Läuft",
    success: "Erfolg",
    failed: "Fehlgeschlagen",
    cancelled: "Abgebrochen",
  },
  taskManagement: taskManagementTranslations,
  messages: {
    dryRun: "TESTLAUF: Keine tatsächlichen Änderungen wurden vorgenommen",
    truncateRequiresForce: "Löschvorgang erfordert --force Flag für Sicherheit",
    noTablesToTruncate: "Keine Tabellen zum Leeren gefunden",
    truncatedTables: "{{count}} Tabellen erfolgreich geleert",
    failedToTruncate: "Fehler beim Leeren der Tabellen: {{error}}",
    dropRequiresForce: "Löschvorgang erfordert --force Flag für Sicherheit",
    droppedSchema: "Schema gelöscht und neu erstellt ({{count}} Tabellen entfernt)",
    failedToDrop: "Fehler beim Löschen und Neuerstellen: {{error}}",
    databaseInitialized: "Datenbank erfolgreich initialisiert {{output}}",
    failedToInitialize: "Fehler beim Initialisieren der Datenbank: {{error}}",
    runningMigrations: "Migrationen würden hier ausgeführt",
    runningSeeds: "Seeds würden hier ausgeführt",
  },
};
