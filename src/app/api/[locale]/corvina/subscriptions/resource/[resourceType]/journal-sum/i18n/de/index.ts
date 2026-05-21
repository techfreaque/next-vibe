export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    subscriptions: "Abonnements",
  },
  get: {
    title: "Summe der Ressourcennutzung",
    description:
      "Gibt die Gesamtnutzung für einen bestimmten Ressourcentyp aus den Journal-Einträgen zurück.",
    resourceType: {
      label: "Ressourcentyp",
      description:
        "Der abzufragende Ressourcentyp (z. B. DEVICES, USERS, ORGANIZATIONS, DEVICE_DATA, DEVICE_VPN, CREDITS).",
    },
    orgResourceId: {
      label: "Organisations-Ressourcen-ID",
      description: "Nach Organisations-Ressourcen-ID filtern.",
    },
    deviceLabel: {
      label: "Gerätebezeichnung",
      description: "Nach Gerätebezeichnung filtern.",
    },
    organizationFilter: {
      label: "Organisationsfilter",
      description: "Nach Organisation filtern.",
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
      totalUsage: "Gesamtverbrauch",
    },
    widget: {
      title: "Summe der Ressourcennutzung",
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
        description: "Keine Daten gefunden.",
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
      description: "Summe der Ressourcennutzung erfolgreich geladen.",
    },
  },
};
