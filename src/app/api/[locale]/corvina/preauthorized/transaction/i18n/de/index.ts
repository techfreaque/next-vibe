export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    preauthorized: "Vorautorisierte Transaktionen",
  },
  post: {
    title: "Vorautorisierte Transaktion erstellen",
    description:
      "Erstellt eine einzelne vorautorisierte Kredittransaktion in Corvina.",
    orderId: {
      label: "Auftrags-ID",
      description: "Eindeutiger Bezeichner des Auftrags.",
    },
    targetWalletId: {
      label: "Ziel-Wallet-ID",
      description: "Wallet-ID, die den Kredit erhält.",
    },
    amount: {
      label: "Betrag",
      description: "Kreditbetrag für diese Transaktion.",
    },
    ordinal: {
      label: "Ordinalzahl",
      description: "Ausführungs-Ordinalzahl für diese Transaktion.",
    },
    sourceWalletId: {
      label: "Quell-Wallet-ID",
      description: "Wallet-ID, die diese Transaktion finanziert.",
    },
    txDescription: {
      label: "Beschreibung",
      description: "Freitext-Beschreibung dieser Transaktion.",
    },
    transactionSubjectType: {
      label: "Betreff-Typ",
      description: "Typ des Transaktionsbetreffs.",
    },
    transactionSubjectRef: {
      label: "Betreff-Referenz",
      description: "Referenz-ID des Betreffs.",
    },
    transactionSubjectQuantity: {
      label: "Betreff-Menge",
      description: "Menge, die dem Betreff zugeordnet ist.",
    },
    executionMinTime: {
      label: "Frühester Ausführungszeitpunkt",
      description: "Transaktion kann nicht vor diesem Datum ausgeführt werden.",
    },
    executionMaxTime: {
      label: "Spätester Ausführungszeitpunkt",
      description: "Transaktion muss vor diesem Datum ausgeführt werden.",
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
          "Keine Berechtigung zum Erstellen vorautorisierter Transaktionen.",
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
      title: "Transaktion erstellt",
      description: "Vorautorisierte Kredittransaktion erfolgreich erstellt.",
    },
    submitButton: {
      label: "Transaktion erstellen",
      loadingText: "Wird erstellt...",
    },
    widget: {
      back: "Zurück",
    },
  },
};
