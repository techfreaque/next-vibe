import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    payment: "zahlung",
    bill: "rechnung",
    ap: "kreditorenbuchhaltung",
  },
  get: {
    title: "Eingangsrechnungen",
    titleShort: "Verbindlichkeiten",
    description: "Lieferantenrechnungen eines Unternehmens auflisten",
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Filterparameter prüfen",
      },
      unauthorized: {
        title: "Nicht angemeldet",
        description: "Anmelden um Rechnungen anzuzeigen",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Kein Mitglied dieses Unternehmens",
      },
      conflict: { title: "Konflikt", description: "Datenkonflikt" },
      server: {
        title: "Serverfehler",
        description: "Rechnungen konnten nicht geladen werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      network: { title: "Netzwerkfehler", description: "Verbindung prüfen" },
      notFound: {
        title: "Nicht gefunden",
        description: "Unternehmen nicht gefunden",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen",
      },
    },
    success: {
      title: "Rechnungen geladen",
      description: "Lieferantenrechnungen abgerufen",
    },
    response: {
      totalCount: "Gesamt",
      id: "ID",
      supplierName: "Lieferant",
      billNumber: "Rechnungs-Nr.",
      billDate: "Rechnungsdatum",
      dueDate: "Fälligkeitsdatum",
      currency: "Währung",
      billTotal: "Betrag",
      status: "Status",
      createdAt: "Erstellt",
    },
  },
  companyId: {
    label: "Unternehmen",
    description: "Nach Unternehmen filtern",
    placeholder: "Unternehmens-UUID",
  },
  status: {
    label: "Status",
    description: "Nach Rechnungsstatus filtern",
    placeholder: "Beliebiger Status",
  },
  page: { label: "Seite", description: "Seitennummer" },
  pageSize: { label: "Pro Seite", description: "Ergebnisse pro Seite" },
  enums: {
    billStatus: {
      DRAFT: "Entwurf",
      RECEIVED: "Erhalten",
      APPROVED: "Genehmigt",
      PAID: "Bezahlt",
      DISPUTED: "Angefochten",
    },
  },
  widget: {
    back: "Zurück",
    title: "Eingangsrechnungen",
    newBill: "Rechnung erfassen",
    loading: "Rechnungen werden geladen...",
    empty: {
      title: "Keine Eingangsrechnungen",
      hint: "Erfassen Sie eine Rechnung, sobald Sie eine Lieferantenrechnung erhalten.",
      cta: "Rechnung erfassen",
    },
    company: {
      select: "Unternehmen wählen",
      selected: "Unternehmen gewählt",
    },
    due: "Fällig",
    overdue: "Überfällig",
    view: "Ansehen",
  },
};
