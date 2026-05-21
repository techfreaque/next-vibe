export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    organizations: "Organisationen",
  },
  delete: {
    title: "Corvina-Organisation löschen",
    description: "Löscht eine Corvina-Organisation dauerhaft per ID.",
    orgId: {
      label: "Organisations-ID",
      description: "Numerische Corvina-Organisations-ID zum Löschen.",
    },
    response: {
      id: "ID",
      name: "Name",
      label: "Bezeichnung",
      status: "Status",
      resourceId: "Ressourcen-ID",
    },
    widget: {
      title: "Organisation löschen",
      warning:
        "Diese Aktion ist endgültig und kann nicht rückgängig gemacht werden.",
      confirmButton: "Löschen",
      cancelButton: "Abbrechen",
      deletedTitle: "Organisation gelöscht",
      deletedDescription: "Die Organisation wurde dauerhaft entfernt.",
      backButton: "Zurück",
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
          "Der API-Schlüssel hat keine Berechtigung zum Löschen dieser Organisation.",
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
      title: "Gelöscht",
      description: "Organisation erfolgreich gelöscht.",
    },
  },
};
