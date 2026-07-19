import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Zahlungen",
  tags: { payment: "zahlung", invoice: "rechnung" },
  get: {
    title: "Rechnung anzeigen",
    titleShort: "Rechnung anzeigen",
    description: "Öffentliche Rechnungsansicht über sicheren Token-Link",
    form: {
      title: "Rechnung",
      description: "Rechnungsdetails anzeigen",
    },
    response: {
      id: "Rechnungs-ID",
      invoiceNumber: "Rechnungsnummer",
      currency: "Währung",
      status: "Status",
      amount: "Betrag",
      dueDate: "Fälligkeitsdatum",
      notes: "Notizen",
      createdAt: "Ausstellungsdatum",
      companyName: "Unternehmen",
      companyEmail: "Unternehmens-E-Mail",
      lineId: "Positions-ID",
      lineDescription: "Beschreibung",
      productId: "Produkt",
      quantity: "Menge",
      unitPrice: "Einzelpreis",
      taxRate: "Steuersatz",
      taxAmount: "Steuer",
      lineTotal: "Zeilensumme",
      sortOrder: "Reihenfolge",
      lineCreatedAt: "Erstellt",
      lineUpdatedAt: "Aktualisiert",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      validation: {
        title: "Ungültiger Link",
        description: "Der Rechnungslink ist ungültig",
      },
      server: { title: "Serverfehler", description: "Interner Serverfehler" },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Unbekannter Fehler aufgetreten",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Ungültiger oder abgelaufener Rechnungslink",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Rechnung nicht gefunden",
      },
      conflict: { title: "Konflikt", description: "Rechnungsstatus-Konflikt" },
      unsavedChanges: {
        title: "Nicht gespeichert",
        description: "Nicht gespeicherte Änderungen",
      },
    },
    success: { title: "Rechnung", description: "Ihre Rechnungsdetails" },
  },
  invoiceId: {
    label: "Rechnungs-ID",
    description: "Die anzuzeigende Rechnung",
  },
  token: {
    label: "Zugriffstoken",
    description: "Sicherer Zugriffstoken aus Ihrer Rechnungs-E-Mail",
  },
  widget: {
    submit: "Rechnung anzeigen",
  },
};
