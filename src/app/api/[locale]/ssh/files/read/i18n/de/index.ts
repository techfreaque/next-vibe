export const translations = {
  category: "SSH",

  errors: {
    invalidPath: "Ungültiger Pfad: Muss absolut sein ohne '..' Segmente",
    fileNotFound: "Datei nicht gefunden",
    permissionDenied: "Zugriff verweigert",
    connectionNotFound: "Verbindung nicht gefunden",
    encryptionFailed:
      "Verschlüsselung fehlgeschlagen — SSH_SECRET_KEY möglicherweise ungültig",
    connectTimeout: "Verbindung hat Zeitlimit überschritten",
    sshAuthFailed: "SSH-Authentifizierung fehlgeschlagen",
    sshConnectionFailed: "SSH-Verbindung fehlgeschlagen",
    fingerprintMismatch:
      "Host-Fingerabdruck hat sich geändert. Möglicher MITM-Angriff. acknowledgeNewFingerprint=true setzen.",
    notImplemented: {
      fileRead: "SSH-Backend noch nicht für Dateilesen implementiert",
    },
  },

  get: {
    title: "Datei lesen",
    description: "Textdatei vom lokalen Rechner oder via SSH lesen",
    fields: {
      connectionId: {
        label: "Verbindung",
        description: "SSH-Verbindung (leer lassen für lokal)",
        placeholder: "Lokal",
      },
      path: {
        label: "Pfad",
        description: "Zu lesender Dateipfad",
        placeholder: "/etc/nginx/nginx.conf",
      },
      maxBytes: {
        label: "Max. Bytes",
        description: "Maximale Bytes zum Lesen (Standard 64 KB)",
        placeholder: "65536",
      },
      offset: {
        label: "Offset",
        description: "Byte-Offset für den Lesebeginn",
        placeholder: "0",
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
        description: "Datei konnte nicht gelesen werden",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Datei nicht gefunden",
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
      timeout: { title: "Timeout", description: "Zeitlimit überschritten" },
    },
    success: { title: "Datei gelesen", description: "Dateiinhalt abgerufen" },
  },
  widget: {
    title: "Datei-Viewer",
    editButton: "Bearbeiten",
    saveButton: "Speichern",
    cancelButton: "Abbrechen",
    truncatedWarning:
      "Datei wurde abgeschnitten. Verwenden Sie Offset, um mehr zu lesen.",
    size: "Größe",
    encoding: "Kodierung",
    loading: "Wird geladen...",
    empty: "Leere Datei",
  },
};
