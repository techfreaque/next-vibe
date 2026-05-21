export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    organizations: "Organisationen",
    userGroups: "Benutzergruppen",
  },
  get: {
    title: "Benutzergruppen auflisten",
    description: "Ruft alle Benutzergruppen einer Corvina-Organisation ab.",
    orgId: {
      label: "Organisations-ID",
      description: "Numerische Corvina-Organisations-ID.",
    },
    response: {
      groups: {
        title: "Benutzergruppen",
        description: "Benutzergruppen dieser Organisation.",
        id: "ID",
        name: "Name",
        organizationId: "Organisations-ID",
        type: "Typ",
        owner: "Eigentümer",
        membershipRole: "Mitgliedsrolle",
      },
      totalElements: "Gesamt",
      totalPages: "Seiten",
      last: "Letzte Seite",
    },
    widget: {
      title: "Benutzergruppen",
      noGroupsFound: "Keine Benutzergruppen gefunden",
    },
    enums: {
      groupType: {
        standard: "Standard",
        selfUserAny: "Eigener Nutzer (beliebig)",
        selfUser: "Eigener Nutzer",
        allUser: "Alle Nutzer",
        selfUserService: "Eigener Nutzer (Dienst)",
        all: "Alle",
      },
      groupOwner: {
        organization: "Organisation",
        app: "App",
      },
      membershipRole: {
        user: "Nutzer",
        admin: "Administrator",
      },
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
          "Der API-Schlüssel hat keinen Zugriff auf Benutzergruppen.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Organisation mit dieser ID gefunden.",
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
      description: "Benutzergruppen erfolgreich geladen.",
    },
  },
};
