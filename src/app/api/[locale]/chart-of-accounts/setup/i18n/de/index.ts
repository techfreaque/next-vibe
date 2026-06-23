import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    country: {
      AT: "AT — ÖKR",
      DE: "DE — SKR03",
      XX: "XX — IFRS Generisch",
    },
  },
  post: {
    title: "Kontenplan initialisieren",
    titleShort: "Einrichten",
    description:
      "Richtet den Kontenplan eines Unternehmens anhand einer länderspezifischen Vorlage ein. Idempotent — mehrfaches Ausführen ist sicher.",
    companyId: {
      label: "Unternehmens-ID",
      description: "Das Unternehmen, für das der Kontenplan eingerichtet wird",
      placeholder: "Unternehmens-UUID eingeben",
    },
    country: {
      label: "Land",
      description:
        "Zu verwendender Kontenstandard (AT = ÖKR, DE = SKR03, XX = IFRS Generisch)",
      placeholder: "Land auswählen",
    },
    response: {
      created: "Erstellte Konten",
      skipped: "Übersprungene Konten (bereits vorhanden)",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description:
          "Sie müssen angemeldet sein, um einen Kontenplan einzurichten",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Eingabe — Unternehmens-ID und Land prüfen",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description:
          "Nur Unternehmenseigentümer und Administratoren können Konten einrichten",
      },
      server: {
        title: "Serverfehler",
        description: "Einrichtung fehlgeschlagen — bitte erneut versuchen",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      conflict: {
        title: "Bereits initialisiert",
        description: "Dieses Unternehmen hat bereits einen Kontenplan",
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
      description: "Alle Konten wurden für das Unternehmen erstellt",
    },
    widget: {
      viewAccounts: "Kontenliste anzeigen",
    },
  },
  title: "Kontenplan-Einrichtung",
  description: "Unternehmenskonten aus Vorlage initialisieren",
  category: "Kontenplan",
  tag: "Einrichten",
};
