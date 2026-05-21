export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    products: "Produkte",
  },
  get: {
    title: "Produkt abrufen",
    description: "Ruft ein einzelnes Produkt anhand seiner ID ab.",
    productId: {
      label: "Produkt-ID",
      description: "Numerische Produkt-ID.",
    },
    response: {
      id: "Produkt-ID",
      code: "Code",
      type: "Typ",
      label: "Name",
      dealer: "Händler",
      trial: "Testversion",
      creationDate: "Erstellt",
      lastModified: "Aktualisiert",
      autorenewDefault: "Automatische Verlängerung (Standard)",
      orgResourceId: "Organisations-ID",
    },
    widget: {
      title: "Produktdetails",
      back: "Zurück",
      noData: "Produkt nicht gefunden.",
    },
    errors: {
      validation: {
        title: "Ungültige Anfrage",
        description: "Die Produkt-ID ist ungültig.",
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
        description: "Kein Zugriff auf dieses Produkt.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Kein Produkt mit dieser ID vorhanden.",
      },
      conflict: {
        title: "Konflikt",
        description: "Corvina hat einen Konflikt gemeldet.",
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
      title: "Produkt abgerufen",
      description: "Produkt erfolgreich geladen.",
    },
  },
};
