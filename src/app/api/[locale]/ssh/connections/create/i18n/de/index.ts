export const translations = {
  category: "SSH",

  enums: {
    authType: {
      password: "Passwort",
      privateKey: "Privater Schlüssel (PEM)",
      keyAgent: "SSH-Agent",
    },
  },

  errors: {
    sshSecretKeyNotSet:
      "SSH_SECRET_KEY Umgebungsvariable nicht gesetzt. Fügen Sie einen 32-Byte-Hex-Wert hinzu.",
    encryptionFailed:
      "Verschlüsselung fehlgeschlagen - SSH_SECRET_KEY möglicherweise ungültig",
    noRowReturned: "Kein Datensatz von der Einfügung zurückgegeben",
  },

  post: {
    title: "SSH-Verbindung erstellen",
    description:
      "Neue SSH-Verbindung speichern. Zugangsdaten werden mit AES-256-GCM verschlüsselt.",
    fields: {
      label: {
        label: "Name",
        description:
          "Ein freundlicher Name zur Identifikation dieser Verbindung",
        placeholder: "prod-web-01",
      },
      host: {
        label: "Hostname / IP",
        description: "SSH-Server-Hostname oder IP-Adresse",
        placeholder: "192.168.1.1",
      },
      port: {
        label: "Port",
        description: "SSH-Server-Port (Standard: 22)",
        placeholder: "22",
      },
      username: {
        label: "Benutzername",
        description: "SSH-Benutzer für die Authentifizierung",
        placeholder: "deploy",
      },
      authType: {
        label: "Authentifizierungsmethode",
        description:
          "Passwort: einfaches Passwort-Login. Privater Schlüssel: PEM-Schlüsseldatei. SSH-Agent: Systemagent (SSH_AUTH_SOCK) verwenden.",
      },
      secret: {
        label: "Passwort / Privater Schlüssel",
        description:
          "Für Passwort-Auth: das Passwort. Für Privaten Schlüssel: den vollständigen PEM-Schlüssel einfügen. Für SSH-Agent: leer lassen.",
        placeholder: "",
      },
      passphrase: {
        label: "Schlüssel-Passphrase",
        description:
          "Falls der private Schlüssel mit einer Passphrase geschützt ist, hier eingeben. Leer lassen wenn unverschlüsselt.",
        placeholder: "",
      },
      isDefault: {
        label: "Als Standardverbindung setzen",
        description:
          "Diese Verbindung standardmäßig für KI-Sitzungen, Terminal und Befehle verwenden.",
      },
      notes: {
        label: "Notizen",
        description: "Optionale interne Notizen zu dieser Verbindung",
        placeholder: "VPS hinter NAT, Jump-Host erforderlich",
      },
    },
    response: {
      id: { title: "Verbindungs-ID" },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Felder prüfen und erneut versuchen",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Admin-Zugang erforderlich",
      },
      forbidden: {
        title: "Verboten",
        description: "Keine Berechtigung zum Erstellen von Verbindungen",
      },
      server: {
        title: "Serverfehler",
        description: "Verbindung konnte nicht gespeichert werden",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Ressource nicht gefunden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Unerwarteter Fehler aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben nicht gespeicherte Änderungen",
      },
      conflict: {
        title: "Name bereits vergeben",
        description: "Eine Verbindung mit diesem Namen existiert bereits",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Server konnte nicht erreicht werden",
      },
      timeout: { title: "Timeout", description: "Zeitlimit überschritten" },
    },
    success: {
      title: "Verbindung gespeichert",
      description: "SSH-Verbindung erfolgreich gespeichert",
    },
    submitButton: {
      text: "Verbindung speichern",
      loadingText: "Speichert...",
    },
  },
  widget: {
    title: "Neue SSH-Verbindung",
    createButton: "Verbindung speichern",
    creating: "Speichert...",
    testFirst: "Verbindung vor dem Speichern testen",
  },
};
