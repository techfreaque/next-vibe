import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Konto",
  get: {
    title: "Meine Daten exportieren",
    titleShort: "Daten exportieren",
    description:
      "Lade alles herunter, was wir über dich speichern: Profil, Chats, Erinnerungen, Skills, Credits, Empfehlungen, Newsletter, Adressen. JSON plus lesbare Zusammenfassung.",
    tags: { export: "Datenexport" },
    response: {
      json: { title: "Alle Daten (JSON)" },
      jsonFilename: { title: "JSON-Dateiname" },
      markdown: { title: "Zusammenfassung (Markdown)" },
      markdownFilename: { title: "Dateiname der Zusammenfassung" },
    },
    success: {
      title: "Export bereit",
      description: "Dein Datenarchiv wurde erstellt",
    },
    md: {
      heading: "Dein Datenexport",
      generated: "Erstellt",
      account: "Konto",
      email: "E-Mail",
      name: "Name",
      memberSince: "Mitglied seit",
      contents: "Inhalt",
      records: "Datensätze",
      note: "Alle Details stehen in der JSON-Datei. Der Export enthält nur Daten, die zu deinem Konto gehören.",
    },
    widget: {
      intro:
        "Erhalte eine Kopie deiner Daten: eine vollständige JSON-Datei und eine lesbare Markdown-Zusammenfassung. Enthalten sind nur deine eigenen Daten.",
      downloadJson: "JSON herunterladen",
      downloadMarkdown: "Zusammenfassung herunterladen",
      generate: "Export vorbereiten",
      preparing: "Wird vorbereitet...",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrage",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Melde dich an, um deine Daten zu exportieren",
      },
      forbidden: {
        title: "Verboten",
        description: "Du darfst diese Daten nicht exportieren",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Konto nicht gefunden",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Ein Netzwerkfehler ist aufgetreten",
      },
      server: {
        title: "Export fehlgeschlagen",
        description:
          "Dein Export konnte nicht erstellt werden. Versuche es später erneut.",
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
        title: "Konflikt",
        description: "Ein Konflikt ist aufgetreten",
      },
    },
  },
};
