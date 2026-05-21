export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    licenses: "Lizenzen",
  },
  post: {
    title: "Ressourcen synchronisieren",
    description:
      "Löst die Synchronisierung des Ressourcenverbrauchs zwischen Corvina und verbundenen Plattformen aus.",
    orgResourceId: {
      label: "Org-Ressourcen-ID",
      description:
        "Synchronisierung auf eine bestimmte Organisation beschränken.",
    },
    dryRun: {
      label: "Probelauf",
      description:
        "Synchronisierung simulieren, ohne Änderungen zu übernehmen.",
    },
    submitButton: {
      label: "Synchronisieren",
      loadingText: "Wird synchronisiert...",
    },
    response: {
      synchronized: "Status",
    },
    widget: {
      title: "Ressourcen synchronisieren",
      back: "Zurück",
      success: "Synchronisierung abgeschlossen.",
    },
    errors: {
      validation: {
        title: "Ungültige Anfrage",
        description: "Die Synchronisierungsanfrage ist ungültig.",
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
          "Der API-Schlüssel hat keine Berechtigung, die Synchronisierung auszulösen.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Die angeforderte Ressource wurde nicht gefunden.",
      },
      conflict: {
        title: "Konflikt",
        description:
          "Corvina hat bei der Synchronisierung einen Konflikt gemeldet.",
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
      title: "Synchronisiert",
      description: "Ressourcensynchronisierung erfolgreich ausgelöst.",
    },
  },
};
