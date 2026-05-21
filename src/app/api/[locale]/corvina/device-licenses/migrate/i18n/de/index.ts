export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    deviceLicenses: "Gerätlizenzen",
  },
  post: {
    title: "Gerätelizenz migrieren",
    description:
      "Migriert eine Gerätelizenz in einen neuen Realm. Nur für Master-Realm-Administratoren.",
    oldActivationKeyId: {
      label: "Alter Aktivierungsschlüssel-ID",
      description: "Die ID des zu migrierenden Aktivierungsschlüssels.",
      placeholder: "42",
    },
    newRealm: {
      label: "Neuer Realm",
      description: "Der Realm, in den die Lizenz migriert werden soll.",
      placeholder: "master",
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
      title: "Lizenz migrieren",
      back: "Zurück",
    },
    submitButton: {
      label: "Lizenz migrieren",
      loadingText: "Wird migriert...",
    },
    errors: {
      validation: {
        title: "Ungültige Anfrage",
        description:
          "Die Anfrage ist ungültig. Prüfe oldActivationKeyId und newRealm.",
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
        description: "Master-Realm-Administratorzugang erforderlich.",
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
      title: "Lizenz migriert",
      description:
        "Gerätelizenz wurde erfolgreich in den neuen Realm migriert.",
    },
  },
};
