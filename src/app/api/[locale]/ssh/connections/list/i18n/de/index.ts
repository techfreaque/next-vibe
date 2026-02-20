export const translations = {
  get: {
    title: "SSH-Verbindungen auflisten",
    description:
      "Alle gespeicherten SSH-Verbindungen für den aktuellen Benutzer auflisten",
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Parameter",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Admin-Zugang erforderlich",
      },
      forbidden: { title: "Verboten", description: "Keine Berechtigung" },
      server: {
        title: "Serverfehler",
        description: "Verbindungen konnten nicht aufgelistet werden",
      },
      notFound: { title: "Nicht gefunden", description: "Nicht gefunden" },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Unerwarteter Fehler",
      },
      unsavedChanges: { title: "Nicht gespeicherte Änderungen" },
      conflict: { title: "Konflikt", description: "Konflikt aufgetreten" },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten",
      },
      timeout: { title: "Timeout", description: "Zeitlimit überschritten" },
    },
    success: {
      title: "Verbindungen aufgelistet",
      description: "SSH-Verbindungen abgerufen",
    },
  },
  widget: {
    title: "SSH-Verbindungen",
    addButton: "Verbindung hinzufügen",
    testButton: "Testen",
    deleteButton: "Löschen",
    emptyState:
      "Noch keine SSH-Verbindungen. Fügen Sie eine hinzu, um auf entfernte Maschinen zuzugreifen.",
    labelCol: "Name",
    hostCol: "Host",
    userCol: "Benutzer",
    authTypeCol: "Authentifizierung",
    defaultBadge: "Standard",
    testingLabel: "Wird getestet...",
    testSuccess: "Verbunden",
    testFailed: "Fehlgeschlagen",
  },
};
