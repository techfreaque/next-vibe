export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    subscriptions: "Abonnements",
  },
  get: {
    title: "Abonnements auflisten",
    description: "Lädt alle Abonnements des Corvina-Mandanten.",
    page: {
      label: "Seite",
      description: "Nullbasierte Seitennummer.",
    },
    pageSize: {
      label: "Seitengröße",
      description: "Anzahl der Abonnements pro Seite.",
    },
    status: {
      label: "Status",
      description: "Nach Abonnementstatus filtern — VALID oder ALL.",
    },
    orgResourceId: {
      label: "Organisations-Ressourcen-ID",
      description: "Abonnements nach Organisations-Ressourcen-ID filtern.",
    },
    response: {
      total: "Gesamt",
      totalPages: "Seiten gesamt",
      currentPage: "Aktuelle Seite",
      subscriptions: {
        resourceType: "Ressourcentyp",
        quantity: "Menge",
        used: "Genutzt",
        expirationDate: "Läuft ab",
        creationDate: "Erstellt am",
        expired: "Abgelaufen",
        productCode: "Produktcode",
        productLabel: "Produkt",
        licenseId: "Lizenz-ID",
        productId: "Produkt-ID",
      },
    },
    widget: {
      title: "Abonnements",
      noItemsFound: "Keine Abonnements gefunden.",
      back: "Zurück",
      refresh: "Aktualisieren",
      expired: "Abgelaufen",
      expiringSoon: "Läuft bald ab",
      prevPage: "Zurück",
      nextPage: "Weiter",
      nav: {
        orgs: "Organisationen",
        aggregated: "Aggregiert",
        summary: "Zusammenfassung",
        history: "Verlauf",
      },
      compact: {
        exp: "Abl.:",
        qty: "Anz.:",
        used: "genutzt:",
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
          "Der API-Schlüssel hat keine Berechtigung, Abonnements aufzurufen.",
      },
      notFound: {
        title: "Nicht gefunden",
        description:
          "Keine Abonnements für die angegebenen Parameter gefunden.",
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
      description: "Abonnements erfolgreich geladen.",
    },
  },
};
