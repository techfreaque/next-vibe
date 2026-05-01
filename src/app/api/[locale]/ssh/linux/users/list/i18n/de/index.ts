export const translations = {
  category: "SSH",

  errors: {
    localModeOnly: {
      title: "Nur im lokalen Modus verfügbar",
    },
    connectionNotFound: "Verbindung nicht gefunden",
    encryptionFailed:
      "Verschlüsselung fehlgeschlagen - JWT_SECRET_KEY möglicherweise ungültig",
    connectTimeout: "Verbindung hat Zeitlimit überschritten",
    sshAuthFailed: "SSH-Authentifizierung fehlgeschlagen",
    sshConnectionFailed: "SSH-Verbindung fehlgeschlagen",
    fingerprintMismatch:
      "Host-Fingerabdruck hat sich geändert. Möglicher MITM-Angriff. acknowledgeNewFingerprint=true setzen.",
  },

  get: {
    title: "Linux-Benutzer auflisten",
    description: "OS-Benutzerkonten auf dem Host auflisten (uid >= 1000)",
    fields: {
      connectionId: {
        label: "Verbindung",
        description: "SSH-Verbindung (leer lassen für lokal)",
        placeholder: "uuid",
      },
    },
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
    noUsers: "Keine Benutzer gefunden",
    confirmDelete:
      "Benutzer {username} löschen? Dies kann nicht rückgängig gemacht werden.",
  },
};
