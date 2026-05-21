export const translations = {
  category: "Corvina",
  tags: { corvina: "Corvina", devices: "Geräte" },
  post: {
    title: "Gerät verschieben",
    description: "Verschiebt ein Corvina-Gerät in eine andere Organisation.",
    orgId: {
      label: "Organisations-ID",
      description: "Quell-Corvina-Organisations-ID.",
    },
    deviceId: {
      label: "Geräte-HW-ID",
      description: "Hardware-ID (hwId) des zu verschiebenden Geräts.",
    },
    organizationImportToken: {
      label: "Organisations-Import-Token",
      description: "Import-Token der Zielorganisation.",
      placeholder: "tok_abc123",
    },
    response: {
      id: "Geräte-ID",
      label: "Bezeichnung",
      hwId: "HW-ID",
      orgResourceId: "Org-Ressourcen-ID",
    },
    widget: {
      successTitle: "Gerät verschoben",
      successDescription: "Das Gerät wurde in die Zielorganisation verschoben.",
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
        description: "Kein Verschiebungszugriff für dieses Gerät.",
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
    success: { title: "Erfolg", description: "Gerät verschoben." },
  },
};
