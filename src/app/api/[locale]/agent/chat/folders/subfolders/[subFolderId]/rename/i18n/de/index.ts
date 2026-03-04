import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    folders: "Ordner",
  },

  patch: {
    title: "Ordner umbenennen",
    description: "Einen vorhandenen Ordner umbenennen",
    id: {
      label: "Ordner-ID",
      description: "Die eindeutige Kennung des umzubenennenden Ordners",
    },
    name: {
      label: "Name",
      description: "Der neue Ordnername",
    },
    icon: {
      label: "Symbol",
      description: "Lucide- oder Simple Icons-Symbolname",
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
        description: "Sie müssen angemeldet sein, um Ordner umzubenennen",
      },
      forbidden: {
        title: "Verboten",
        description: "Sie haben keine Berechtigung, diesen Ordner umzubenennen",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Der angeforderte Ordner wurde nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Beim Umbenennen des Ordners ist ein Fehler aufgetreten",
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
        description: "Ein Ordner mit diesem Namen existiert bereits",
      },
    },
    success: {
      title: "Erfolg",
      description: "Ordner erfolgreich umbenannt",
    },
  },
};
