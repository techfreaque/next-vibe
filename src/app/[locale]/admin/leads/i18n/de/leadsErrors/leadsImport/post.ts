import type { translations as EnglishPostTranslations } from "../../../en/leadsErrors/leadsImport/post";

export const translations: typeof EnglishPostTranslations = {
  success: {
    title: "Import-Auftragsaktion abgeschlossen",
    description: "Die angeforderte Aktion wurde ausgeführt",
    job_stopped: "Auftrag erfolgreich gestoppt",
    job_queued_retry: "Auftrag für Wiederholung eingereiht",
    job_deleted: "Auftrag erfolgreich gelöscht",
  },
  error: {
    validation: {
      title: "Lead-Import-Validierung fehlgeschlagen",
      description:
        "Bitte überprüfen Sie Ihre CSV-Datei und versuchen Sie es erneut",
      failed: "CSV-Zeilen-Validierung fehlgeschlagen",
      invalidData: "Ungültige Daten in CSV-Zeile",
      missingFields: "Erforderliche Felder fehlen",
      invalidEmail: "Ungültige E-Mail-Adresse in CSV-Zeile",
      email_required: "E-Mail ist erforderlich",
      invalid_email_format: "Ungültiges E-Mail-Format",
    },
    unauthorized: {
      title: "Lead-Import nicht autorisiert",
      description: "Sie haben keine Berechtigung, Leads zu importieren",
    },
    server: {
      title: "Lead-Import Serverfehler",
      description:
        "Leads konnten aufgrund eines Serverfehlers nicht importiert werden",
    },
    unknown: {
      title: "Lead-Import fehlgeschlagen",
      description:
        "Ein unerwarteter Fehler beim Importieren der Leads ist aufgetreten",
    },
    forbidden: {
      title: "Lead-Import verboten",
      description: "Sie haben keine Berechtigung, Leads zu importieren",
    },
    not_found: {
      title: "Import-Auftrag nicht gefunden",
      description:
        "Der angeforderte Import-Auftrag konnte nicht gefunden werden",
    },
    stopped_by_user: "Vom Benutzer gestoppt",
  },
};
