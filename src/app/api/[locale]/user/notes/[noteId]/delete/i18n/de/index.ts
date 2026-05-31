import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Benutzernotiz löschen",
    description:
      "CRM-Notiz löschen — nur der Autor oder ein Administrator kann dies tun",
    fields: {
      noteId: {
        label: "Notiz-ID",
        description: "Die zu löschende Notiz",
        placeholder: "Notiz-UUID",
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Notiz-ID",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie müssen angemeldet sein",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description:
          "Nur der Autor oder ein Administrator kann diese Notiz löschen",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Notiz nicht gefunden",
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
      title: "Notiz gelöscht",
      description: "Die Notiz wurde dauerhaft entfernt",
    },
    widget: {
      warning: "Diese Notiz wird unwiderruflich gelöscht.",
      deleted: "Notiz gelöscht.",
      backToNotes: "Zurück zu Notizen",
    },
    response: {
      deleted: "Gelöscht",
    },
  },
  tag: "CRM",
};
