export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    organizations: "Organisationen",
    securityPolicies: "Sicherheitsrichtlinien",
  },
  get: {
    title: "Sicherheitsrichtlinien auflisten",
    description:
      "Ruft alle Sicherheitsrichtlinien einer Corvina-Organisation ab.",
    orgId: {
      label: "Organisations-ID",
      description: "Numerische Corvina-Organisations-ID.",
    },
    response: {
      policies: {
        title: "Sicherheitsrichtlinien",
        description: "Sicherheitsrichtlinien dieser Organisation.",
        id: "ID",
        name: "Name",
        type: "Typ",
        organizationId: "Organisations-ID",
        orgResourceId: "Ressourcen-ID der Organisation",
      },
      totalElements: "Gesamt",
      totalPages: "Seiten",
      last: "Letzte Seite",
    },
    widget: {
      title: "Sicherheitsrichtlinien",
      noPoliciesFound: "Keine Sicherheitsrichtlinien gefunden",
    },
    enums: {
      policyType: {
        standard: "Standard",
        selfDevice: "Eigenes Gerät",
        allDevices: "Alle Geräte",
      },
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
        description: "Kein Zugriff auf Sicherheitsrichtlinien.",
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
      description: "Sicherheitsrichtlinien erfolgreich geladen.",
    },
  },
};
