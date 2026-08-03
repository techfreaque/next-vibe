import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "IMAP-Client",
  tag: "IMAP-Client",
  tags: {
    health: "Gesundheit",
    monitoring: "Überwachung",
    sync: "Synchronisation",
    accounts: "Konten",
    folders: "Ordner",
    messages: "Nachrichten",
    config: "Konfiguration",
  },
  messages: {
    tag: "Nachrichten",
    id: {
      widget: {
        markRead: "Als gelesen markieren",
        markUnread: "Als ungelesen markieren",
        flag: "Markieren",
        unflag: "Markierung entfernen",
      },
    },
    errors: {
      server: { title: "Serverfehler" },
      notFound: { title: "Nachricht nicht gefunden" },
      accountNotFound: { title: "Konto nicht gefunden" },
      syncFailed: { title: "Synchronisierung fehlgeschlagen" },
      syncSuccess: { message: "Nachrichten erfolgreich synchronisiert" },
      list: {
        get: {
          errors: {
            server: { title: "Serverfehler beim Auflisten von Nachrichten" },
          },
        },
      },
    },
  },
  sync: {
    category: "IMAP-Client",

    title: "IMAP-Synchronisation",
    description: "IMAP-Synchronisierungsdienst",
    container: {
      title: "IMAP-Sync-Konfiguration",
      description: "IMAP-Synchronisierungsparameter konfigurieren",
    },
    accountIds: {
      label: "Konto-IDs",
      description: "IMAP-Konto-IDs zum Synchronisieren",
      placeholder: "Konto-IDs durch Kommas getrennt eingeben",
    },
    force: {
      label: "Sync erzwingen",
      description: "Synchronisation auch bei kürzlich erfolgter Sync erzwingen",
    },
    dryRun: {
      label: "Testlauf",
      description: "Testlauf ohne Änderungen durchführen",
    },
    maxMessages: {
      label: "Max. Nachrichten",
      description: "Maximale Anzahl Nachrichten pro Ordner zu synchronisieren",
      placeholder: "Maximale Nachrichtenanzahl eingeben",
    },
    post: {
      title: "Titel",
      description: "Endpunkt-Beschreibung",
      form: {
        title: "Konfiguration",
        description: "Parameter konfigurieren",
      },
      response: {
        title: "Antwort",
        description: "Antwortdaten",
        result: {
          title: "Sync-Ergebnisse",
          description: "Detaillierte Synchronisationsergebnisse",
          accountsProcessed: "Verarbeitete Konten",
          foldersProcessed: "Verarbeitete Ordner",
          messagesProcessed: "Verarbeitete Nachrichten",
          messagesAdded: "Hinzugefügte Nachrichten",
          messagesUpdated: "Aktualisierte Nachrichten",
          messagesDeleted: "Gelöschte Nachrichten",
          duration: "Dauer",
        },
        errors: {
          error: {
            title: "Sync-Fehler",
            description: "Fehlerdetails",
            code: "Fehlercode",
            message: "Fehlermeldung",
          },
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
          description: "Interner Serverfehler",
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
      },
      success: {
        title: "Erfolg",
        description: "Vorgang erfolgreich abgeschlossen",
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
        description: "Interner Serverfehler",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff verboten",
      },
    },
    success: {
      title: "Erfolg",
      description: "Vorgang erfolgreich abgeschlossen",
    },
    widget: {
      title: "Vollständige IMAP-Synchronisierung",
      options: "Synchronisierungsoptionen",
      noAccounts: "Keine IMAP-Konten konfiguriert",
      result: "Synchronisierungsergebnis",
      duration: "Dauer",
      errors: "Fehler",
      accountsProcessed: "Verarbeitete Konten",
      foldersProcessed: "Verarbeitete Ordner",
      messagesProcessed: "Verarbeitete Nachrichten",
      messagesAdded: "Hinzugefügte Nachrichten",
      messagesUpdated: "Aktualisierte Nachrichten",
      messagesDeleted: "Gelöschte Nachrichten",
      submit: "Sync starten",
      submitting: "Synchronisiere...",
    },
  },
  imapErrors: {
    accounts: {
      post: {
        error: {
          duplicate: {
            title: "Konto existiert bereits",
          },
          server: {
            title: "Serverfehler beim Erstellen des Kontos",
          },
        },
      },
      get: {
        error: {
          not_found: {
            title: "Konto nicht gefunden",
          },
          server: {
            title: "Serverfehler beim Abrufen des Kontos",
          },
        },
      },
      put: {
        error: {
          not_found: {
            title: "Konto nicht gefunden",
          },
          duplicate: {
            title: "Konto mit dieser E-Mail existiert bereits",
          },
          server: {
            title: "Serverfehler beim Aktualisieren des Kontos",
          },
        },
      },
      delete: {
        error: {
          not_found: {
            title: "Konto nicht gefunden",
          },
          server: {
            title: "Serverfehler beim Löschen des Kontos",
          },
        },
        success: {
          title: "Konto erfolgreich gelöscht",
        },
      },
    },
    folders: {
      get: {
        error: {
          not_found: {
            title: "Ordner nicht gefunden",
          },
          server: {
            title: "Serverfehler beim Abrufen des Ordners",
          },
        },
      },
      sync: {
        error: {
          missing_account: {
            title: "Konto für Ordnersynchronisation nicht gefunden",
          },
        },
      },
    },
    messages: {
      get: {
        error: {
          not_found: {
            title: "Nachricht nicht gefunden",
          },
          server: {
            title: "Serverfehler beim Abrufen der Nachricht",
          },
        },
      },
    },
    connection: {
      failed: "Verbindung fehlgeschlagen",
      timeout: {
        title: "Verbindungszeitüberschreitung",
      },
      test: {
        failed: "Verbindungstest fehlgeschlagen",
      },
      close: {
        failed: "Verbindung konnte nicht geschlossen werden",
      },
      folders: {
        list: {
          failed: "Ordner konnten nicht aufgelistet werden",
        },
      },
      messages: {
        list: {
          failed: "Nachrichten konnten nicht aufgelistet werden",
        },
      },
    },
    sync: {
      failed: "Synchronisation fehlgeschlagen",
      account: {
        failed: "Kontosynchronisation fehlgeschlagen: {{error}}",
      },
      folder: {
        failed: "Ordnersynchronisation fehlgeschlagen",
      },
      message: {
        failed: "Nachrichtensynchronisation fehlgeschlagen",
      },
      post: {
        error: {
          server: {
            title: "Serverfehler während der Synchronisation",
          },
        },
      },
    },
    validation: {
      account: {
        username: {
          required: "Benutzername ist erforderlich",
        },
        port: {
          invalid: "Ungültige Portnummer",
        },
        host: {
          invalid: "Ungültiger Host",
        },
      },
    },
  },
  imap: {
    "example.com": "imap.example.com",
    "gmail.com": "imap.gmail.com",
    connection: {
      test: {
        success: "Verbindungstest erfolgreich",
        failed: "Verbindungstest fehlgeschlagen",
        timeout: "Verbindungstest-Zeitüberschreitung",
      },
    },
    sync: {
      messages: {
        accounts: {
          success: "Alle Konten erfolgreich synchronisiert",
          successWithErrors: "Konten mit Fehlern synchronisiert",
        },
        account: {
          success: "Konto erfolgreich synchronisiert",
          successWithErrors: "Konto mit Fehlern synchronisiert",
        },
        folders: {
          success: "Ordner erfolgreich synchronisiert",
          successWithErrors: "Ordner mit Fehlern synchronisiert",
        },
        messages: {
          success: "Nachrichten erfolgreich synchronisiert",
          successWithErrors: "Nachrichten mit Fehlern synchronisiert",
        },
      },
      errors: {
        default: "IMAP-Synchronisation fehlgeschlagen",
        account_failed: "Kontosynchronisation fehlgeschlagen: {{error}}",
        folder_sync_failed: "Ordnersynchronisation fehlgeschlagen: {{error}}",
        message_sync_error: "Nachrichtensynchronisationsfehler",
        message_sync_failed: "Nachrichtensynchronisation fehlgeschlagen",
      },
    },
  },
  enums: {
    loggingLevel: {
      error: "Fehler",
      warn: "Warnung",
      info: "Info",
      debug: "Debug",
    },
    syncStatus: {
      pending: "Ausstehend",
      syncing: "Synchronisierung",
      synced: "Synchronisiert",
      error: "Fehler",
    },
    overallSyncStatus: {
      idle: "Inaktiv",
      running: "Läuft",
      completed: "Abgeschlossen",
      failed: "Fehlgeschlagen",
      cancelled: "Abgebrochen",
    },
    sortOrder: {
      asc: "Aufsteigend",
      desc: "Absteigend",
    },
    authMethod: {
      plain: "Einfach",
      oauth2: "OAuth2",
      xoauth2: "XOAuth2",
    },
    imapAuthMethod: {
      plain: "Einfach",
      oauth2: "OAuth2",
      xoauth2: "XOAuth2",
    },
    specialUseType: {
      inbox: "Posteingang",
      sent: "Gesendet",
      drafts: "Entwürfe",
      trash: "Papierkorb",
      junk: "Spam",
      archive: "Archiv",
    },
    folderSortField: {
      name: "Name",
      displayName: "Anzeigename",
      messageCount: "Nachrichtenanzahl",
      unseenCount: "Ungelesene Anzahl",
      createdAt: "Erstellt am",
    },
    accountSortField: {
      name: "Name",
      email: "E-Mail",
      host: "Host",
      enabled: "Aktiviert",
      lastSyncAt: "Letzte Synchronisation",
      createdAt: "Erstellt am",
    },
    connectionStatus: {
      disconnected: "Getrennt",
      connecting: "Verbindung wird hergestellt",
      connected: "Verbunden",
      error: "Fehler",
      timeout: "Zeitüberschreitung",
    },
    syncStatusFilter: {
      all: "Alle Synchronisationsstatus",
    },
    accountStatusFilter: {
      all: "Alle Kontostatus",
      enabled: "Aktiviert",
      disabled: "Deaktiviert",
    },
    accountFilter: {
      all: "Alle Konten",
    },
    messageSortField: {
      subject: "Betreff",
      senderName: "Absendername",
      senderEmail: "Absender-E-Mail",
      recipientEmail: "Empfänger-E-Mail",
      recipientName: "Empfängername",
      isRead: "Gelesen-Status",
      isFlagged: "Markiert",
      messageSize: "Nachrichtengröße",
      sentAt: "Gesendet am",
      createdAt: "Erstellt am",
    },
    messageStatusFilter: {
      all: "Alle Nachrichten",
      read: "Gelesen",
      unread: "Ungelesen",
      flagged: "Markiert",
      unflagged: "Nicht markiert",
      draft: "Entwurf",
      deleted: "Gelöscht",
      hasAttachments: "Mit Anhängen",
      noAttachments: "Ohne Anhänge",
    },
    healthStatus: {
      healthy: "Gesund",
      warning: "Warnung",
      error: "Fehler",
      maintenance: "Wartung",
    },
    performanceStatus: {
      good: "Gut",
      warning: "Warnung",
      error: "Fehler",
    },
  },
};
