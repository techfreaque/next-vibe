import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Root-Ordner-Berechtigungen abrufen",
    description: "Berechtigungen für einen Root-Ordner berechnen",
    container: {
      title: "Root-Ordner-Berechtigungen",
      description: "Berechtigungen für Root-Ordner anzeigen",
    },
    rootFolderId: {
      label: "Root-Ordner-ID",
      description:
        "Die ID des Root-Ordners, für den Berechtigungen geprüft werden sollen",
      placeholder: "private, shared, public oder incognito",
    },
    response: {
      canCreateThread: {
        content: "Kann Thread erstellen",
      },
      canCreateFolder: {
        content: "Kann Ordner erstellen",
      },
    },
    success: {
      title: "Erfolg",
      description: "Root-Ordner-Berechtigungen erfolgreich abgerufen",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Root-Ordner-ID angegeben",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Server fehlgeschlagen",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Sie müssen angemeldet sein, um Berechtigungen zu prüfen",
      },
      forbidden: {
        title: "Verboten",
        description: "Sie haben keine Berechtigung für diese Ressource",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Root-Ordner nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Ein interner Serverfehler ist aufgetreten",
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
  },
};
