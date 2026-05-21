export const translations = {
  category: "Corvina",
  tags: { corvina: "Corvina", devices: "Geräte" },
  patch: {
    title: "Gerät aktualisieren",
    description:
      "Aktualisiert Label, Beschreibung oder Seriennummer eines Corvina-Geräts.",
    orgId: {
      label: "Organisations-ID",
      description: "Numerische Corvina-Organisations-ID.",
    },
    deviceId: {
      label: "Geräte-HW-ID",
      description: "Hardware-ID (hwId) des Geräts.",
    },
    label: {
      label: "Bezeichnung",
      description: "Lesbare Bezeichnung des Geräts.",
      placeholder: "Mein Gerät",
    },
    descriptionField: {
      label: "Beschreibung",
      description: "Optionale Beschreibung des Geräts.",
      placeholder: "Produktionssensoreinheit",
    },
    serialNumber: {
      label: "Seriennummer",
      description: "Seriennummer des Geräts.",
      placeholder: "SN-12345",
    },
    response: {
      id: "Geräte-ID",
      label: "Bezeichnung",
      hwId: "HW-ID",
      orgResourceId: "Org-Ressourcen-ID",
    },
    widget: {
      successTitle: "Gerät aktualisiert",
      successDescription: "Das Gerät wurde erfolgreich aktualisiert.",
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
        description: "Kein Bearbeitungszugriff auf dieses Gerät.",
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
    success: { title: "Erfolg", description: "Gerät aktualisiert." },
  },
};
