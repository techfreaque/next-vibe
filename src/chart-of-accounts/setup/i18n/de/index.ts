import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    country: {
      AT: "Österreich (ÖKR)",
      DE: "Deutschland (SKR03)",
      XX: "Allgemeine IFRS-Vorlage",
      SK: "Slowakei (Rámcová účtová osnova)",
    },
  },
  post: {
    title: "Kontenplan einrichten",
    titleShort: "Kontenplan einrichten",
    description:
      "Ergänze die Konten deines Unternehmens mit einer Standardvorlage.",
    companyId: {
      label: "Unternehmen",
      description: "Wähle das Unternehmen aus.",
      placeholder: "Unternehmen auswählen",
    },
    country: {
      label: "Kontenplanvorlage",
      description: "Wähle die Kontenstruktur, die du ergänzen willst.",
      placeholder: "Vorlage auswählen",
    },
    response: {
      created: "Konten angelegt",
      skipped: "Konten beibehalten",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Sie müssen angemeldet sein, um einen Kontenplan einzurichten",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Prüfe das Unternehmen und die Kontenplanvorlage.",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description:
          "Nur Unternehmenseigentümer und Administratoren können Konten einrichten",
      },
      server: {
        title: "Serverfehler",
        description: "Wende die Vorlage erneut an.",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      conflict: {
        title: "Einrichtung prüfen",
        description:
          "Lade die Konten des Unternehmens neu, bevor du die Vorlage anwendest.",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Server nicht erreichbar",
      },
      notFound: {
        title: "Vorlage nicht gefunden",
        description: "Keine Kontenplanvorlage für dieses Land gefunden",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Sie haben ungespeicherte Änderungen",
      },
    },
    success: {
      title: "Kontenplan bereit",
      description:
        "Die Vorlage ist angewendet. Sieh dir die neuen und vorhandenen Konten an.",
    },
    widget: {
      review: "Einrichtung prüfen",
      previewLoading: "Vorhandene Konten werden geladen…",
      previewFailed: "Die aktuelle Kontenzahl ist nicht verfügbar.",
      existing: "Vorhandene Konten: {{count}}.",
      empty: "Für dieses Unternehmen gibt es noch keine Konten.",
      consequences:
        "Die Einrichtung ergänzt fehlende Kontonummern aus der Vorlage und erhält bestehende Daten.",
      submit: "Konten aus Vorlage hinzufügen",
      back: "Zurück",
      viewAccounts: "Kontenplan öffnen",
      viewPeriods: "Buchungsperioden ansehen",
    },
  },
  title: "Kontenplan-Einrichtung",
  description: "Unternehmenskonten aus Vorlage initialisieren",
  category: "Kontenplan",
  tag: "Einrichten",
};
