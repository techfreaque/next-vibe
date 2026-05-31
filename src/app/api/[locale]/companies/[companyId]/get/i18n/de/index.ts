import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    companies: "Unternehmen",
    get: "Abrufen",
  },
  get: {
    title: "Unternehmensdetails",
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
      createdAt: "Mitglied seit",
      actions: "Aktionen",
      modules: {
        title: "Module",
        accounting: {
          label: "Buchhaltung",
          description: "Kontenplan, Buchungseinträge, Berichte",
        },
        invoices: {
          label: "Rechnungen",
          description: "Ausgangsrechnungen, Zahlungen",
        },
        estimates: {
          label: "Angebote",
          description: "Angebotsentwürfe für Kunden",
        },
        bills: {
          label: "Eingangsrechnungen",
          description: "Lieferantenrechnungen und Zahlungen",
        },
        pos: {
          label: "Kasse",
          description: "Terminals, Sitzungen, Bestellungen",
        },
        purchasing: {
          label: "Einkauf",
          description: "Bestellungen und Lieferanten",
        },
        inventory: {
          label: "Lager",
          description: "Bestände, Lagerorte, Transfers",
        },
        team: {
          label: "Team",
          description: "Mitglieder und Rollen",
        },
      },
    },
  },
};
