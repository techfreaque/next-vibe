import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    folders: "Ordner",
  },
  title: "Ordner erstellen",
  description: "Einen neuen Ordner erstellen",
  config: {
    folders: {
      private: "Private Chats",
      shared: "Geteilte Chats",
      public: "Öffentliche Chats",
      incognito: "Inkognito Chats",
    },
  },
  sections: {
    folder: {
      title: "Ordnerdetails",
      description: "Grundlegende Ordnerinformationen",
      rootFolderId: {
        label: "Stammordner",
        description: "Stammordner (private, shared, public, incognito)",
      },
      name: {
        label: "Ordnername",
        description: "Name des Ordners",
      },
      icon: {
        label: "Symbol",
        description: "Symbol für den Ordner (lucide oder si Symbolname)",
      },
      color: {
        label: "Farbe",
        description: "Hex-Farbe zur visuellen Unterscheidung",
      },
      parentId: {
        label: "Übergeordneter Ordner",
        description: "Übergeordnete Ordner-ID für verschachtelte Ordner",
      },
    },
  },
  response: {
    title: "Erstellter Ordner",
    description: "Details des neu erstellten Ordners",
    folder: {
      title: "Ordner",
      id: { content: "Ordner-ID" },
      userId: { content: "Benutzer-ID" },
      rootFolderId: { content: "Stammordner" },
      name: { content: "Ordnername" },
      icon: { content: "Symbol" },
      color: { content: "Farbe" },
      parentId: { content: "Übergeordnete Ordner-ID" },
      expanded: { content: "Erweitert-Status" },
      sortOrder: { content: "Sortierreihenfolge" },
      createdAt: { content: "Erstellt am" },
      updatedAt: { content: "Aktualisiert am" },
    },
  },
  errors: {
    validation: {
      title: "Validierungsfehler",
      description: "Die Ordnerdaten sind ungültig",
    },
    unauthorized: {
      title: "Nicht autorisiert",
      description: "Sie müssen angemeldet sein, um Ordner zu erstellen",
    },
    forbidden: {
      title: "Verboten",
      description: "Sie haben keine Berechtigung, Ordner zu erstellen",
      incognitoNotAllowed:
        "Inkognito-Ordner können nicht auf dem Server erstellt werden",
    },
    notFound: {
      title: "Nicht gefunden",
      description: "Die angeforderte Ressource wurde nicht gefunden",
    },
    server: {
      title: "Serverfehler",
      description: "Beim Erstellen des Ordners ist ein Fehler aufgetreten",
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
  submitButton: {
    label: "Ordner erstellen",
    loadingText: "Erstelle...",
  },
  success: {
    title: "Erfolg",
    description: "Ordner erfolgreich erstellt",
  },
};
