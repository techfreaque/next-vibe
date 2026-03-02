import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    messages: "Nachrichten",
  },
  search: {
    get: {
      title: "Globale Nachrichtensuche",
      description: "Nachrichten in allen Threads mit Volltextsuche durchsuchen",
      container: {
        title: "Globale Nachrichtensuche",
        description: "Nachrichten in allen Threads durchsuchen",
      },
      query: {
        label: "Suchanfrage",
        description: "Text, nach dem in Nachrichten gesucht werden soll",
      },
      sections: {
        filters: {
          title: "Filter",
          description: "Optionale Filter zur Eingrenzung der Suchergebnisse",
        },
        pagination: {
          title: "Seitennavigation",
          description: "Einstellungen für die Seitennavigation",
        },
      },
      rootFolderId: {
        label: "Stammordner",
        description:
          "Suche auf einen bestimmten Stammordnertyp beschränken (privat, geteilt, öffentlich, cron)",
      },
      role: {
        label: "Nachrichtenrolle",
        description:
          "Nach Nachrichtenrolle filtern (Benutzer, Assistent, System, Tool, Fehler)",
      },
      startDate: {
        label: "Startdatum",
        description: "Nur Nachrichten nach diesem Datum einbeziehen",
      },
      endDate: {
        label: "Enddatum",
        description: "Nur Nachrichten vor diesem Datum einbeziehen",
      },
      page: {
        label: "Seite",
        description: "Abzurufende Seitennummer",
      },
      limit: {
        label: "Limit",
        description: "Anzahl der Ergebnisse pro Seite",
      },
      response: {
        results: {
          message: {
            title: "Nachrichtenergebnis",
            messageId: {
              content: "Nachrichten-ID",
            },
            threadId: {
              content: "Thread-ID",
            },
            threadTitle: {
              content: "Thread-Titel",
            },
            role: {
              content: "Rolle",
            },
            headline: {
              content: "Inhaltsausschnitt",
            },
            createdAt: {
              content: "Erstellt am",
            },
            rootFolderId: {
              content: "Stammordner",
            },
          },
        },
        total: {
          content: "Gesamtergebnisse",
        },
        page: {
          content: "Aktuelle Seite",
        },
      },
      errors: {
        validationFailed: {
          title: "Validierung fehlgeschlagen",
          description: "Ungültige Suchparameter angegeben",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Verbindung zum Server nicht möglich",
        },
        unauthorized: {
          title: "Nicht autorisiert",
          description:
            "Sie müssen angemeldet sein, um Nachrichten zu durchsuchen",
        },
        forbidden: {
          title: "Verboten",
          description:
            "Sie haben keine Berechtigung, diese Suche durchzuführen",
        },
        notFound: {
          title: "Nicht gefunden",
          description: "Keine Ergebnisse für Ihre Anfrage gefunden",
        },
        serverError: {
          title: "Serverfehler",
          description:
            "Bei der Suche ist ein interner Serverfehler aufgetreten",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description: "Ein unerwarteter Fehler ist aufgetreten",
        },
        unsavedChanges: {
          title: "Nicht gespeicherte Änderungen",
          description: "Sie haben nicht gespeicherte Änderungen",
        },
        conflict: {
          title: "Konflikt",
          description: "Ein Konflikt ist aufgetreten",
        },
      },
      success: {
        title: "Erfolg",
        description: "Globale Nachrichtensuche erfolgreich abgeschlossen",
      },
    },
  },
};
