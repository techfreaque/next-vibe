export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    deviceLicenses: "Gerätlizenzen",
  },
  put: {
    title: "VPN-Autoverlängerung verwalten",
    description:
      "Aktiviert oder deaktiviert die VPN-Autoverlängerung für eine Gerätelizenz und konfiguriert den Verlängerungszeitraum.",
    logicalId: {
      label: "Logische ID",
      description:
        "Die logische ID des Geräts, für das die VPN-Autoverlängerung aktualisiert werden soll.",
      placeholder: "device-logical-id",
    },
    orgResourceId: {
      label: "Organisations-Ressourcen-ID",
      description:
        "Die Organisation, in der die Aktualisierung durchgeführt werden soll.",
      placeholder: "org.resource.id",
    },
    numOfSeconds: {
      label: "Dauer (Sekunden)",
      description: "Anzahl der Sekunden für jeden VPN-Verlängerungszeitraum.",
      placeholder: "2592000",
    },
    autorenew: {
      label: "Autoverlängerung aktiviert",
      description: "Ob VPN automatisch verlängert wird, wenn es abläuft.",
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
      title: "VPN-Autoverlängerung",
      back: "Zurück",
    },
    submitButton: {
      label: "Autoverlängerung aktualisieren",
      loadingText: "Wird aktualisiert...",
    },
    errors: {
      validation: {
        title: "Ungültige Anfrage",
        description:
          "Die Anfrage ist ungültig. Prüfe logicalId und numOfSeconds.",
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
        description: "Keine Berechtigung zur Verwaltung des Geräte-VPN.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Gerätelizenz nicht gefunden.",
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
      title: "Autoverlängerung aktualisiert",
      description:
        "VPN-Autoverlängerungseinstellungen erfolgreich aktualisiert.",
    },
  },
};
