export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    subscriptions: "Abonnements",
  },
  get: {
    title: "Abonnementverlauf",
    description:
      "Lädt historische Nutzungsdaten von Abonnements für einen bestimmten Zeitraum.",
    fromDate: {
      label: "Von Datum",
      description: "Beginn des Zeitraums (z. B. 2024-01-01).",
    },
    toDate: {
      label: "Bis Datum",
      description: "Ende des Zeitraums (z. B. 2024-12-31).",
    },
    orgResourceId: {
      label: "Organisations-Ressourcen-ID",
      description: "Ergebnisse nach Organisations-Ressourcen-ID filtern.",
    },
    resourceId: {
      label: "Ressourcen-ID",
      description: "Ergebnisse nach Ressourcen-ID filtern.",
    },
    page: {
      label: "Seite",
      description: "Nullbasierte Seitennummer.",
    },
    pageSize: {
      label: "Seitengröße",
      description: "Anzahl der Verlaufseinträge pro Seite.",
    },
    response: {
      total: "Gesamt",
      totalPages: "Seiten gesamt",
      currentPage: "Aktuelle Seite",
      items: {
        resourceType: "Ressourcentyp",
        quantity: "Menge",
        used: "Genutzt",
        granted: "Gewährt",
        grantedUsed: "Gewährt genutzt",
        licensed: "Lizenziert",
        timestamp: "Zeitstempel",
      },
    },
    widget: {
      title: "Abonnementverlauf",
      noItemsFound: "Keine Verlaufseinträge gefunden.",
      back: "Zurück",
      fetch: "Verlauf laden",
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
          "Der API-Schlüssel hat keinen Zugriff auf den Abonnementverlauf.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Kein Verlauf für die angegebenen Parameter gefunden.",
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
      description: "Abonnementverlauf erfolgreich geladen.",
    },
  },
};
