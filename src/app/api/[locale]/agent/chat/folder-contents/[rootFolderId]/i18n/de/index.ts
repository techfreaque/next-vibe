export const translations = {
  category: "Chat",
  tags: {
    folderContents: "Ordnerinhalt",
  },
  config: {
    folders: {
      private: "Privat",
      shared: "Geteilt",
      public: "Öffentlich",
      cron: "Cron",
      incognito: "Inkognito",
    },
  },
  get: {
    title: "Ordnerinhalt abrufen",
    description:
      "Gemischte Liste von Ordnern und Threads für eine bestimmte Ordnerebene abrufen",
    rootFolderId: {
      label: "Hauptordner",
      description: "Der Hauptordner (privat, geteilt, öffentlich usw.)",
    },
    subFolderId: {
      label: "Unterordner",
      description: "Die Unterordner-ID (null für Stammebene)",
    },
    response: {
      items: {
        item: {
          type: { content: "Elementtyp" },
          sortOrder: { content: "Sortierreihenfolge" },
          id: { content: "ID" },
          userId: { content: "Benutzer-ID" },
          rootFolderId: { content: "Hauptordner" },
          name: { content: "Name" },
          icon: { content: "Symbol" },
          color: { content: "Farbe" },
          parentId: { content: "Übergeordneter Ordner" },
          expanded: { content: "Erweitert" },
          canManage: { content: "Kann verwalten" },
          canCreateThread: { content: "Kann Thread erstellen" },
          canModerate: { content: "Kann moderieren" },
          canDelete: { content: "Kann löschen" },
          canManagePermissions: { content: "Kann Berechtigungen verwalten" },
          title: { content: "Thread-Titel" },
          folderId: { content: "Ordner" },
          status: { content: "Status" },
          preview: { content: "Vorschau" },
          pinned: { content: "Angeheftet" },
          archived: { content: "Archiviert" },
          canEdit: { content: "Kann bearbeiten" },
          canPost: { content: "Kann posten" },
          streamingState: { content: "Streaming-Status" },
          createdAt: { content: "Erstellt am" },
          updatedAt: { content: "Aktualisiert am" },
        },
      },
      rootFolderPermissions: {
        title: "Hauptordner-Berechtigungen",
        description: "Berechtigungen für den Hauptordner",
        canCreateThread: { content: "Kann Thread erstellen" },
        canCreateFolder: { content: "Kann Ordner erstellen" },
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Ordner-ID",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Anmeldung erforderlich",
      },
      forbidden: { title: "Verboten", description: "Keine Berechtigung" },
      notFound: {
        title: "Nicht gefunden",
        description: "Ordner nicht gefunden",
      },
      server: { title: "Serverfehler", description: "Fehler beim Abrufen" },
      network: { title: "Netzwerkfehler", description: "Verbindungsfehler" },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Unerwarteter Fehler",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Sie haben nicht gespeicherte Änderungen",
      },
      conflict: { title: "Konflikt", description: "Konflikt aufgetreten" },
    },
    success: {
      title: "Erfolg",
      description: "Ordnerinhalt erfolgreich abgerufen",
    },
  },
};
