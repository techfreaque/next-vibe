export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    products: "Produkte",
  },
  get: {
    title: "Produkte auflisten",
    description: "Lädt alle auf der Corvina-Plattform verfügbaren Produkte.",
    page: {
      label: "Seite",
      description: "Nullbasierte Seitennummer.",
    },
    pageSize: {
      label: "Seitengröße",
      description: "Anzahl der Produkte pro Seite.",
    },
    orgResourceId: {
      label: "Organisations-Ressourcen-ID",
      description: "Produkte nach Organisations-Ressourcen-ID filtern.",
    },
    response: {
      total: "Gesamt",
      totalPages: "Seiten gesamt",
      currentPage: "Aktuelle Seite",
      products: {
        id: "ID",
        code: "Code",
        type: "Typ",
        label: "Name",
        dealer: "Händler",
        trial: "Testversion",
        creationDate: "Erstellt am",
        lastModified: "Geändert am",
        autorenewDefault: "Automatische Verlängerung (Standard)",
        orgResourceId: "Organisations-Ressourcen-ID",
      },
    },
    widget: {
      title: "Produkte",
      noProductsFound: "Keine Produkte gefunden.",
      back: "Zurück",
      compact: {
        type: "Typ:",
        org: "Org.:",
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
          "Der API-Schlüssel hat keine Berechtigung, Produkte aufzurufen.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Produkte für die angegebenen Parameter gefunden.",
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
      description: "Produkte erfolgreich geladen.",
    },
  },
};
