import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    country: {
      AT: "Österreich (AT)",
      DE: "Deutschland (DE)",
      XX: "Generisch (XX)",
    },
  },
  tags: {
    companies: "unternehmen",
    onboard: "einrichten",
    setup: "einrichtung",
  },
  post: {
    title: "Unternehmen einrichten",
    titleShort: "Einrichten",
    description:
      "Neues Unternehmen einrichten: Kontenrahmen, Steuersätze und Standard-Bankkonto",
    companyId: {
      label: "Unternehmens-ID",
      description: "Das einzurichtende Unternehmen",
    },
    country: {
      label: "Land",
      description: "Das Land bestimmt Steuersätze und Kontenrahmen-Vorlage",
      placeholder: "DE",
    },
    errors: {
      validation: { title: "Validierungsfehler", description: "Felder prüfen" },
      unauthorized: {
        title: "Nicht angemeldet",
        description: "Anmelden um Unternehmen einzurichten",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Adminrolle erforderlich",
      },
      conflict: {
        title: "Bereits eingerichtet",
        description: "Das Unternehmen wurde bereits eingerichtet",
      },
      server: {
        title: "Serverfehler",
        description: "Einrichtung konnte nicht abgeschlossen werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      network: { title: "Netzwerkfehler", description: "Verbindung prüfen" },
      notFound: {
        title: "Unternehmen nicht gefunden",
        description: "Dieses Unternehmen existiert nicht",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen",
      },
    },
    success: {
      title: "Unternehmen bereit",
      description: "Unternehmen erfolgreich eingerichtet",
    },
    response: {
      accountsCreated: "Konten erstellt",
      accountsSkipped: "Konten übersprungen",
      taxRatesCreated: "Steuersätze erstellt",
      cashAccountId: "Kassenkonto-ID",
      bankAccountId: "Bankkonto-ID",
      success: "Erfolg",
    },
  },
};
