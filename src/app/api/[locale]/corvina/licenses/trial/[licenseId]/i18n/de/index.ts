export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    licenses: "Lizenzen",
  },
  delete: {
    title: "Testlizenz löschen",
    description: "Löscht eine Testlizenz dauerhaft anhand der ID.",
    licenseId: {
      label: "Lizenz-ID",
      description: "Numerische ID der zu löschenden Testlizenz.",
    },
    response: {
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
      autorenew: "Automatische Verlängerung",
      orgResourceId: "Organisations-Ressourcen-ID",
    },
    widget: {
      title: "Testlizenz löschen",
      back: "Zurück",
    },
    submitButton: {
      label: "Testlizenz löschen",
      loadingText: "Wird gelöscht...",
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
          "Der API-Schlüssel hat keine Berechtigung zum Löschen von Testlizenzen.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Testlizenz mit dieser ID gefunden.",
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
      title: "Gelöscht",
      description: "Testlizenz erfolgreich gelöscht.",
    },
  },
};
