export const translations = {
  category: "Corvina",
  tags: { corvina: "Corvina", devices: "Geräte" },
  get: {
    title: "Gerät",
    description: "Ruft ein einzelnes Corvina-Gerät ab.",
    orgId: {
      label: "Organisations-ID",
      description: "Numerische Corvina-Organisations-ID.",
    },
    deviceId: {
      label: "Geräte-ID",
      description: "Numerische Corvina-Geräte-ID.",
    },
    response: {
      orgId: "Organisations-ID",
      deviceId: "Geräte-ID",
      label: "Bezeichnung",
      hwId: "Hardware-ID",
      orgResourceId: "Org-Ressourcen-ID",
    },
    widget: {
      edit: "Bearbeiten",
      tags: "Tags",
      sections: { identity: "Identität" },
      labels: {
        label: "Bezeichnung",
        hwId: "Hardware-ID",
        orgResourceId: "Org-Ressourcen-ID",
      },
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
    success: { title: "Erfolg", description: "Gerät geladen." },
  },
  patch: {
    title: "Gerät bearbeiten",
    info: "Aktualisiert Bezeichnung, Beschreibung und Seriennummer eines Corvina-Geräts.",
    orgId: {
      label: "Organisations-ID",
      description: "Numerische Corvina-Organisations-ID.",
    },
    deviceId: {
      label: "Geräte-ID",
      description: "Numerische Corvina-Geräte-ID.",
    },
    label: {
      label: "Bezeichnung",
      description: "Anzeigename des Geräts.",
      placeholder: "Mein Gerät",
    },
    description: {
      label: "Beschreibung",
      description: "Optionale Beschreibung des Geräts.",
      placeholder: "Kurze Beschreibung",
    },
    serialNumber: {
      label: "Seriennummer",
      description: "Physische Seriennummer des Geräts.",
      placeholder: "SN-123456",
    },
    submitButton: { label: "Speichern", loadingText: "Wird gespeichert…" },
    errors: {
      validation: {
        title: "Ungültige Aktualisierung",
        description: "Corvina hat die Aktualisierung abgelehnt.",
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
    success: {
      title: "Gespeichert",
      description: "Gerät erfolgreich aktualisiert.",
    },
  },
};
