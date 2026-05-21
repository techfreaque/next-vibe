export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    deviceLicenses: "Gerätelizenzen",
  },
  put: {
    title: "Gerätelizenz aktualisieren",
    description:
      "Aktualisiert Seriennummer, Clientname, Notizen und VPN-Einstellungen einer Gerätelizenz.",
    deviceLicenseId: {
      label: "Gerätelizenz-ID",
      description: "Numerische Gerätelizenz-ID.",
    },
    serialNumber: {
      label: "Seriennummer",
      description: "Hardware-Seriennummer des Geräts.",
    },
    clientName: {
      label: "Clientname",
      description: "Name des Clients, dem diese Gerätelizenz gehört.",
    },
    notes: {
      label: "Notizen",
      description: "Freitextnotizen zu dieser Gerätelizenz.",
    },
    vpnStartDate: {
      label: "VPN-Startdatum",
      description: "Datum, ab dem der VPN-Zugang gilt.",
    },
    vpnEndDate: {
      label: "VPN-Enddatum",
      description: "Datum, an dem der VPN-Zugang abläuft.",
    },
    vpnValidityMonths: {
      label: "VPN-Gültigkeit (Monate)",
      description: "Anzahl der Monate, für die der VPN-Zugang gilt.",
    },
    vpnAccountingDisabled: {
      label: "VPN-Abrechnung deaktivieren",
      description: "Wenn aktiviert, wird die VPN-Nutzung nicht erfasst.",
    },
    response: {
      id: "ID",
      realm: "Realm",
      logicalId: "Logische ID",
      gatewayLogicalId: "Gateway-Logische-ID",
      label: "Bezeichnung",
      apiKey: "API-Schlüssel",
      platformPairingApiUrl: "Plattform-Pairing-API-URL",
      vpnPairingApiUrl: "VPN-Pairing-API-URL",
      brokerUrls: "Broker-URLs",
      orgResourceId: "Organisations-Ressourcen-ID",
      vpnKey: "VPN-Schlüssel",
      fromDateVpn: "VPN ab",
      toDateVpn: "VPN bis",
      numOfSecondsAutoRenewVpn: "VPN Automatisch verlängern (Sekunden)",
      activationDate: "Aktivierungsdatum",
      vpnValidityMonths: "VPN-Gültigkeit (Monate)",
      vpnAccountingDisabled: "VPN-Abrechnung deaktiviert",
      serialNumber: "Seriennummer",
      activationKey: "Aktivierungsschlüssel",
      used: "In Verwendung",
      usedInTrial: "In Testversion verwendet",
      deleted: "Gelöscht",
      clientName: "Clientname",
      notes: "Notizen",
      vpnOtpRequired: "VPN-OTP erforderlich",
      vpnPairingMode: "VPN-Pairing-Modus",
      vpnLastAttempt: "Letzter VPN-Versuch",
    },
    errors: {
      validation: {
        title: "Ungültige Anfrage",
        description: "Die Anfrage an Corvina war fehlerhaft.",
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
          "Der API-Schlüssel hat keine Berechtigung zum Aktualisieren von Gerätelizenzen.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Gerätelizenz mit dieser ID gefunden.",
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
      title: "Aktualisiert",
      description: "Gerätelizenz erfolgreich aktualisiert.",
    },
    submitButton: {
      label: "Änderungen speichern",
      loadingText: "Wird gespeichert...",
    },
    widget: {
      back: "Zurück",
    },
  },
  delete: {
    title: "Gerätelizenz löschen",
    description: "Löscht eine Gerätelizenz anhand der ID dauerhaft.",
    deviceLicenseId: {
      label: "Gerätelizenz-ID",
      description: "Numerische Gerätelizenz-ID zum Löschen.",
    },
    deleteOrgResourceId: {
      label: "Organisations-Ressourcen-ID",
      description: "Löschung auf eine bestimmte Organisation einschränken.",
    },
    errors: {
      validation: {
        title: "Ungültige Anfrage",
        description: "Die Anfrage an Corvina war fehlerhaft.",
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
          "Der API-Schlüssel hat keine Berechtigung zum Löschen von Gerätelizenzen.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Gerätelizenz mit dieser ID gefunden.",
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
      title: "Gelöscht",
      description: "Gerätelizenz erfolgreich gelöscht.",
    },
    submitButton: {
      label: "Gerätelizenz löschen",
      loadingText: "Wird gelöscht...",
    },
    widget: {
      back: "Zurück",
      deletedDevice: "Gelöschtes Gerät",
      activationKey: "Aktivierungsschlüssel",
    },
  },
};
