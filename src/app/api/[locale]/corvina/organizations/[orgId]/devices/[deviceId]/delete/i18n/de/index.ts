export const translations = {
  category: "Corvina",
  tags: { corvina: "Corvina", devices: "Geräte" },
  delete: {
    title: "Gerät löschen",
    description: "Entfernt ein Gerät dauerhaft aus einer Corvina-Organisation.",
    orgId: {
      label: "Organisations-ID",
      description: "Numerische Corvina-Organisations-ID.",
    },
    deviceId: {
      label: "Geräte-ID",
      description: "Numerische Corvina-Geräte-ID.",
    },
    widget: {
      confirm: "Gerät löschen",
      cancel: "Abbrechen",
      warning: "Dies kann nicht rückgängig gemacht werden.",
      deleted: "Gerät gelöscht.",
      deletedMcp: "Gerät erfolgreich gelöscht.",
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
    response: { message: "Ergebnis" },
    success: { title: "Gelöscht", description: "Gerät erfolgreich entfernt." },
  },
};
