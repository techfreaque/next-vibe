export const translations = {
  get: {
    title: "Terminal",
    description: "Vollständiges PTY-Terminal im Browser",
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Admin-Zugang erforderlich",
      },
      server: {
        title: "Serverfehler",
        description: "Terminal nicht verfügbar",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Unerwarteter Fehler",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Es gibt nicht gespeicherte Änderungen",
      },
      notFound: { title: "Nicht gefunden", description: "Nicht gefunden" },
      conflict: { title: "Konflikt", description: "Konflikt aufgetreten" },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Parameter",
      },
      forbidden: { title: "Verboten", description: "Keine Berechtigung" },
    },
    success: {
      title: "Terminal bereit",
      description: "Terminal-Sitzung geöffnet",
    },
  },
  widget: {
    title: "Terminal",
    connectButton: "Verbinden",
    disconnectButton: "Trennen",
    localLabel: "Lokal (aktueller Benutzer)",
    connectionLabel: "Verbindung",
    connecting: "Verbindet...",
    connected: "Verbunden",
    disconnected: "Getrennt",
    sessionError: "Sitzungsfehler",
    connectPrompt:
      "Klicken Sie auf Verbinden, um eine Terminalsitzung zu starten.\n",
    prompt: "$ ",
    inputPlaceholder: "Befehl eingeben und Enter drücken...",
  },
};
