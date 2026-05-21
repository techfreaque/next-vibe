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
      name: "Name",
      label: "Bezeichnung",
      status: "Status",
      serialNumber: "Seriennummer",
      firmwareVersion: "Firmware",
      connected: "Verbunden",
      lastSeen: "Zuletzt gesehen",
      vpnEnabled: "VPN aktiviert",
      dataEnabled: "Daten aktiviert",
    },
    widget: {
      edit: "Bearbeiten",
      tags: "Tags",
      sections: { identity: "Identität", network: "Netzwerk" },
      labels: {
        name: "Name",
        label: "Bezeichnung",
        serialNumber: "Seriennummer",
        firmwareVersion: "Firmware",
        lastSeen: "Zuletzt gesehen",
      },
      badges: {
        connected: "Online",
        disconnected: "Offline",
        vpnOn: "VPN an",
        vpnOff: "VPN aus",
        dataOn: "Daten an",
        dataOff: "Daten aus",
      },
      cli: {
        firmwarePrefix: " · FW ",
        lastSeenPrefix: "zuletzt gesehen ",
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
  put: {
    title: "Gerät bearbeiten",
    description: "Aktualisiert ein Corvina-Gerät.",
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
    vpnEnabled: {
      label: "VPN aktiviert",
      description: "VPN für dieses Gerät aktivieren.",
    },
    dataEnabled: {
      label: "Daten aktiviert",
      description: "Datendienste für dieses Gerät aktivieren.",
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
