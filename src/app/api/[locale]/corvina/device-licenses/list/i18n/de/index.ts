export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    deviceLicenses: "Gerätelizenzen",
  },
  get: {
    title: "Gerätelizenzen auflisten",
    description: "Lädt paginierte Gerätelizenzen aus der Corvina-Plattform.",
    page: {
      label: "Seite",
      description: "Nullbasierte Seitennummer.",
    },
    pageSize: {
      label: "Seitengröße",
      description: "Anzahl der Gerätelizenzen pro Seite.",
    },
    orgResourceId: {
      label: "Organisations-Ressourcen-ID",
      description: "Gerätelizenzen nach Organisations-Ressourcen-ID filtern.",
    },
    response: {
      total: "Gesamt",
      totalPages: "Seiten gesamt",
      currentPage: "Aktuelle Seite",
      deviceLicenses: {
        id: "ID",
        serialNumber: "Seriennummer",
        realm: "Bereich",
        logicalId: "Logische ID",
        label: "Bezeichnung",
        apiKey: "API-Schlüssel",
        orgResourceId: "Organisations-Ressourcen-ID",
        vpnKey: "VPN-Schlüssel",
        fromDateVpn: "VPN-Startdatum",
        toDateVpn: "VPN-Enddatum",
        numOfSecondsAutoRenewVpn: "VPN-Automatische Verlängerung (s)",
        activationDate: "Aktivierungsdatum",
        used: "Verwendet",
        deleted: "Gelöscht",
        activationKey: "Aktivierungsschlüssel",
        clientName: "Kundenname",
        notes: "Notizen",
        vpnEnabled: "VPN aktiviert",
        vpnValidityMonths: "VPN-Laufzeit (Monate)",
      },
    },
    widget: {
      title: "Gerätelizenzen",
      noItemsFound: "Keine Gerätelizenzen gefunden.",
      back: "Zurück",
      refresh: "Aktualisieren",
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
          "Der API-Schlüssel hat keine Berechtigung, Gerätelizenzen abzurufen.",
      },
      notFound: {
        title: "Nicht gefunden",
        description:
          "Keine Gerätelizenzen für die angegebenen Parameter gefunden.",
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
      title: "Erfolg",
      description: "Gerätelizenzen erfolgreich geladen.",
    },
  },
  post: {
    title: "Gerätelizenz erstellen",
    description: "Legt eine neue Gerätelizenz in der Corvina-Plattform an.",
    serialNumber: {
      label: "Seriennummer",
      description: "Seriennummer des Geräts für diese Lizenz.",
    },
    activationKey: {
      label: "Aktivierungsschlüssel",
      description: "Eindeutiger Aktivierungsschlüssel für die Gerätelizenz.",
    },
    clientName: {
      label: "Kundenname",
      description: "Name des Kunden für diese Lizenz.",
    },
    notes: {
      label: "Notizen",
      description: "Freitext-Notizen zu dieser Gerätelizenz.",
    },
    vpnEnabled: {
      label: "VPN aktiviert",
      description: "Gibt an, ob VPN für dieses Gerät aktiviert ist.",
    },
    dataEnabled: {
      label: "Datenübertragung aktiviert",
      description:
        "Gibt an, ob Datenübertragung für dieses Gerät aktiviert ist.",
    },
    vpnStartDate: {
      label: "VPN-Startdatum",
      description: "Datum, ab dem der VPN-Zugang gültig ist.",
    },
    vpnEndDate: {
      label: "VPN-Enddatum",
      description: "Datum, bis zu dem der VPN-Zugang gültig ist.",
    },
    vpnValidityMonths: {
      label: "VPN-Laufzeit (Monate)",
      description: "Anzahl der Monate, für die das VPN-Abonnement gilt.",
    },
    vpnAccountingDisabled: {
      label: "VPN-Abrechnung deaktiviert",
      description: "VPN-Nutzungsabrechnung für dieses Gerät deaktivieren.",
    },
    widget: {
      title: "Gerätelizenz erstellen",
      back: "Zurück",
      result: {
        title: "Lizenz erstellt",
      },
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
          "Der API-Schlüssel hat keine Berechtigung, Gerätelizenzen zu erstellen.",
      },
      notFound: {
        title: "Nicht gefunden",
        description:
          "Die Zielorganisation oder das Gerät wurde nicht gefunden.",
      },
      conflict: {
        title: "Konflikt",
        description:
          "Eine Gerätelizenz mit diesem Aktivierungsschlüssel existiert bereits.",
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
      title: "Erstellt",
      description: "Gerätelizenz erfolgreich erstellt.",
    },
    submitButton: {
      label: "Lizenz erstellen",
      loadingText: "Wird erstellt…",
    },
  },
};
