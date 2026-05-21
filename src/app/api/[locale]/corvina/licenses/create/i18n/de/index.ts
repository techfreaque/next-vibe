export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    licenses: "Lizenzen",
  },
  post: {
    title: "Lizenz erstellen",
    description: "Erstellt eine neue Lizenz auf der Corvina-Plattform.",
    productId: {
      label: "Produkt-ID",
      description: "Numerische ID des zu lizenzierenden Corvina-Produkts.",
      placeholder: "42",
    },
    autorenew: {
      label: "Automatisch verlängern",
      description: "Lizenz vor Ablauf automatisch erneuern.",
    },
    expirationDate: {
      label: "Ablaufdatum",
      description:
        "Ablaufzeitpunkt als Epoch-Millisekunden. Leer lassen für keine Begrenzung.",
      placeholder: "1800000000000",
    },
    price: {
      label: "Preis",
      description: "Kaufpreis dieser Lizenz.",
      placeholder: "99,00",
    },
    currency: {
      label: "Währung",
      description: "ISO-4217-Währungscode (z. B. EUR, USD).",
      placeholder: "EUR",
    },
    externalRef: {
      label: "Externe Referenz",
      description:
        "Optionale externe Kennung für systemübergreifendes Tracking.",
      placeholder: "bestellung-12345",
    },
    targetOrgResourceId: {
      label: "Ziel-Org-Ressourcen-ID",
      description:
        "Lizenz direkt einer bestimmten Organisationsressource zuweisen.",
      placeholder: "exorde.connex.connectika",
    },
    submitButton: {
      label: "Lizenz erstellen",
      loadingText: "Wird erstellt...",
    },
    response: {
      licenseId: "Lizenz-ID",
      productCode: "Produktcode",
      productLabel: "Produkt",
      productType: "Typ",
      productTrial: "Testversion",
      creationDate: "Erstellt",
      activationDate: "Aktiviert",
      used: "In Verwendung",
      code: "Lizenzcode",
      orgResourceId: "Org-Ressourcen-ID",
    },
    widget: {
      title: "Lizenz erstellen",
      back: "Zurück",
      resultTitle: "Lizenz erstellt",
      noData: "Keine Lizenzdaten",
    },
    errors: {
      validation: {
        title: "Ungültige Anfrage",
        description: "Die Lizenzerstellungsanfrage ist ungültig.",
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
          "Der API-Schlüssel hat keine Berechtigung, Lizenzen zu erstellen.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Das angeforderte Produkt wurde nicht gefunden.",
      },
      conflict: {
        title: "Konflikt",
        description: "Es ist ein Lizenzkonflikt aufgetreten.",
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
      title: "Lizenz erstellt",
      description: "Die Lizenz wurde erfolgreich erstellt.",
    },
  },
};
