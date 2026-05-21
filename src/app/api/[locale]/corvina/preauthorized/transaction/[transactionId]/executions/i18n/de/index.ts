export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    preauthorized: "Vorautorisierte Transaktionen",
  },
  get: {
    title: "Ausführungsaufträge auflisten",
    description:
      "Listet alle Ausführungsaufträge einer vorautorisierter Transaktion auf.",
    transactionId: {
      label: "Transaktions-ID",
      description: "Numerische ID der vorautorisierter Transaktion.",
    },
    ordinal: {
      label: "Ordinalzahl",
      description: "Nach Ausführungs-Ordinalzahl filtern.",
    },
    issuer: {
      label: "Aussteller",
      description: "Nach Aussteller filtern.",
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
        description:
          "Keine Berechtigung zum Auflisten von Ausführungsaufträgen.",
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
      title: "Ausführungsaufträge geladen",
      description: "Ausführungsaufträge erfolgreich abgerufen.",
    },
    submitButton: {
      label: "Ausführungen auflisten",
      loadingText: "Wird geladen...",
    },
    widget: {
      back: "Zurück",
      title: "Ausführungsaufträge",
      noItemsFound: "Keine Ausführungsaufträge gefunden.",
    },
  },
};
