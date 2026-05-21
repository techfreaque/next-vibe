export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    licenses: "Lizenzen",
  },
  post: {
    title: "Lizenz aktivieren",
    description: "Aktiviert eine Lizenz anhand ihres Codes.",
    licenseCode: {
      label: "Lizenzcode",
      description: "Der Aktivierungscode der Lizenz.",
      placeholder: "XXXX-YYYY-ZZZZ",
    },
    orgResourceId: {
      label: "Org-Ressourcen-ID",
      description: "Zielorganisation für die Aktivierung.",
      placeholder: "exorde.connex.example",
    },
    submitButton: {
      label: "Aktivieren",
      loadingText: "Wird aktiviert...",
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
      used: "Verwendet",
      code: "Code",
      orgResourceId: "Org.",
      externalRef: "Externe Referenz",
      price: "Preis",
      currency: "Währung",
      autorenew: "Automatisch verlängern",
    },
    widget: {
      title: "Lizenz aktivieren",
      back: "Zurück",
    },
    errors: {
      validation: {
        title: "Ungültige Anfrage",
        description: "Die Aktivierungsanfrage ist ungültig.",
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
          "Der API-Schlüssel hat keine Berechtigung, Lizenzen zu aktivieren.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Der Lizenzcode wurde nicht gefunden.",
      },
      conflict: {
        title: "Konflikt",
        description: "Diese Lizenz wurde bereits aktiviert.",
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
      title: "Lizenz aktiviert",
      description: "Lizenz erfolgreich aktiviert.",
    },
  },
};
