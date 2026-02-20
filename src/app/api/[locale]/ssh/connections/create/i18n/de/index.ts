export const translations = {
  post: {
    title: "SSH-Verbindung erstellen",
    description: "Neue SSH-Verbindungskonfiguration speichern",
    fields: {
      label: {
        label: "Name",
        description: "Freundlicher Name für diese Verbindung",
        placeholder: "prod-web-01",
      },
      host: {
        label: "Host",
        description: "SSH-Server-Hostname oder IP",
        placeholder: "192.168.1.1",
      },
      port: { label: "Port", description: "SSH-Port", placeholder: "22" },
      username: {
        label: "Benutzername",
        description: "SSH-Benutzername",
        placeholder: "deploy",
      },
      authType: {
        label: "Authentifizierungstyp",
        description: "Authentifizierungsmethode",
        placeholder: "",
      },
      secret: {
        label: "Geheimnis",
        description: "Passwort oder PEM-Privatschlüssel",
        placeholder: "",
      },
      passphrase: {
        label: "Passphrase",
        description: "Passphrase für PEM-Schlüssel (falls verschlüsselt)",
        placeholder: "",
      },
      isDefault: {
        label: "Standardverbindung",
        description: "Als Standard für KI-Sitzungen verwenden",
        placeholder: "",
      },
      notes: {
        label: "Notizen",
        description: "Optionale Notizen zu dieser Verbindung",
        placeholder: "",
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
        description: "Verbindung konnte nicht erstellt werden",
      },
      notFound: { title: "Nicht gefunden", description: "Nicht gefunden" },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Unerwarteter Fehler",
      },
      unsavedChanges: { title: "Nicht gespeicherte Änderungen" },
      conflict: {
        title: "Konflikt",
        description: "Verbindung mit diesem Namen existiert bereits",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten",
      },
      timeout: { title: "Timeout", description: "Zeitlimit überschritten" },
    },
    success: {
      title: "Verbindung erstellt",
      description: "SSH-Verbindung erfolgreich gespeichert",
    },
  },
  widget: {
    title: "Neue SSH-Verbindung",
    createButton: "Verbindung speichern",
    creating: "Speichert...",
    testFirst: "Verbindung vor dem Speichern testen",
  },
};
