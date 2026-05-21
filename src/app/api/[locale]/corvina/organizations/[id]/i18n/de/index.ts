export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    organizations: "Organisationen",
  },
  get: {
    title: "Corvina-Organisation abrufen",
    description: "Lädt eine einzelne Kunden­organisation per ID.",
    container: {
      title: "Organisation",
      description: "Details einer Kunden­organisation.",
    },
    id: {
      label: "Organisations-ID",
      description: "Die Corvina-Organisations-ID.",
    },
    response: {
      title: "Organisation",
      description: "Die von Corvina zurückgegebene Organisation.",
      organization: {
        title: "Details",
        description: "Wichtigste Felder der Organisation.",
        id: "ID",
        name: "Name",
        displayName: "Anzeigename",
        enabled: "Aktiv",
        createdAt: "Erstellt",
      },
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
        description: "Corvina hat die Service-Account-Daten abgelehnt.",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description:
          "Dem Service-Account fehlt der Scope zum Lesen dieser Organisation.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Organisation mit dieser ID gefunden.",
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
      description: "Organisation erfolgreich geladen.",
    },
  },
  patch: {
    title: "Corvina-Organisation aktualisieren",
    description:
      "Benennt eine Corvina-Organisation um. Aktivieren/Deaktivieren ist bewusst noch nicht angebunden — vorher das richtige API-Primitiv bestätigen.",
    container: {
      title: "Organisation aktualisieren",
      description: "Den Anzeigenamen der Organisation ändern.",
    },
    id: {
      label: "Organisations-ID",
      description: "Die zu aktualisierende Organisations-ID.",
    },
    displayName: {
      label: "Anzeigename",
      description: "Menschen-lesbarer Name, der in Corvina angezeigt wird.",
      placeholder: "Acme GmbH",
    },
    response: {
      title: "Aktualisierte Organisation",
      description: "Die Organisation nach der Aktualisierung.",
      organization: {
        title: "Details",
        description: "Felder nach der Aktualisierung.",
        id: "ID",
        name: "Name",
        displayName: "Anzeigename",
        enabled: "Aktiv",
        createdAt: "Erstellt",
      },
    },
    submitButton: {
      label: "Änderungen speichern",
      loadingText: "Speichern…",
    },
    backButton: {
      label: "Zurück",
    },
    errors: {
      validation: {
        title: "Ungültige Aktualisierung",
        description: "Corvina hat die Aktualisierung abgelehnt.",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Das Corvina-API ist nicht erreichbar.",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Corvina hat die Service-Account-Daten abgelehnt.",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description:
          "Dem Service-Account fehlt der Scope zum Aktualisieren dieser Organisation.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Organisation mit dieser ID gefunden.",
      },
      conflict: {
        title: "Konflikt",
        description: "Corvina meldet einen Konflikt für diese Aktualisierung.",
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
      title: "Gespeichert",
      description: "Organisation erfolgreich aktualisiert.",
    },
  },
  delete: {
    title: "Corvina-Organisation löschen",
    description:
      "Löscht eine Organisation in Corvina. Unumkehrbar — vor der Ausführung bestätigen.",
    container: {
      title: "Organisation löschen",
      description: "Diese Organisation dauerhaft entfernen.",
    },
    id: {
      label: "Organisations-ID",
      description: "Die zu löschende Organisations-ID.",
    },
    response: {
      title: "Löschung",
      description: "Ergebnis der Löschanfrage.",
      deleted: "Gelöscht",
      id: "ID",
    },
    submitButton: {
      label: "Organisation löschen",
      loadingText: "Löschen…",
    },
    backButton: {
      label: "Zurück",
    },
    errors: {
      validation: {
        title: "Ungültige Anfrage",
        description: "Corvina hat die Löschanfrage abgelehnt.",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Das Corvina-API ist nicht erreichbar.",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Corvina hat die Service-Account-Daten abgelehnt.",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description:
          "Dem Service-Account fehlt der Scope zum Löschen von Organisationen.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Organisation mit dieser ID gefunden.",
      },
      conflict: {
        title: "Konflikt",
        description: "Corvina meldet einen Konflikt für diese Löschung.",
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
      description: "Organisation erfolgreich gelöscht.",
    },
  },
};
