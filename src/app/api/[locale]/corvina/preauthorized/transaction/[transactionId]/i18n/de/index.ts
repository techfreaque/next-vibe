export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    preauthorized: "Vorautorisierte Transaktionen",
  },
  get: {
    title: "Vorautorisierte Transaktion abrufen",
    description:
      "Ruft eine einzelne vorautorisierte Kredittransaktion anhand der ID ab.",
    transactionId: {
      label: "Transaktions-ID",
      description: "Numerische ID der vorautorisierte Transaktion.",
    },
    response: {
      id: "ID",
      orderId: "Auftrags-ID",
      ordinal: "Ordinalzahl",
      authorizedBy: "Autorisiert von",
      targetWalletId: "Ziel-Wallet-ID",
      amount: "Betrag",
      sourceOrgResourceId: "Quell-Organisations-Ressourcen-ID",
      sourceWalletId: "Quell-Wallet-ID",
      description: "Beschreibung",
      transactionSubjectType: "Betreff-Typ",
      transactionSubjectRef: "Betreff-Referenz",
      transactionSubjectQuantity: "Betreff-Menge",
      executionMinTime: "Früheste Ausführung",
      executionMaxTime: "Späteste Ausführung",
      updatedAt: "Aktualisiert am",
      revokedBy: "Widerrufen von",
      executionMaxOrdinal: "Max. Ausführungs-Ordinalzahl",
      state: "Status",
      orgResourceId: "Organisations-Ressourcen-ID",
      expectedPaymentsToDate: "Erwartete Zahlungen bis heute",
      actualPaymentsReceived: "Tatsächlich eingegangene Zahlungen",
      nextPaymentDate: "Nächstes Zahlungsdatum",
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
          "Keine Berechtigung zum Lesen vorautorisierter Transaktionen.",
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
      title: "Transaktion geladen",
      description: "Vorautorisierte Transaktion erfolgreich abgerufen.",
    },
    submitButton: {
      label: "Transaktion abrufen",
      loadingText: "Wird abgerufen...",
    },
    widget: {
      back: "Zurück",
    },
  },
  delete: {
    title: "Vorautorisierte Transaktion widerrufen",
    description:
      "Widerruft eine vorautorisierte Kredittransaktion anhand der ID.",
    transactionId: {
      label: "Transaktions-ID",
      description: "Numerische ID der zu widerrufenden Transaktion.",
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
          "Keine Berechtigung zum Widerrufen vorautorisierter Transaktionen.",
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
      title: "Transaktion widerrufen",
      description: "Vorautorisierte Transaktion erfolgreich widerrufen.",
    },
    submitButton: {
      label: "Transaktion widerrufen",
      loadingText: "Wird widerrufen...",
    },
    widget: {
      back: "Zurück",
      revokedTransaction: "Widerrufene Transaktion",
    },
  },
};
