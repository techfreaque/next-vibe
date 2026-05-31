import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Benutzernotiz erstellen",
    description:
      "CRM-Notiz, Gesprächsprotokoll, E-Mail, Meeting oder Aufgabe für einen Benutzer hinzufügen",
    fields: {
      userId: {
        label: "Benutzer",
        description: "Der Benutzer, auf den sich diese Notiz bezieht",
        placeholder: "Benutzer auswählen",
      },
      type: {
        label: "Aktivitätstyp",
        description: "Welche Art von Interaktion dies erfasst",
        placeholder: "Typ auswählen",
      },
      content: {
        label: "Inhalt",
        description: "Details der Aktivität",
        placeholder: "Was ist passiert...",
      },
      isPrivate: {
        label: "Privat",
        description: "Private Notizen sind nur für Sie sichtbar",
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Überprüfen Sie die Felder und versuchen Sie es erneut",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie müssen angemeldet sein",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Sie haben keinen Zugriff auf diesen Benutzer",
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
      title: "Notiz erstellt",
      description: "Die Notiz wurde gespeichert",
    },
    widget: {
      created: "Notiz erstellt",
      noteId: "Notiz-ID",
      backToNotes: "Zurück zu Notizen",
    },
    response: {
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
  tag: "CRM",
};
