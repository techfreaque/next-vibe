export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    deviceLicenses: "Gerätlizenzen",
  },
  get: {
    title: "Gerätelizenz abrufen",
    description:
      "Ruft eine Gerätelizenz anhand der Seriennummer und des Aktivierungsschlüssels ab.",
    serialNumber: {
      label: "Seriennummer",
      description: "Seriennummer des Geräts, das die Lizenz aktiviert hat.",
      placeholder: "SN-ABC-001",
    },
    activationKey: {
      label: "Aktivierungsschlüssel",
      description: "Aktivierungsschlüssel der Lizenz.",
      placeholder: "ACT-KEY-XXXX",
    },
    response: {
      realm: "Realm",
      logicalId: "Logische ID",
      gatewayLogicalId: "Gateway-Logische-ID",
      label: "Bezeichnung",
      apiKey: "API-Schlüssel",
      orgResourceId: "Organisations-Ressourcen-ID",
      vpnKey: "VPN-Schlüssel",
      fromDateVpn: "VPN-Start",
      toDateVpn: "VPN-Ende",
      numOfSecondsAutoRenewVpn: "Autoverlängerung (Sekunden)",
      activationDate: "Aktivierungsdatum",
      vpnValidityMonths: "VPN-Gültigkeit (Monate)",
      vpnAccountingDisabled: "VPN-Abrechnung deaktiviert",
    },
    widget: {
      title: "Gerätelizenz-Suche",
      back: "Zurück",
    },
    submitButton: {
      label: "Suchen",
      loadingText: "Wird gesucht...",
    },
    errors: {
      validation: {
        title: "Ungültige Anfrage",
        description: "Prüfe Seriennummer und Aktivierungsschlüssel.",
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
        description: "Keine Berechtigung zum Abrufen von Gerätlizenzen.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Gerätelizenz für diese Daten gefunden.",
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
      title: "Gerätelizenz gefunden",
      description: "Gerätelizenz erfolgreich abgerufen.",
    },
  },
  post: {
    title: "Gerätelizenz abrufen (POST)",
    description:
      "Ruft eine Gerätelizenz per POST-Body anhand der Seriennummer und des Aktivierungsschlüssels ab.",
    serialNumber: {
      label: "Seriennummer",
      description: "Seriennummer des Geräts, das die Lizenz aktiviert hat.",
      placeholder: "SN-ABC-001",
    },
    activationKey: {
      label: "Aktivierungsschlüssel",
      description: "Aktivierungsschlüssel der Lizenz.",
      placeholder: "ACT-KEY-XXXX",
    },
    response: {
      realm: "Realm",
      logicalId: "Logische ID",
      gatewayLogicalId: "Gateway-Logische-ID",
      label: "Bezeichnung",
      apiKey: "API-Schlüssel",
      orgResourceId: "Organisations-Ressourcen-ID",
      vpnKey: "VPN-Schlüssel",
      fromDateVpn: "VPN-Start",
      toDateVpn: "VPN-Ende",
      numOfSecondsAutoRenewVpn: "Autoverlängerung (Sekunden)",
      activationDate: "Aktivierungsdatum",
      vpnValidityMonths: "VPN-Gültigkeit (Monate)",
      vpnAccountingDisabled: "VPN-Abrechnung deaktiviert",
    },
    widget: {
      title: "Gerätelizenz-Suche (POST)",
      back: "Zurück",
    },
    submitButton: {
      label: "Suchen",
      loadingText: "Wird gesucht...",
    },
    errors: {
      validation: {
        title: "Ungültige Anfrage",
        description: "Prüfe Seriennummer und Aktivierungsschlüssel.",
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
        description: "Keine Berechtigung zum Abrufen von Gerätlizenzen.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Gerätelizenz für diese Daten gefunden.",
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
      title: "Gerätelizenz gefunden",
      description: "Gerätelizenz erfolgreich abgerufen.",
    },
  },
};
