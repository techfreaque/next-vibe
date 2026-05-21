export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    licenses: "Lizenzen",
  },
  post: {
    title: "Lizenz verlängern",
    description: "Verlängert eine Lizenz anhand der ID.",
    licenseId: {
      label: "Lizenz-ID",
      description: "Numerische Lizenz-ID zur Verlängerung.",
    },
    response: {
      licenseId: "Lizenz-ID",
      productCode: "Produktcode",
      productLabel: "Produkt",
      productType: "Typ",
      productTrial: "Testversion",
      creationDate: "Erstellt",
      expirationDate: "Läuft ab",
      activationDate: "Aktiviert",
      used: "In Verwendung",
      code: "Lizenzcode",
      externalRef: "Externe Referenz",
      price: "Preis",
      currency: "Währung",
      autorenew: "Autoverlängerung",
      orgResourceId: "Organisations-Ressourcen-ID",
    },
    widget: {
      title: "Lizenz verlängern",
      back: "Zurück",
    },
    submitButton: {
      label: "Lizenz verlängern",
      loadingText: "Wird verlängert...",
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
          "Der API-Schlüssel hat keine Berechtigung zur Lizenzverlängerung.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Lizenz mit dieser ID vorhanden.",
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
      title: "Verlängert",
      description: "Lizenz erfolgreich verlängert.",
    },
  },
};
