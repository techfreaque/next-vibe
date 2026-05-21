export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    subscriptions: "Abonnements",
  },
  get: {
    title: "Abonnement-Übersicht",
    description:
      "Lädt eine lizenzbasierte Übersicht der Abonnements mit Ressourcenaufschlüsselung.",
    orgResourceId: {
      label: "Organisations-Ressourcen-ID",
      description: "Nach Organisations-Ressourcen-ID filtern.",
    },
    includeExpired: {
      label: "Abgelaufene einschließen",
      description: "Wenn aktiviert, werden abgelaufene Abonnements einbezogen.",
    },
    response: {
      items: {
        orgResourceId: "Organisations-Ressourcen-ID",
        licenseId: "Lizenz-ID",
        productCode: "Produktcode",
        productLabel: "Produkt",
        productType: "Typ",
        licenseCode: "Lizenzcode",
        currency: "Währung",
        price: "Preis",
        autorenew: "Automatische Verlängerung",
        trial: "Testversion",
        expirationDate: "Läuft ab",
        activationDate: "Aktiviert am",
        creationDate: "Erstellt am",
        resources: {
          resourceType: "Ressourcentyp",
          quantity: "Menge",
          used: "Genutzt",
          expired: "Abgelaufen",
        },
      },
    },
    widget: {
      title: "Abonnement-Übersicht",
      noItemsFound: "Keine Abonnement-Übersichten gefunden.",
      back: "Zurück",
      resources: "Ressourcen",
      trial: "Testversion",
      autorenewSymbol: "↻",
      compact: {
        exp: "Abl.:",
        autorenew: "Autoverlängerung:",
        separator: "·",
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
          "Der API-Schlüssel hat keine Berechtigung für Abonnement-Übersichten.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Abonnement-Übersichten gefunden.",
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
      description: "Abonnement-Übersicht erfolgreich geladen.",
    },
  },
};
