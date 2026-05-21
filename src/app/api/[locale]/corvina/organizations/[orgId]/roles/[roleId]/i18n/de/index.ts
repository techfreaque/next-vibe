export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    roles: "Rollen",
  },
  get: {
    title: "Rolle abrufen",
    description: "Lädt eine einzelne Corvina-Rolle per ID.",
    orgId: {
      label: "Organisations-ID",
      description: "Numerische Corvina-Organisations-ID.",
    },
    roleId: {
      label: "Rollen-ID",
      description: "Numerische Corvina-Rollen-ID.",
    },
    response: {
      id: "ID",
      name: "Name",
      label: "Bezeichnung",
      resourceId: "Ressourcen-ID",
      description: "Beschreibung",
      type: "Typ",
      owner: "Eigentümer",
      enabled: "Aktiv",
      defaultStar: "Standard",
      deviceGeneralPermission: "Geräteberechtigung",
      vpnGeneralPermission: "VPN-Berechtigung",
      orgResourceId: "Organisations-Ressourcen-ID",
    },
    widget: {
      edit: "Bearbeiten",
      delete: "Löschen",
      sections: {
        identity: "Identität",
        permissions: "Berechtigungen",
      },
      labels: {
        name: "Name",
        label: "Bezeichnung",
        resourceId: "Ressourcen-ID",
        description: "Beschreibung",
        type: "Typ",
        owner: "Eigentümer",
      },
      badges: {
        enabled: "Aktiv",
        disabled: "Inaktiv",
        defaultRole: "Standard",
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
        description: "Der API-Schlüssel hat keinen Zugriff auf diese Rolle.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Rolle mit dieser ID gefunden.",
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
      description: "Rolle erfolgreich geladen.",
    },
  },
  put: {
    title: "Rolle aktualisieren",
    description: "Aktualisiert eine bestehende Corvina-Rolle.",
    orgId: {
      label: "Organisations-ID",
      description: "Numerische Corvina-Organisations-ID.",
    },
    roleId: {
      label: "Rollen-ID",
      description: "Numerische Corvina-Rollen-ID zum Aktualisieren.",
    },
    label: {
      label: "Bezeichnung",
      description: "Lesbarer Anzeigename in der Oberfläche.",
      placeholder: "Meine Rolle",
    },
    descriptionField: {
      label: "Beschreibung",
      description: "Beschreibung der Berechtigungen dieser Rolle.",
      placeholder: "Gewährt Zugriff auf…",
    },
    type: {
      label: "Rollentyp",
      description: "Art der Ressource, auf die sich diese Rolle bezieht.",
    },
    defaultStar: {
      label: "Standardrolle",
      description: "Diese Rolle neuen Benutzern automatisch zuweisen.",
    },
    deviceGeneralPermission: {
      label: "Geräteberechtigung",
      description: "Allgemeine Berechtigungsstufe für Gerätezugriff.",
    },
    vpnGeneralPermission: {
      label: "VPN-Berechtigung",
      description: "Allgemeine Berechtigungsstufe für VPN-Zugriff.",
    },
    submitButton: {
      label: "Änderungen speichern",
      loadingText: "Speichern…",
    },
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
        description:
          "Der API-Schlüssel hat keinen Schreibzugriff auf diese Rolle.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Rolle mit dieser ID gefunden.",
      },
      conflict: {
        title: "Konflikt",
        description: "Corvina meldet einen Konflikt für diese Aktualisierung.",
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
      title: "Gespeichert",
      description: "Rolle erfolgreich aktualisiert.",
    },
  },
  delete: {
    title: "Rolle löschen",
    description: "Löscht eine Corvina-Rolle dauerhaft.",
    orgId: {
      label: "Organisations-ID",
      description: "Numerische Corvina-Organisations-ID.",
    },
    roleId: {
      label: "Rollen-ID",
      description: "Numerische Corvina-Rollen-ID zum Löschen.",
    },
    widget: {
      warning:
        "Diese Aktion ist endgültig und kann nicht rückgängig gemacht werden.",
      confirmButton: "Rolle löschen",
      cancelButton: "Abbrechen",
      deletedTitle: "Rolle gelöscht",
      deletedDescription: "Die Rolle wurde dauerhaft entfernt.",
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
          "Der API-Schlüssel hat keine Berechtigung zum Löschen dieser Rolle.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Rolle mit dieser ID gefunden.",
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
      description: "Rolle erfolgreich gelöscht.",
    },
  },
};
