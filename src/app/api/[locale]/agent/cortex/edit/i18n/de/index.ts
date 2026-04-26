export const translations = {
  patch: {
    title: "Datei bearbeiten",
    description:
      "Teil einer Datei ändern. Text suchen und ersetzen, oder bestimmte Zeilen bearbeiten.",
    dynamicTitle: "{{path}}",
    status: {
      loading: "Bearbeiten...",
      done: "Bearbeitet",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "Pfad",
        description: "Welche Datei bearbeiten",
      },
      find: {
        label: "Suchen",
        description: "Diesen Text finden",
      },
      replace: {
        label: "Ersetzen",
        description: "Damit ersetzen",
      },
      startLine: {
        label: "Ab Zeile",
        description: "Ab dieser Zeilennummer",
      },
      endLine: {
        label: "Bis Zeile",
        description: "Bis zu dieser Zeilennummer",
      },
      newContent: {
        label: "Neuer Inhalt",
        description: "Das stattdessen einsetzen",
      },
    },
    submitButton: {
      label: "Anwenden",
      loadingText: "Wird angewendet...",
    },
    response: {
      path: { content: "Pfad" },
      size: { text: "Größe" },
      replacements: { text: "Änderungen" },
      updatedAt: { content: "Aktualisiert" },
    },
    errors: {
      validation: {
        title: "Ungültige Eingabe",
        description: "Pfad und Suchen/Ersetzen prüfen",
      },
      network: { title: "Offline", description: "Server nicht erreichbar" },
      unauthorized: { title: "Nicht eingeloggt", description: "Erst anmelden" },
      forbidden: {
        title: "Kein Zugriff",
        description: "Darfst du nicht bearbeiten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Datei existiert nicht",
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
        title: "Konflikt",
        description: "Datei wurde gleichzeitig geändert",
      },
    },
    success: {
      title: "Bearbeitet",
      description: "Änderungen gespeichert",
    },
  },
};
