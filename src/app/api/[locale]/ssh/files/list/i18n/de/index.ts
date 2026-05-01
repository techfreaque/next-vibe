export const translations = {
  category: "SSH",

  errors: {
    invalidPath: "Ungültiger Pfad: Muss absolut sein ohne '..' Segmente",
    directoryNotFound: "Verzeichnis nicht gefunden",
    connectionNotFound: "Verbindung nicht gefunden",
    encryptionFailed:
      "Verschlüsselung fehlgeschlagen - JWT_SECRET_KEY möglicherweise ungültig",
    connectTimeout: "Verbindung hat Zeitlimit überschritten",
    sshAuthFailed: "SSH-Authentifizierung fehlgeschlagen",
    sshConnectionFailed: "SSH-Verbindung fehlgeschlagen",
    fingerprintMismatch:
      "Host-Fingerabdruck hat sich geändert. Möglicher MITM-Angriff. acknowledgeNewFingerprint=true setzen.",
    notImplemented: {
      fileList: "SSH-Backend noch nicht für Dateiauflistung implementiert",
    },
  },

  get: {
    title: "Dateien auflisten",
    description:
      "Verzeichnisinhalt auf dem lokalen Rechner oder via SSH auflisten",
    fields: {
      connectionId: {
        label: "Verbindung",
        description: "SSH-Verbindung (leer lassen für lokal)",
        placeholder: "Lokal",
      },
      path: {
        label: "Pfad",
        description: "Aufzulistendes Verzeichnis",
        placeholder: "~",
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
      forbidden: { title: "Verboten", description: "Keine Berechtigung" },
      server: {
        title: "Serverfehler",
        description: "Verzeichnis konnte nicht aufgelistet werden",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Verzeichnis nicht gefunden",
      },
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
      timeout: {
        title: "Timeout",
        description: "Anfrage hat das Zeitlimit überschritten",
      },
    },
    success: {
      title: "Verzeichnis aufgelistet",
      description: "Verzeichnisinhalt abgerufen",
    },
  },
  widget: {
    title: "Datei-Browser",
    emptyDir: "Leeres Verzeichnis",
    loading: "Wird geladen...",
    backButton: "Zurück",
    nameCol: "Name",
    sizeCol: "Größe",
    modifiedCol: "Geändert",
    permissionsCol: "Berechtigungen",
    file: "Datei",
    directory: "Verzeichnis",
    symlink: "Symlink",
  },
};
