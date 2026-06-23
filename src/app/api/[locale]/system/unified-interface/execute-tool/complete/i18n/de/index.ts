import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "System",
  tags: {
    remoteSync: "Remote-Synchronisation",
  },
  taskReport: {
    post: {
      title: "Aufgabenbericht",
      titleShort: "Bericht",
      description: "Ausführungsergebnisse von Remote-Instanzen entgegennehmen.",
      taskId: {
        label: "Aufgaben-ID",
        description: "ID der berichteten Aufgabe",
      },
      executionId: {
        label: "Ausführungs-ID",
        description: "ID des spezifischen Ausführungslaufs",
      },
      status: {
        label: "Status",
        description: "Endstatus der Aufgabenausführung",
      },
      durationMs: {
        label: "Dauer (ms)",
        description: "Ausführungsdauer in Millisekunden",
      },
      summary: {
        label: "Zusammenfassung",
        description: "Lesbare Zusammenfassung des Ergebnisses",
      },
      error: {
        label: "Fehler",
        description: "Fehlermeldung bei fehlgeschlagener Ausführung",
      },
      serverTimezone: {
        label: "Server-Zeitzone",
        description: "Zeitzone des ausführenden Servers",
      },
      executedByInstance: {
        label: "Ausgeführt von",
        description: "Instanz-ID, die die Aufgabe ausgeführt hat",
      },
      output: {
        label: "Ausgabe",
        description: "Strukturierte Ausgabedaten der Aufgabe",
      },
      startedAt: {
        label: "Gestartet um",
        description: "ISO-Zeitstempel des Ausführungsbeginns",
      },
      wakeUpContext: {
        label: "Fortsetzungskontext",
        description:
          "Thread-Fortsetzungskontext aus der Dispatch-Anfrage — ermöglicht die Wiederaufnahme ohne lokalen Task-Datensatz",
      },
      processed: {
        label: "Verarbeitet",
        description: "Ob der Bericht akzeptiert wurde",
      },
      errors: {
        validation: {
          title: "Validierungsfehler",
          description: "Ungültiger Bericht",
        },
        unauthorized: {
          title: "Nicht autorisiert",
          description: "Authentifizierung erforderlich",
        },
        internal: {
          title: "Verarbeitungsfehler",
          description: "Fehler bei der Berichtsverarbeitung",
        },
        forbidden: {
          title: "Verboten",
          description: "Keine Berechtigung zum Einreichen von Berichten",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Aufgabe nicht gefunden",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Berichts-Endpunkt nicht erreichbar",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
        unsaved: {
          title: "Ungespeicherte Änderungen",
          description: "Es gibt ungespeicherte Änderungen",
        },
        conflict: {
          title: "Konflikt",
          description: "Berichtskonflikt erkannt",
        },
      },
      success: {
        title: "Bericht akzeptiert",
        description: "Aufgabenbericht erfolgreich verarbeitet",
      },
    },
  },
};
