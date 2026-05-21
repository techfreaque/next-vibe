export const translations = {
  category: "Corvina",
  tags: { corvina: "Corvina", devices: "Geräte" },
  post: {
    title: "Tag-Verlaufabfrage",
    description: "Fragt historische Tag-Daten eines Corvina-Geräts ab.",
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
      description: "Tag-Modellpfad-Filter. Wildcards werden unterstützt.",
      placeholder: "** oder Test_Model:1/Tag",
    },
    since: {
      label: "Von",
      description: "Beginn des Zeitraums (ISO 8601 oder Zeitstempel).",
      placeholder: "2024-01-01T00:00:00Z",
    },
    to: {
      label: "Bis",
      description: "Ende des Zeitraums (ISO 8601 oder Zeitstempel).",
      placeholder: "2024-12-31T23:59:59Z",
    },
    limit: {
      label: "Limit",
      description: "Maximale Anzahl zurückgegebener Zeilen.",
      placeholder: "100",
    },
    mode: {
      label: "Modus",
      description: "Tag-Zugriffsmodus-Filter.",
    },
    filterCondition: {
      label: "Filterbedingung",
      description: "Zusätzlicher Filterausdruck.",
      placeholder: "value > 0",
    },
    response: {
      deviceId: "Geräte-ID",
      modelPath: "Modellpfad",
      rowCount: "Zeilenanzahl",
      latestValue: "Letzter Wert",
      latestTimestamp: "Letzter Zeitstempel",
    },
    widget: {
      title: "Tag-Abfrageergebnisse",
      noResultsFound: "Keine Tag-Daten gefunden.",
      rows: "Zeilen",
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
        description: "Kein Lesezugriff auf dieses Gerät.",
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
    success: { title: "Erfolg", description: "Tag-Verlauf abgerufen." },
  },
};
