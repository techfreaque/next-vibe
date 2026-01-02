import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "IMAP-Konten auflisten",
  description: "Eine paginierte Liste von IMAP-Konten mit Filterung abrufen",
  container: {
    title: "IMAP-Konten-Liste",
    description: "IMAP-Konten-Listen-Parameter konfigurieren und Ergebnisse anzeigen",
  },
  fields: {
    page: {
      label: "Seite",
      description: "Seitenzahl für Paginierung",
      placeholder: "Seitenzahl eingeben",
    },
    limit: {
      label: "Grenzwert",
      description: "Anzahl der Elemente pro Seite",
      placeholder: "Grenzwert eingeben",
    },
    search: {
      label: "Suchen",
      description: "Konten nach Name oder E-Mail suchen",
      placeholder: "Konten suchen...",
    },
    status: {
      label: "Status",
      description: "Nach Kontostatus filtern",
      placeholder: "Status auswählen",
    },
    enabled: {
      label: "Aktiviert",
      description: "Nach aktiviertem Status filtern",
    },
    sortBy: {
      label: "Sortieren nach",
      description: "Feld zum Sortieren",
      placeholder: "Sortierfeld auswählen",
    },
    sortOrder: {
      label: "Sortierreihenfolge",
      description: "Richtung der Sortierreihenfolge",
      placeholder: "Sortierreihenfolge auswählen",
    },
  },
  response: {
    accounts: {
      title: "IMAP-Konten",
      emptyState: {
        title: "Keine Konten gefunden",
        description: "Keine IMAP-Konten entsprechen Ihren aktuellen Filtern",
      },
      item: {
        title: "IMAP-Konto",
        description: "IMAP-Kontodetails",
        id: "ID",
        name: "Name",
        email: "E-Mail",
        host: "Host",
        port: "Port",
        secure: "Sicher",
        username: "Benutzername",
        authMethod: "Authentifizierungsmethode",
        connectionTimeout: "Verbindungs-Timeout",
        keepAlive: "Verbindung aufrechterhalten",
        enabled: "Aktiviert",
        syncInterval: "Synchronisationsintervall",
        maxMessages: "Max. Nachrichten",
        syncFolders: "Synchronisationsordner",
        lastSyncAt: "Letzte Synchronisation",
        syncStatus: "Synchronisationsstatus",
        syncError: "Synchronisationsfehler",
        isConnected: "Ist verbunden",
        createdAt: "Erstellt am",
        updatedAt: "Aktualisiert am",
      },
    },
    pagination: {
      title: "Paginierung",
      description: "Paginierungsinformationen",
      page: "Aktuelle Seite",
      limit: "Elemente pro Seite",
      total: "Gesamtelemente",
      totalPages: "Gesamtseiten",
    },
  },
  errors: {
    validation: {
      title: "Validierungsfehler",
      description: "Die bereitgestellten Parameter sind ungültig",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Sie müssen authentifiziert sein, um auf diese Ressource zuzugreifen",
    },
    forbidden: {
      title: "Verboten",
      description: "Sie haben keine Berechtigung, auf diese Ressource zuzugreifen",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Die angeforderte Ressource wurde nicht gefunden",
    },
    server: {
      title: "Serverfehler",
      description: "Ein interner Serverfehler ist aufgetreten",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Ein unerwarteter Fehler ist aufgetreten",
    },
    unsaved: {
      title: "Nicht gespeicherte Änderungen",
      description: "Sie haben nicht gespeicherte Änderungen",
    },
    conflict: {
      title: "Konflikt",
      description: "Die Anfrage steht im Konflikt mit dem aktuellen Zustand",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Ein Netzwerkfehler ist aufgetreten",
    },
  },
  success: {
    title: "Erfolg",
    description: "IMAP-Konten erfolgreich abgerufen",
  },
};
