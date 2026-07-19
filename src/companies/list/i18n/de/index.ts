import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    companyType: {
      b2b: "B2B",
      b2c: "B2C",
      individual: "Einzelperson",
    },
    companyMemberRole: {
      owner: "Inhaber",
      admin: "Administrator",
      member: "Mitglied",
      accountant: "Buchhalter",
      viewer: "Betrachter",
    },
  },
  tags: {
    companies: "Unternehmen",
    list: "Liste",
  },
  get: {
    title: "Meine Unternehmen",
    titleShort: "Meine Unternehmen",
    description: "Unternehmen, bei denen Sie Mitglied sind",
    page: {
      label: "Seite",
      description: "Seitennummer (beginnt bei 1)",
    },
    pageSize: {
      label: "Pro Seite",
      description: "Ergebnisse pro Seite (max. 100)",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Anfrage",
      },
      unauthorized: {
        title: "Nicht angemeldet",
        description: "Anmelden um Ihre Unternehmen anzuzeigen",
      },
      forbidden: {
        title: "Keine Berechtigung",
        description: "Zugriff verweigert",
      },
      conflict: {
        title: "Konflikt",
        description: "Datenkonflikt",
      },
      server: {
        title: "Serverfehler",
        description: "Etwas ist schiefgelaufen — bitte erneut versuchen",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Verbindung prüfen und erneut versuchen",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Keine Unternehmen gefunden",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen",
      },
    },
    success: {
      title: "Unternehmen geladen",
      description: "Unternehmensliste abgerufen",
    },
    widget: {
      back: "Zurück",
      loading: "Unternehmen werden geladen...",
      title: "Meine Unternehmen",
      create: "Neues Unternehmen",
      total: "Unternehmen",
      totalSingular: "Unternehmen",
      inactive: "Inaktiv",
      empty: {
        title: "Noch keine Unternehmen",
        hint: "Erstellen Sie ein Unternehmen, um Buchhaltung, Rechnungsstellung und Ihr Team zu verwalten.",
        cta: "Erstes Unternehmen anlegen",
      },
    },
    response: {
      total: "Gesamt",
      id: "ID",
      name: "Name",
      type: "Typ",
      role: "Ihre Rolle",
      isActive: "Aktiv",
      country: "Land",
      currency: "Währung",
      email: "E-Mail",
      createdAt: "Erstellt",
    },
  },
};
