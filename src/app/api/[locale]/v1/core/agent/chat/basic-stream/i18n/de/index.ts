import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Basis-Stream",
    description: "Nachrichten progressiv mit anpassbaren Parametern streamen",
    form: {
      title: "Stream-Konfiguration",
      description: "Stream-Parameter konfigurieren",
    },
    count: {
      label: "Nachrichtenanzahl",
      description: "Anzahl der zu streamenden Nachrichten (1-100)",
    },
    delay: {
      label: "Verzögerung (ms)",
      description:
        "Verzögerung zwischen Nachrichten in Millisekunden (100-5000)",
    },
    prefix: {
      label: "Nachrichten-Präfix",
      description: "Präfix für jede Nachricht",
    },
    includeTimestamp: {
      label: "Zeitstempel einschließen",
      description: "Zeitstempel zu jeder Nachricht hinzufügen",
    },
    includeCounter: {
      label: "Zähler einschließen",
      description: "Zähler zu jeder Nachricht hinzufügen",
    },
    response: {
      title: "Stream-Antwort",
      description: "Streaming-Antwort-Metadaten",
      success: "Stream erfolgreich abgeschlossen",
      totalMessages: "Gesendete Nachrichten insgesamt",
      duration: "Stream-Dauer (ms)",
      completed: "Stream-Abschlussstatus",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung für Streaming erforderlich",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter angegeben",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler beim Streaming aufgetreten",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff auf Streaming ist verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Streaming-Endpunkt nicht gefunden",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description:
          "Es gibt ungespeicherte Änderungen, die zuerst gespeichert werden müssen",
      },
      conflict: {
        title: "Konflikt",
        description: "Datenkonflikt beim Streaming aufgetreten",
      },
    },
    success: {
      title: "Erfolg",
      description: "Stream erfolgreich abgeschlossen",
    },
  },
  streamingErrors: {
    basicStream: {
      error: {
        processing: "Fehler bei der Stream-Verarbeitung",
        initialization: "Stream-Initialisierung fehlgeschlagen",
      },
    },
  },
};
