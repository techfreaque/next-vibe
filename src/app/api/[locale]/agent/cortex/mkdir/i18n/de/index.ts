export const translations = {
  post: {
    title: "Neuer Ordner",
    description: "Ordner anlegen.",
    dynamicTitle: "{{path}}",
    status: {
      loading: "Erstellen...",
      done: "Erstellt",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "Pfad",
        description: "Ordnerpfad, z.B. /documents/projekte/meine-app",
      },
      viewType: {
        label: "Ansicht",
        description: "Darstellung (Liste, Kanban, Kalender, Raster)",
      },
      createParents: {
        label: "Ordner anlegen",
        description: "Fehlende übergeordnete Ordner auch erstellen",
      },
    },
    submitButton: {
      label: "Erstellen",
      loadingText: "Wird erstellt...",
    },
    response: {
      path: { content: "Pfad" },
      created: { text: "Erstellt" },
      alreadyExists: { text: "Bereits vorhanden" },
    },
    errors: {
      validation: { title: "Ungültige Eingabe", description: "Pfad prüfen" },
      network: { title: "Offline", description: "Server nicht erreichbar" },
      unauthorized: { title: "Nicht eingeloggt", description: "Erst anmelden" },
      forbidden: {
        title: "Kein Zugriff",
        description: "Hier keine Ordner erstellen",
      },
      notFound: {
        title: "Ordner fehlt",
        description: "Übergeordneter Ordner existiert nicht",
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
        title: "Existiert schon",
        description: "Ordner ist schon da",
      },
    },
    success: {
      title: "Erstellt",
      description: "Ordner bereit",
    },
  },
};
