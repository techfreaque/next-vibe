export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    organizations: "Organisationen",
    userGroups: "Benutzergruppen",
  },
  get: {
    title: "Benutzergruppe abrufen",
    description: "Ruft eine einzelne Benutzergruppe per ID ab.",
    orgId: {
      label: "Organisations-ID",
      description: "Numerische Corvina-Organisations-ID.",
    },
    groupId: {
      label: "Gruppen-ID",
      description: "Numerische Benutzergruppen-ID.",
    },
    response: {
      id: "ID",
      name: "Name",
      organizationId: "Organisations-ID",
      type: "Typ",
      owner: "Eigentümer",
      membershipRole: "Mitgliedsrolle",
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
        description: "Kein Zugriff auf diese Gruppe.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Gruppe mit dieser ID.",
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
      description: "Benutzergruppe erfolgreich geladen.",
    },
    widget: { prefix: "Gruppe" },
  },
  put: {
    title: "Benutzergruppe aktualisieren",
    description: "Aktualisiert Mitglieder und Rollen einer Benutzergruppe.",
    orgId: {
      label: "Organisations-ID",
      description: "Numerische Corvina-Organisations-ID.",
    },
    groupId: {
      label: "Gruppen-ID",
      description: "Numerische Benutzergruppen-ID.",
    },
    membersId: {
      label: "Mitglieds-IDs",
      description: "Kommagetrennte Liste der Benutzer-IDs als Mitglieder.",
      placeholder: "1, 2, 3",
    },
    rolesId: {
      label: "Rollen-IDs",
      description: "Kommagetrennte Liste der zuzuweisenden Rollen-IDs.",
      placeholder: "10, 20",
    },
    response: {
      id: "ID",
      name: "Name",
      organizationId: "Organisations-ID",
      type: "Typ",
      owner: "Eigentümer",
      membershipRole: "Mitgliedsrolle",
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
        description: "Kein Schreibzugriff auf diese Gruppe.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Gruppe mit dieser ID.",
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
      description: "Benutzergruppe erfolgreich aktualisiert.",
    },
    widget: { prefix: "Gruppe aktualisiert" },
  },
  delete: {
    title: "Benutzergruppe löschen",
    description: "Löscht eine Benutzergruppe aus der Organisation.",
    orgId: {
      label: "Organisations-ID",
      description: "Numerische Corvina-Organisations-ID.",
    },
    groupId: {
      label: "Gruppen-ID",
      description: "Zu löschende Benutzergruppen-ID.",
    },
    response: {
      id: "ID",
      name: "Name",
      organizationId: "Organisations-ID",
      type: "Typ",
      owner: "Eigentümer",
      membershipRole: "Mitgliedsrolle",
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
        description: "Kein Zugriff zum Löschen dieser Gruppe.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Gruppe mit dieser ID.",
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
      description: "Benutzergruppe erfolgreich gelöscht.",
    },
    widget: { prefix: "Gruppe gelöscht" },
  },
};
