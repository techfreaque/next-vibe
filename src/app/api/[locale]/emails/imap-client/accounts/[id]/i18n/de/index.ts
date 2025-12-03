export const translations = {
  get: {
    title: "IMAP-Konto abrufen",
    description: "Ein spezifisches IMAP-Konto anhand der ID abrufen",
    container: {
      title: "IMAP-Konto Details",
      description: "IMAP-Konto-Informationen anzeigen und verwalten",
    },
    id: {
      label: "Konto-ID",
      description: "Eindeutige Kennung für das IMAP-Konto",
    },
    response: {
      account: {
        title: "IMAP-Konto Informationen",
        description: "Detaillierte Informationen über das IMAP-Konto",
        id: "Konto-ID",
        name: "Kontoname",
        email: "E-Mail-Adresse",
        host: "IMAP-Server-Host",
        port: "IMAP-Server-Port",
        secure: "Sichere Verbindung",
        username: "Benutzername",
        authMethod: "Authentifizierungsmethode",
        connectionTimeout: "Verbindungs-Timeout (ms)",
        keepAlive: "Verbindung aufrechterhalten",
        enabled: "Konto aktiviert",
        syncInterval: "Synchronisationsintervall (Sekunden)",
        maxMessages: "Maximale Nachrichten",
        syncFolders: "Synchronisierte Ordner",
        lastSyncAt: "Letzte Synchronisation",
        syncStatus: "Synchronisationsstatus",
        syncError: "Synchronisationsfehler",
        createdAt: "Erstellt am",
        updatedAt: "Aktualisiert am",
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Konto-ID angegeben",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Sie haben keine Berechtigung, auf dieses Konto zuzugreifen",
      },
      notFound: {
        title: "Konto nicht gefunden",
        description: "Das angeforderte IMAP-Konto konnte nicht gefunden werden",
      },
      server: {
        title: "Serverfehler",
        description: "Ein interner Serverfehler ist aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      conflict: {
        title: "Konfliktfehler",
        description:
          "Ein Konflikt ist bei der Verarbeitung der Anfrage aufgetreten",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff auf diese Ressource ist verboten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Ein Netzwerkfehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen",
      },
    },
    success: {
      title: "Erfolg",
      description: "IMAP-Konto erfolgreich abgerufen",
    },
  },
  post: {
    title: "IMAP-Konto aktualisieren",
    description: "Ein bestehendes IMAP-Konto aktualisieren",
    form: {
      title: "Konto-Konfiguration aktualisieren",
      description: "IMAP-Konto-Parameter konfigurieren",
      name: {
        label: "Kontoname",
        description: "Anzeigename für das IMAP-Konto",
      },
      email: {
        label: "E-Mail-Adresse",
        description: "E-Mail-Adresse für das IMAP-Konto",
      },
      host: {
        label: "IMAP-Server-Host",
        description: "IMAP-Server-Hostname oder IP-Adresse",
      },
      port: {
        label: "IMAP-Server-Port",
        description: "IMAP-Server-Port-Nummer (typischerweise 143 oder 993)",
      },
      secure: {
        label: "Sichere Verbindung verwenden",
        description: "SSL/TLS-Verschlüsselung für die Verbindung aktivieren",
      },
      username: {
        label: "Benutzername",
        description: "Benutzername für IMAP-Authentifizierung",
      },
      password: {
        label: "Passwort",
        description: "Passwort für IMAP-Authentifizierung",
      },
      authMethod: {
        label: "Authentifizierungsmethode",
        description: "Für IMAP-Authentifizierung verwendete Methode",
      },
      enabled: {
        label: "Konto aktiviert",
        description: "Dieses IMAP-Konto aktivieren oder deaktivieren",
      },
      connectionTimeout: {
        label: "Verbindungs-Timeout",
        description: "Verbindungs-Timeout in Millisekunden",
      },
      keepAlive: {
        label: "Verbindung aufrechterhalten",
        description: "Verbindung zwischen Anfragen aufrechterhalten",
      },
      syncInterval: {
        label: "Synchronisationsintervall",
        description: "Synchronisationsintervall in Sekunden",
      },
      maxMessages: {
        label: "Maximale Nachrichten",
        description: "Maximale Anzahl der zu synchronisierenden Nachrichten",
      },
      syncFolders: {
        label: "Synchronisierte Ordner",
        description: "Zu synchronisierende Ordner (durch Kommas getrennt)",
      },
    },
    response: {
      title: "Aktualisiertes Konto",
      description: "IMAP-Konto Antwortdaten",
      account: {
        id: "Konto-ID",
        name: "Kontoname",
        email: "E-Mail-Adresse",
        host: "IMAP-Server-Host",
        port: "IMAP-Server-Port",
        secure: "Sichere Verbindung",
        username: "Benutzername",
        authMethod: "Authentifizierungsmethode",
        enabled: "Konto aktiviert",
        createdAt: "Erstellt am",
        updatedAt: "Aktualisiert am",
      },
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Ressource nicht gefunden",
      },
      conflict: {
        title: "Konflikt",
        description: "Datenkonflikt aufgetreten",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen",
      },
    },
    success: {
      title: "Erfolg",
      description: "Operation erfolgreich abgeschlossen",
    },
  },
  delete: {
    title: "IMAP-Konto löschen",
    description: "Ein bestehendes IMAP-Konto löschen",
    container: {
      title: "Konto löschen",
      description: "Dieses IMAP-Konto dauerhaft entfernen",
    },
    response: {
      message: "Konto erfolgreich gelöscht",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      notFound: {
        title: "Konto nicht gefunden",
        description: "Das IMAP-Konto konnte nicht gefunden werden",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler aufgetreten",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff verboten",
      },
      conflict: {
        title: "Konflikt",
        description:
          "Konto mit aktiven Verbindungen kann nicht gelöscht werden",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler beim Löschen des Kontos aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist beim Löschen aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description:
          "Konto mit nicht gespeicherten Änderungen kann nicht gelöscht werden",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Konto-ID angegeben",
      },
    },
    success: {
      title: "Erfolg",
      description: "Konto erfolgreich gelöscht",
    },
  },
};
