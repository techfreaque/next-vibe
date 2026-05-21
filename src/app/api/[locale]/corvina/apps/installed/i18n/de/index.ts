export const translations = {
  tags: {
    corvina: "Corvina",
    apps: "Apps",
  },
  get: {
    title: "Installierte Apps",
    description:
      "Alle in einer Corvina-Organisation installierten Apps anzeigen.",
    organizationId: {
      label: "Organisations-ID",
      description: "Numerische ID der Corvina-Organisation.",
    },
    response: {
      title: "Installierte Apps",
      description: "In der Organisation installierte Apps.",
      installs: {
        title: "Installationen",
        description: "Eine Zeile pro installierter App.",
        id: "Installations-ID",
        status: "Status",
        appKey: "App-Schlüssel",
        appName: "App-Name",
        manifestFrom: "Quelle",
        planId: "Plan",
        autoRenewActive: "Auto-Verlängerung",
        freeTrial: "Testphase",
        serviceAccountUsername: "Dienstkonto",
        createdAt: "Installiert am",
        updatedAt: "Aktualisiert am",
      },
      total: "Gesamt",
      totalPages: "Seiten",
      currentPage: "Aktuelle Seite",
    },
    widget: {
      title: "Installierte Apps",
      noInstallsFound: "Keine Apps in dieser Organisation installiert",
      back: "Zurück",
      uninstall: "Deinstallieren",
      loadButton: "Laden",
      trialBadge: "Testphase",
      autoRenewBadge: "Auto-Verlängerung",
      orgLabel: "Org",
      orgIdPlaceholder: "Organisations-ID",
      appStore: "App-Store",
      installApp: "Eigene App installieren",
      source: {
        store: "Store",
        custom: "Benutzerdefiniert",
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
        description: "Der API-Schlüssel hat keine Berechtigung.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Organisation nicht gefunden.",
      },
      conflict: {
        title: "Konflikt",
        description: "Corvina meldete einen Konflikt.",
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
      description: "Installierte Apps erfolgreich abgerufen.",
    },
  },
};
