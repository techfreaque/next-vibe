import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Chat",
  tags: {
    moderation: "Moderation",
  },
  post: {
    title: "Inhalt melden",
    titleShort: "Melden",
    description:
      "Melde einen öffentlichen Beitrag oder geteilten Thread. Genug Meldungen blenden ihn bis zur Prüfung durch einen Admin aus.",
    reason: {
      label: "Grund",
      description: "Was ist an diesem Inhalt falsch?",
    },
    note: {
      label: "Details",
      description: "Optional. Gib dem Prüfer Kontext.",
      placeholder: "Was soll der Prüfer wissen?",
    },
    reasons: {
      spam: "Spam",
      illegal: "Illegale Inhalte",
      abuse: "Missbrauch oder Belästigung",
      csamFlag: "Kinderschutz-Verdacht",
      other: "Sonstiges",
    },
    messageId: {
      label: "Nachrichten-ID",
      description: "Konkrete gemeldete Nachricht (optional)",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Wähle einen Grund",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung zum Server fehlgeschlagen",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Du kannst diesen Inhalt nicht melden",
      },
      forbidden: {
        title: "Verboten",
        description: "Eigene Inhalte kannst du nicht melden",
      },
      notFound: {
        title: "Nicht gefunden",
        description:
          "Dieser Inhalt existiert nicht mehr oder ist nicht verfügbar",
      },
      server: {
        title: "Serverfehler",
        description: "Deine Meldung konnte nicht gesendet werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Du hast ungespeicherte Änderungen",
      },
      conflict: {
        title: "Bereits gemeldet",
        description: "Du hast diesen Inhalt bereits gemeldet",
      },
      rateLimited: {
        title: "Zu viele Meldungen",
        description: "Du meldest zu schnell. Versuche es später erneut.",
      },
    },
    success: {
      title: "Meldung gesendet",
      description: "Danke. Wir prüfen jede Meldung.",
    },
    response: {
      reported: { content: "Gemeldet" },
      reportCount: { content: "Anzahl Meldungen" },
      hidden: { content: "Ausgeblendet" },
    },
    backButton: {
      label: "Zurück",
    },
    button: {
      submit: "Meldung senden",
      loading: "Wird gesendet...",
    },
  },
};
