export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    organizations: "Organisationen",
    securityPolicies: "Sicherheitsrichtlinien",
  },
  post: {
    title: "Sicherheitsrichtlinie erstellen",
    description:
      "Erstellt eine neue Sicherheitsrichtlinien-Gruppe in einer Corvina-Organisation.",
    orgId: {
      label: "Organisations-ID",
      description: "Numerische Corvina-Organisations-ID.",
    },
    name: {
      label: "Name",
      description: "Eindeutiger Name der Sicherheitsrichtlinie.",
      placeholder: "meine-richtlinie",
    },
    descriptionField: {
      label: "Beschreibung",
      description: "Optionale Beschreibung.",
      placeholder: "Beschränkt den Zugriff auf…",
    },
    deviceHwIds: {
      label: "Geräte-HW-IDs",
      description: "Kommagetrennte Hardware-IDs der einzuschließenden Geräte.",
      placeholder: "AABBCCDD, 11223344",
    },
    response: {
      id: "ID",
      name: "Name",
      type: "Typ",
      organizationId: "Organisations-ID",
      orgResourceId: "Ressourcen-ID der Organisation",
    },
    submitButton: {
      label: "Richtlinie erstellen",
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
        description:
          "Keine Berechtigung zum Erstellen von Sicherheitsrichtlinien.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Organisation mit dieser ID.",
      },
      conflict: {
        title: "Konflikt",
        description: "Eine Richtlinie mit diesem Namen existiert bereits.",
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
      description: "Sicherheitsrichtlinie erfolgreich erstellt.",
    },
  },
};
