import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "KI-Werkzeuge",
  tags: {
    skills: "Fähigkeiten",
  },
  post: {
    title: "Für Fähigkeit abstimmen",
    description:
      "Abstimmung umschalten. Idempotent - erneut aufrufen zum Entfernen der Stimme.",
    dynamicTitle: "Abstimmung: {{name}}",
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
        description: "Sie müssen angemeldet sein um abzustimmen",
      },
      forbidden: {
        title: "Verboten",
        description: "Sie können für diese Fähigkeit nicht abstimmen",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Fähigkeit nicht gefunden",
      },
      server: {
        title: "Serverfehler",
        description: "Fehler bei der Verarbeitung Ihrer Abstimmung",
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
      title: "Abstimmung gespeichert",
      description: "Ihre Abstimmung wurde aktualisiert",
    },
    response: {
      voted: { content: "Abgestimmt" },
      voteCount: { content: "Stimmenanzahl" },
      trustLevel: { content: "Vertrauensstufe" },
    },
    backButton: {
      label: "Zurück",
    },
    button: {
      vote: "Upvoten",
      unvote: "Stimme entfernen",
      loading: "Wird gespeichert...",
    },
    badge: {
      verified: "Verifiziert",
    },
  },
};
