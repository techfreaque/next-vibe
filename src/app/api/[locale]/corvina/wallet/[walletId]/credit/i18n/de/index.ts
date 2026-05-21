export const translations = {
  category: "Corvina",
  tags: { corvina: "Corvina", wallet: "Wallet" },
  post: {
    title: "Wallet aufladen",
    description: "Überträgt Credits aus einem Abonnement in ein Wallet.",
    walletId: {
      label: "Ziel-Wallet-ID",
      description: "Das Wallet, dem Credits gutgeschrieben werden sollen.",
      placeholder: "mein-wallet-01",
    },
    orderId: {
      label: "Auftrags-ID",
      description: "Eindeutige Kennung für diesen Übertragungsauftrag.",
      placeholder: "auftrag-12345",
    },
    ordinal: {
      label: "Ordnungszahl",
      description: "Auftragssequenznummer (optional).",
      placeholder: "1",
    },
    authorizedBy: {
      label: "Autorisiert von",
      description: "Wer diese Übertragung autorisiert hat.",
      placeholder: "admin@beispiel.de",
    },
    amount: {
      label: "Betrag",
      description: "Anzahl der zu übertragenden Credits.",
      placeholder: "100",
    },
    sourceOrgResourceId: {
      label: "Quell-Organisations-ID",
      description: "Ressourcen-ID der Quellorganisation.",
      placeholder: "org.ressource.id",
    },
    sourceWalletId: {
      label: "Quell-Wallet-ID",
      description: "Wallet, von dem abgebucht werden soll (falls zutreffend).",
      placeholder: "quell-wallet-01",
    },
    transferDescription: {
      label: "Beschreibung",
      description: "Optionale Beschreibung für diese Übertragung.",
      placeholder: "Monatliche Abonnement-Aufladung",
    },
    transactionSubjectType: {
      label: "Betreff-Typ",
      description: "Typ des Transaktionsgegenstands.",
      placeholder: "abonnement",
    },
    transactionSubjectRef: {
      label: "Betreff-Referenz",
      description: "Referenz auf den Transaktionsgegenstand.",
      placeholder: "abo-123",
    },
    transactionSubjectQuantity: {
      label: "Betreff-Menge",
      description: "Menge des Transaktionsgegenstands.",
      placeholder: "1",
    },
    nextRenewalDate: {
      label: "Nächstes Verlängerungsdatum",
      description: "Datum der nächsten Verlängerung.",
      placeholder: "2025-12-31",
    },
    submitButton: {
      label: "Wallet aufladen",
      loadingText: "Wird verarbeitet...",
    },
    response: {
      id: "Transaktions-ID",
      errorCode: "Fehlercode",
      executionResult: "Ergebnis",
      failureReason: "Fehlerursache",
      createdAt: "Erstellt am",
      issuedBy: "Ausgestellt von",
      targetWalletId: "Ziel-Wallet",
      txDescription: "Beschreibung",
      orderId: "Auftrags-ID",
      ordinal: "Ordnungszahl",
      authorizedBy: "Autorisiert von",
      amount: "Betrag",
      sourceOrgResourceId: "Quellorganisation",
      sourceWalletId: "Quell-Wallet",
    },
    widget: {
      title: "Wallet aufladen",
      back: "Zurück",
      resultTitle: "Übertragung abgeschlossen",
      success: "Credits wurden erfolgreich übertragen.",
      failed: "Übertragung fehlgeschlagen.",
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
        description: "Keine Berechtigung, dieses Wallet aufzuladen.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Das Wallet wurde nicht gefunden.",
      },
      conflict: {
        title: "Konflikt",
        description: "Corvina hat einen Konflikt gemeldet.",
      },
      server: {
        title: "Serverfehler",
        description: "Corvina hat einen internen Serverfehler zurückgegeben.",
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
      description: "Credits wurden erfolgreich in das Wallet übertragen.",
    },
  },
};
