export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    preauthorized: "Vorautorisierte Transaktionen",
  },
  post: {
    title: "Vorautorisierte Transaktionen (Bulk) ausführen",
    description:
      "Löst die Ausführung mehrerer vorautorisierter Transaktionen in einer Anfrage aus.",
    preauthorizedCreditTransactionId: {
      label: "Transaktions-ID",
      description: "Vorautorisierte Kredittransaktions-ID zur Ausführung.",
    },
    ordinal: {
      label: "Ordinalzahl",
      description: "Auszulösende Ausführungs-Ordinalzahl.",
    },
    response: {
      id: "ID",
      transactionId: "Transaktions-ID",
      preauthorizedCreditTransactionId: "Vorautorisierte Kredittransaktions-ID",
      executionTime: "Ausführungszeitpunkt",
      ordinal: "Ordinalzahl",
      executionResult: "Ausführungsergebnis",
      errorCode: "Fehlercode",
      failureReason: "Fehlerursache",
      issuer: "Aussteller",
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
        description: "Keine Berechtigung für Massenausführungen.",
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
      title: "Ausführungen ausgelöst",
      description: "Massenausführungsaufträge erfolgreich erstellt.",
    },
    submitButton: {
      label: "Ausführungen auslösen",
      loadingText: "Wird ausgelöst...",
    },
    widget: {
      back: "Zurück",
      title: "Ausführungsergebnisse",
      noItemsFound: "Keine Ausführungsaufträge zurückgegeben.",
    },
  },
};
