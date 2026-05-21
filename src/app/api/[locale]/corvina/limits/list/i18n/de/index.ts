export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    limits: "Limits",
  },
  get: {
    title: "Ressourcenlimits auflisten",
    description: "Lädt alle Ressourcenlimits des Corvina-Mandanten.",
    page: {
      label: "Seite",
      description: "Nullbasierte Seitennummer.",
    },
    pageSize: {
      label: "Seitengröße",
      description: "Anzahl der Limits pro Seite.",
    },
    status: {
      label: "Status",
      description: "Nach Limitstatus filtern — VALID oder ALL.",
    },
    orgResourceId: {
      label: "Organisations-Ressourcen-ID",
      description: "Limits nach Organisations-Ressourcen-ID filtern.",
    },
    response: {
      total: "Gesamt",
      totalPages: "Seiten gesamt",
      currentPage: "Aktuelle Seite",
      limits: {
        resourceType: "Ressourcentyp",
        quantity: "Menge",
        used: "Genutzt",
        targetOrganization: "Zielorganisation",
        grantingOrganization: "Gewährende Organisation",
        orgResourceId: "Organisations-Ressourcen-ID",
      },
    },
    widget: {
      title: "Ressourcenlimits",
      noItemsFound: "Keine Ressourcenlimits gefunden.",
      back: "Zurück",
      refresh: "Aktualisieren",
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
          "Der API-Schlüssel hat keine Berechtigung, Ressourcenlimits aufzurufen.",
      },
      notFound: {
        title: "Nicht gefunden",
        description:
          "Keine Ressourcenlimits für die angegebenen Parameter gefunden.",
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
      description: "Ressourcenlimits erfolgreich geladen.",
    },
  },
  post: {
    title: "Ressourcenlimit erstellen",
    description:
      "Erstellt ein neues Ressourcenlimit für den Corvina-Mandanten.",
    resourceType: {
      label: "Ressourcentyp",
      description: "Art der zu limitierenden Ressource (z. B. DEVICE).",
    },
    quantity: {
      label: "Menge",
      description: "Maximale Anzahl der Ressource.",
    },
    orgResourceId: {
      label: "Organisations-Ressourcen-ID",
      description:
        "Organisations-Ressourcen-ID, der dieses Limit zugeordnet wird.",
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
          "Der API-Schlüssel hat keine Berechtigung, Ressourcenlimits zu erstellen.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Die Zielorganisation wurde nicht gefunden.",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Ressourcenlimit für diesen Typ existiert bereits.",
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
      title: "Erstellt",
      description: "Ressourcenlimit erfolgreich erstellt.",
    },
    submitButton: {
      label: "Limit erstellen",
      loadingText: "Wird erstellt…",
    },
  },
  put: {
    title: "Ressourcenlimit aktualisieren",
    description:
      "Aktualisiert ein bestehendes Ressourcenlimit des Corvina-Mandanten.",
    resourceType: {
      label: "Ressourcentyp",
      description: "Art der zu aktualisierenden Ressource.",
    },
    quantity: {
      label: "Menge",
      description: "Neue maximale Anzahl für die Ressource.",
    },
    orgResourceId: {
      label: "Organisations-Ressourcen-ID",
      description:
        "Organisations-Ressourcen-ID, die das zu aktualisierende Limit identifiziert.",
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
          "Der API-Schlüssel hat keine Berechtigung, Ressourcenlimits zu aktualisieren.",
      },
      notFound: {
        title: "Nicht gefunden",
        description:
          "Kein Ressourcenlimit für die angegebenen Parameter gefunden.",
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
      description: "Ressourcenlimit erfolgreich aktualisiert.",
    },
    submitButton: {
      label: "Änderungen speichern",
      loadingText: "Wird gespeichert…",
    },
  },
};
