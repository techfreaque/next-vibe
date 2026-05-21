export const translations = {
  category: "Corvina",
  tags: { corvina: "Corvina", devices: "Geräte" },
  delete: {
    title: "Geräte-Tags löschen",
    description: "Löscht historische Tag-Daten eines Corvina-Geräts.",
    orgId: {
      label: "Organisations-ID",
      description: "Numerische Corvina-Organisations-ID.",
    },
    deviceId: {
      label: "Geräte-HW-ID",
      description: "Hardware-ID (hwId) des Geräts.",
    },
    modelPath: {
      label: "Modellpfad",
      description: "Tag-Modellpfad-Filter. ** passt auf alle Tags.",
      placeholder: "**",
    },
    since: {
      label: "Von",
      description: "Beginn des Löschzeitraums (ISO 8601 oder Zeitstempel).",
      placeholder: "2024-01-01T00:00:00Z",
    },
    to: {
      label: "Bis",
      description: "Ende des Löschzeitraums (ISO 8601 oder Zeitstempel).",
      placeholder: "2024-12-31T23:59:59Z",
    },
    filterCondition: {
      label: "Filterbedingung",
      description: "Zusätzlicher Filterausdruck.",
      placeholder: "value > 0",
    },
    response: {
      deletedCount: "Gelöschte Einträge",
    },
    widget: {
      title: "Tags gelöscht",
      deletedMessage: "gelöscht",
    },
    errors: {
      validation: {
        title: "Ungültige Anfrage",
        description: "Die Anfrage war fehlerhaft.",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Corvina API nicht erreichbar.",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "CORVINA_API_KEY prüfen.",
      },
      forbidden: {
        title: "Verboten",
        description: "Kein Löschzugriff auf dieses Gerät.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Gerät nicht gefunden.",
      },
      conflict: {
        title: "Konflikt",
        description: "Corvina meldet einen Konflikt.",
      },
      server: {
        title: "Serverfehler",
        description: "Corvina meldet einen Serverfehler.",
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
    success: { title: "Erfolg", description: "Tag-Daten gelöscht." },
  },
};
