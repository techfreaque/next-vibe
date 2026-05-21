export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    wallet: "Wallet",
  },
  get: {
    title: "Wallet abrufen",
    description: "Lädt ein einzelnes Corvina-Wallet per ID.",
    walletId: {
      label: "Wallet-ID",
      description: "Eindeutige Kennung des Wallets.",
    },
    response: {
      id: "ID",
      type: "Typ",
      description: "Beschreibung",
      webhookUrl: "Webhook-URL",
    },
    widget: {
      title: "Wallet",
      edit: "Bearbeiten",
      back: "Zurück",
      noData: "Keine Wallet-Daten vorhanden.",
      labels: {
        id: "ID",
        type: "Typ",
        description: "Beschreibung",
        webhookUrl: "Webhook-URL",
      },
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
          "Der API-Schlüssel hat keine Leseberechtigung für dieses Wallet.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Kein Wallet mit dieser ID vorhanden.",
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
    enums: {
      walletType: {
        generic: "Allgemein",
        app: "App",
      },
    },
    success: {
      title: "Erfolg",
      description: "Wallet erfolgreich geladen.",
    },
  },
  put: {
    title: "Wallet aktualisieren",
    description: "Aktualisiert die Konfiguration eines Corvina-Wallets.",
    walletId: {
      label: "Wallet-ID",
      description: "Eindeutige Kennung des zu aktualisierenden Wallets.",
    },
    type: {
      label: "Typ",
      description: "Wallet-Typ — GENERIC oder APP.",
      placeholder: "GENERIC",
    },
    walletDescription: {
      label: "Beschreibung",
      description: "Lesbare Bezeichnung für dieses Wallet.",
      placeholder: "Mein Wallet",
    },
    webhookUrl: {
      label: "Webhook-URL",
      description: "URL für Wallet-Ereignisbenachrichtigungen.",
      placeholder: "https://example.com/webhook",
    },
    submitButton: {
      label: "Änderungen speichern",
      loadingText: "Wird gespeichert…",
    },
    errors: {
      validation: {
        title: "Ungültige Aktualisierung",
        description: "Corvina hat die Aktualisierungsdaten abgelehnt.",
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
          "Der API-Schlüssel hat keine Schreibberechtigung für dieses Wallet.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Kein Wallet mit dieser ID vorhanden.",
      },
      conflict: {
        title: "Konflikt",
        description: "Corvina meldet einen Konflikt bei dieser Aktualisierung.",
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
      title: "Gespeichert",
      description: "Wallet erfolgreich aktualisiert.",
    },
  },
};
