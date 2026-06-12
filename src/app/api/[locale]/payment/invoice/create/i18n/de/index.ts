import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Abrechnung",
  tags: {
    payment: "zahlung",
    invoice: "rechnung",
    ar: "forderungen",
  },
  post: {
    title: "Ausgangsrechnung erstellen",
    titleShort: "Rechnung erstellen",
    description: "Neue Ausgangsrechnung für einen Kunden erstellen",
    form: {
      title: "Neue Rechnung",
      description: "Rechnungsdaten eingeben",
    },
    response: {
      success: "Rechnung erstellt",
      message: "Statusmeldung",
      invoice: {
        title: "Rechnung",
        subtitle: "Erstellte Rechnung",
        id: "Rechnungs-ID",
        companyId: "Firmen-ID",
        customerId: "Kunden-ID",
        invoiceSequenceNumber: "Rechnungsnummer",
        currency: "Währung",
        status: "Status",
        dueDate: "Fälligkeitsdatum",
        notes: "Hinweise",
        amount: "Betrag",
        createdAt: "Erstellt am",
        updatedAt: "Aktualisiert am",
      },
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Rechnungsparameter",
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
        description: "Muss Admin oder Buchhalter dieser Firma sein",
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
      title: "Rechnung erstellt",
      description: "Rechnung im Entwurfsstatus erstellt",
    },
    widget: {
      back: "Zurück",
      submit: "Rechnung erstellen",
      viewButton: "Rechnung anzeigen",
    },
  },
  companyId: {
    label: "Firmen-ID",
    description: "Die Firma, die diese Rechnung ausstellt",
    placeholder: "Firmen-ID eingeben",
  },
  customerId: {
    label: "Kunden-ID",
    description: "Optional: UUID des Kunden (weiche Referenz zum Nutzer)",
    placeholder: "Kunden-ID eingeben",
  },
  dueDate: {
    label: "Fälligkeitsdatum",
    description: "Wann diese Rechnung fällig ist",
    placeholder: "Datum auswählen",
  },
  currency: {
    label: "Währung",
    description: "Rechnungswährung",
    placeholder: "EUR",
  },
  notes: {
    label: "Hinweise",
    description: "Optionale Hinweise auf der Rechnung",
    placeholder: "z.B. Zahlungsziel: 30 Tage",
  },
};
