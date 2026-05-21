export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    deviceLicenses: "Gerätlizenzen",
  },
  post: {
    title: "Gerätelizenz aktivieren",
    description:
      "Aktiviert eine Gerätelizenz in der Corvina-Plattform anhand eines Aktivierungsschlüssels.",
    activationKey: {
      label: "Aktivierungsschlüssel",
      description: "Eindeutiger Aktivierungsschlüssel für die Gerätelizenz.",
    },
    alias: {
      label: "Alias",
      description: "Optionaler Alias für diese Gerätelizenz.",
    },
    deviceSerialNumber: {
      label: "Seriennummer des Geräts",
      description:
        "Seriennummer des Geräts, das dieser Lizenz zugeordnet werden soll.",
    },
    activateDescription: {
      label: "Beschreibung",
      description: "Freitext-Beschreibung für diese Gerätelizenz.",
    },
    orgResourceId: {
      label: "Organisations-Ressourcen-ID",
      description:
        "Organisations-Ressourcen-ID, der die Lizenz zugewiesen werden soll.",
    },
    logicalId: {
      label: "Logische ID",
      description: "Logischer Bezeichner für das Gerät.",
    },
    numOfSecondsVpn: {
      label: "VPN-Dauer (Sekunden)",
      description: "Anzahl der Sekunden für die VPN-Gültigkeit.",
    },
    autorenewVpn: {
      label: "VPN automatisch verlängern",
      description: "VPN-Zugang automatisch verlängern, wenn er abläuft.",
    },
    response: {
      id: "ID",
      realm: "Realm",
      logicalId: "Logische ID",
      gatewayLogicalId: "Gateway Logische ID",
      label: "Bezeichnung",
      apiKey: "API-Schlüssel",
      platformPairingApiUrl: "Plattform-Pairing-URL",
      vpnPairingApiUrl: "VPN-Pairing-URL",
      brokerUrls: "Broker-URLs",
      orgResourceId: "Organisations-Ressourcen-ID",
      vpnKey: "VPN-Schlüssel",
      fromDateVpn: "VPN-Startdatum",
      toDateVpn: "VPN-Enddatum",
      numOfSecondsAutoRenewVpn: "VPN-Autoverlängerung (s)",
      activationDate: "Aktivierungsdatum",
      vpnValidityMonths: "VPN-Gültigkeit (Monate)",
      vpnAccountingDisabled: "VPN-Abrechnung deaktiviert",
      serialNumber: "Seriennummer",
      activationKey: "Aktivierungsschlüssel",
      used: "Verwendet",
      usedInTrial: "In Testversion verwendet",
      deleted: "Gelöscht",
      clientName: "Kundenname",
      notes: "Notizen",
      vpnOtpRequired: "VPN OTP erforderlich",
      vpnPairingMode: "VPN-Pairing-Modus",
      vpnLastAttempt: "Letzter VPN-Versuch",
    },
    widget: {
      title: "Gerätelizenz aktivieren",
      back: "Zurück",
      result: "Aktiviert",
      noResult: "Aktivierungsschlüssel eingeben, um die Lizenz zu aktivieren.",
    },
    errors: {
      validation: {
        title: "Ungültige Anfrage",
        description: "Die Aktivierungsanfrage ist fehlerhaft.",
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
          "Der API-Schlüssel hat keine Berechtigung, Gerätlizenzen zu aktivieren.",
      },
      notFound: {
        title: "Nicht gefunden",
        description:
          "Der Aktivierungsschlüssel oder die Zielressource wurde nicht gefunden.",
      },
      conflict: {
        title: "Konflikt",
        description:
          "Eine Gerätelizenz mit diesem Aktivierungsschlüssel ist bereits aktiv.",
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
      title: "Aktiviert",
      description: "Gerätelizenz erfolgreich aktiviert.",
    },
    submitButton: {
      label: "Lizenz aktivieren",
      loadingText: "Wird aktiviert...",
    },
  },
};
