export const translations = {
  category: "Corvina",
  tags: { corvina: "Corvina", devices: "Geräte", status: "Status" },
  get: {
    title: "Gerätestatus abrufen",
    description: "Ruft den aktuellen Verbindungsstatus eines Geräts ab.",
    orgId: {
      label: "Organisations-ID",
      description: "Numerische Corvina-Organisations-ID.",
    },
    deviceId: { label: "Geräte-ID", description: "Numerische Geräte-ID." },
    response: {
      connected: "Verbunden",
      lastSeen: "Zuletzt gesehen",
      ipAddress: "IP-Adresse",
    },
    errors: {
      validation: {
        title: "Ungültige Anfrage",
        description: "Die Anfrage war fehlerhaft.",
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
        description: "Kein Zugriff auf Gerätestatus.",
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
        description: "Corvina hat einen Serverfehler gemeldet.",
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
      description: "Gerätestatus erfolgreich geladen.",
    },
  },
};
