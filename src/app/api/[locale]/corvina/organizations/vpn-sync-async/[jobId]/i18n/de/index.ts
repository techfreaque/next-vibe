export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    organizations: "Organisationen",
  },
  get: {
    title: "VPN-Synchronisierungsauftrag abrufen",
    description:
      "Ruft den Status eines asynchronen VPN-Synchronisierungsauftrags ab.",
    jobId: {
      label: "Auftrags-ID",
      description: "Die ID des asynchronen VPN-Synchronisierungsauftrags.",
    },
    response: {
      id: "Auftrags-ID",
      orgResourceId: "Organisations-Ressourcen-ID",
      rootOrgResourceId: "Root-Organisations-Ressourcen-ID",
      status: "Status",
      error: "Fehler",
    },
    widget: {
      title: "VPN-Synchronisierungsauftrag",
      back: "Zurück",
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
        description: "Keine Berechtigung zum Abrufen dieses VPN-Auftrags.",
      },
      notFound: {
        title: "Nicht gefunden",
        description:
          "Kein VPN-Synchronisierungsauftrag mit dieser ID gefunden.",
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
      title: "Auftrag abgerufen",
      description:
        "Status des VPN-Synchronisierungsauftrags erfolgreich abgerufen.",
    },
  },
};
