export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    organizations: "Organisationen",
  },
  post: {
    title: "Organisations-VPN synchronisieren",
    description: "Startet eine VPN-Synchronisierung für eine Organisation.",
    orgResourceId: {
      label: "Organisations-Ressourcen-ID",
      description:
        "Optionale Ressourcen-ID der zu synchronisierenden Organisation.",
      placeholder: "org.resource.id",
    },
    rootOrgResourceId: {
      label: "Root-Organisations-Ressourcen-ID",
      description: "Optionale Root-Organisations-Ressourcen-ID.",
      placeholder: "root.org.resource.id",
    },
    response: {
      result: "Ergebnis",
    },
    widget: {
      title: "VPN synchronisieren",
      back: "Zurück",
    },
    submitButton: {
      label: "VPN synchronisieren",
      loadingText: "Wird synchronisiert...",
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
        description: "Keine Berechtigung zur VPN-Synchronisierung.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Organisation nicht gefunden.",
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
      title: "VPN synchronisiert",
      description: "Organisations-VPN erfolgreich synchronisiert.",
    },
  },
};
