export const translations = {
  category: "Corvina",
  tags: { corvina: "Corvina", alarms: "Alarme" },
  get: {
    title: "Alarm-Detail",
    description:
      "Lädt alle Details eines einzelnen Corvina-Alarms anhand der ID.",
    alarmId: {
      label: "Alarm-ID",
      description: "Eindeutige Kennung des Alarms.",
    },
    response: {
      id: "ID",
      realmId: "Realm",
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
    },
    widget: {
      identity: "Identität",
      statusSection: "Status",
      timing: "Zeitstempel",
      metadata: "Metadaten",
      noData: "—",
      back: "Zurück",
    },
    errors: {
      validation: {
        title: "Ungültige Anfrage",
        description: "Die Alarm-ID ist fehlerhaft.",
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
        description: "Kein Zugriff auf diesen Alarm.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Alarm nicht gefunden.",
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
      description: "Alarm geladen.",
    },
  },
};
