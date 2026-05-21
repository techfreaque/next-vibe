export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    organizations: "Organisationen",
    userGroups: "Benutzergruppen",
  },
  post: {
    title: "Benutzergruppe erstellen",
    endpointDescription:
      "Erstellt eine neue Benutzergruppe in einer Corvina-Organisation.",
    orgId: {
      label: "Organisations-ID",
      description: "Numerische Corvina-Organisations-ID.",
    },
    name: {
      label: "Name",
      description: "Eindeutiger Name der Benutzergruppe.",
      placeholder: "meine-gruppe",
    },
    description: {
      label: "Beschreibung",
      description: "Optionale Beschreibung dieser Gruppe.",
      placeholder: "Team zuständig für…",
    },
    groupPoliciesEnabled: {
      label: "Gruppenrichtlinien aktiviert",
      description: "Sicherheitsrichtlinien auf Gruppenebene aktivieren.",
    },
    response: {
      id: "ID",
      name: "Name",
      organizationId: "Organisations-ID",
      type: "Typ",
      owner: "Eigentümer",
      membershipRole: "Mitgliedsrolle",
    },
    submitButton: {
      label: "Gruppe erstellen",
      loadingText: "Wird erstellt…",
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
          "Der API-Schlüssel hat keine Berechtigung zum Erstellen von Gruppen.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Organisation mit dieser ID gefunden.",
      },
      conflict: {
        title: "Konflikt",
        description: "Eine Gruppe mit diesem Namen existiert bereits.",
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
      description: "Benutzergruppe erfolgreich erstellt.",
    },
  },
};
