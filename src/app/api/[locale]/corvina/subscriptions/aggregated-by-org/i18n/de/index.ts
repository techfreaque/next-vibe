export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    subscriptions: "Abonnements",
  },
  post: {
    title: "Aggregierter Verbrauch nach Organisation",
    description:
      "Gibt aggregierten Ressourcenverbrauch gruppiert nach den angegebenen Organisationen zurück.",
    organizations: {
      label: "Organisationen",
      description: "Kommagetrennte Liste der Organisations-Ressourcen-IDs.",
      placeholder: "org1.example,org2.example",
    },
    response: {
      items: {
        org: "Organisation",
        resourceType: "Ressourcentyp",
        quantity: "Menge",
        used: "Genutzt",
        licensed: "Lizenziert",
        granted: "Gewährt",
        grantedUsed: "Gewährt genutzt",
        lastUpdateFreeQuantity: "Letzte Aktualisierung freie Menge",
      },
    },
    widget: {
      title: "Aggregierter Verbrauch nach Organisation",
      noItemsFound: "Keine Daten gefunden.",
      back: "Zurück",
    },
    submitButton: {
      label: "Abrufen",
      loadingText: "Wird geladen...",
    },
    errors: {
      validation: {
        title: "Ungültige Anfrage",
        description: "Die Anfrage ist ungültig.",
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
        description: "Keine Berechtigung.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Daten gefunden.",
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
      title: "Daten abgerufen",
      description:
        "Aggregierter Verbrauch nach Organisation erfolgreich geladen.",
    },
  },
};
