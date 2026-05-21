export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    subscriptions: "Abonnements",
  },
  get: {
    title: "Aggregierte Abonnements",
    description:
      "Lädt aggregierte Abonnementnutzung für alle Ressourcen des Mandanten.",
    orgResourceId: {
      label: "Organisations-Ressourcen-ID",
      description:
        "Aggregierte Daten nach Organisations-Ressourcen-ID filtern.",
    },
    response: {
      items: {
        resourceType: "Ressourcentyp",
        org: "Organisation",
        quantity: "Menge",
        used: "Genutzt",
        licensed: "Lizenziert",
        granted: "Gewährt",
        grantedUsed: "Gewährt genutzt",
        lastUpdateFreeQuantity: "Letzte Aktualisierung freie Menge",
      },
    },
    widget: {
      title: "Aggregierte Abonnements",
      noItemsFound: "Keine aggregierten Daten gefunden.",
      back: "Zurück",
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
          "Der API-Schlüssel hat keinen Zugriff auf aggregierte Abonnements.",
      },
      notFound: {
        title: "Nicht gefunden",
        description:
          "Keine aggregierten Daten für die angegebenen Parameter gefunden.",
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
      description: "Aggregierte Abonnements erfolgreich geladen.",
    },
  },
};
