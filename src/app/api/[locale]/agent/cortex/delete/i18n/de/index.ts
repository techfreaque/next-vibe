export const translations = {
  delete: {
    title: "Löschen",
    description: "Datei oder Ordner entfernen. Unwiderruflich.",
    dynamicTitle: "{{path}}",
    status: {
      loading: "Löschen...",
      done: "Gelöscht",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "Pfad",
        description: "Was löschen",
      },
      recursive: {
        label: "Mit Inhalt",
        description: "Auch alles darin löschen",
      },
    },
    submitButton: {
      label: "Löschen",
      loadingText: "Wird gelöscht...",
    },
    response: {
      path: { content: "Pfad" },
      nodesDeleted: { text: "Gelöscht" },
    },
    errors: {
      validation: { title: "Ungültige Eingabe", description: "Pfad prüfen" },
      network: { title: "Offline", description: "Server nicht erreichbar" },
      unauthorized: { title: "Nicht eingeloggt", description: "Erst anmelden" },
      forbidden: {
        title: "Kein Zugriff",
        description: "Darfst du nicht löschen",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Nichts unter diesem Pfad",
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
      conflict: {
        title: "Nicht leer",
        description: "Ordner ist nicht leer - Mit Inhalt aktivieren",
      },
    },
    success: {
      title: "Gelöscht",
      description: "Weg",
    },
  },
};
