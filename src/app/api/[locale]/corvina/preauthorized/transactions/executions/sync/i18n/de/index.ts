export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    preauthorized: "Vorautorisierte Transaktionen",
  },
  post: {
    title: "Ausführungsstatus synchronisieren",
    description:
      "Löst eine Synchronisierung aller Ausführungsstatus vorautorisierter Transaktionen aus.",
    response: {
      synchronized: "Synchronisiert",
    },
    errors: {
      validation: {
        title: "Ungültige Anfrage",
        description: "Die Anfrage an Corvina war fehlerhaft.",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Das Corvina-API ist nicht erreichbar.",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Corvina hat den API-Schlüssel abgelehnt.",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Keine Berechtigung zur Synchronisierung.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Ressource nicht gefunden.",
      },
      conflict: {
        title: "Konflikt",
        description: "Corvina meldet einen Konflikt.",
      },
      server: {
        title: "Serverfehler",
        description: "Corvina hat einen internen Serverfehler gemeldet.",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Es liegen nicht gespeicherte Änderungen vor.",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten.",
      },
    },
    success: {
      title: "Synchronisierung abgeschlossen",
      description: "Ausführungsstatus erfolgreich synchronisiert.",
    },
    submitButton: {
      label: "Ausführungen synchronisieren",
      loadingText: "Wird synchronisiert...",
    },
    widget: {
      back: "Zurück",
      synced: "Ausführungsstatus synchronisiert.",
    },
  },
};
