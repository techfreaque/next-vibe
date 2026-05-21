export const translations = {
  tags: {
    corvina: "Corvina",
    apps: "Apps",
  },
  post: {
    title: "Corvina App installieren",
    description:
      "Eine Anwendung per Manifest oder Store-ID in einer Corvina-Organisation installieren.",
    organizationId: {
      label: "Organisations-ID",
      description: "Numerische ID der Ziel-Corvina-Organisation.",
      placeholder: "45511",
    },
    manifest: {
      label: "App-Manifest (JSON)",
      description:
        "Vollständigen Inhalt der corvina-manifest.json einfügen. Wird ignoriert, wenn App-ID gesetzt.",
      placeholder:
        '{"key": "my-app", "name": {"value": "Meine App"}, "baseUrl": "https://..."}',
    },
    appId: {
      label: "App-ID (optional)",
      description: "Vorhandene Store-App statt eigenem Manifest verwenden.",
      placeholder: "123",
    },
    planId: {
      label: "Plan-ID (optional)",
      description: "Zahlungsplan-ID für kostenpflichtige Apps.",
      placeholder: "planId1",
    },
    submitButton: {
      label: "App installieren",
      loadingText: "Wird installiert...",
    },
    response: {
      title: "Installationsergebnis",
      description: "Details der installierten Anwendung.",
      id: "Installations-ID",
      status: "Status",
      appKey: "App-Schlüssel",
      appName: "App-Name",
      serviceAccountUsername: "Dienstkonto",
      createdAt: "Installiert am",
      manifestFrom: "Quelle",
    },
    widget: {
      title: "Corvina App installieren",
      orgLabel: "Organisation",
      manifestLabel: "App-Manifest",
      manifestLoading: "Manifest wird geladen…",
      jsonPlaceholder: "Inhalt der corvina-manifest.json hier einfügen",
      success: "App erfolgreich installiert",
      errorDetail:
        "Installation fehlgeschlagen – Manifest-Struktur und Organisations-ID prüfen.",
      resultTitle: "Installation gestartet",
      appLabel: "App",
      statusLabel: "Status",
      serviceAccountLabel: "Dienstkonto",
      installIdLabel: "Installations-ID",
      installedAtLabel: "Installiert am",
      appStore: "App-Store",
      installedApps: "Installierte Apps",
    },
    errors: {
      validation: {
        title: "Ungültiges Manifest",
        description: "Das Manifest-JSON ist ungültig oder fehlt Pflichtfelder.",
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
          "Der API-Schlüssel hat keine Berechtigung, Apps zu installieren.",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Organisation nicht gefunden.",
      },
      conflict: {
        title: "Bereits installiert",
        description: "Diese App ist in der Organisation bereits installiert.",
      },
      server: {
        title: "Serverfehler",
        description:
          "Corvina hat einen Serverfehler zurückgegeben. Manifest prüfen.",
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
      title: "App installiert",
      description: "Die Anwendung wurde erfolgreich installiert.",
    },
  },
};
