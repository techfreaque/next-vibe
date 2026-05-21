export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    organizations: "Organisationen",
    apiKeys: "API-Schlüssel",
  },
  get: {
    title: "API-Schlüssel auflisten",
    description: "Ruft alle API-Schlüssel einer Corvina-Organisation ab.",
    orgId: {
      label: "Organisations-ID",
      description: "Numerische Corvina-Organisations-ID.",
    },
    response: {
      keys: {
        title: "API-Schlüssel",
        description: "API-Schlüssel dieser Organisation.",
        id: "ID",
        userId: "Benutzer-ID",
        organizationId: "Organisations-ID",
        key: "Schlüssel",
      },
    },
    widget: {
      title: "API-Schlüssel",
      noKeysFound: "Keine API-Schlüssel gefunden",
      keyMasked: "Schlüssel (maskiert)",
      loading: "Lädt…",
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
        description: "Kein Zugriff auf API-Schlüssel.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Organisation mit dieser ID.",
      },
      conflict: {
        title: "Konflikt",
        description: "Corvina meldet einen Konflikt.",
      },
      server: {
        title: "Serverfehler",
        description: "Corvina hat einen Serverfehler gemeldet.",
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
      description: "API-Schlüssel erfolgreich geladen.",
    },
  },
  post: {
    title: "API-Schlüssel erstellen",
    description:
      "Erstellt einen neuen API-Schlüssel für einen Corvina-Organisationsbenutzer.",
    orgId: {
      label: "Organisations-ID",
      description: "Numerische Corvina-Organisations-ID.",
    },
    username: {
      label: "Benutzername",
      description: "Benutzername für den neuen API-Schlüssel.",
      placeholder: "max.mustermann",
    },
    response: {
      id: "ID",
      userId: "Benutzer-ID",
      organizationId: "Organisations-ID",
      key: "API-Schlüssel",
    },
    submitButton: {
      label: "Schlüssel erstellen",
      loadingText: "Wird erstellt…",
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
        description: "Keine Berechtigung zum Erstellen von API-Schlüsseln.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Organisation oder kein Benutzer mit dieser ID.",
      },
      conflict: {
        title: "Konflikt",
        description: "Für diesen Benutzer existiert bereits ein API-Schlüssel.",
      },
      server: {
        title: "Serverfehler",
        description: "Corvina hat einen Serverfehler gemeldet.",
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
      description:
        "API-Schlüssel erstellt. Jetzt speichern — er wird nicht erneut angezeigt.",
    },
  },
};
