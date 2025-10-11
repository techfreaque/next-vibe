import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Pulse Ausführung",
  tags: {
    execute: "Ausführen",
  },
  post: {
    title: "Pulse Ausführen",
    description: "Pulse Gesundheitsüberwachung und Aufgabenausführung",
    container: {
      title: "Pulse Ausführung",
      description: "Pulse Überwachung ausführen und geplante Aufgaben starten",
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
};
