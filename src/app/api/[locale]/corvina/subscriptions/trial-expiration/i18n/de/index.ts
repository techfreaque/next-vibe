export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    subscriptions: "Abonnements",
  },
  get: {
    title: "Testversion-Ablaufdatum",
    description:
      "Gibt das Ablaufdatum der Testversion für den aktuellen Mandanten zurück.",
    orgResourceId: {
      label: "Organisations-Ressourcen-ID",
      description: "Abfrage auf eine bestimmte Organisation einschränken.",
    },
    response: {
      expirationDate: "Ablaufdatum der Testversion",
    },
    widget: {
      title: "Testversion-Ablaufdatum",
      back: "Zurück",
      noExpiration: "Kein Ablaufdatum für die Testversion festgelegt.",
      expiringSoon: "Testversion läuft bald ab",
      expired: "Testversion abgelaufen",
      expiresOn: "Läuft ab am",
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
          "Der API-Schlüssel hat keinen Zugriff auf Testversion-Ablaufdaten.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Testversion-Ablaufdaten gefunden.",
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
      description: "Testversion-Ablaufdatum erfolgreich geladen.",
    },
  },
};
