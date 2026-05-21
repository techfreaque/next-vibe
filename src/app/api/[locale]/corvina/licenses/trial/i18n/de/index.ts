export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    licenses: "Lizenzen",
  },
  post: {
    title: "Testlizenz erstellen",
    description: "Erstellt eine Testlizenz für ein Gerät.",
    deviceLicense: {
      label: "Gerätelizenzschlüssel",
      description:
        "Der Gerätelizenzschlüssel, für den eine Testlizenz aktiviert wird.",
      placeholder: "XXXX-YYYY-ZZZZ-AAAA",
    },
    targetOrganization: {
      label: "Zielorganisation",
      description:
        "Ressourcen-ID der Organisation, die die Testlizenz erhält (optional).",
      placeholder: "exorde.connex.connectika",
    },
    ownerOrganization: {
      label: "Eigentümerorganisation",
      description:
        "Ressourcen-ID der Organisation, die die Testlizenz besitzt (optional).",
      placeholder: "exorde.connex.connectika",
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
      title: "Testlizenz erstellen",
      back: "Zurück",
      resultTitle: "Testlizenz erstellt",
    },
    submitButton: {
      label: "Testlizenz anlegen",
      loadingText: "Wird erstellt...",
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
          "Der API-Schlüssel hat keine Berechtigung zum Erstellen von Testlizenzen.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Die Gerätelizenz wurde nicht gefunden.",
      },
      conflict: {
        title: "Konflikt",
        description: "Für dieses Gerät existiert bereits eine Testlizenz.",
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
      title: "Testlizenz erstellt",
      description: "Testlizenz erfolgreich erstellt.",
    },
  },
};
