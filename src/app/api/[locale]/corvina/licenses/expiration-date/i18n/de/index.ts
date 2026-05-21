export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    licenses: "Lizenzen",
  },
  get: {
    title: "Lizenz-Ablaufdatum",
    description:
      "Gibt das Ablaufdatum (Epoch ms) für einen gegebenen Lizenzcode zurück.",
    licenseCode: {
      label: "Lizenzcode",
      description:
        "Der Lizenzcode, dessen Ablaufdatum abgefragt werden soll (z.B. XXXX-YYYY-ZZZZ-AAAA).",
      placeholder: "XXXX-YYYY-ZZZZ-AAAA",
    },
    response: {
      expirationDate: "Ablaufdatum",
    },
    widget: {
      title: "Ablaufdatum prüfen",
      back: "Zurück",
      result: "Ablauf",
      noResult: "Lizenzcode eingeben, um das Ablaufdatum zu prüfen.",
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
        description: "Keine Berechtigung zur Abfrage des Ablaufdatums.",
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
      title: "Ablaufdatum abgerufen",
      description: "Das Lizenz-Ablaufdatum wurde erfolgreich zurückgegeben.",
    },
  },
};
