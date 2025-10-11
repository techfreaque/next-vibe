import type { errorsTranslations as EnglishErrorsTranslations } from "../../../en/sections/cronErrors/errors";

export const errorsTranslations: typeof EnglishErrorsTranslations = {
  transform_failed: "Fehler beim Transformieren der Daten",
  stats_transform_failed: "Fehler beim Transformieren der Statistikdaten",
  status_transform_failed: "Fehler beim Transformieren der Statusdaten",
  execution: {
    invalid_module_structure: "Ungültige Modulstruktur",
    validation_failed: "Validierung fehlgeschlagen",
    execution_failed: "Ausführung fehlgeschlagen",
    threw_error: "Aufgabe hat einen Fehler ausgelöst",
    processing_error: "Verarbeitungsfehler",
    unknown_error: "Unbekannter Fehler",
  },
  email_campaigns: {
    failed_to_render_email: "Fehler beim Rendern der E-Mail-Vorlage",
    failed_to_initialize_campaign:
      "Fehler beim Initialisieren der E-Mail-Kampagne",
    unknown_error_fallback: "Unbekannter Fehler",
  },
  system: {
    task_validation_failed: "Aufgabenvalidierung fehlgeschlagen",
    database_connection_failed: "Datenbankverbindung fehlgeschlagen",
    required_tables_not_found: "Erforderliche Datenbanktabellen nicht gefunden",
    invalid_task_configuration: "Ungültige Aufgabenkonfiguration",
  },
  tasks: {
    list: {
      database_error: "Fehler beim Abrufen der Aufgaben aus der Datenbank",
      fetch_failed: "Fehler beim Abrufen der Aufgabenliste",
    },
  },
  task_create: {
    database_error: "Fehler beim Erstellen der Aufgabe in der Datenbank",
    invalid_schedule: "Ungültiges Cron-Zeitplan-Format",
    creation_failed: "Aufgabenerstellung fehlgeschlagen",
  },
  history: {
    fetch_failed: "Fehler beim Abrufen der Ausführungshistorie",
  },
  status: {
    health_fetch_failed: "Fehler beim Abrufen des Gesundheitsstatus",
    stats_fetch_failed: "Fehler beim Abrufen der Aufgabenstatistiken",
    system_status_failed: "Fehler beim Abrufen des Systemstatus",
  },
  stats: {
    detailed_stats_failed: "Fehler beim Abrufen detaillierter Statistiken",
  },
  task: {
    find_by_id_failed: "Fehler beim Finden der Aufgabe nach ID",
    find_by_name_failed: "Fehler beim Finden der Aufgabe nach Name",
    not_found: "Aufgabe nicht gefunden",
    update_failed: "Fehler beim Aktualisieren der Aufgabe",
    delete_failed: "Fehler beim Löschen der Aufgabe",
    toggle_failed: "Fehler beim Umschalten des Aufgabenstatus",
    executions_fetch_failed: "Fehler beim Abrufen der Aufgabenausführungen",
    execution_create_failed: "Fehler beim Erstellen der Aufgabenausführung",
    execution_update_failed: "Fehler beim Aktualisieren der Aufgabenausführung",
  },
};
