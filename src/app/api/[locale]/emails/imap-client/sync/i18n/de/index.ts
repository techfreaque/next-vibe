import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
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
};
