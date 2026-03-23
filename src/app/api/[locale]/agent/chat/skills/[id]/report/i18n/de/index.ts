import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "KI-Werkzeuge",
  tags: {
    skills: "Fähigkeiten",
  },
  post: {
    title: "Fähigkeit melden",
    description:
      "Fähigkeit zur Moderation melden. Idempotent - eine Meldung pro Benutzer pro Fähigkeit.",
    dynamicTitle: "Melden: {{name}}",
    reason: {
      label: "Grund",
      description: "Warum melden Sie diese Fähigkeit?",
      placeholder: "Problem beschreiben...",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Bitte geben Sie einen Grund an",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Server fehlgeschlagen",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie müssen angemeldet sein um zu melden",
      },
      forbidden: {
        title: "Verboten",
        description: "Sie können diese Fähigkeit nicht melden",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Fähigkeit nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Fehler beim Einreichen Ihrer Meldung",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Sie haben ungespeicherte Änderungen",
      },
      conflict: {
        title: "Bereits gemeldet",
        description: "Sie haben diese Fähigkeit bereits gemeldet",
      },
    },
    success: {
      title: "Meldung eingereicht",
      description: "Danke für Ihre Hilfe bei der Sicherheit der Community",
    },
    response: {
      reported: { content: "Gemeldet" },
      reportCount: { content: "Anzahl der Meldungen" },
    },
    button: {
      submit: "Meldung einreichen",
      loading: "Wird eingereicht...",
    },
  },
};
