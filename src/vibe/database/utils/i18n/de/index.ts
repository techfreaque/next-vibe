import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
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
      commandFailed: "Docker-Befehl fehlgeschlagen mit Code {code}: {command}",
      executionFailed: "Fehler beim Ausführen des Docker-Befehls: {command}",
      commandError: "Docker-Befehl Fehler: {error}",
    },
  },
  title: "Datenbank-Utilities",
  titleShort: "DB-Hilfsfunktionen",
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
};
