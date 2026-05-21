export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    products: "Produkte",
  },
  get: {
    title: "Produktanzahl",
    description: "Ruft die Lizenzanzahl je Produkt ab.",
    orgResourceId: {
      label: "Organisations-Ressourcen-ID",
      description: "Nach Organisations-Ressourcen-ID filtern.",
    },
    productId: {
      label: "Produkt-ID",
      description: "Nach einer bestimmten Produkt-ID filtern.",
    },
    page: {
      label: "Seite",
      description: "Seitennummer (0-basiert).",
    },
    pageSize: {
      label: "Seitengröße",
      description: "Anzahl der Ergebnisse pro Seite.",
    },
    response: {
      items: {
        productId: "Produkt-ID",
        totalCount: "Gesamtanzahl",
        activeCount: "Aktive Anzahl",
      },
      total: "Gesamt",
      totalPages: "Gesamtseiten",
      currentPage: "Aktuelle Seite",
    },
    widget: {
      title: "Produktanzahl",
      noItemsFound: "Keine Produkte gefunden.",
      back: "Zurück",
    },
    errors: {
      validation: {
        title: "Ungültige Anfrage",
        description: "Die Anfrage war fehlerhaft.",
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
        description: "Keine Berechtigung zum Anzeigen der Produktanzahl.",
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
      title: "Produktanzahl abgerufen",
      description: "Produktanzahl erfolgreich geladen.",
    },
  },
};
