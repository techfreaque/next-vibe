export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    products: "Produkte",
  },
  post: {
    title: "Produkt erstellen",
    description: "Erstellt ein neues Produkt auf der Corvina-Plattform.",
    code: {
      label: "Produktcode",
      description: "Eindeutiger Code zur Identifikation dieses Produkts.",
      placeholder: "CORVINA_STANDARD",
    },
    type: {
      label: "Produkttyp",
      description: "z. B. STANDARD",
      placeholder: "STANDARD",
    },
    productLabel: {
      label: "Bezeichnung",
      description: "Lesbare Bezeichnung für dieses Produkt.",
      placeholder: "Corvina Standard",
    },
    trial: {
      label: "Testversion",
      description: "Dieses Produkt als Testangebot markieren.",
    },
    autorenewDefaultValueForNewLicenses: {
      label: "Standard-Automatik­verlängerung",
      description:
        "Standardwert für die automatische Verlängerung neuer Lizenzen dieses Produkts.",
    },
    orgResourceId: {
      label: "Org-Ressourcen-ID",
      description:
        "Dieses Produkt einer bestimmten Organisationsressource zuweisen.",
      placeholder: "exorde.connex.connectika",
    },
    submitButton: {
      label: "Produkt erstellen",
      loadingText: "Wird erstellt...",
    },
    response: {
      id: "Produkt-ID",
      code: "Code",
      type: "Typ",
      productLabel: "Bezeichnung",
      dealer: "Händler",
      trial: "Testversion",
      creationDate: "Erstellt",
      lastModified: "Zuletzt geändert",
      autorenewDefaultValueForNewLicenses: "Standard-Automatik­verlängerung",
      orgResourceId: "Org-Ressourcen-ID",
    },
    widget: {
      title: "Produkt erstellen",
      back: "Zurück",
      resultTitle: "Produkt erstellt",
      noData: "Keine Produktdaten",
    },
    errors: {
      validation: {
        title: "Ungültige Anfrage",
        description: "Die Produkterstellungsanfrage ist ungültig.",
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
          "Der API-Schlüssel hat keine Berechtigung, Produkte zu erstellen.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Die angeforderte Ressource wurde nicht gefunden.",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Produkt mit diesem Code existiert bereits.",
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
      title: "Produkt erstellt",
      description: "Das Produkt wurde erfolgreich erstellt.",
    },
  },
};
