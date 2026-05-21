export const translations = {
  category: "Corvina",
  tags: { corvina: "Corvina", alarms: "Alarme" },
  post: {
    title: "Alarme suchen",
    description: "Durchsucht und filtert aktive Alarme aller Corvina-Geräte.",
    filter: {
      label: "Filter",
      description: "OData-Filterausdruck zur Einschränkung der Alarme.",
      placeholder: "z.B. severity gt 3",
    },
    page: {
      label: "Seite",
      description: "Seitennummer (0-basiert).",
    },
    pageSize: {
      label: "Einträge pro Seite",
      description: "Anzahl der Alarme je Seite.",
    },
    orderBy: {
      label: "Sortieren nach",
      description: "Feld, nach dem sortiert wird.",
    },
    orderDir: {
      label: "Sortierrichtung",
      description: "Aufsteigend oder absteigend.",
    },
    scopedOrganization: {
      label: "Organisation",
      description:
        "Ergebnisse auf eine Organisations-Ressourcen-ID einschränken.",
      placeholder: "z.B. exorde.connex.acme",
    },
    deviceName: {
      label: "Gerätename",
      description: "Alarme nach Gerätename filtern.",
      placeholder: "z.B. mein-gerät",
    },
    deviceGroups: {
      label: "Gerätegruppen",
      description: "Kommagetrennte Liste der Gerätegruppen.",
      placeholder: "z.B. gruppe1,gruppe2",
    },
    response: {
      alarms: {
        id: "ID",
        name: "Name",
        description: "Beschreibung",
        deviceId: "Geräte-ID",
        deviceLabel: "Gerät",
        tag: "Tag",
        severity: "Schweregrad",
        status: "Status",
        action: "Aktion",
        alarmEnabled: "Aktiv",
        ack: "Quittierung erforderlich",
        reset: "Reset erforderlich",
        eventTimestamp: "Ereigniszeit",
        updatedAt: "Aktualisiert",
        acknowledgedDate: "Quittiert",
        orgResourceId: "Organisation",
        user: "Benutzer",
        comment: "Kommentar",
        timestampAction: "Aktionszeit",
        platformAction: "Plattformaktion",
        value_double: "Wert (double)",
        value_integer: "Wert (integer)",
        value_boolean: "Wert (boolean)",
        value_string: "Wert (string)",
        realmId: "Realm",
      },
      totalElements: "Gesamt",
      totalPages: "Seiten",
      last: "Letzte Seite",
    },
    widget: {
      title: "Alarme",
      noAlarmsFound: "Keine Alarme gefunden.",
      filterPlaceholder: "Alarme filtern…",
    },
    enums: {
      alarmStatus: {
        active: "Aktiv",
        notActive: "Inaktiv",
      },
      alarmAction: {
        ack: "Quittiert",
        noAck: "Nicht quittiert",
      },
      alarmActionType: {
        ack: "Quittieren",
        reset: "Zurücksetzen",
        clear: "Löschen",
      },
      bulkAlarmActionType: {
        ackAll: "Alle quittieren",
        resetAll: "Alle zurücksetzen",
        clearAll: "Alle löschen",
      },
      alarmOrderBy: {
        eventTimestamp: "Ereigniszeit",
        updatedAt: "Aktualisierungszeit",
        severity: "Schweregrad",
      },
      alarmOrderDir: {
        asc: "Aufsteigend",
        desc: "Absteigend",
      },
    },
    errors: {
      validation: {
        title: "Ungültige Anfrage",
        description: "Die Suchanfrage war fehlerhaft.",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Corvina Platform API nicht erreichbar.",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "CORVINA_API_KEY prüfen.",
      },
      forbidden: {
        title: "Verboten",
        description: "Kein Zugriff auf Alarmsuche.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Alarm-Suchendpunkt nicht gefunden.",
      },
      conflict: {
        title: "Konflikt",
        description: "Corvina meldet einen Konflikt.",
      },
      server: {
        title: "Serverfehler",
        description: "Die Corvina Platform API meldet einen Serverfehler.",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen.",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten.",
      },
    },
    success: {
      title: "Erfolg",
      description: "Alarme geladen.",
    },
  },
};
