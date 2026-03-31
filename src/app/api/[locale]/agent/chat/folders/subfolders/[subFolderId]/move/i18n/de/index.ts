import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    folders: "Ordner",
  },

  patch: {
    title: "Ordner verschieben",
    description:
      "Einen Ordner zu einem anderen übergeordneten Ordner verschieben",
    id: {
      label: "Ordner-ID",
      description: "Die eindeutige Kennung des zu verschiebenden Ordners",
    },
    parentId: {
      label: "Übergeordneter Ordner",
      description:
        "Ordner zu einem anderen übergeordneten Ordner verschieben (null für Wurzel)",
    },
    response: {
      folder: {
        id: {
          content: "ID",
        },
        updatedAt: {
          content: "Aktualisiert am",
        },
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Die angegebenen Daten sind ungültig",
        circularReference:
          "Ordner kann nicht als eigener übergeordneter Ordner festgelegt werden",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie müssen angemeldet sein, um Ordner zu verschieben",
      },
      forbidden: {
        title: "Verboten",
        description:
          "Sie haben keine Berechtigung, diesen Ordner zu verschieben",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Der angeforderte Ordner wurde nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Beim Verschieben des Ordners ist ein Fehler aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Server nicht möglich",
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
        description:
          "Ordner kann nicht an diesen Speicherort verschoben werden",
      },
    },
    success: {
      title: "Erfolg",
      description: "Ordner erfolgreich verschoben",
    },
    backButton: { label: "Zurück" },
    submitButton: {
      label: "Ordner verschieben",
      loadingText: "Verschieben...",
    },
  },
  widget: {
    moveFolder: {
      description: "Zielordner auswählen",
      rootLevel: "(Stammebene)",
    },
  },
};
