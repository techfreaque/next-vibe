import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Migration Task-Management",
  description: "Datenbankmigrationsaufgaben verwalten und überwachen",
  category: "Migrationsaufgaben",
  tags: {
    migration: "Migration",
    tasks: "Aufgaben",
    taskmanagement: "Task-Management",
  },
  container: {
    title: "Migration Task-Management",
    description: "Datenbankmigrationsaufgaben steuern und überwachen",
  },
  fields: {
    operation: {
      label: "Task-Operation",
      description: "Wählen Sie die auszuführende Migrationsaufgaben-Operation",
      placeholder: "Wählen Sie eine Migrationsaufgaben-Operation",
    },
    taskName: {
      label: "Task-Name",
      description: "Name der spezifischen Migrationsaufgabe",
      placeholder: "Task-Name eingeben (optional)",
    },
    options: {
      label: "Task-Optionen",
      description: "Konfigurationsoptionen für die Migrationsaufgabe",
      placeholder: "Task-Ausführungsoptionen konfigurieren",
    },
  },
  operations: {
    getMigrationStatus: "Migrationsstatus abrufen",
    listMigrationTasks: "Migrationsaufgaben auflisten",
    runHealthCheck: "Gesundheitsprüfung ausführen",
    startAutoMigration: "Automatische Migration starten",
    startBackupMonitor: "Backup-Monitor starten",
    stopAutoMigration: "Automatische Migration stoppen",
    stopBackupMonitor: "Backup-Monitor stoppen",
  },
  response: {
    success: {
      label: "Operation erfolgreich",
    },
    taskExecuted: {
      label: "Task ausgeführt",
    },
    status: {
      label: "Task-Status",
    },
    output: {
      label: "Task-Ausgabe",
    },
    error: {
      label: "Fehlerdetails",
    },
    result: {
      label: "Task-Ergebnis",
    },
  },
  errors: {
    validation: {
      title: "Validierungsfehler",
      description: "Ungültige Migrationsaufgaben-Parameter",
    },
    unauthorized: {
      title: "Unberechtigt",
      description:
        "Authentifizierung für Migrationsaufgaben-Operationen erforderlich",
    },
    forbidden: {
      title: "Verboten",
      description:
        "Unzureichende Berechtigungen für Migrationsaufgaben-Operationen",
    },
    internal: {
      title: "Task-Fehler",
      description: "Migrationsaufgaben-Ausführung fehlgeschlagen",
    },
    conflict: {
      title: "Konfliktfehler",
      description: "Migrationsaufgaben-Konflikt aufgetreten",
    },
    networkError: {
      title: "Netzwerkfehler",
      description: "Netzwerkfehler während Migrationsaufgaben-Operation",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Migrationsaufgabe nicht gefunden",
    },
    unknownError: {
      title: "Unbekannter Fehler",
      description:
        "Ein unbekannter Fehler ist während der Migrationsaufgaben-Operation aufgetreten",
    },
    unsavedChanges: {
      title: "Nicht gespeicherte Änderungen",
      description:
        "Es gibt nicht gespeicherte Änderungen in der Migrationsaufgabe",
    },
  },
  priority: {
    low: "Niedrige Priorität",
    medium: "Mittlere Priorität",
    high: "Hohe Priorität",
  },
  success: {
    title: "Migrationsaufgabe erfolgreich",
    description: "Migrationsaufgaben-Operation erfolgreich abgeschlossen",
  },
  messages: {
    healthCheckCompleted:
      "Gesundheitsprüfung abgeschlossen: {migrationsChecked} Migrationen überprüft, {pendingMigrations} ausstehend",
    healthCheckFailed: "Datenbankmigrations-Gesundheitsprüfung fehlgeschlagen",
    autoMigrationSkippedNotDevelopment:
      "Automatische Migration übersprungen - nicht in Entwicklungsumgebung",
    operationOnlyAllowedInDevelopment:
      "Diese Operation ist nur in der Entwicklungsumgebung erlaubt",
    autoMigrationTaskNotFound: "Automatische Migrationsaufgabe nicht gefunden",
    taskConfigurationMissing: "Task-Konfiguration fehlt",
    autoMigrationStartedSuccessfully:
      "Automatische Migration erfolgreich gestartet",
    failedToStartAutoMigration:
      "Fehler beim Starten der automatischen Migration",
    backupMonitorTaskNotFound: "Backup-Monitor-Aufgabe nicht gefunden",
    backupMonitorStartedSuccessfully: "Backup-Monitor erfolgreich gestartet",
    failedToStartBackupMonitor: "Fehler beim Starten des Backup-Monitors",
    autoMigrationStoppedSuccessfully:
      "Automatische Migration erfolgreich gestoppt",
    failedToStopAutoMigrationTask:
      "Fehler beim Stoppen der automatischen Migrationsaufgabe",
    backupMonitorStoppedSuccessfully: "Backup-Monitor erfolgreich gestoppt",
    failedToStopBackupMonitorTask:
      "Fehler beim Stoppen der Backup-Monitor-Aufgabe",
    migrationTaskNotFound: "Migrationsaufgabe nicht gefunden",
    migrationTaskDoesNotExist: "Migrationsaufgabe '{taskName}' existiert nicht",
    migrationTaskStatusRetrieved:
      "Status der Migrationsaufgabe '{taskName}' erfolgreich abgerufen",
    failedToGetMigrationTaskStatus:
      "Fehler beim Abrufen des Migrationsaufgaben-Status",
    foundMigrationTasks: "{count} Migrationsaufgaben gefunden",
    failedToListMigrationTasks: "Fehler beim Auflisten der Migrationsaufgaben",
  },
  tasks: {
    healthCheck: {
      description:
        "Führt Gesundheitsprüfungen bei Datenbankmigrationen durch, um die Systemintegrität sicherzustellen",
      schedule: "0 */6 * * *",
    },
    autoMigration: {
      description:
        "Führt automatisch ausstehende Datenbankmigrationen in der Entwicklungsumgebung aus",
      schedule: "*/30 * * * *",
    },
    backupMonitor: {
      description:
        "Überwacht und verwaltet Datenbankmigrations-Backup-Dateien und deren Bereinigung",
    },
  },
};
