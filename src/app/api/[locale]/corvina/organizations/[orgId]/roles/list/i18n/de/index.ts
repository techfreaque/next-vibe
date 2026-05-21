export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    roles: "Rollen",
  },
  get: {
    title: "Organisationsrollen auflisten",
    description: "Listet alle Rollen einer Corvina-Organisation auf.",
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
      description: "Anzahl der Rollen pro Seite (max. 100).",
    },
    response: {
      roles: {
        id: "ID",
        name: "Name",
        label: "Bezeichnung",
        resourceId: "Ressourcen-ID",
        description: "Beschreibung",
        type: "Typ",
        owner: "Eigentümer",
        enabled: "Aktiv",
        defaultStar: "Standard",
        deleted: "Gelöscht",
        createdAt: "Erstellt am",
        updatedAt: "Aktualisiert am",
        deviceGeneralPermission: "Geräteberechtigung",
        vpnGeneralPermission: "VPN-Berechtigung",
        orgResourceId: "Organisations-Ressourcen-ID",
      },
      totalElements: "Rollen gesamt",
      totalPages: "Seiten gesamt",
      last: "Letzte Seite",
    },
    widget: {
      title: "Rollen",
      emptyState: "Keine Rollen gefunden.",
      badges: {
        enabled: "Aktiv",
        disabled: "Inaktiv",
        defaultRole: "Standard",
      },
    },
    enums: {
      roleType: {
        application: "Anwendung",
        device: "Gerät",
        undefined: "Undefiniert",
      },
      roleOwner: {
        system: "System",
        organization: "Organisation",
        application: "Anwendung",
      },
      permissionLevel: {
        none: "Keine",
        regularUser: "Standardbenutzer",
        administrator: "Administrator",
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
          "Der API-Schlüssel hat keinen Zugriff auf die Rollenliste.",
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
      description: "Rollen erfolgreich geladen.",
    },
  },
};
