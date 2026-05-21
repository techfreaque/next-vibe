export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    licenses: "Lizenzen",
  },
  get: {
    title: "Lizenz prüfen",
    description:
      "Prüft einen Lizenzcode und gibt die zugehörigen Details zurück.",
    licenseCode: {
      label: "Lizenzcode",
      description: "Der zu prüfende Lizenzcode (z.B. XXXX-YYYY-ZZZZ-AAAA).",
      placeholder: "XXXX-YYYY-ZZZZ-AAAA",
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
      autorenew: "Automatische Verlängerung",
      orgResourceId: "Organisations-Ressourcen-ID",
    },
    widget: {
      title: "Lizenz prüfen",
      back: "Zurück",
      valid: "Gültig",
      invalid: "Ungültig",
      noResult: "Lizenzcode eingeben, um zu prüfen.",
    },
    errors: {
      validation: {
        title: "Ungültige Anfrage",
        description: "Das Format des Lizenzcodes ist ungültig.",
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
        description: "Keine Berechtigung zur Lizenzprüfung.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Kein Eintrag für diesen Lizenzcode gefunden.",
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
      title: "Lizenz gültig",
      description: "Der Lizenzcode ist gültig.",
    },
  },
};
