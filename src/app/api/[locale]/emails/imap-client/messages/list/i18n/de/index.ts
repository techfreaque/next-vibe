import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tag: "Nachrichten Liste",
  get: {
    title: "IMAP-Nachrichten auflisten",
    description:
      "Abrufen einer paginierten Liste von IMAP-Nachrichten mit Filterung und Sortierung",
    container: {
      title: "Nachrichten-Abfrage",
      description: "Konfigurieren Sie die Parameter für die Nachrichtenliste",
    },
    page: {
      label: "Seite",
      description: "Seitennummer für die Paginierung",
    },
    limit: {
      label: "Limit",
      description: "Anzahl der Nachrichten pro Seite",
    },
    accountId: {
      label: "Konto-ID",
      description: "IMAP-Konto-Identifikator",
      placeholder: "Wählen Sie ein IMAP-Konto",
    },
    folderId: {
      label: "Ordner-ID",
      description: "IMAP-Ordner-Identifikator (optional)",
      placeholder: "Wählen Sie einen Ordner",
    },
    search: {
      label: "Suchen",
      description: "Nachrichten nach Betreff, Absender oder Inhalt durchsuchen",
      placeholder: "Suchbegriffe eingeben...",
    },
    status: {
      label: "Status",
      description: "Nachrichten nach Status filtern",
    },
    sortBy: {
      label: "Sortieren nach",
      description: "Feld zum Sortieren der Nachrichten",
    },
    sortOrder: {
      label: "Sortierreihenfolge",
      description: "Sortierrichtung (aufsteigend oder absteigend)",
    },
    dateFrom: {
      label: "Datum von",
      description: "Nachrichten ab diesem Datum filtern",
    },
    dateTo: {
      label: "Datum bis",
      description: "Nachrichten bis zu diesem Datum filtern",
    },
    response: {
      message: {
        title: "Nachricht",
        description: "IMAP-Nachrichtendetails",
        id: "Nachrichten-ID",
        subject: "Betreff",
        senderEmail: "Absender-E-Mail",
        senderName: "Absendername",
        isRead: "Gelesen-Status",
        isFlagged: "Markiert-Status",
        hasAttachments: "Hat Anhänge",
        sentAt: "Gesendet am",
        headers: "E-Mail-Header",
      },
      total: "Gesamtnachrichten",
      page: "Aktuelle Seite",
      limit: "Seitenlimit",
      totalPages: "Gesamtseiten",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Nachrichtenlisten-Parameter",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich zum Auflisten von Nachrichten",
      },
      forbidden: {
        title: "Verboten",
        description: "Zugriff auf Nachrichten ist verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Nachrichten oder Konto nicht gefunden",
      },
      conflict: {
        title: "Konflikt",
        description: "Nachrichtenlisten-Anfrage steht im Konflikt mit vorhandenen Daten",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler beim Auflisten von Nachrichten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler beim Auflisten von Nachrichten",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Sie haben ungespeicherte Änderungen in der Nachrichtenliste",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler beim Auflisten von Nachrichten",
      },
    },
    success: {
      title: "Nachrichten erfolgreich aufgelistet",
      description: "Nachrichten wurden erfolgreich abgerufen",
    },
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
};
