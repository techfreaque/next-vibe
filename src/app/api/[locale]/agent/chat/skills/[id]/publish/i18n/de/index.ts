import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "KI-Werkzeuge",
  tags: {
    skills: "Fähigkeiten",
  },
  patch: {
    title: "Fähigkeit veröffentlichen",
    description:
      "Fähigkeit veröffentlichen oder zurückziehen. PUBLISHED macht sie im Community-Store sichtbar.",
    dynamicTitle: "Veröffentlichen: {{name}}",
    status: {
      label: "Status",
      description:
        "PUBLISHED für Store-Sichtbarkeit, DRAFT zum Verstecken, UNLISTED für Link-Zugriff.",
    },
    changeNote: {
      label: "Änderungsnotiz",
      description: "Optionale Notiz zur beschreibung der Änderungen.",
      placeholder: "z.B. Systemanweisung verbessert",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrage",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Server fehlgeschlagen",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Sie müssen angemeldet sein um zu veröffentlichen",
      },
      forbidden: {
        title: "Verboten",
        description: "Sie können nur Ihre eigenen Fähigkeiten veröffentlichen",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Fähigkeit nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Fehler beim Veröffentlichen",
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
        title: "Konflikt",
        description: "Ein Konflikt ist aufgetreten",
      },
    },
    success: {
      title: "Fähigkeit veröffentlicht",
      description: "Ihre Fähigkeit ist jetzt im Community-Store sichtbar",
    },
    response: {
      status: { content: "Status" },
      publishedAt: { content: "Veröffentlicht am" },
    },
    button: {
      submit: "Status speichern",
      loading: "Wird gespeichert...",
    },
  },
};
