export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    notifications: "Benachrichtigungen",
  },
  get: {
    title: "Benachrichtigungskonfigurationen auflisten",
    description:
      "Listet alle Benachrichtigungskonfigurationen einer Corvina-Organisation auf.",
    orgId: {
      label: "Organisations-ID",
      description: "Numerische Corvina-Organisations-ID.",
    },
    page: {
      label: "Seite",
      description: "Nullbasierte Seitenzahl.",
    },
    pageSize: {
      label: "Seitengröße",
      description: "Anzahl der Konfigurationen pro Seite (max. 100).",
    },
    response: {
      configs: {
        id: "ID",
        organizationId: "Organisations-ID",
        event: "Ereignis",
        beforeDays: "Tage vorher",
        afterDays: "Tage nachher",
        emailBcc: "E-Mail BCC",
        lastCheck: "Letzte Prüfung",
      },
      totalElements: "Konfigurationen gesamt",
      totalPages: "Seiten gesamt",
      last: "Letzte Seite",
    },
    widget: {
      title: "Benachrichtigungskonfigurationen",
      emptyState: "Keine Benachrichtigungskonfigurationen gefunden.",
      labels: {
        bcc: "bcc",
        before: "vorher",
        after: "nachher",
      },
    },
    enums: {
      notificationEvent: {
        standardLicenseExpiration: "Standard-Lizenz läuft ab",
        plusLicenseExpiration: "Plus-Lizenz läuft ab",
        trialLicenseExpiration: "Testlizenz läuft ab",
        vpnConsumptionsLevel0: "VPN-Verbrauch Stufe 0",
        vpnConsumptionsLevel1: "VPN-Verbrauch Stufe 1",
        vpnConsumptionsLevel2: "VPN-Verbrauch Stufe 2",
        vpnConsumptionsLevel3: "VPN-Verbrauch Stufe 3",
        iotConsumptionsLevel0: "IoT-Verbrauch Stufe 0",
        iotConsumptionsLevel1: "IoT-Verbrauch Stufe 1",
        iotConsumptionsLevel2: "IoT-Verbrauch Stufe 2",
        iotConsumptionsLevel3: "IoT-Verbrauch Stufe 3",
      },
      notificationMailEventType: {
        alarmNotification: "Alarmbenachrichtigung",
        userCreation: "Benutzererstellung",
        standardLicenseExpiration: "Standard-Lizenz läuft ab",
        plusLicenseExpiration: "Plus-Lizenz läuft ab",
        trialLicenseExpiration: "Testlizenz läuft ab",
        standardLicenseExpired: "Standard-Lizenz abgelaufen",
        plusLicenseExpired: "Plus-Lizenz abgelaufen",
        trialLicenseExpired: "Testlizenz abgelaufen",
        vpnCreditsConsumptions: "VPN-Guthaben Verbrauch",
        vpnCreditsConsumptionsOver: "VPN-Guthaben überschritten",
        iotCreditsConsumptions: "IoT-Guthaben Verbrauch",
        iotCreditsConsumptionsOver: "IoT-Guthaben überschritten",
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
          "Der API-Schlüssel hat keinen Zugriff auf die Konfigurationsliste.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Organisation mit dieser ID gefunden.",
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
      description: "Benachrichtigungskonfigurationen erfolgreich geladen.",
    },
  },
  post: {
    title: "Benachrichtigungskonfiguration erstellen",
    description:
      "Erstellt eine neue Benachrichtigungskonfiguration für eine Organisation.",
    orgId: {
      label: "Organisations-ID",
      description: "Numerische Corvina-Organisations-ID.",
    },
    event: {
      label: "Ereignis",
      description: "Der Typ des Benachrichtigungsereignisses.",
    },
    beforeDays: {
      label: "Tage vorher",
      description: "Benachrichtigung so viele Tage vor dem Ereignis auslösen.",
    },
    afterDays: {
      label: "Tage nachher",
      description: "Benachrichtigung so viele Tage nach dem Ereignis auslösen.",
    },
    emailBcc: {
      label: "E-Mail BCC",
      description: "Zusätzliche BCC-E-Mail-Adresse für Benachrichtigungen.",
      placeholder: "bcc@beispiel.de",
    },
    response: {
      id: "ID",
      organizationId: "Organisations-ID",
      event: "Ereignis",
      beforeDays: "Tage vorher",
      afterDays: "Tage nachher",
      emailBcc: "E-Mail BCC",
      lastCheck: "Letzte Prüfung",
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
          "Der API-Schlüssel hat keinen Zugriff zum Erstellen von Konfigurationen.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Organisation mit dieser ID gefunden.",
      },
      conflict: {
        title: "Konflikt",
        description:
          "Eine Konfiguration für dieses Ereignis existiert bereits.",
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
      description: "Benachrichtigungskonfiguration erfolgreich erstellt.",
    },
    submitButton: {
      label: "Konfiguration erstellen",
      loadingText: "Wird erstellt...",
    },
  },
};
