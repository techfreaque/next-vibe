export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    wallet: "Wallet",
  },
  post: {
    title: "Wallet erstellen",
    description: "Erstellt ein neues Wallet in der Corvina-Plattform.",
    id: {
      label: "Wallet-ID",
      description:
        "Optionale benutzerdefinierte ID. Muss dem Muster entsprechen: Kleinbuchstaben, Bindestriche, alphanumerisch (z. B. mein-wallet-01).",
      placeholder: "mein-wallet-01",
    },
    type: {
      label: "Typ",
      description:
        "Wallet-Typ: GENERIC für allgemeine Nutzung, APP für app-spezifische Wallets.",
      placeholder: "Typ auswählen",
    },
    walletDescription: {
      label: "Beschreibung",
      description: "Lesbare Beschreibung für dieses Wallet.",
      placeholder: "Produktions-Zahlungs-Wallet",
    },
    webhookUrl: {
      label: "Webhook-URL",
      description: "URL für Wallet-Ereignisbenachrichtigungen.",
      placeholder: "https://beispiel.de/webhook",
    },
    submitButton: {
      label: "Wallet erstellen",
      loadingText: "Wird erstellt...",
    },
    response: {
      id: "Wallet-ID",
      type: "Typ",
      description: "Beschreibung",
      webhookUrl: "Webhook-URL",
    },
    widget: {
      title: "Wallet erstellen",
      resultTitle: "Wallet erstellt",
      idLabel: "ID",
      typeLabel: "Typ",
      descriptionLabel: "Beschreibung",
      webhookLabel: "Webhook-URL",
      back: "Zurück",
      noType: "Kein Typ",
    },
    errors: {
      validation: {
        title: "Ungültige Anfrage",
        description: "Die Wallet-Erstellungsanfrage ist ungültig.",
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
          "Der API-Schlüssel hat keine Berechtigung, Wallets zu erstellen.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Die angeforderte Ressource wurde nicht gefunden.",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Wallet mit dieser ID existiert bereits.",
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
      title: "Wallet erstellt",
      description: "Das Wallet wurde erfolgreich erstellt.",
    },
  },
};
