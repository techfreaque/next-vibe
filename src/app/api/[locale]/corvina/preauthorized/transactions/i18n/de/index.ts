export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    preauthorized: "Vorautorisierte Transaktionen",
  },
  get: {
    title: "Vorautorisierte Transaktionen auflisten",
    description:
      "Listet vorautorisierte Kredittransaktionen mit Paginierung und optionalen Filtern auf.",
    targetWalletId: {
      label: "Ziel-Wallet-ID",
      description: "Nach Ziel-Wallet-ID filtern.",
    },
    orderId: {
      label: "Auftrags-ID",
      description: "Nach Auftrags-ID filtern.",
    },
    orgResourceId: {
      label: "Organisations-Ressourcen-ID",
      description: "Nach Organisations-Ressourcen-ID filtern.",
    },
    page: {
      label: "Seite",
      description: "Seitennummer (beginnt bei 0).",
    },
    pageSize: {
      label: "Seitengröße",
      description: "Anzahl der Ergebnisse pro Seite.",
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
      total: "Gesamt",
      currentPage: "Aktuelle Seite",
      totalPages: "Seiten gesamt",
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
          "Keine Berechtigung zum Auflisten vorautorisierter Transaktionen.",
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
      title: "Transaktionen geladen",
      description: "Vorautorisierte Transaktionen erfolgreich abgerufen.",
    },
    submitButton: {
      label: "Transaktionen auflisten",
      loadingText: "Wird geladen...",
    },
    widget: {
      back: "Zurück",
      title: "Vorautorisierte Transaktionen",
      noItemsFound: "Keine Transaktionen gefunden.",
    },
  },
  post: {
    title: "Vorautorisierte Transaktionen erstellen (Bulk)",
    description:
      "Erstellt mehrere vorautorisierte Kredittransaktionen in einer Anfrage.",
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
    ordinal: { label: "Ordinalzahl", description: "Ausführungs-Ordinalzahl." },
    sourceWalletId: {
      label: "Quell-Wallet-ID",
      description: "Wallet-ID, die die Transaktion finanziert.",
    },
    txDescription: {
      label: "Beschreibung",
      description: "Freitext-Beschreibung.",
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
      description: "Menge des Betreffs.",
    },
    executionMinTime: {
      label: "Frühester Ausführungszeitpunkt",
      description: "Transaktion kann nicht vor diesem Datum ausgeführt werden.",
    },
    executionMaxTime: {
      label: "Spätester Ausführungszeitpunkt",
      description: "Transaktion muss vor diesem Datum ausgeführt werden.",
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
      title: "Transaktionen erstellt",
      description: "Vorautorisierte Transaktionen erfolgreich erstellt.",
    },
    submitButton: {
      label: "Transaktionen erstellen",
      loadingText: "Wird erstellt...",
    },
    widget: { back: "Zurück" },
  },
  delete: {
    title: "Vorautorisierte Transaktionen widerrufen (Bulk)",
    description:
      "Widerruft mehrere vorautorisierte Kredittransaktionen in einer Anfrage.",
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
      title: "Transaktionen widerrufen",
      description: "Vorautorisierte Transaktionen erfolgreich widerrufen.",
    },
    submitButton: {
      label: "Transaktionen widerrufen",
      loadingText: "Wird widerrufen...",
    },
    widget: { back: "Zurück" },
  },
};
