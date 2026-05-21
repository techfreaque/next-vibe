export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    resources: "Ressourcen",
  },
  get: {
    title: "Ressourcen",
    description:
      "Listet alle verfügbaren Ressourcentypen der Corvina-Plattform auf.",
    response: {
      items: {
        id: "ID",
        type: "Ressourcentyp",
        maxActive: "Max. aktiv",
        consumable: "Verbrauchbar",
      },
    },
    widget: {
      title: "Ressourcen",
      noItemsFound: "Keine Ressourcen gefunden.",
      back: "Zurück",
    },
    errors: {
      validation: {
        title: "Ungültige Anfrage",
        description: "Die Anfrage war fehlerhaft.",
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
        description: "Keine Berechtigung zum Anzeigen der Ressourcen.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Ressourcen gefunden.",
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
      title: "Ressourcen abgerufen",
      description: "Ressourcen erfolgreich geladen.",
    },
  },
};
