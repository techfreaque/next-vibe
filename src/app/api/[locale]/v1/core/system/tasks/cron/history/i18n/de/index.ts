import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    tags: {
      tasks: "Aufgaben",
      monitoring: "Überwachung",
    },
    title: "Task-Ausführungsverlauf",
    description:
      "Historische Ausführungsaufzeichnungen für Cron-Tasks anzeigen",
    fields: {
      taskId: {
        label: "Task-ID",
        description: "Nach spezifischer Task-ID filtern",
        placeholder: "Task-ID eingeben",
      },
      taskName: {
        label: "Task-Name",
        description: "Nach Task-Namen filtern (Teilübereinstimmung)",
        placeholder: "Task-Namen eingeben",
      },
      status: {
        label: "Ausführungsstatus",
        description: "Nach Ausführungsstatus filtern",
        placeholder: "Status auswählen",
        options: {
          PENDING: "Ausstehend",
          SCHEDULED: "Geplant",
          RUNNING: "Läuft",
          COMPLETED: "Abgeschlossen",
          FAILED: "Fehlgeschlagen",
          ERROR: "Fehler",
          TIMEOUT: "Zeitüberschreitung",
          SKIPPED: "Übersprungen",
          CANCELLED: "Abgebrochen",
          STOPPED: "Gestoppt",
          BLOCKED: "Blockiert",
        },
      },
      priority: {
        label: "Task-Priorität",
        description: "Nach Task-Prioritätsstufe filtern",
        placeholder: "Prioritäten auswählen",
        options: {
          LOW: "Niedrig",
          MEDIUM: "Mittel",
          HIGH: "Hoch",
          CRITICAL: "Kritisch",
        },
      },
      startDate: {
        label: "Startdatum",
        description: "Ausführungen nach diesem Datum filtern",
      },
      endDate: {
        label: "Enddatum",
        description: "Ausführungen vor diesem Datum filtern",
      },
      limit: {
        label: "Ergebnislimit",
        description: "Maximale Anzahl der zurückzugebenden Ergebnisse",
        placeholder: "50",
      },
      offset: {
        label: "Ergebnisversatz",
        description: "Anzahl der zu überspringenden Ergebnisse für Paginierung",
        placeholder: "0",
      },
    },
    response: {
      title: "Task-Verlaufsantwort",
      description: "Historische Ausführungsdaten für Cron-Tasks",
      executions: {
        title: "Ausführungsaufzeichnungen",
      },
      totalCount: {
        title: "Gesamtanzahl",
      },
      hasMore: {
        title: "Weitere Ergebnisse vorhanden",
      },
      summary: {
        title: "Ausführungszusammenfassung",
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter angegeben",
      },
      internal: {
        title: "Interner Serverfehler",
        description: "Task-Verlauf konnte nicht abgerufen werden",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Sie haben keine Berechtigung, den Task-Verlauf anzuzeigen",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Task oder Ausführungsaufzeichnung nicht gefunden",
      },
    },
    success: {
      title: "Verlauf abgerufen",
      description: "Task-Ausführungsverlauf erfolgreich abgerufen",
    },
    log: {
      fetchSuccess: "{{count}} Ausführungsaufzeichnungen erfolgreich abgerufen",
      fetchError: "Task-Ausführungsverlauf konnte nicht abgerufen werden",
    },
    request: {
      title: "Anfrageparameter",
      description: "Task-Ausführungsverlauf filtern",
    },
    unknownTask: "Unbekannter Task",
  },
};
