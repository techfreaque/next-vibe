export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    wallet: "Wallet",
  },
  post: {
    title: "Massentransfer von Credits",
    description:
      "Überträgt Credits aus einem Abonnement in ein Wallet. Führt eine einzelne Übertragung als Bulk-Anfrage aus.",
    targetWalletId: {
      label: "Ziel-Wallet-ID",
      description: "ID des Wallets, das die Credits erhalten soll.",
      placeholder: "b-12345-6789-abcde",
    },
    orderId: {
      label: "Auftrags-ID",
      description: "Eindeutige Auftragskennung für diese Transaktion.",
      placeholder: "order-12345",
    },
    amount: {
      label: "Betrag",
      description: "Anzahl der zu übertragenden Credits.",
      placeholder: "100",
    },
    ordinal: {
      label: "Ordinalzahl",
      description: "Position dieser Transaktion im Auftrag (ab 0).",
      placeholder: "0",
    },
    sourceWalletId: {
      label: "Quell-Wallet-ID",
      description: "Quell-Wallet-ID (bei Transfer zwischen Wallets).",
      placeholder: "a-12345-6789-abcde",
    },
    transferDescription: {
      label: "Beschreibung",
      description: "Lesbare Beschreibung der Übertragung.",
      placeholder: "Zahlung für Dienstleistungen",
    },
    transactionSubjectType: {
      label: "Betrefftyp",
      description: "Typ des Transaktionsobjekts (z.B. SERVICE).",
      placeholder: "SERVICE",
    },
    transactionSubjectRef: {
      label: "Betreff-Referenz",
      description: "Referenzkennung für das Transaktionsobjekt.",
      placeholder: "service-12345",
    },
    transactionSubjectQuantity: {
      label: "Betreff-Menge",
      description: "Menge des Transaktionsobjekts.",
      placeholder: "1",
    },
    response: {
      items: {
        id: "Transaktions-ID",
        executionResult: "Ergebnis",
        failureReason: "Fehlergrund",
        sourceWalletId: "Quell-Wallet",
        targetWalletId: "Ziel-Wallet",
        amount: "Betrag",
        createdAt: "Erstellt am",
        orderId: "Auftrags-ID",
        ordinal: "Ordinalzahl",
        orgResourceId: "Organisations-Ressourcen-ID",
      },
    },
    widget: {
      title: "Massentransfer von Credits",
      back: "Zurück",
      noItems: "Keine Transaktionen zurückgegeben.",
    },
    submitButton: {
      label: "Credits übertragen",
      loadingText: "Wird übertragen...",
    },
    errors: {
      validation: {
        title: "Ungültige Anfrage",
        description: "Prüfe Ziel-Wallet-ID, Auftrags-ID und Betrag.",
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
        description: "Keine Berechtigung zur Übertragung von Credits.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Wallet nicht gefunden.",
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
      title: "Credits übertragen",
      description: "Massentransfer von Credits erfolgreich abgeschlossen.",
    },
  },
};
