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
    get: "Abrufen",
  },
  get: {
    title: "Unternehmensdetails",
    titleShort: "Unternehmen",
    description: "Unternehmensinformationen anzeigen",
    companyId: {
      label: "Unternehmens-ID",
      description: "Das anzuzeigende Unternehmen",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Unternehmens-ID",
      },
      unauthorized: {
        title: "Nicht angemeldet",
        description: "Anmelden um Unternehmensdetails anzuzeigen",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Sie sind kein Mitglied dieses Unternehmens",
      },
      conflict: {
        title: "Konflikt",
        description: "Datenkonflikt",
      },
      server: {
        title: "Serverfehler",
        description: "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.",
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
        title: "Unternehmen nicht gefunden",
        description:
          "Dieses Unternehmen existiert nicht oder Sie haben keinen Zugriff mehr",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen",
      },
    },
    success: {
      title: "Unternehmen geladen",
      description: "Unternehmensdetails abgerufen",
    },
    widget: {
      address: "Adresse",
      activeMembers: "Aktive Mitglieder",
      backToList: "Firmen",
      type: "Kundentyp",
      loadFailed: "Firma konnte nicht geladen werden",
      retry: "Erneut versuchen",
      related: "In dieser Firma arbeiten",
      setupAccounting: "Buchhaltung einrichten",
      back: "Zurück",
      loading: "Unternehmen wird geladen...",
      edit: "Bearbeiten",
      members: "Mitglieder",
      invite: "Mitglied einladen",
      chartOfAccounts: "Kontenplan",
      viewInvoices: "Rechnungen anzeigen",
      viewTerminals: "POS-Terminals anzeigen",
      active: "Aktiv",
      inactive: "Inaktiv",
      country: "Land",
      currency: "Währung",
      vatNumber: "USt-IdNr.",
      taxId: "Steuer-ID",
      email: "E-Mail",
      phone: "Telefon",
      website: "Website",
      createdAt: "Angelegt am",
      actions: "Aktionen",
      modules: {
        accounting: {
          label: "Buchhaltung",
        },
        invoices: {
          label: "Rechnungen",
        },
        estimates: {
          label: "Angebote",
        },
        bills: {
          label: "Eingangsrechnungen",
        },
        pos: {
          label: "Kasse",
        },
        purchasing: {
          label: "Einkauf",
        },
        inventory: {
          label: "Lager",
        },
        team: {
          label: "Team",
        },
      },
    },
  },
};
