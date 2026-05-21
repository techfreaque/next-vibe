export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    licenses: "Lizenzen",
  },
  get: {
    title: "Lizenz abrufen",
    description: "Ruft eine einzelne Lizenz anhand der ID ab.",
    licenseId: {
      label: "Lizenz-ID",
      description: "Numerische Lizenz-ID.",
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
      title: "Lizenzdetails",
      expiringWarning: "Läuft in weniger als 30 Tagen ab",
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
        description: "Der API-Schlüssel hat keinen Zugriff auf diese Lizenz.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Lizenz mit dieser ID gefunden.",
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
      description: "Lizenz erfolgreich geladen.",
    },
  },
  put: {
    title: "Lizenz aktualisieren",
    description:
      "Aktualisiert die automatische Verlängerung und das Ablaufdatum einer Lizenz.",
    licenseId: {
      label: "Lizenz-ID",
      description: "Numerische Lizenz-ID.",
    },
    autorenew: {
      label: "Automatische Verlängerung",
      description: "Automatische Verlängerung aktivieren oder deaktivieren.",
    },
    expirationDate: {
      label: "Ablaufdatum",
      description:
        "Neues Ablaufdatum als Epoch-Millisekunden (null zum Löschen).",
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
          "Der API-Schlüssel hat keine Berechtigung zum Aktualisieren von Lizenzen.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Lizenz mit dieser ID gefunden.",
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
      title: "Aktualisiert",
      description: "Lizenz erfolgreich aktualisiert.",
    },
    submitButton: {
      label: "Änderungen speichern",
      loadingText: "Wird gespeichert...",
    },
  },
  delete: {
    title: "Lizenz löschen",
    description: "Löscht eine Lizenz anhand der ID dauerhaft.",
    licenseId: {
      label: "Lizenz-ID",
      description: "Numerische Lizenz-ID zum Löschen.",
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
          "Der API-Schlüssel hat keine Berechtigung zum Löschen von Lizenzen.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Lizenz mit dieser ID gefunden.",
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
      description: "Lizenz erfolgreich gelöscht.",
    },
    submitButton: {
      label: "Lizenz löschen",
      loadingText: "Wird gelöscht...",
    },
  },
  post: {
    title: "Lizenz erneuern",
    description: "Erneuert eine Lizenz anhand der ID.",
    licenseId: {
      label: "Lizenz-ID",
      description: "Numerische Lizenz-ID zum Erneuern.",
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
          "Der API-Schlüssel hat keine Berechtigung zum Erneuern von Lizenzen.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Lizenz mit dieser ID gefunden.",
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
      title: "Erneuert",
      description: "Lizenz erfolgreich erneuert.",
    },
    submitButton: {
      label: "Lizenz erneuern",
      loadingText: "Wird erneuert...",
    },
  },
};
