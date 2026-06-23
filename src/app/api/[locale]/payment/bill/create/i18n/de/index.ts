import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    payment: "zahlung",
    bill: "rechnung",
    ap: "kreditorenbuchhaltung",
  },
  enums: {
    billStatus: {
      DRAFT: "Entwurf",
      RECEIVED: "Eingegangen",
      APPROVED: "Genehmigt",
      PAID: "Bezahlt",
      DISPUTED: "Strittig",
    },
  },
  post: {
    title: "Eingangsrechnung erfassen",
    titleShort: "Rechnung erstellen",
    description: "Lieferantenrechnung im System erfassen",
    form: {
      title: "Neue Lieferantenrechnung",
      description: "Rechnungsdaten des Lieferanten eingeben",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Felder prüfen und erneut versuchen",
      },
      unauthorized: {
        title: "Nicht angemeldet",
        description: "Anmelden um Rechnungen zu erfassen",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Buchhaltungs- oder Adminrolle erforderlich",
      },
      conflict: { title: "Konflikt", description: "Datenkonflikt" },
      server: {
        title: "Serverfehler",
        description: "Rechnung konnte nicht erstellt werden — erneut versuchen",
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
        description: "Ressource nicht gefunden",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen",
      },
    },
    success: {
      title: "Rechnung erfasst",
      description: "Lieferantenrechnung erfolgreich gespeichert",
    },
    widget: {
      back: "Zurück",
      submit: "Rechnung erfassen",
      viewButton: "Rechnung ansehen",
      addAnotherButton: "Weitere erfassen",
    },
    response: {
      id: "Rechnungs-ID",
      companyId: "Unternehmens-ID",
      supplierName: "Lieferant",
      billNumber: "Rechnungsnummer",
      billDate: "Rechnungsdatum",
      dueDate: "Fälligkeitsdatum",
      currency: "Währung",
      subtotal: "Nettobetrag",
      taxAmount: "MwSt",
      total: "Gesamtbetrag",
      status: "Status",
      createdAt: "Erstellt",
      updatedAt: "Aktualisiert",
    },
  },
  companyId: {
    label: "Unternehmen",
    description: "Das Unternehmen, das diese Rechnung erhält",
    placeholder: "Unternehmens-UUID",
  },
  supplierName: {
    label: "Lieferantenname",
    description: "Name des Lieferanten, der diese Rechnung geschickt hat",
    placeholder: "Mustermann GmbH",
  },
  supplierVatNumber: {
    label: "USt-IdNr. des Lieferanten",
    description: "Umsatzsteuer-Identifikationsnummer des Lieferanten",
    placeholder: "DE123456789",
  },
  billNumber: {
    label: "Rechnungsnummer",
    description: "Rechnungsnummer des Lieferanten",
    placeholder: "RE-2024-001",
  },
  billDate: {
    label: "Rechnungsdatum",
    description: "Datum der Rechnungsstellung",
    placeholder: "2024-01-01",
  },
  dueDate: {
    label: "Fälligkeitsdatum",
    description: "Zahlungsfrist",
    placeholder: "2024-01-31",
  },
  currency: {
    label: "Währung",
    description: "Rechnungswährung",
    placeholder: "EUR",
  },
  notes: {
    label: "Notizen",
    description: "Interne Notizen zur Rechnung",
    placeholder: "Optionale Notizen",
  },
};
