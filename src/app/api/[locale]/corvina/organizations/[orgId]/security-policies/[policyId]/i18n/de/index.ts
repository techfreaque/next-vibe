export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    organizations: "Organisationen",
    securityPolicies: "Sicherheitsrichtlinien",
  },
  get: {
    title: "Sicherheitsrichtlinie abrufen",
    description: "Ruft eine einzelne Sicherheitsrichtlinien-Gruppe per ID ab.",
    orgId: {
      label: "Organisations-ID",
      description: "Numerische Corvina-Organisations-ID.",
    },
    policyId: {
      label: "Richtlinien-ID",
      description: "Numerische Sicherheitsrichtlinien-ID.",
    },
    response: {
      id: "ID",
      name: "Name",
      type: "Typ",
      organizationId: "Organisations-ID",
      orgResourceId: "Ressourcen-ID der Organisation",
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
        description: "Kein Zugriff auf diese Richtlinie.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Richtlinie mit dieser ID.",
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
      description: "Sicherheitsrichtlinie erfolgreich geladen.",
    },
    widget: { prefix: "Richtlinie" },
  },
  put: {
    title: "Sicherheitsrichtlinie aktualisieren",
    description: "Aktualisiert eine Sicherheitsrichtlinien-Gruppe.",
    orgId: {
      label: "Organisations-ID",
      description: "Numerische Corvina-Organisations-ID.",
    },
    policyId: {
      label: "Richtlinien-ID",
      description: "Numerische Sicherheitsrichtlinien-ID.",
    },
    name: {
      label: "Name",
      description: "Neuer Name der Sicherheitsrichtlinie.",
      placeholder: "meine-richtlinie",
    },
    descriptionField: {
      label: "Beschreibung",
      description: "Optionale Beschreibung.",
      placeholder: "Beschränkt den Zugriff auf…",
    },
    response: {
      id: "ID",
      name: "Name",
      type: "Typ",
      organizationId: "Organisations-ID",
      orgResourceId: "Ressourcen-ID der Organisation",
    },
    submitButton: { label: "Änderungen speichern", loadingText: "Speichern…" },
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
        description: "Corvina hat den API-Schlüssel abgelehnt.",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Kein Schreibzugriff auf diese Richtlinie.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Richtlinie mit dieser ID.",
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
      title: "Gespeichert",
      description: "Sicherheitsrichtlinie erfolgreich aktualisiert.",
    },
    widget: { prefix: "Richtlinie aktualisiert" },
  },
  delete: {
    title: "Sicherheitsrichtlinie löschen",
    description: "Löscht eine Sicherheitsrichtlinien-Gruppe.",
    orgId: {
      label: "Organisations-ID",
      description: "Numerische Corvina-Organisations-ID.",
    },
    policyId: {
      label: "Richtlinien-ID",
      description: "Zu löschende Sicherheitsrichtlinien-ID.",
    },
    response: {
      id: "ID",
      name: "Name",
      type: "Typ",
      organizationId: "Organisations-ID",
      orgResourceId: "Ressourcen-ID der Organisation",
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
        description: "Kein Zugriff zum Löschen dieser Richtlinie.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Richtlinie mit dieser ID.",
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
      title: "Gelöscht",
      description: "Sicherheitsrichtlinie erfolgreich gelöscht.",
    },
    widget: { prefix: "Richtlinie gelöscht" },
  },
};
