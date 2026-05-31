import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Benutzernotizen auflisten",
    description:
      "CRM-Notizen für einen Benutzer anzeigen, gefiltert nach Typ und Sichtbarkeit",
    fields: {
      userId: {
        label: "Benutzer-ID",
        description: "Notizen welches Benutzers auflisten",
        placeholder: "Benutzer-UUID",
      },
      type: {
        label: "Typ",
        description: "Nach Aktivitätstyp filtern",
        placeholder: "Alle Typen",
      },
      isPrivate: {
        label: "Nur private",
        description: "Nur eigene private Notizen anzeigen",
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Überprüfen Sie die Filter und versuchen Sie es erneut",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie müssen angemeldet sein",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Sie haben keinen Zugriff auf diese Notizen",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Benutzer nicht gefunden",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt ist aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkanfrage fehlgeschlagen",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Es gibt nicht gespeicherte Änderungen",
      },
      internal: {
        title: "Interner Fehler",
        description: "Serverfehler — erneut versuchen",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
    },
    success: {
      title: "Notizen geladen",
      description: "Notizen erfolgreich abgerufen",
    },
    widget: {
      addNote: "Notiz hinzufügen",
      total: "Gesamt",
      empty: "Noch keine Notizen",
      delete: "Löschen",
      private: "Privat",
      ago: "vor",
    },
    response: {
      notes: "Notizen",
      total: "Gesamt",
      note: {
        id: "Notiz-ID",
        userId: "Benutzer-ID",
        authorUserId: "Autor-ID",
        type: "Typ",
        content: "Inhalt",
        isPrivate: "Privat",
        createdAt: "Erstellt am",
        updatedAt: "Aktualisiert am",
      },
    },
  },
  tag: "CRM",
};
