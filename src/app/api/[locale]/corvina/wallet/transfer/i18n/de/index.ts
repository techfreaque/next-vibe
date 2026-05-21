export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    wallet: "Wallet",
  },
  post: {
    title: "Guthaben übertragen",
    description:
      "Überträgt Guthaben zwischen zwei Wallets in der Corvina-Plattform.",
    sourceWalletId: {
      label: "Quell-Wallet-ID",
      description: "Das Wallet, von dem Guthaben abgebucht wird.",
      placeholder: "quell-wallet-01",
    },
    targetWalletId: {
      label: "Ziel-Wallet-ID",
      description: "Das Wallet, dem Guthaben gutgeschrieben wird.",
      placeholder: "ziel-wallet-01",
    },
    amount: {
      label: "Betrag",
      description: "Anzahl der zu übertragenden Credits.",
      placeholder: "100",
    },
    orderId: {
      label: "Auftrags-ID",
      description: "Eindeutige Kennung für diesen Auftrag.",
      placeholder: "auftrag-12345",
    },
    ordinal: {
      label: "Laufnummer",
      description: "Sequenznummer des Auftrags (optional).",
      placeholder: "1",
    },
    authorizedBy: {
      label: "Genehmigt von",
      description: "Wer diese Übertragung genehmigt hat.",
      placeholder: "admin@example.com",
    },
    sourceOrgResourceId: {
      label: "Quell-Organisations-ID",
      description: "Ressourcen-ID der Quellorganisation.",
      placeholder: "org.ressource.id",
    },
    transferDescription: {
      label: "Beschreibung",
      description: "Optionale Beschreibung für diese Übertragung.",
      placeholder: "Wallet-Ausgleich",
    },
    submitButton: {
      label: "Guthaben übertragen",
      loadingText: "Wird übertragen...",
    },
    response: {
      id: "Transaktions-ID",
      errorCode: "Fehlercode",
      executionResult: "Ergebnis",
      failureReason: "Fehlerursache",
      createdAt: "Erstellt am",
      issuedBy: "Ausgestellt von",
      sourceWalletId: "Quell-Wallet",
      targetWalletId: "Ziel-Wallet",
      amount: "Betrag",
      orderId: "Auftrags-ID",
      ordinal: "Laufnummer",
      authorizedBy: "Genehmigt von",
      sourceOrgResourceId: "Quell-Org",
    },
    widget: {
      title: "Guthaben übertragen",
      back: "Zurück",
      resultTitle: "Übertragung abgeschlossen",
    },
    errors: {
      validation: {
        title: "Ungültige Anfrage",
        description: "Die Übertragungsanfrage ist ungültig.",
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
        description: "Keine Berechtigung für diese Wallet-Übertragung.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Eines der Wallets wurde nicht gefunden.",
      },
      conflict: {
        title: "Konflikt",
        description: "Corvina hat einen Konflikt gemeldet.",
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
      title: "Übertragung abgeschlossen",
      description: "Das Guthaben wurde erfolgreich übertragen.",
    },
  },
};
