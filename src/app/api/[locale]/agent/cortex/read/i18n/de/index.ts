export const translations = {
  get: {
    title: "Datei lesen",
    description:
      "Beliebige Datei öffnen — Notizen, Threads, Erinnerungen, Skills oder Aufgaben.",
    dynamicTitle: "{{path}}",
    status: {
      loading: "Lesen...",
      done: "Geladen",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "Pfad",
        description:
          "Welche Datei. Deutsche Wurzel: /erinnerungen/, /dokumente/. Beispiel: /dokumente/notizen/ideen.md",
      },
      maxLines: {
        label: "Max. Zeilen",
        description: "Nur so viele Zeilen anzeigen",
      },
    },
    submitButton: {
      label: "Lesen",
      loadingText: "Wird gelesen...",
    },
    response: {
      path: { content: "Pfad" },
      content: { content: "Inhalt" },
      size: { text: "Größe" },
      truncated: { text: "Gekürzt" },
      readonly: { text: "Nur lesen" },
      nodeType: { text: "Typ" },
      updatedAt: { content: "Aktualisiert" },
    },
    errors: {
      validation: { title: "Ungültige Eingabe", description: "Pfad prüfen" },
      network: { title: "Offline", description: "Server nicht erreichbar" },
      unauthorized: { title: "Nicht eingeloggt", description: "Erst anmelden" },
      forbidden: {
        title: "Kein Zugriff",
        description: "Darfst du nicht lesen",
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
        title: "Konflikt",
        description: "Versionen stimmen nicht überein",
      },
    },
    success: {
      title: "Geladen",
      description: "Datei geladen",
    },
  },
};
