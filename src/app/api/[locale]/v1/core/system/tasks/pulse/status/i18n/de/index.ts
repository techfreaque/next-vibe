import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
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
};
