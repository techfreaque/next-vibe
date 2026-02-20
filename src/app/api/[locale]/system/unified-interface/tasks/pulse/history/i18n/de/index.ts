export const translations = {
  get: {
    title: "Pulse-Ausführungsverlauf",
    description: "Historische Pulse-Ausführungszyklen anzeigen",
    fields: {
      startDate: {
        label: "Startdatum",
        description: "Pulse-Zyklen nach diesem Datum filtern",
      },
      endDate: {
        label: "Enddatum",
        description: "Pulse-Zyklen vor diesem Datum filtern",
      },
      status: {
        label: "Status",
        description: "Nach Ausführungsstatus filtern",
        placeholder: "Alle Status",
      },
      limit: {
        label: "Ergebnislimit",
        description: "Maximale Anzahl der zurückzugebenden Ergebnisse",
        placeholder: "50",
      },
      offset: {
        label: "Ergebnisversatz",
        description:
          "Anzahl der zu überspringenden Ergebnisse für die Paginierung",
        placeholder: "0",
      },
    },
    response: {
      executions: { title: "Pulse-Ausführungen" },
      totalCount: { title: "Gesamtanzahl" },
      hasMore: { title: "Weitere Ergebnisse vorhanden" },
      summary: { title: "Ausführungszusammenfassung" },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter angegeben",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler beim Abrufen des Pulse-Verlaufs",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Sie haben keine Berechtigung, den Pulse-Verlauf anzuzeigen",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff auf den Pulse-Verlauf ist verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Pulse-Ausführungsdatensatz nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Datenkonflik aufgetreten",
      },
    },
    success: {
      title: "Verlauf abgerufen",
      description: "Pulse-Ausführungsverlauf erfolgreich abgerufen",
    },
  },
  widget: {
    title: "Pulse-Verlauf",
    empty: "Keine Pulse-Ausführungen gefunden",
    details: "Details",
    discovered: "{{count}} erkannt",
    due: "{{count}} fällig",
    succeeded: "{{count}} ok",
    failed: "{{count}} fehlgeschlagen",
    tasksExecuted: "Ausgeführt",
    tasksSucceeded: "Erfolgreich",
    tasksFailed: "Fehlgeschlagen",
    tasksSkipped: "Übersprungen",
    header: {
      cronHistory: "Cron-Verlauf",
      stats: "Statistiken",
      refresh: "Aktualisieren",
    },
    summary: {
      total: "Gesamt",
      successful: "Erfolgreich",
      failed: "Fehlgeschlagen",
      successRate: "Erfolgsrate",
      avgDuration: "Ø Dauer",
    },
    filter: {
      all: "Alle",
      success: "Erfolgreich",
      failure: "Fehlgeschlagen",
      timeout: "Timeout",
    },
    pagination: {
      info: "Seite {{page}} von {{totalPages}} ({{total}} gesamt)",
      prev: "Zurück",
      next: "Weiter",
    },
  },
};
