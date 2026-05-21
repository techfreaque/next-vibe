export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    subscriptions: "Abonnements",
  },
  get: {
    title: "Abonnement-Übersicht nach Organisation",
    description:
      "Lädt eine paginierte Liste von Abonnement-Übersichten nach Organisation.",
    createdByOrgResourceId: {
      label: "Übergeordnete Organisations-Ressourcen-ID",
      description:
        "Die übergeordnete Organisations-Ressourcen-ID (erforderlich).",
    },
    page: {
      label: "Seite",
      description: "Nullbasierte Seitennummer.",
    },
    pageSize: {
      label: "Seitengröße",
      description: "Anzahl der Ergebnisse pro Seite.",
    },
    expired: {
      label: "Abgelaufen",
      description: "Wenn gesetzt, wird nach abgelaufenem Status gefiltert.",
    },
    search: {
      label: "Suche",
      description: "Suchbegriff zur Filterung der Ergebnisse.",
    },
    response: {
      total: "Gesamt",
      totalPages: "Seiten gesamt",
      currentPage: "Aktuelle Seite",
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
      title: "Abonnements nach Organisation",
      noItemsFound: "Keine Abonnement-Übersichten gefunden.",
      back: "Zurück",
      trial: "Testversion",
      autorenewSymbol: "↻",
      compact: {
        exp: "Abl.:",
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
          "Der API-Schlüssel hat keine Berechtigung für Organisations-Abonnement-Übersichten.",
      },
      notFound: {
        title: "Nicht gefunden",
        description:
          "Keine Abonnement-Übersichten für die angegebene Organisation gefunden.",
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
      description: "Organisations-Abonnement-Übersichten erfolgreich geladen.",
    },
  },
};
