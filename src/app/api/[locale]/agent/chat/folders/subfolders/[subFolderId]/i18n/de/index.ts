export const translations = {
  category: "Chat",
  tags: {
    folders: "Ordner",
  },

  get: {
    title: "Ordner abrufen",
    description: "Einen Ordner nach ID abrufen",
    container: {
      title: "Ordner",
      description: "Ordnerdetails",
    },
    id: {
      label: "Ordner-ID",
      description: "Die eindeutige Kennung des Ordners",
    },
    response: {
      folder: {
        id: { content: "ID" },
        name: { content: "Name" },
        icon: { content: "Symbol" },
        color: { content: "Farbe" },
        parentId: { content: "Übergeordneter Ordner" },
        rootFolderId: { content: "Stammordner" },
        expanded: { content: "Erweitert" },
        sortOrder: { content: "Sortierreihenfolge" },
        createdAt: { content: "Erstellt am" },
        updatedAt: { content: "Aktualisiert am" },
      },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Die angegebenen Daten sind ungültig",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie müssen angemeldet sein",
      },
      forbidden: {
        title: "Verboten",
        description: "Sie haben keine Berechtigung",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Der angeforderte Ordner wurde nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Beim Abrufen des Ordners ist ein Fehler aufgetreten",
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
        title: "Ungespeicherte Änderungen",
        description: "Sie haben ungespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt ist aufgetreten",
      },
    },
    success: { title: "Erfolg", description: "Ordner erfolgreich abgerufen" },
  },

  delete: {
    title: "Ordner löschen",
    description: "Einen Ordner nach ID löschen",
    container: {
      title: "Ordner löschen",
      description: "Ordnerlöschung bestätigen",
    },
    id: {
      label: "Ordner-ID",
      description: "Die eindeutige Kennung des zu löschenden Ordners",
    },
    response: {
      id: { content: "ID" },
      name: { content: "Name" },
      updatedAt: { content: "Gelöscht am" },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Die angegebenen Daten sind ungültig",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie müssen angemeldet sein",
      },
      forbidden: {
        title: "Verboten",
        description: "Sie haben keine Berechtigung",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Der angeforderte Ordner wurde nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Beim Löschen des Ordners ist ein Fehler aufgetreten",
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
        title: "Ungespeicherte Änderungen",
        description: "Sie haben ungespeicherte Änderungen",
      },
      conflict: {
        title: "Konflikt",
        description: "Ordner kann nicht gelöscht werden",
      },
    },
    success: { title: "Erfolg", description: "Ordner erfolgreich gelöscht" },
  },

  errors: {
    not_implemented_on_native: "{{method}} ist auf native nicht implementiert",
  },
};
