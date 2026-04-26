export const translations = {
  post: {
    title: "Embeddings nachfüllen",
    description: "Embeddings für alle Cortex-Knoten ohne Vektoren erzeugen.",
    status: {
      loading: "Einbetten...",
      done: "Fertig",
    },
    tags: {
      cortex: "Cortex",
    },
    widget: {
      hint: "Embeddings für alle Cortex-Knoten ohne Vektoren erzeugen. Kann etwas dauern.",
    },
    fields: {},
    submitButton: {
      label: "Starten",
      loadingText: "Läuft...",
    },
    response: {
      processed: { text: "Eingebettet" },
      failed: { text: "Fehlgeschlagen" },
      skipped: { text: "Übersprungen" },
    },
    errors: {
      validation: {
        title: "Ungültige Eingabe",
        description: "Ungültige Anfrage",
      },
      network: {
        title: "Offline",
        description: "Server nicht erreichbar",
      },
      unauthorized: {
        title: "Nicht eingeloggt",
        description: "Erst anmelden",
      },
      forbidden: {
        title: "Nur für Admins",
        description: "Adminrechte nötig",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Ressource nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Embedding-Dienst fehlgeschlagen",
      },
      unknown: {
        title: "Fehler",
        description: "Etwas ist schiefgelaufen",
      },
      unsavedChanges: {
        title: "Nicht gespeichert",
        description: "Erst speichern oder verwerfen",
      },
      conflict: {
        title: "Läuft bereits",
        description: "Ein Backfill läuft schon",
      },
    },
    success: {
      title: "Backfill abgeschlossen",
      description: "Alle Embeddings verarbeitet",
    },
  },
};
