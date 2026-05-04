export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    organizations: "Organisationen",
  },
  get: {
    title: "Corvina-Organisationen auflisten",
    description:
      "Liefert alle Kunden­organisationen des konfigurierten Corvina-Mandanten.",
    container: {
      title: "Corvina-Organisationen",
      description:
        "Alle Kunden­organisationen auf dem konfigurierten Corvina-Mandanten.",
    },
    response: {
      title: "Organisationen",
      description:
        "Vom Corvina-API zurückgegebene Kunden­organisationen.",
      organizations: {
        title: "Organisationen",
        description: "Jede Zeile entspricht einer Kunden­organisation.",
        id: "ID",
        name: "Name",
        displayName: "Anzeigename",
        enabled: "Aktiv",
        createdAt: "Erstellt",
      },
      total: "Gesamt",
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
        description:
          "Corvina hat die Service-Account-Anmeldedaten abgelehnt. CORVINA_CLIENT_ID und CORVINA_CLIENT_SECRET prüfen.",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description:
          "Dem Service-Account fehlt der nötige Scope, um Organisationen zu lesen.",
      },
      notFound: {
        title: "Nicht gefunden",
        description:
          "Corvina liefert 404 für den konfigurierten Pfad. CORVINA_ORGANIZATIONS_PATH anpassen.",
      },
      conflict: {
        title: "Konflikt",
        description:
          "Corvina meldet einen Konflikt beim Auflisten der Organisationen.",
      },
      server: {
        title: "Serverfehler",
        description: "Das Corvina-API hat einen internen Serverfehler gemeldet.",
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
      description: "Organisationen erfolgreich geladen.",
    },
  },
};
