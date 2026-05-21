export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    organizations: "Organisationen",
    realmSettings: "Realm-Einstellungen",
  },
  get: {
    title: "Realm-Einstellungen abrufen",
    description: "Ruft die Realm-Konfigurationstiefen einer Organisation ab.",
    orgId: {
      label: "Organisations-ID",
      description: "Numerische Corvina-Organisations-ID.",
    },
    response: {
      configDealerMaxDepth: "Max. Händlertiefe",
      configHostnameMaxDepth: "Max. Hostname-Tiefe",
      configOwnResourcesMaxDepth: "Max. Tiefe eigener Ressourcen",
      configIotMaxDepth: "Max. IoT-Tiefe",
      configVpnMaxDepth: "Max. VPN-Tiefe",
      configStoreMaxDepth: "Max. Shop-Tiefe",
      configIpFilteringMaxDepth: "Max. IP-Filtertiefe",
      configPrivateAccessMaxDepth: "Max. Tiefe Privatzugriff",
    },
    errors: {
      validation: {
        title: "Ungültige Anfrage",
        description: "Die Anfrage war fehlerhaft.",
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
        description: "Kein Zugriff auf Realm-Einstellungen.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Organisation mit dieser ID.",
      },
      conflict: {
        title: "Konflikt",
        description: "Corvina meldet einen Konflikt.",
      },
      server: {
        title: "Serverfehler",
        description: "Corvina hat einen Serverfehler gemeldet.",
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
      description: "Realm-Einstellungen erfolgreich geladen.",
    },
  },
  put: {
    title: "Realm-Einstellungen aktualisieren",
    description:
      "Aktualisiert die Realm-Konfigurationstiefen einer Organisation.",
    orgId: {
      label: "Organisations-ID",
      description: "Numerische Corvina-Organisations-ID.",
    },
    configDealerMaxDepth: {
      label: "Max. Händlertiefe",
      description: "Maximale Tiefe der Händlerhierarchie.",
    },
    configHostnameMaxDepth: {
      label: "Max. Hostname-Tiefe",
      description: "Maximale Tiefe der Hostname-Hierarchie.",
    },
    configOwnResourcesMaxDepth: {
      label: "Max. Tiefe eigener Ressourcen",
      description: "Maximale Tiefe eigener Ressourcen.",
    },
    configIotMaxDepth: {
      label: "Max. IoT-Tiefe",
      description: "Maximale Tiefe für IoT-Geräte.",
    },
    configVpnMaxDepth: {
      label: "Max. VPN-Tiefe",
      description: "Maximale Tiefe der VPN-Konfiguration.",
    },
    configStoreMaxDepth: {
      label: "Max. Shop-Tiefe",
      description: "Maximale Tiefe der Shop-Hierarchie.",
    },
    configIpFilteringMaxDepth: {
      label: "Max. IP-Filtertiefe",
      description: "Maximale Tiefe der IP-Filterregeln.",
    },
    configPrivateAccessMaxDepth: {
      label: "Max. Tiefe Privatzugriff",
      description: "Maximale Tiefe für Privatzugriff.",
    },
    response: {
      configDealerMaxDepth: "Max. Händlertiefe",
      configHostnameMaxDepth: "Max. Hostname-Tiefe",
      configOwnResourcesMaxDepth: "Max. Tiefe eigener Ressourcen",
      configIotMaxDepth: "Max. IoT-Tiefe",
      configVpnMaxDepth: "Max. VPN-Tiefe",
      configStoreMaxDepth: "Max. Shop-Tiefe",
      configIpFilteringMaxDepth: "Max. IP-Filtertiefe",
      configPrivateAccessMaxDepth: "Max. Tiefe Privatzugriff",
    },
    submitButton: {
      label: "Einstellungen speichern",
      loadingText: "Speichern…",
    },
    errors: {
      validation: {
        title: "Ungültige Aktualisierung",
        description: "Corvina hat die Aktualisierung abgelehnt.",
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
        description: "Kein Schreibzugriff auf Realm-Einstellungen.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Organisation mit dieser ID.",
      },
      conflict: {
        title: "Konflikt",
        description: "Corvina meldet einen Konflikt.",
      },
      server: {
        title: "Serverfehler",
        description: "Corvina hat einen Serverfehler gemeldet.",
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
      title: "Gespeichert",
      description: "Realm-Einstellungen erfolgreich aktualisiert.",
    },
  },
};
