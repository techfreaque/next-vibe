export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    licenses: "Lizenzen",
  },
  get: {
    title: "Lizenzen auflisten",
    description: "Lädt alle auf dem Corvina-Mandanten registrierten Lizenzen.",
    page: {
      label: "Seite",
      description: "Nullbasierte Seitennummer.",
    },
    pageSize: {
      label: "Seitengröße",
      description: "Anzahl der Lizenzen pro Seite.",
    },
    orgResourceId: {
      label: "Organisations-Ressourcen-ID",
      description: "Lizenzen nach Organisations-Ressourcen-ID filtern.",
    },
    response: {
      total: "Gesamt",
      totalPages: "Seiten gesamt",
      currentPage: "Aktuelle Seite",
      licenses: {
        licenseId: "Lizenz-ID",
        productCode: "Produktcode",
        productLabel: "Produkt",
        productType: "Typ",
        productTrial: "Testversion",
        creationDate: "Erstellt am",
        expirationDate: "Läuft ab",
        activationDate: "Aktiviert am",
        used: "In Verwendung",
        code: "Code",
        externalRef: "Externe Referenz",
        price: "Preis",
        currency: "Währung",
        autorenew: "Automatische Verlängerung",
        orgResourceId: "Organisations-Ressourcen-ID",
      },
    },
    widget: {
      title: "Lizenzen",
      noLicensesFound: "Keine Lizenzen gefunden.",
      back: "Zurück",
      refresh: "Aktualisieren",
      prevPage: "Zurück",
      nextPage: "Weiter",
      nav: {
        orgs: "Organisationen",
        create: "Neue Lizenz",
        trial: "Testlizenz",
      },
      compact: {
        exp: "Abl.:",
        autorenew: "Autoverlängerung:",
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
          "Der API-Schlüssel hat keine Berechtigung, Lizenzen aufzurufen.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Lizenzen für die angegebenen Parameter gefunden.",
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
      description: "Lizenzen erfolgreich geladen.",
    },
  },
};
