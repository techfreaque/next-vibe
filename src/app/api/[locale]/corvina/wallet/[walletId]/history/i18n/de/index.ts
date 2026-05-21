export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    wallet: "Wallet",
  },
  get: {
    title: "Wallet-Transaktionshistorie",
    description:
      "Lädt die seitenweise Transaktionshistorie eines Corvina-Wallets.",
    walletId: {
      label: "Wallet-ID",
      description: "Die ID des Wallets, dessen Historie abgerufen werden soll.",
    },
    page: {
      label: "Seite",
      description: "Nullbasierte Seitennummer.",
    },
    pageSize: {
      label: "Seitengröße",
      description: "Anzahl der Transaktionen pro Seite.",
    },
    orderBy: {
      label: "Sortierung",
      description: "Feld für die Sortierung — z. B. id, serialNumber.",
    },
    orderDir: {
      label: "Sortierrichtung",
      description: "Sortierrichtung — ASC oder DESC.",
    },
    response: {
      total: "Gesamt",
      totalPages: "Seiten gesamt",
      currentPage: "Aktuelle Seite",
      transactions: {
        id: "ID",
        executionResult: "Ergebnis",
        failureReason: "Fehlergrund",
        sourceWalletId: "Quell-Wallet",
        targetWalletId: "Ziel-Wallet",
        amount: "Betrag",
        createdAt: "Erstellt am",
        authorizedBy: "Autorisiert von",
        description: "Beschreibung",
        orderId: "Auftrags-ID",
        orgResourceId: "Organisations-Ressourcen-ID",
      },
    },
    widget: {
      title: "Transaktionen",
      noItemsFound: "Keine Transaktionen gefunden.",
      back: "Zurück",
      success: "ERFOLG",
      failure: "FEHLER",
      noop: "NOOP",
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
          "Der API-Schlüssel hat keine Berechtigung, die Wallet-Historie abzurufen.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Kein Wallet mit der angegebenen ID gefunden.",
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
      title: "Erfolg",
      description: "Transaktionshistorie erfolgreich geladen.",
    },
  },
};
