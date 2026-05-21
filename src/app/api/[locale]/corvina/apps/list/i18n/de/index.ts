export const translations = {
  category: "Corvina",
  tags: {
    corvina: "Corvina",
    apps: "Apps",
  },
  get: {
    title: "App-Marktplatz",
    description:
      "Alle verfügbaren Anwendungen im Corvina-Marktplatz durchsuchen.",
    response: {
      title: "Anwendungen",
      description: "Alle im Marktplatz verfügbaren Apps.",
      apps: {
        title: "Apps",
        description: "Eine Zeile pro Marktplatz-App.",
        appDescription: "Beschreibung",
        id: "ID",
        key: "Schlüssel",
        name: "Name",
        status: "Status",
        coverImageUrl: "Titelbild",
        iconUrl: "Symbol",
        version: "Version",
      },
      total: "Gesamt",
      totalPages: "Seiten",
      currentPage: "Aktuelle Seite",
    },
    widget: {
      title: "Corvina App-Marktplatz",
      noAppsFound: "Keine Apps im Marktplatz gefunden",
      install: "Installieren",
      search: "Apps suchen...",
      installedApps: "Installierte Apps",
      installApp: "Eigene App installieren",
    },
    enums: {
      appStoreStatus: {
        active: "Aktiv",
        underEvaluation: "In Prüfung",
      },
      installStatus: {
        installation: "Wird installiert",
        installed: "Installiert",
        installationFailed: "Installation fehlgeschlagen",
        uninstallation: "Wird deinstalliert",
        uninstalled: "Deinstalliert",
        uninstallationFailed: "Deinstallation fehlgeschlagen",
        manualUpgradable: "Update verfügbar",
        freeTrial: "Kostenlose Testphase",
        paymentRequired: "Zahlung erforderlich",
      },
    },
    errors: {
      validation: {
        title: "Ungültige Anfrage",
        description: "Die Anfrage an Corvina war fehlerhaft.",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Corvina API nicht erreichbar.",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Corvina hat den API-Schlüssel abgelehnt.",
      },
      forbidden: {
        title: "Verboten",
        description:
          "Der API-Schlüssel hat keine Berechtigung zum Auflisten von Apps.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Apps unter diesem Pfad gefunden.",
      },
      conflict: {
        title: "Konflikt",
        description: "Corvina meldete einen Konflikt beim Abrufen von Apps.",
      },
      server: {
        title: "Serverfehler",
        description: "Die Corvina API hat einen internen Fehler zurückgegeben.",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Es gibt nicht gespeicherte Änderungen.",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten.",
      },
    },
    success: {
      title: "Erfolgreich",
      description: "Apps erfolgreich abgerufen.",
    },
  },
};
