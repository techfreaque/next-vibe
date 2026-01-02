import { translations as dockerOperationsTranslations } from "../../docker-operations/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  dockerOperations: dockerOperationsTranslations,
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
    command_timeout: "Docker-Befehl nach {{timeout}}ms abgebrochen: {{command}}",
    command_failed: "Docker-Befehl fehlgeschlagen mit Code {{code}}: {{command}}",
    execution_failed: "Fehler beim Ausführen des Docker-Befehls: {{command}}",
    command_error: "Docker-Befehlsfehler: {{error}}",
    stopping_containers: "Docker-Container werden gestoppt...",
    starting_containers: "Docker-Container werden gestartet...",
  },
};
