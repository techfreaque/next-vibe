import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  // Shared translation keys
  tag: "IMAP-Nachricht",

  // GET endpoint translations
  get: {
    title: "IMAP-Nachricht abrufen",
    description: "IMAP-Nachrichtendetails anhand der ID abrufen",
    container: {
      title: "Nachrichtendetails",
      description: "Individuelle IMAP-Nachrichteninformationen",
    },
    id: {
      label: "Nachrichten-ID",
      description: "Eindeutige Kennung für die IMAP-Nachricht",
      placeholder: "Nachrichten-UUID eingeben",
    },
    response: {
      title: "Nachrichtenantwort",
      description: "IMAP-Nachrichtendetails und Metadaten",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Nachrichten-ID oder Anfrageparameter",
      },
      notFound: {
        title: "Nachricht nicht gefunden",
        description:
          "Die angeforderte IMAP-Nachricht konnte nicht gefunden werden",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Authentifizierung erforderlich für den Zugriff auf IMAP-Nachrichten",
      },
      forbidden: {
        title: "Verboten",
        description:
          "Sie haben keine Berechtigung, auf diese IMAP-Nachricht zuzugreifen",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler beim Abrufen der Nachricht",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler beim Abrufen der Nachricht",
      },
      conflict: {
        title: "Konfliktfehler",
        description: "Nachrichtenabruf steht im Konflikt mit vorhandenen Daten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler beim Abrufen der Nachricht",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description:
          "Es gibt ungespeicherte Änderungen, die zuerst gespeichert werden müssen",
      },
    },
    success: {
      title: "Nachricht abgerufen",
      description: "IMAP-Nachricht erfolgreich abgerufen",
    },
  },

  // PATCH endpoint translations
  patch: {
    title: "IMAP-Nachricht aktualisieren",
    description:
      "IMAP-Nachrichteneigenschaften aktualisieren (Gelesen-Status, Markierungen, etc.)",
    container: {
      title: "Nachricht aktualisieren",
      description: "IMAP-Nachrichteneigenschaften ändern",
    },
    id: {
      label: "Nachrichten-ID",
      description:
        "Eindeutige Kennung für die zu aktualisierende IMAP-Nachricht",
      placeholder: "Nachrichten-UUID eingeben",
    },
    isRead: {
      label: "Gelesen-Status",
      description: "Nachricht als gelesen oder ungelesen markieren",
    },
    isFlagged: {
      label: "Markiert-Status",
      description: "Nachricht als markiert oder nicht markiert kennzeichnen",
    },
    subject: {
      label: "Betreff",
      description: "Den Nachrichtenbetreff aktualisieren",
      placeholder: "Nachrichtenbetreff eingeben",
    },
    response: {
      title: "Aktualisierte Nachricht",
      description: "Aktualisierte IMAP-Nachrichtendetails",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Aktualisierungsparameter oder Nachrichten-ID",
      },
      notFound: {
        title: "Nachricht nicht gefunden",
        description:
          "Die zu aktualisierende IMAP-Nachricht konnte nicht gefunden werden",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Authentifizierung erforderlich zum Aktualisieren von IMAP-Nachrichten",
      },
      forbidden: {
        title: "Verboten",
        description:
          "Sie haben keine Berechtigung, diese IMAP-Nachricht zu aktualisieren",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler beim Aktualisieren der Nachricht",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler beim Aktualisieren der Nachricht",
      },
      conflict: {
        title: "Konfliktfehler",
        description:
          "Nachrichtenaktualisierung steht im Konflikt mit vorhandenen Daten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler beim Aktualisieren der Nachricht",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description:
          "Es gibt ungespeicherte Änderungen, die zuerst gespeichert werden müssen",
      },
    },
    success: {
      title: "Nachricht aktualisiert",
      description: "IMAP-Nachricht erfolgreich aktualisiert",
    },
  },

  // Legacy POST endpoint translations (keeping for compatibility)
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
  widget: {
    title: "IMAP-Nachricht",
    notFound: "Nachricht nicht gefunden",
    parties: "Beteiligte",
    from: "Von",
    to: "An",
    timestamps: "Zeitstempel",
    sentAt: "Gesendet am",
    receivedAt: "Empfangen am",
    flagged: "Markiert",
    unread: "Ungelesen",
    hasAttachments: "Hat Anhänge",
    attachments: "Anhänge",
    body: "Nachrichteninhalt",
    noBody: "Kein Nachrichteninhalt",
    sent: "Gesendet",
    received: "Empfangen",
    flag: "Markieren",
    unflag: "Markierung entfernen",
    markRead: "Als gelesen markieren",
    markUnread: "Als ungelesen markieren",
    thread: "Konversation",
    threadMessages: "Nachrichten in dieser Konversation",
    threadExpand: "Anzeigen",
    threadCollapse: "Ausblenden",
  },
};
