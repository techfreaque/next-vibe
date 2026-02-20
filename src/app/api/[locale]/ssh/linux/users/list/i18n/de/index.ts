export const translations = {
  get: {
    title: "Linux-Benutzer auflisten",
    description: "OS-Benutzerkonten auf dem Host auflisten (uid >= 1000)",
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Parameter",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Admin-Zugang erforderlich",
      },
      forbidden: { title: "Verboten", description: "LOCAL_MODE erforderlich" },
      server: {
        title: "Serverfehler",
        description: "Benutzer konnten nicht aufgelistet werden",
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
      title: "Benutzer aufgelistet",
      description: "OS-Benutzer abgerufen",
    },
  },
  widget: {
    title: "Linux-Benutzer",
    createButton: "Benutzer erstellen",
    lockButton: "Sperren",
    unlockButton: "Entsperren",
    deleteButton: "Löschen",
    usernameCol: "Benutzername",
    uidCol: "UID",
    homeDirCol: "Heimverzeichnis",
    shellCol: "Shell",
    groupsCol: "Gruppen",
    statusCol: "Status",
    locked: "Gesperrt",
    active: "Aktiv",
    localModeOnly: "Nur im LOCAL_MODE verfügbar",
    confirmDelete:
      "Benutzer {username} löschen? Dies kann nicht rückgängig gemacht werden.",
  },
};
