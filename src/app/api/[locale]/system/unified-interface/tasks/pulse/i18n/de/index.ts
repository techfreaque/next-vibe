import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  execute: {
    category: "Pulse Ausführung",
    tags: {
      execute: "Ausführen",
    },
    post: {
      title: "Pulse Ausführen",
      description: "Pulse Gesundheitsüberwachung und Aufgabenausführung",
      container: {
        title: "Pulse Ausführung",
        description:
          "Pulse Überwachung ausführen und geplante Aufgaben starten",
      },
      fields: {
        dryRun: {
          label: "Testlauf",
          description: "Testlauf ohne tatsächliche Änderungen durchführen",
        },
        taskNames: {
          label: "Aufgabennamen",
          description: "Spezifische Aufgabennamen zum Ausführen (optional)",
        },
        force: {
          label: "Erzwungene Ausführung",
          description:
            "Ausführung erzwingen, auch wenn Aufgaben nicht fällig sind",
        },
        success: {
          title: "Erfolg",
        },
        message: {
          title: "Nachricht",
        },
      },
      response: {
        pulseId: "Pulse ID",
        executedAt: "Ausgeführt am",
        totalTasksDiscovered: "Gefundene Aufgaben gesamt",
        tasksDue: "Fällige Aufgaben",
        tasksExecuted: "Ausgeführte Aufgaben",
        tasksSucceeded: "Erfolgreiche Aufgaben",
        tasksFailed: "Fehlgeschlagene Aufgaben",
        tasksSkipped: "Übersprungene Aufgaben",
        totalExecutionTimeMs: "Gesamtausführungszeit (ms)",
        errors: "Fehler",
        summary: "Ausführungszusammenfassung",
        results: "Ergebnisse",
        resultsDescription: "Aufgabenausführungsergebnisse",
        taskName: "Aufgabenname",
        success: "Erfolg",
        duration: "Dauer",
        message: "Nachricht",
        executionFailed: "Ausführung fehlgeschlagen",
        dryRunSuccess: "Probelauf erfolgreich abgeschlossen",
        executionSuccess: "Ausführung erfolgreich abgeschlossen",
      },
      examples: {
        basic: {
          title: "Grundlegende Pulse Ausführung",
        },
        dryRun: {
          title: "Testlauf Ausführung",
        },
        success: {
          title: "Erfolgreiche Ausführung",
        },
      },
      errors: {
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung erforderlich",
        },
        internal: {
          title: "Interner Fehler",
          description: "Interner Serverfehler aufgetreten",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unbekannter Fehler ist aufgetreten",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Netzwerkfehler aufgetreten",
        },
        forbidden: {
          title: "Verboten",
          description: "Zugriff verboten",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Ressource nicht gefunden",
        },
        conflict: {
          title: "Konflikt",
          description: "Datenkonflikt aufgetreten",
        },
        unsaved: {
          title: "Ungespeicherte Änderungen",
          description: "Es gibt ungespeicherte Änderungen",
        },
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Anfrageparameter",
        },
      },
      success: {
        title: "Erfolg",
        description: "Operation erfolgreich abgeschlossen",
      },
    },
  },
  status: {
    category: "API Endpunkt",
    tags: {
      status: "Status",
    },
    get: {
      title: "Pulse Status",
      description: "Pulse-Gesundheitsüberwachungsstatus abrufen",
      container: {
        title: "Pulse-Gesundheitsstatus",
        description: "Pulse-Ausführungsgesundheit und Statistiken überwachen",
      },
      fields: {
        status: {
          title: "Status",
          label: "Pulse Status",
          description: "Aktueller Pulse-Gesundheitsstatus",
        },
        lastPulseAt: {
          title: "Letzter Pulse um",
          label: "Letzter Pulse",
          description: "Zeitstempel der letzten Pulse-Ausführung",
        },
        successRate: {
          title: "Erfolgsrate",
          label: "Erfolgsrate",
          description: "Prozentsatz erfolgreicher Pulse-Ausführungen",
        },
        totalExecutions: {
          title: "Gesamtausführungen",
          label: "Gesamtausführungen",
          description: "Gesamtanzahl der Pulse-Ausführungen",
        },
      },
      examples: {
        basic: {
          title: "Grundlegende Statusanfrage",
        },
        success: {
          title: "Erfolgreiche Statusantwort",
        },
      },
      errors: {
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung erforderlich",
        },
        internal: {
          title: "Interner Fehler",
          description: "Interner Serverfehler aufgetreten",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unbekannter Fehler ist aufgetreten",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Netzwerkfehler aufgetreten",
        },
        forbidden: {
          title: "Verboten",
          description: "Zugriff verboten",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Ressource nicht gefunden",
        },
        conflict: {
          title: "Konflikt",
          description: "Datenkonflikt aufgetreten",
        },
        unsaved: {
          title: "Nicht gespeicherte Änderungen",
          description: "Es gibt nicht gespeicherte Änderungen",
        },
        validation: {
          title: "Validierungsfehler",
          description: "Ungültige Anfrageparameter",
        },
      },
      success: {
        title: "Erfolg",
        description: "Operation erfolgreich abgeschlossen",
      },
    },
  },
  history: {
    category: "Aufgabenverwaltung",

    tags: {
      pulse: "Pulse",
      monitoring: "Überwachung",
    },

    errors: {
      fetchCronTaskHistory: "Fehler beim Abrufen des Pulse-Ausführungsverlaufs",
    },

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
    pulse: {
      execution: {
        success: "Erfolgreich",
        failure: "Fehlgeschlagen",
        timeout: "Zeitüberschreitung",
        cancelled: "Abgebrochen",
        pending: "Ausstehend",
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
  },
  success: {
    title: "Erfolg",
    description: "Puls erfolgreich ausgeführt",
    content: "Erfolg",
  },
  container: {
    title: "Puls-Container",
    description: "Puls-Container-Beschreibung",
  },
};
