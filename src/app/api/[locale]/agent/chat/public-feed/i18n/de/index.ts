export const translations = {
  tags: {
    publicFeed: "Öffentlicher Feed",
  },
  get: {
    title: "Community-Feed",
    description: "Öffentliche Threads der Community",
    sortMode: {
      label: "Sortierung",
      description: "Wie der Feed sortiert werden soll (hot, neu, aufsteigend)",
    },
    page: {
      label: "Seite",
      description: "Seitennummer",
    },
    limit: {
      label: "Limit",
      description: "Anzahl der Threads pro Seite",
    },
    search: {
      label: "Suche",
      description: "Threads nach Titel durchsuchen",
    },
    response: {
      title: "Feed-Antwort",
      description: "Angereicherte öffentliche Thread-Liste",
      items: {
        item: {
          title: "Feed-Eintrag",
          id: { content: "Thread-ID" },
          threadTitle: { content: "Titel" },
          preview: { content: "Vorschau" },
          folderId: { content: "Ordner-ID" },
          folderName: { content: "Kategorie" },
          authorId: { content: "Autor-ID" },
          authorName: { content: "Autor" },
          messageCount: { content: "Nachrichten" },
          authorCount: { content: "Teilnehmer" },
          upvotes: { content: "Upvotes" },
          downvotes: { content: "Downvotes" },
          score: { content: "Punkte" },
          modelNames: { content: "Verwendete Modelle" },
          isStreaming: { content: "Wird gestreamt" },
          createdAt: { content: "Erstellt am" },
          updatedAt: { content: "Aktualisiert am" },
        },
      },
      totalCount: { content: "Gesamtanzahl" },
      pageCount: { content: "Seitenanzahl" },
      currentPage: { content: "Aktuelle Seite" },
      pageSize: { content: "Seitengröße" },
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrageparameter",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie müssen angemeldet sein",
      },
      forbidden: {
        title: "Verboten",
        description: "Keine Berechtigung",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Threads gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Ein interner Serverfehler ist aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Keine Verbindung zum Server",
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
    success: {
      title: "Erfolg",
      description: "Feed erfolgreich abgerufen",
    },
  },
  sortMode: {
    hot: "Beliebt",
    new: "Neu",
    rising: "Aufsteigend",
  },
};
