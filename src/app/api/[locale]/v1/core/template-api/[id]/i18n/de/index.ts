import type { translations as enTranslations } from "../en";

/**
 * Template Item API translations for German
 */

export const translations: typeof enTranslations = {
  // Common category and tags
  category: "Template API",
  tags: {
    template: "Vorlage",
    get: "Abrufen",
    update: "Aktualisieren",
    delete: "Löschen",
  },

  // GET endpoint translations
  get: {
    title: "Vorlage Abrufen",
    description: "Eine Vorlage über ID abrufen",
    form: {
      title: "Vorlagen-Abruf",
      description: "Geben Sie die Vorlagen-ID an, um sie abzurufen",
    },
    id: {
      label: "Vorlagen-ID",
      description: "Die eindeutige Kennung der Vorlage",
      placeholder: "Vorlagen-ID eingeben",
    },
    response: {
      title: "Vorlagen-Antwort",
      description: "Die abgerufenen Vorlagendaten",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Die angegebene Vorlagen-ID ist ungültig",
      },
      notFound: {
        title: "Vorlage Nicht Gefunden",
        description: "Keine Vorlage mit der angegebenen ID gefunden",
      },
      unauthorized: {
        title: "Nicht Autorisiert",
        description: "Sie sind nicht berechtigt, auf diese Vorlage zuzugreifen",
      },
      forbidden: {
        title: "Verboten",
        description: "Der Zugriff auf diese Vorlage ist verboten",
      },
      server: {
        title: "Serverfehler",
        description: "Ein Fehler ist beim Abrufen der Vorlage aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler beim Abrufen der Vorlage aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht Gespeicherte Änderungen",
        description:
          "Es gibt nicht gespeicherte Änderungen, die verloren gehen",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt ist beim Abrufen der Vorlage aufgetreten",
      },
    },
    success: {
      title: "Vorlage Abgerufen",
      description: "Vorlage wurde erfolgreich abgerufen",
    },
  },

  // PUT endpoint translations
  put: {
    title: "Vorlage Aktualisieren",
    description: "Eine bestehende Vorlage aktualisieren",
    form: {
      title: "Vorlagen-Aktualisierung",
      description: "Vorlagen-Eigenschaften ändern",
    },
    id: {
      label: "Vorlagen-ID",
      description: "Die eindeutige Kennung der zu aktualisierenden Vorlage",
      placeholder: "Vorlagen-ID eingeben",
    },
    name: {
      label: "Vorlagen-Name",
      description: "Der Name der Vorlage",
      placeholder: "Vorlagen-Namen eingeben",
    },
    templateDescription: {
      label: "Beschreibung",
      help: "Eine optionale Beschreibung für die Vorlage",
      placeholder: "Vorlagen-Beschreibung eingeben",
    },
    content: {
      label: "Vorlagen-Inhalt",
      description: "Der Inhalt/Körper der Vorlage",
      placeholder: "Vorlagen-Inhalt eingeben",
    },
    status: {
      label: "Status",
      description: "Der aktuelle Status der Vorlage",
      placeholder: "Vorlagen-Status auswählen",
    },
    tags: {
      label: "Tags",
      description: "Tags zur Kategorisierung der Vorlage",
      placeholder: "Vorlagen-Tags eingeben",
    },
    response: {
      title: "Aktualisierungs-Antwort",
      description: "Die aktualisierten Vorlagendaten",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Die angegebenen Vorlagendaten sind ungültig",
      },
      network: {
        title: "Netzwerkfehler",
        description:
          "Netzwerkfehler beim Aktualisieren der Vorlage aufgetreten",
      },
      unauthorized: {
        title: "Nicht Autorisiert",
        description:
          "Sie sind nicht berechtigt, diese Vorlage zu aktualisieren",
      },
      forbidden: {
        title: "Verboten",
        description:
          "Der Zugriff zum Aktualisieren dieser Vorlage ist verboten",
      },
      notFound: {
        title: "Vorlage Nicht Gefunden",
        description:
          "Keine Vorlage mit der angegebenen ID zum Aktualisieren gefunden",
      },
      server: {
        title: "Serverfehler",
        description:
          "Ein Fehler ist beim Aktualisieren der Vorlage aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description:
          "Ein unbekannter Fehler ist beim Aktualisieren aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht Gespeicherte Änderungen",
        description:
          "Es gibt nicht gespeicherte Änderungen, die verloren gehen",
      },
      conflict: {
        title: "Konflikt",
        description:
          "Ein Konflikt ist beim Aktualisieren der Vorlage aufgetreten",
      },
    },
    success: {
      title: "Vorlage Aktualisiert",
      description: "Vorlage wurde erfolgreich aktualisiert",
    },
  },

  // DELETE endpoint translations
  delete: {
    title: "Vorlage Löschen",
    description: "Eine bestehende Vorlage löschen",
    form: {
      title: "Vorlagen-Löschung",
      description: "Vorlagen-Löschung bestätigen",
    },
    id: {
      label: "Vorlagen-ID",
      description: "Die eindeutige Kennung der zu löschenden Vorlage",
      placeholder: "Vorlagen-ID eingeben",
    },
    response: {
      title: "Löschungs-Antwort",
      description: "Bestätigung der Vorlagen-Löschung",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Die angegebene Vorlagen-ID ist ungültig",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler beim Löschen der Vorlage aufgetreten",
      },
      unauthorized: {
        title: "Nicht Autorisiert",
        description: "Sie sind nicht berechtigt, diese Vorlage zu löschen",
      },
      forbidden: {
        title: "Verboten",
        description: "Der Zugriff zum Löschen dieser Vorlage ist verboten",
      },
      notFound: {
        title: "Vorlage Nicht Gefunden",
        description:
          "Keine Vorlage mit der angegebenen ID zum Löschen gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Ein Fehler ist beim Löschen der Vorlage aufgetreten",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist beim Löschen aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht Gespeicherte Änderungen",
        description:
          "Es gibt nicht gespeicherte Änderungen, die verloren gehen",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt ist beim Löschen der Vorlage aufgetreten",
      },
    },
    success: {
      title: "Vorlage Gelöscht",
      description: "Vorlage wurde erfolgreich gelöscht",
    },
  },
};
