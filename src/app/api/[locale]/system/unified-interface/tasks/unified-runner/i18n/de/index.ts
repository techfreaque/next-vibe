import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  description: "Führt Cron-Tasks aus und verwaltet Side-Tasks",
  common: {
    taskName: "Aufgabenname",
    taskNamesDescription: "Namen der zu filternden Aufgaben",
    detailed: "Detailliert",
    detailedDescription: "Detaillierte Informationen einbeziehen",
    active: "Aktiv",
    total: "Gesamt",
    uptime: "Betriebszeit",
    id: "ID",
    status: "Status",
    lastRun: "Letzter Lauf",
    nextRun: "Nächster Lauf",
    schedule: "Zeitplan",
  },
  post: {
    title: "Einheitlicher Task Runner",
    description: "Verwalten Sie den einheitlichen Task Runner für Cron-Tasks und Seitenaufgaben",
    container: {
      title: "Einheitliche Task Runner Verwaltung",
      description:
        "Steuern Sie den einheitlichen Task Runner, der sowohl Cron-Tasks als auch Seitenaufgaben verwaltet",
    },
    fields: {
      action: {
        label: "Aktion",
        description: "Aktion, die am Task Runner ausgeführt werden soll",
        options: {
          start: "Runner starten",
          stop: "Runner stoppen",
          status: "Status abrufen",
          restart: "Runner neu starten",
        },
      },
      taskFilter: {
        label: "Task Filter",
        description: "Tasks nach Typ filtern",
        options: {
          all: "Alle Tasks",
          cron: "Nur Cron Tasks",
          side: "Nur Seitenaufgaben",
        },
      },
      dryRun: {
        label: "Testlauf",
        description: "Testlauf ohne tatsächliche Änderungen durchführen",
      },
    },
    response: {
      success: "Erfolgreich",
      actionResult: "Aktionsergebnis",
      message: "Nachricht",
      timestamp: "Zeitstempel",
    },
    reasons: {
      previousInstanceRunning: "Vorherige Instanz läuft noch",
    },
    messages: {
      taskSkipped: "Task wurde übersprungen",
      taskCompleted: "Task erfolgreich abgeschlossen",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
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
      execution: {
        title: "Task-Ausführungsfehler",
        description: "Fehler beim Ausführen der Aufgabe",
      },
      taskAlreadyRunning: {
        title: "Task läuft bereits",
        description: "Die angegebene Aufgabe läuft bereits",
      },
      sideTaskExecution: {
        title: "Side-Task-Ausführungsfehler",
        description: "Fehler beim Ausführen der Side-Task",
      },
    },
    success: {
      title: "Erfolg",
      description: "Vorgang erfolgreich abgeschlossen",
    },
  },
};
