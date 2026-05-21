export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    notifications: "Benachrichtigungen",
  },
  post: {
    title: "Benachrichtigung testen",
    description:
      "Sendet eine Test-Benachrichtigungs-E-Mail für eine Organisation.",
    orgId: {
      label: "Organisations-ID",
      description: "Numerische Corvina-Organisations-ID.",
    },
    type: {
      label: "Benachrichtigungstyp",
      description: "Der Typ der zu testenden Benachrichtigung.",
    },
    emailTo: {
      label: "E-Mail an",
      description: "Empfänger-E-Mail-Adresse für die Testbenachrichtigung.",
      placeholder: "empfaenger@beispiel.de",
    },
    emailBcc: {
      label: "E-Mail BCC",
      description: "BCC-E-Mail-Adresse für die Testbenachrichtigung.",
      placeholder: "bcc@beispiel.de",
    },
    subject: {
      label: "Betreff",
      description: "Benutzerdefinierter Betreff für die Test-E-Mail.",
      placeholder: "Testbenachrichtigung",
    },
    response: {
      message: "Meldung",
    },
    enums: {
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
          "Der API-Schlüssel hat keinen Zugriff zum Senden von Testbenachrichtigungen.",
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
      title: "Gesendet",
      description: "Testbenachrichtigung erfolgreich gesendet.",
    },
    submitButton: {
      label: "Test senden",
      loadingText: "Wird gesendet...",
    },
  },
};
