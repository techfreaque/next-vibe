export const translations = {
  title: "IMAP-Konto erstellen",
  description: "Ein neues IMAP-Konto für E-Mail-Verwaltung erstellen",
  category: "IMAP-Verwaltung",
  tags: {
    create: "Erstellen",
  },
  container: {
    title: "Neues IMAP-Konto",
    description: "Ein neues IMAP-Konto für E-Mail-Synchronisation konfigurieren",
  },
  name: {
    label: "Kontoname",
    description: "Anzeigename für das IMAP-Konto",
    placeholder: "Kontoname eingeben",
  },
  email: {
    label: "E-Mail-Adresse",
    description: "E-Mail-Adresse für das IMAP-Konto",
    placeholder: "benutzer@beispiel.de",
  },
  host: {
    label: "IMAP-Server-Host",
    description: "IMAP-Server-Hostname oder IP-Adresse",
    placeholder: "imap.beispiel.de",
  },
  port: {
    label: "IMAP-Server-Port",
    description: "IMAP-Server-Port-Nummer (typischerweise 143 oder 993)",
    placeholder: "993",
  },
  secure: {
    label: "Sichere Verbindung verwenden",
    description: "SSL/TLS-Verschlüsselung für die Verbindung aktivieren",
    placeholder: "true",
  },
  username: {
    label: "Benutzername",
    description: "Benutzername für IMAP-Authentifizierung",
    placeholder: "Benutzername eingeben",
  },
  password: {
    label: "Passwort",
    description: "Passwort für IMAP-Authentifizierung",
    placeholder: "Passwort eingeben",
  },
  authMethod: {
    label: "Authentifizierungsmethode",
    description: "Für IMAP-Authentifizierung verwendete Methode",
    placeholder: "Authentifizierungsmethode auswählen",
  },
  connectionTimeout: {
    label: "Verbindungs-Timeout",
    description: "Verbindungs-Timeout in Millisekunden",
    placeholder: "30000",
  },
  keepAlive: {
    label: "Verbindung aufrechterhalten",
    description: "Verbindung zwischen Anfragen aufrechterhalten",
  },
  enabled: {
    label: "Konto aktiviert",
    description: "Dieses IMAP-Konto aktivieren oder deaktivieren",
  },
  syncInterval: {
    label: "Synchronisationsintervall",
    description: "Synchronisationsintervall in Sekunden",
    placeholder: "300",
  },
  maxMessages: {
    label: "Maximale Nachrichten",
    description: "Maximale Anzahl der zu synchronisierenden Nachrichten",
    placeholder: "1000",
  },
  syncFolders: {
    label: "Synchronisierte Ordner",
    description: "Zu synchronisierende Ordner (kommagetrennt)",
    placeholder: "INBOX, Gesendet, Entwürfe",
  },
  response: {
    title: "Erstelltes Konto",
    description: "IMAP-Konto Erstellungsantwort",

    accountSummary: {
      title: "Kontozusammenfassung",
      description: "Grundlegende Kontoinformationen",
    },

    connectionDetails: {
      title: "Verbindungsdetails",
      description: "IMAP-Server-Verbindungseinstellungen",
    },

    syncConfiguration: {
      title: "Synchronisationskonfiguration",
      description: "E-Mail-Synchronisationseinstellungen",
    },

    id: {
      title: "Konto-ID",
      label: "ID",
    },
    name: {
      title: "Kontoname",
      label: "Name",
    },
    email: {
      title: "E-Mail-Adresse",
      label: "E-Mail",
    },
    host: {
      title: "IMAP-Server-Host",
      label: "Host",
    },
    port: {
      title: "IMAP-Server-Port",
      label: "Port",
    },
    secure: {
      title: "Sichere Verbindung",
      label: "Sicher",
    },
    username: {
      title: "Benutzername",
      label: "Benutzername",
    },
    authMethod: {
      title: "Authentifizierungsmethode",
      label: "Auth-Methode",
    },
    connectionTimeout: {
      title: "Verbindungs-Timeout (ms)",
      label: "Timeout",
    },
    keepAlive: {
      title: "Verbindung aufrechterhalten",
      label: "Keep Alive",
    },
    enabled: {
      title: "Konto aktiviert",
      label: "Aktiviert",
    },
    syncStatus: {
      title: "Synchronisationsstatus",
      label: "Status",
    },
    syncInterval: {
      title: "Synchronisationsintervall (Sekunden)",
      label: "Intervall",
    },
    maxMessages: {
      title: "Maximale Nachrichten",
      label: "Max Nachrichten",
    },
    syncFolders: {
      title: "Synchronisierte Ordner",
      label: "Ordner",
    },
    lastSyncAt: "Letzte Synchronisation",
    syncError: "Synchronisationsfehler",
    isConnected: "Verbindungsstatus",
    createdAt: "Erstellt am",
    updatedAt: "Aktualisiert am",
  },
  errors: {
    validation: {
      title: "Validierungsfehler",
      description: "Ungültige Parameter angegeben",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Authentifizierung erforderlich",
    },
    conflict: {
      title: "Konfliktfehler",
      description: "Konto mit dieser Konfiguration existiert bereits",
    },
    server: {
      title: "Serverfehler",
      description: "Interner Serverfehler aufgetreten",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unerwarteter Fehler ist aufgetreten",
    },
    forbidden: {
      title: "Verboten",
      description: "Zugriff verweigert",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Netzwerkverbindung fehlgeschlagen",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Ressource nicht gefunden",
    },
    unsavedChanges: {
      title: "Ungespeicherte Änderungen",
      description: "Es gibt ungespeicherte Änderungen",
    },
  },
  success: {
    title: "Erfolg",
    description: "IMAP-Konto erfolgreich erstellt",
  },
};
