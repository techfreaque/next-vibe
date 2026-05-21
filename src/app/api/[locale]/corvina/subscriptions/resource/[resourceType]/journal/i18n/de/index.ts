export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    subscriptions: "Abonnements",
  },
  get: {
    title: "Ressourcennutzungs-Journal",
    description:
      "Gibt paginierte Journal-Einträge für einen bestimmten Ressourcentyp zurück.",
    resourceType: {
      label: "Ressourcentyp",
      description:
        "Der abzufragende Ressourcentyp (z. B. DEVICES, USERS, ORGANIZATIONS, DEVICE_DATA, DEVICE_VPN, CREDITS).",
    },
    orgResourceId: {
      label: "Organisations-Ressourcen-ID",
      description: "Journal-Einträge nach Organisations-Ressourcen-ID filtern.",
    },
    deviceLabel: {
      label: "Gerätebezeichnung",
      description: "Journal-Einträge nach Gerätebezeichnung filtern.",
    },
    organizationFilter: {
      label: "Organisationsfilter",
      description: "Journal-Einträge nach Organisation filtern.",
    },
    includeSubOrgs: {
      label: "Unterorganisationen einbeziehen",
      description:
        "Gibt an, ob Einträge aus Unterorganisationen einbezogen werden sollen.",
    },
    fromDate: {
      label: "Von Datum",
      description: "Startzeitstempel in Millisekunden.",
    },
    toDate: {
      label: "Bis Datum",
      description: "Endzeitstempel in Millisekunden.",
    },
    page: {
      label: "Seite",
      description: "Nullbasierte Seitennummer.",
    },
    pageSize: {
      label: "Seitengröße",
      description: "Anzahl der Einträge pro Seite.",
    },
    response: {
      items: {
        usage: "Verbrauch",
        timestamp: "Zeitstempel",
        grantingOrganization: "Gewährende Organisation",
        dealerOrganization: "Händlerorganisation",
        organization: "Organisation",
        licenseCode: "Lizenzcode",
        deviceId: "Geräte-ID",
        deviceLogicalId: "Logische Geräte-ID",
        deviceSerialNumber: "Seriennummer des Geräts",
      },
      total: "Gesamt",
      totalPages: "Gesamtseiten",
      currentPage: "Aktuelle Seite",
    },
    widget: {
      title: "Ressourcennutzungs-Journal",
      noItemsFound: "Keine Journal-Einträge gefunden.",
      back: "Zurück",
    },
    errors: {
      validation: {
        title: "Ungültige Anfrage",
        description: "Die Anfrage ist ungültig.",
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
        description: "Keine Berechtigung.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Journal-Einträge gefunden.",
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
      title: "Daten abgerufen",
      description: "Ressourcennutzungs-Journal erfolgreich geladen.",
    },
  },
};
