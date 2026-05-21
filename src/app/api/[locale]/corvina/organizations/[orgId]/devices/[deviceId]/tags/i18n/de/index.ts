export const translations = {
  category: "Corvina",
  tags: { corvina: "Corvina", devices: "Geräte" },
  get: {
    title: "Geräte-Tags",
    description: "Ruft Telemetrie-Tags eines Corvina-Geräts ab.",
    orgId: {
      label: "Organisations-ID",
      description: "Numerische Corvina-Organisations-ID.",
    },
    deviceId: {
      label: "Geräte-HW-ID",
      description: "Hardware-ID (hwId) des Geräts.",
    },
    response: {
      tags: {
        modelPath: "Modellpfad",
        latestValue: "Letzter Wert",
        latestTimestamp: "Zeitstempel",
      },
      total: "Gesamt",
    },
    widget: {
      title: "Tags",
      noTagsFound: "Keine Tags gefunden.",
      noData: "kein Wert",
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
    success: { title: "Erfolg", description: "Tags geladen." },
  },
  post: {
    title: "Tag-Wert setzen",
    description: "Schreibt einen neuen Wert auf einen Corvina-Gerätetag.",
    orgId: {
      label: "Organisations-ID",
      description: "Numerische Corvina-Organisations-ID.",
    },
    deviceId: {
      label: "Geräte-HW-ID",
      description: "Hardware-ID (hwId) des Geräts.",
    },
    modelPath: {
      label: "Tag-Pfad",
      description: "Vollständiger Modellpfad des Tags.",
      placeholder: "ABC:1/Tag9",
    },
    v: {
      label: "Neuer Wert",
      description: "Wert, der in den Tag geschrieben werden soll.",
      placeholder: "z.B. 42 oder hallo",
    },
    response: { message: "Ergebnis" },
    widget: {
      currentValue: "Aktueller Wert",
      submitButton: "Wert schreiben",
      successTitle: "Wert geschrieben",
      successDescription: "Der Tag wurde erfolgreich aktualisiert.",
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
        description: "Kein Schreibzugriff auf dieses Gerät.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Gerät oder Tag nicht gefunden.",
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
    success: { title: "Erfolg", description: "Tag-Wert geschrieben." },
  },
};
