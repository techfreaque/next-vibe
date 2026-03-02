export const translations = {
  category: "KI",
  tags: {
    streaming: "Streaming",
  },
  post: {
    title: "KI-Stream abbrechen",
    description: "Eine aktive KI-Streaming-Antwort abbrechen",
    container: {
      title: "Stream abbrechen",
      description: "Einen aktiven KI-Stream für einen Thread stoppen",
    },
    form: {
      title: "Stream abbrechen",
      description:
        "Geben Sie die Thread-ID an, um den aktiven Stream abzubrechen",
    },
    threadId: {
      label: "Thread-ID",
      description: "ID des Threads, dessen Stream abgebrochen werden soll",
    },
    response: {
      title: "Abbruchergebnis",
      description: "Ergebnis des Abbruchvorgangs",
      cancelled: "Ob ein aktiver Stream gefunden und abgebrochen wurde",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Abbruchanfragedaten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Server nicht möglich",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich zum Abbrechen von Streams",
      },
      forbidden: {
        title: "Verboten",
        description: "Sie können nur Ihre eigenen Streams abbrechen",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Thread nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Stream konnte nicht abgebrochen werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben nicht gespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Abbruchkonflikt aufgetreten",
      },
    },
    success: {
      title: "Stream abgebrochen",
      description: "Der KI-Stream wurde erfolgreich abgebrochen",
    },
  },
};
