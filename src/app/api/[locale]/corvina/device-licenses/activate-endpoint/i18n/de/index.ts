export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    deviceLicenses: "Gerätlizenzen",
  },
  post: {
    title: "Endpoint-Gerätelizenz aktivieren",
    description: "Aktiviert eine Gerätelizenz für ein Endpoint-Gerät.",
    activationKey: {
      label: "Aktivierungsschlüssel",
      description: "Der Aktivierungsschlüssel des Geräts.",
      placeholder: "0123-4567-89AB-CDEF",
    },
    alias: {
      label: "Alias",
      description: "Gerätealias.",
      placeholder: "mein-gerät",
    },
    deviceSerialNumber: {
      label: "Seriennummer",
      description: "Seriennummer des Geräts.",
      placeholder: "1234567890",
    },
    endpointDescription: {
      label: "Beschreibung",
      description: "Gerätebeschreibung.",
      placeholder: "Mein Endpoint-Gerät",
    },
    orgResourceId: {
      label: "Organisations-Ressourcen-ID",
      description: "Zielorganisation.",
      placeholder: "org.resource.id",
    },
    logicalId: {
      label: "Logische ID",
      description: "Optionale logische ID (base64 URL-safe).",
      placeholder: "",
    },
    numOfSecondsVpn: {
      label: "VPN-Sekunden",
      description: "Sekunden, die dem VPN-Abonnement hinzugefügt werden.",
      placeholder: "2592000",
    },
    autorenewVpn: {
      label: "VPN-Autoverlängerung",
      description: "Ob VPN automatisch verlängert wird.",
    },
    gatewayId: {
      label: "Gateway-ID",
      description: "Logische ID des Gateway-Geräts.",
      placeholder: "",
    },
    response: {
      id: "ID",
      logicalId: "Logische ID",
      serialNumber: "Seriennummer",
      clientName: "Clientname",
      orgResourceId: "Organisations-Ressourcen-ID",
      activationKey: "Aktivierungsschlüssel",
      fromDateVpn: "VPN-Start",
      toDateVpn: "VPN-Ende",
      activationDate: "Aktiviert",
      vpnValidityMonths: "VPN-Gültigkeit (Monate)",
      numOfSecondsAutoRenewVpn: "Autoverlängerung (Sekunden)",
      used: "Verwendet",
      deleted: "Gelöscht",
    },
    widget: {
      title: "Endpoint aktivieren",
      back: "Zurück",
    },
    submitButton: {
      label: "Endpoint aktivieren",
      loadingText: "Wird aktiviert...",
    },
    errors: {
      validation: {
        title: "Ungültige Anfrage",
        description: "Die Anfrage ist ungültig. Prüfe activationKey und alias.",
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
        description:
          "Keine Berechtigung zur Aktivierung der Endpoint-Gerätelizenz.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Gerätelizenz oder Aktivierungsschlüssel nicht gefunden.",
      },
      conflict: {
        title: "Konflikt",
        description: "Corvina meldet einen Konflikt.",
      },
      server: {
        title: "Serverfehler",
        description: "Corvina hat einen internen Serverfehler gemeldet.",
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
      title: "Endpoint aktiviert",
      description: "Endpoint-Gerätelizenz wurde erfolgreich aktiviert.",
    },
  },
};
