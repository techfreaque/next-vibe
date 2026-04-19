export const translations = {
  get: {
    title: "Baumansicht",
    description: "Gesamte Ordnerstruktur auf einen Blick.",
    dynamicTitle: "{{path}}",
    status: {
      loading: "Scannen...",
      done: "Gescannt",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "Pfad",
        description: "Ab hier anzeigen (Standard: Wurzel)",
      },
      depth: {
        label: "Tiefe",
        description: "Wie viele Ebenen tief",
      },
    },
    submitButton: {
      label: "Baum anzeigen",
      loadingText: "Wird geladen...",
    },
    response: {
      tree: { content: "Baum" },
      totalFiles: { text: "Dateien" },
      totalDirs: { text: "Ordner" },
    },
    errors: {
      validation: {
        title: "Ungültige Eingabe",
        description: "Pfad und Tiefe prüfen",
      },
      network: { title: "Offline", description: "Server nicht erreichbar" },
      unauthorized: { title: "Nicht eingeloggt", description: "Erst anmelden" },
      forbidden: { title: "Kein Zugriff", description: "Nicht einsehbar" },
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
      title: "Baum",
      description: "Hier die Struktur",
    },
  },
};
