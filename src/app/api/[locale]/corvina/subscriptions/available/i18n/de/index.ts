export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    subscriptions: "Abonnements",
  },
  get: {
    title: "Abonnementverfügbarkeit prüfen",
    description:
      "Prüft, ob eine bestimmte Ressource im aktuellen Abonnementkontingent verfügbar ist.",
    resource: {
      label: "Ressource",
      description: "Der zu prüfende Ressourcentyp (erforderlich).",
    },
    orgResourceId: {
      label: "Organisations-Ressourcen-ID",
      description: "Prüfung auf eine bestimmte Organisation einschränken.",
    },
    quantity: {
      label: "Menge",
      description: "Anzahl der zu prüfenden Einheiten.",
    },
    response: {
      resourceType: "Ressourcentyp",
      available: "Verfügbar",
      availableAmount: "Verfügbare Menge",
      inDebtSince: "In Schulden seit",
    },
    widget: {
      title: "Abonnementverfügbarkeit",
      back: "Zurück",
      available: "Verfügbar",
      unavailable: "Nicht verfügbar",
      units: "Einheiten verfügbar",
      inDebt: "In Schulden seit",
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
          "Der API-Schlüssel hat keine Berechtigung zur Verfügbarkeitsprüfung.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Kein Abonnement für die angegebene Ressource gefunden.",
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
      description: "Verfügbarkeit erfolgreich geprüft.",
    },
  },
};
