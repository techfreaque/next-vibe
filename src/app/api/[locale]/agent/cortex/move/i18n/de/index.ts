export const translations = {
  post: {
    title: "Verschieben",
    description: "Datei oder Ordner verschieben oder umbenennen.",
    dynamicTitle: "{{from}} → {{to}}",
    status: {
      loading: "Verschieben...",
      done: "Verschoben",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      from: {
        label: "Von",
        description: "Aktueller Pfad",
      },
      to: {
        label: "Nach",
        description: "Neuer Pfad",
      },
    },
    submitButton: {
      label: "Verschieben",
      loadingText: "Wird verschoben...",
    },
    response: {
      from: { content: "Von" },
      to: { content: "Nach" },
      nodesAffected: { text: "Verschoben" },
    },
    errors: {
      validation: {
        title: "Ungültige Eingabe",
        description: "Beide Pfade prüfen",
      },
      network: { title: "Offline", description: "Server nicht erreichbar" },
      unauthorized: { title: "Nicht eingeloggt", description: "Erst anmelden" },
      forbidden: {
        title: "Kein Zugriff",
        description: "Darfst du nicht verschieben",
      },
      notFound: { title: "Nicht gefunden", description: "Nichts am Quellpfad" },
      server: {
        title: "Serverfehler",
        description: "Etwas ist schiefgelaufen",
      },
      unknown: { title: "Fehler", description: "Etwas ist schiefgelaufen" },
      unsavedChanges: {
        title: "Nicht gespeichert",
        description: "Erst speichern oder verwerfen",
      },
      conflict: { title: "Blockiert", description: "Am Ziel ist schon etwas" },
    },
    success: {
      title: "Verschoben",
      description: "Erledigt",
    },
  },
};
