import type { translations as enTranslations } from "../en";
export const translations: typeof enTranslations = {
  category: "SSH",

  enums: {
    authType: {
      password: "Passwort",
      privateKey: "Privater Schlüssel (PEM)",
      keyAgent: "SSH-Agent",
      local: "Lokaler Rechner",
    },
  },

  get: {
    title: "Verbindungen",
    titleShort: "Verbindungen",
    description:
      "Alle erreichbaren Maschinen — lokale Shell, SSH-Server und Remote-Instanzen",
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
      description: "Alle Maschinenverbindungen abgerufen",
    },
    response: {
      connections: {
        title: "Verbindungen",
      },
    },
  },
  widget: {
    title: "Verbindungen",
    back: "Zurück",
    addSsh: "SSH hinzufügen",
    connectRemote: "Remote verbinden",
    openTerminal: "Terminal",
    viewRemote: "Details",
    defaultBadge: "Standard",
    localType: "Lokal",
    sshType: "SSH",
    remoteType: "Remote",
    healthHealthy: "Verbunden",
    healthWarning: "Langsam",
    healthCritical: "Nicht erreichbar",
    healthDisconnected: "Offline",
    noConnections: "Keine Maschinen konfiguriert",
    noConnectionsHint:
      "SSH-Verbindung hinzufügen oder Remote-Instanz verbinden.",
    emptyState:
      "Noch keine Verbindungen. Fügen Sie eine hinzu, um auf entfernte Maschinen zuzugreifen.",
  },
};
