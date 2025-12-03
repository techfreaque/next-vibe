import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "IMAP-Nachrichten synchronisieren",
  description: "Nachrichten aus IMAP-Kontoordnern synchronisieren",

  container: {
    title: "Nachrichten-Sync-Konfiguration",
    description: "IMAP-Nachrichtensynchronisationsparameter konfigurieren",
  },

  accountId: {
    label: "Konto-ID",
    description: "IMAP-Kontobezeichner",
    placeholder: "IMAP-Konto-ID eingeben",
  },

  folderId: {
    label: "Ordner-ID",
    description: "Spezifischer zu synchronisierender Ordner (optional)",
    placeholder: "Ordner-ID eingeben um spezifischen Ordner zu synchronisieren",
  },

  force: {
    label: "Synchronisation erzwingen",
    description: "Erneute Synchronisation aller Nachrichten erzwingen",
  },

  response: {
    success: "Erfolg",
    message: "Sync-Statusmeldung",

    results: {
      title: "Sync-Ergebnisse",
      description: "Nachrichtensynchronisationsstatistiken",
      messagesProcessed: "Verarbeitete Nachrichten",
      messagesAdded: "Hinzugefügte Nachrichten",
      messagesUpdated: "Aktualisierte Nachrichten",
      messagesDeleted: "Gelöschte Nachrichten",
      duration: "Dauer (ms)",
    },

    errors: {
      title: "Sync-Fehler",
      description: "Während der Synchronisation aufgetretene Fehler",
      error: {
        title: "Fehlerdetails",
        description: "Einzelne Fehlerinformationen",
        code: "Fehlercode",
        message: "Fehlermeldung",
      },
    },
  },

  errors: {
    validation: {
      title: "Validierung fehlgeschlagen",
      description: "Anfrageparameter sind ungültig",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description:
        "Authentifizierung erforderlich für Zugriff auf diesen Endpunkt",
    },
    forbidden: {
      title: "Zugriff verweigert",
      description: "Unzureichende Berechtigungen für diesen Vorgang",
    },
    server: {
      title: "Serverfehler",
      description: "Interner Serverfehler während der Synchronisation",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unerwarteter Fehler ist aufgetreten",
    },
    conflict: {
      title: "Konfliktfehler",
      description: "Datenkonflikt während der Synchronisation aufgetreten",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Netzwerkfehler während der Synchronisation aufgetreten",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Angeforderte Ressource nicht gefunden",
    },
    unsavedChanges: {
      title: "Ungespeicherte Änderungen",
      description: "Es gibt ungespeicherte Änderungen",
    },
  },

  success: {
    title: "Synchronisation abgeschlossen",
    description: "IMAP-Nachrichtensynchronisation erfolgreich abgeschlossen",
  },
};
