export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    preauthorized: "Vorautorisierte Transaktionen",
  },
  post: {
    title: "Vorautorisierte Transaktion ausführen",
    description:
      "Löst die Ausführung einer vorautorisierter Transaktion mit der angegebenen Ordinalzahl aus.",
    transactionId: {
      label: "Transaktions-ID",
      description: "Numerische ID der vorautorisierter Transaktion.",
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
        description: "Keine Berechtigung zur Ausführung dieser Transaktion.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Transaktion mit dieser ID gefunden.",
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
      title: "Ausführung ausgelöst",
      description:
        "Ausführungsauftrag für vorautorisierte Transaktion erstellt.",
    },
    submitButton: {
      label: "Ausführen",
      loadingText: "Wird ausgeführt...",
    },
    widget: {
      back: "Zurück",
    },
  },
};
