export const translations = {
  post: {
    title: "Datei speichern",
    description:
      "Datei anlegen oder überschreiben. Pfad und Inhalt angeben — fertig.",
    dynamicTitle: "Gespeichert: {{path}}",
    status: {
      loading: "Schreiben...",
      done: "Gespeichert",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "Pfad",
        description: "Wohin, z.B. /documents/notizen/ideen.md",
      },
      content: {
        label: "Inhalt",
        description: "Was reinschreiben (Markdown)",
      },
      createParents: {
        label: "Ordner anlegen",
        description: "Fehlende Ordner automatisch erstellen",
      },
    },
    submitButton: {
      label: "Speichern",
      loadingText: "Wird gespeichert...",
    },
    response: {
      path: { content: "Pfad" },
      size: { text: "Größe" },
      created: { text: "Neue Datei" },
      updated: { text: "Aktualisiert" },
      updatedAt: { content: "Aktualisiert" },
    },
    errors: {
      validation: {
        title: "Ungültige Eingabe",
        description: "Pfad und Inhalt prüfen",
      },
      network: { title: "Offline", description: "Server nicht erreichbar" },
      unauthorized: { title: "Nicht eingeloggt", description: "Erst anmelden" },
      forbidden: {
        title: "Nur lesen",
        description: "Dieser Pfad ist schreibgeschützt",
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
      conflict: { title: "Existiert schon", description: "Da ist schon etwas" },
    },
    success: {
      title: "Gespeichert",
      description: "Datei gespeichert",
    },
  },
};
