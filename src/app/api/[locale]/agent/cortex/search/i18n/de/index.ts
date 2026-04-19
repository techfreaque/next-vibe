export const translations = {
  get: {
    title: "Suchen",
    description: "Dateien nach Name oder Inhalt finden. Durchsucht alles.",
    dynamicTitle: "{{query}}",
    status: {
      loading: "Suchen...",
      done: "Gefunden",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      query: {
        label: "Suche",
        description: "Wonach suchen",
      },
      path: {
        label: "In Ordner",
        description: "Nur hier suchen (Standard: überall)",
      },
      maxResults: {
        label: "Limit",
        description: "Wie viele Ergebnisse (Standard: 20)",
      },
    },
    submitButton: {
      label: "Suchen",
      loadingText: "Suche läuft...",
    },
    noResults: "Keine Ergebnisse gefunden",
    response: {
      query: { content: "Gesucht" },
      results: {
        path: { content: "Pfad" },
        name: { content: "Name" },
        nodeType: { text: "Typ" },
        excerpt: { content: "Treffer" },
        score: { text: "Relevanz" },
        updatedAt: { content: "Aktualisiert" },
      },
      total: { text: "Gefunden" },
      searchMode: { text: "Modus" },
    },
    errors: {
      validation: {
        title: "Ungültige Eingabe",
        description: "Suchtext prüfen",
      },
      network: { title: "Offline", description: "Server nicht erreichbar" },
      unauthorized: { title: "Nicht eingeloggt", description: "Erst anmelden" },
      forbidden: { title: "Kein Zugriff", description: "Hier nicht suchbar" },
      notFound: {
        title: "Nicht gefunden",
        description: "Ordner existiert nicht",
      },
      server: {
        title: "Serverfehler",
        description: "Etwas ist schiefgelaufen",
      },
      unknown: { title: "Fehler", description: "Etwas ist schiefgelaufen" },
      unsavedChanges: {
        title: "Nicht gespeichert",
        description: "Erst speichern oder verwerfen",
      },
      conflict: { title: "Konflikt", description: "Nochmal versuchen" },
    },
    success: {
      title: "Fertig",
      description: "Suche abgeschlossen",
    },
  },
};
