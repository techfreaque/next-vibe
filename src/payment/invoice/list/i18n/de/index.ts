import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Abrechnung",
  enums: {
    invoiceStatus: {
      draft: "Entwurf",
      open: "Offen",
      paid: "Bezahlt",
      void: "Storniert",
      uncollectible: "Uneinbringlich",
    },
  },
  tags: {
    payment: "zahlung",
    invoice: "rechnung",
  },
  get: {
    title: "Ausgangsrechnungen",
    titleShort: "Ausgangsrechnungen",
    description:
      "Suche nach Belegnummer, Rechnungs-ID oder Kunden-ID. Filtere nach Unternehmen oder Status.",
    form: {
      title: "Rechnungsfilter",
      description: "Rechnungsliste filtern",
    },
    response: {
      customerName: "Kunde",
      total: "Gesamt",
      invoices: "Rechnungen",
      id: "Rechnungs-ID",
      invoiceSequenceNumber: "Rechnungsnummer",
      customerId: "Kunden-ID",
      currency: "Währung",
      status: "Status",
      amount: "Betrag",
      dueDate: "Fälligkeitsdatum",
      notes: "Hinweise",
      lineCount: "Anzahl Positionen",
      amountPaid: "Bezahlter Betrag",
      amountDue: "Offener Betrag",
      isOverdue: "Überfällig",
      createdAt: "Erstellt am",
      updatedAt: "Aktualisiert am",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Filterparameter",
      },
      server: {
        title: "Serverfehler",
        description: "Interner Serverfehler",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler ist aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten",
      },
      forbidden: {
        title: "Verboten",
        description: "Muss Mitglied dieser Firma sein",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Firma nicht gefunden",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt ist aufgetreten",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen",
      },
    },
    success: {
      title: "Erfolg",
      description: "Rechnungsliste abgerufen",
    },
  },
  companyId: {
    label: "Firmen-ID",
    description: "Rechnungen dieser Firma filtern",
    placeholder: "Firmen-ID eingeben",
  },
  search: {
    label: "Dokumente suchen",
    description: "Suchen Sie nach Rechnungsnummer, Kundenname oder ID.",
    placeholder: "Rechnungsnummer oder Kunde",
  },
  status: {
    label: "Status",
    description:
      "Filtern Sie nach Rechnungsstatus oder zeigen Sie überfällige Rechnungen mit offenem Betrag.",
    placeholder: "Alle Status",
  },
  customerId: {
    label: "Kunden-ID",
    description: "Nach Kunden filtern",
    placeholder: "Kunden-ID eingeben",
  },
  page: {
    label: "Seite",
    description: "Seitennummer",
  },
  pageSize: {
    label: "Seitengröße",
    description: "Ergebnisse pro Seite",
  },
  widget: {
    creditNote: "Gutschrift",
    creditable: "Rechnung für die Gutschrift auswählen",
    noCreditable: "Für keine Rechnung ist eine Gutschrift verfügbar.",
    filters: "Filter",
    partlyPaid: "Teilbezahlt",
    pageCount: "Seiten insgesamt",
    title: "Ausgangsrechnungen",
    newInvoice: "Neue Rechnung",
    loading: "Rechnungen werden geladen...",
    noInvoices: "Noch keine Rechnungen.",
    noInvoicesHint: "Erstellen Sie Ihre erste Rechnung.",
    overdue: "Überfällig",
    due: "Fällig",
    lines: "Positionen",
    line: "Position",
    view: "Ansehen",
    back: "Zurück",
    empty: {
      title: "Noch keine Rechnungen.",
      hint: "Erste Rechnung erstellen und loslegen.",
      cta: "Neue Rechnung",
    },
    status: {
      draft: "Entwurf",
      open: "Offen",
      paid: "Bezahlt",
      void: "Storniert",
      uncollectible: "Uneinbringlich",
    },
  },
};
