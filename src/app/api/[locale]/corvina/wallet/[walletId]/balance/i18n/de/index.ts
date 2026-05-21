export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    wallet: "Wallet",
  },
  get: {
    title: "Wallet-Guthaben",
    description: "Ruft das aktuelle Guthaben eines Corvina-Wallets ab.",
    walletId: {
      label: "Wallet-ID",
      description: "Die eindeutige Kennung des Wallets.",
    },
    response: {
      balance: "Guthaben",
    },
    widget: {
      title: "Wallet-Guthaben",
      back: "Zurück",
      units: "Credits",
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
        description: "Der API-Schlüssel hat keinen Zugriff auf dieses Wallet.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Kein Wallet mit dieser ID gefunden.",
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
      description: "Wallet-Guthaben erfolgreich abgerufen.",
    },
  },
};
