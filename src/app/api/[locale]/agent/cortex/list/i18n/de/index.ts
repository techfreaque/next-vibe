export const translations = {
  get: {
    title: "Ordner anzeigen",
    description: "Zeigt was in einem Ordner ist.",
    dynamicTitle: "{{path}}",
    status: {
      loading: "Auflisten...",
      done: "Aufgelistet",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "Pfad",
        description: "Welcher Ordner, z.B. / oder /documents",
      },
    },
    submitButton: {
      label: "Durchsuchen",
      loadingText: "Wird geladen...",
    },
    emptyState: "Dieser Ordner ist leer",
    folderNames: {
      memories: "Erinnerungen",
      documents: "Dokumente",
      threads: "Konversationen",
      skills: "Fähigkeiten",
      tasks: "Aufgaben",
      uploads: "Uploads",
      searches: "Suchen",
      gens: "Generierte Medien",
      inbox: "Eingang",
      projects: "Projekte",
      knowledge: "Wissen",
      journal: "Tagebuch",
      templates: "Vorlagen",
      identity: "Identität",
      expertise: "Fachgebiet",
      context: "Kontext",
    },
    response: {
      path: { content: "Pfad" },
      entries: {
        name: { content: "Name" },
        path: { content: "Pfad" },
        nodeType: { text: "Typ" },
        size: { text: "Größe" },
        updatedAt: { content: "Aktualisiert" },
      },
      total: { text: "Gesamt" },
    },
    errors: {
      validation: { title: "Ungültige Eingabe", description: "Pfad prüfen" },
      network: { title: "Offline", description: "Server nicht erreichbar" },
      unauthorized: { title: "Nicht eingeloggt", description: "Erst anmelden" },
      forbidden: {
        title: "Kein Zugriff",
        description: "Ordner nicht einsehbar",
      },
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
      title: "Aufgelistet",
      description: "Hier ist der Inhalt",
    },
  },
};
