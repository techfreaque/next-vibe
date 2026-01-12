import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Reset Task-Management",
  description: "Datenbankrücksetzungsaufgaben verwalten und überwachen",
  category: "Reset-Aufgaben",
  tags: {
    tasks: "Aufgaben",
    management: "Management",
    reset: "Reset",
    taskmanagement: "Task-Management",
  },
  container: {
    title: "Reset Task-Management",
    description: "Datenbankrücksetzungsaufgaben steuern und überwachen",
  },
  fields: {
    operation: {
      label: "Task-Operation",
      description: "Wählen Sie die auszuführende Reset-Task-Operation",
      placeholder: "Wählen Sie eine Reset-Task-Operation",
    },
    taskName: {
      label: "Task-Name",
      description: "Name der spezifischen Reset-Aufgabe",
      placeholder: "Task-Name eingeben (optional)",
    },
    options: {
      label: "Task-Optionen",
      description: "Konfigurationsoptionen für die Reset-Aufgabe",
      placeholder: "Task-Ausführungsoptionen konfigurieren",
    },
  },
  operations: {
    runSafetyCheck: "Sicherheitsprüfung ausführen",
    startAutoReset: "Automatischen Reset starten",
    startBackupVerification: "Backup-Verifizierung starten",
    stopAutoReset: "Automatischen Reset stoppen",
    stopBackupVerification: "Backup-Verifizierung stoppen",
    getStatus: "Status abrufen",
    listTasks: "Aufgaben auflisten",
  },
  response: {
    success: {
      label: "Operation erfolgreich",
    },
    taskName: {
      label: "Task-Name",
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
      description: "Ungültige Reset-Task-Parameter",
    },
    unauthorized: {
      title: "Unberechtigt",
      description: "Authentifizierung für Reset-Task-Operationen erforderlich",
    },
    forbidden: {
      title: "Verboten",
      description: "Unzureichende Berechtigungen für Reset-Task-Operationen",
    },
    internal: {
      title: "Task-Fehler",
      description: "Reset-Task-Ausführung fehlgeschlagen",
    },
    conflict: {
      title: "Konfliktfehler",
      description: "Reset-Task-Konflikt aufgetreten",
    },
    networkError: {
      title: "Netzwerkfehler",
      description: "Netzwerkfehler während Reset-Task-Operation",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Reset-Task nicht gefunden",
    },
    unknownError: {
      title: "Unbekannter Fehler",
      description:
        "Ein unbekannter Fehler ist während der Reset-Task-Operation aufgetreten",
    },
    unsavedChanges: {
      title: "Nicht gespeicherte Änderungen",
      description: "Es gibt nicht gespeicherte Änderungen in der Reset-Aufgabe",
    },
    timeout: {
      title: "Timeout-Fehler",
      description: "Reset-Task-Operation hat Timeout-Limit überschritten",
    },
  },
  priority: {
    low: "Niedrige Priorität",
    medium: "Mittlere Priorität",
    high: "Hohe Priorität",
  },
  success: {
    title: "Reset-Task erfolgreich",
    description: "Reset-Task-Operation erfolgreich abgeschlossen",
  },
  messages: {
    noUnauthorizedResetOperations: "Keine unbefugten Reset-Operationen erkannt",
    safetyCheckSkippedNotProduction:
      "Sicherheitsprüfung übersprungen (nicht in Produktion)",
    safetyCheckFailed: "Datenbank-Reset-Sicherheitsprüfung fehlgeschlagen",
    autoResetSkippedNotDevelopment:
      "Automatischer Reset übersprungen (nicht in Entwicklungsumgebung)",
    operationOnlyAllowedInDevelopment:
      "Operation nur in Entwicklungsumgebung erlaubt",
    autoResetTaskNotFound: "Automatische Reset-Aufgabe nicht gefunden",
    taskConfigurationMissing: "Task-Konfiguration fehlt",
    autoResetStartedSuccessfully:
      "Automatische Datenbank-Reset-Aufgabe erfolgreich gestartet",
    failedToStartAutoReset: "Automatischer Reset konnte nicht gestartet werden",
    backupVerificationTaskNotFound:
      "Backup-Verifizierungsaufgabe nicht gefunden",
    backupVerificationStartedSuccessfully:
      "Datenbank-Backup-Verifizierung erfolgreich gestartet",
    failedToStartBackupVerification:
      "Backup-Verifizierung konnte nicht gestartet werden",
    autoResetStoppedSuccessfully:
      "Automatische Reset-Aufgabe erfolgreich gestoppt",
    failedToStopAutoReset: "Automatischer Reset konnte nicht gestoppt werden",
    backupVerificationStoppedSuccessfully:
      "Backup-Verifizierungsaufgabe erfolgreich gestoppt",
    failedToStopBackupVerification:
      "Backup-Verifizierung konnte nicht gestoppt werden",
    taskNotFound: "Aufgabe nicht gefunden",
    taskDoesNotExist: "Aufgabe '{taskName}' existiert nicht",
    taskStatusRetrieved: "Status der Aufgabe '{taskName}' abgerufen",
    failedToGetTaskStatus: "Task-Status konnte nicht abgerufen werden",
    foundTasks: "{count} Aufgaben gefunden",
    failedToListTasks: "Aufgaben konnten nicht aufgelistet werden",
  },
  tasks: {
    resetSafetyCheck: {
      description:
        "Überwachung auf versehentliche Datenbank-Resets in der Produktion",
      schedule: "0 */12 * * *",
    },
    devAutoReset: {
      description:
        "Automatisches Zurücksetzen der Entwicklungsdatenbank nach Zeitplan",
      schedule: "0 6 * * 1",
    },
    backupVerification: {
      description: "Datenbank-Backups vor dem Zulassen von Resets verifizieren",
    },
  },
};
