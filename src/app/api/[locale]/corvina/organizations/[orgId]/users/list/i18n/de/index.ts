export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    users: "Benutzer",
  },
  get: {
    title: "Organisationsbenutzer auflisten",
    description: "Listet alle Benutzer einer Corvina-Organisation auf.",
    orgId: {
      label: "Organisations-ID",
      description: "Numerische Corvina-Organisations-ID.",
    },
    page: {
      label: "Seite",
      description: "Nullbasierte Seitenzahl.",
    },
    pageSize: {
      label: "Seitengröße",
      description: "Anzahl der Benutzer pro Seite (max. 100).",
    },
    response: {
      users: {
        id: "ID",
        username: "Benutzername",
        email: "E-Mail",
        firstName: "Vorname",
        lastName: "Nachname",
        country: "Land",
        defaultHomePage: "Startseite",
        serviceAccount: "Dienstkonto",
        groupPoliciesEnabled: "Gruppenrichtlinien",
        userImpersonation: "Identitätswechsel",
        mfaEnabled: "MFA",
        owner: "Eigentümer",
        ownerRef: "Eigentümerreferenz",
      },
      totalElements: "Benutzer gesamt",
      totalPages: "Seiten gesamt",
      last: "Letzte Seite",
    },
    widget: {
      title: "Benutzer",
      emptyState: "Keine Benutzer gefunden.",
      badges: {
        serviceAccount: "Dienstkonto",
        mfaEnabled: "MFA aktiv",
        mfaDisabled: "Kein MFA",
        impersonation: "Identitätswechsel",
      },
    },
    enums: {
      userOwner: {
        organization: "Organisation",
        app: "App",
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
          "Der API-Schlüssel hat keinen Zugriff auf die Benutzerliste.",
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
      description: "Benutzer erfolgreich geladen.",
    },
  },
};
