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
    title: "Neue Lieferantenrechnung",
    titleShort: "Neue Lieferantenrechnung",
    description:
      "Erfassen Sie Lieferant und Positionen und speichern Sie den Entwurf.",
    form: {
      title: "Neue Lieferantenrechnung",
      description: "Rechnungsdaten des Lieferanten eingeben",
    },
    errors: {
      vendor: "Wählen Sie einen aktiven Lieferanten dieses Unternehmens.",
      supplier:
        "Geben Sie einen Lieferantennamen ein oder wählen Sie einen Lieferanten aus.",
      dates: "Geben Sie gültige Rechnungs- und Fälligkeitsdaten ein.",
      amounts: "Prüfen Sie die Positionen und den zulässigen Rechnungsbetrag.",
      expenseAccount:
        "Wählen Sie ein aktives Aufwandskonto dieses Unternehmens.",

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
      conflict: {
        title: "Konflikt",
        description:
          "Für diesen Lieferanten und diese Rechnungsnummer gibt es bereits eine Rechnung. Prüfe den vorhandenen Beleg.",
      },
      server: {
        title: "Serverfehler",
        description:
          "Rechnung konnte nicht erstellt werden. Bitte versuchen Sie es erneut.",
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
      supplier: "Lieferant",
      dates: "Rechnungsdaten und Währung",
      items: "Positionen",
      itemsDescription:
        "Optionale Positionen. Geben Sie den Steuersatz als Dezimalzahl von 0 bis 1 an.",
      itemsHint: "Fügen Sie die berechneten Waren oder Leistungen hinzu.",
      item: "Beschreibung",
      quantity: "Menge",
      unitPrice: "Einzelpreis",
      manualTaxRate: "Anderer Satz",
      taxRate: "USt. %",
      lineTotal: "Positionssumme",
      addItem: "Position hinzufügen",
      removeItem: "Position entfernen",
      itemError: "Prüfen Sie Beschreibung, Menge, Preis und USt.-Satz.",
      supplierTotalReview:
        "Vergleichen Sie diese Summe mit der Lieferantenrechnung. Prüfen Sie bei Abweichungen den Originalbeleg, bevor Sie speichern.",
      summary: "Rechnungsübersicht",
      net: "Netto",
      tax: "Umsatzsteuer",
      total: "Gesamt",
      chooseVendor: "Lieferanten auswählen",
      vendorSource: "Aus dem Lieferantenverzeichnis",
      terms: "Zahlungsziel des Lieferanten übernehmen",
      manualVendor: "Lieferanten manuell eingeben",
      selectCompanyFirst: "Wählen Sie zuerst ein Unternehmen aus.",

      back: "Zurück",
      submit: "Entwurf speichern",
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
  vendorId: {
    label: "Lieferanten auswählen",
    description: "Aus dem Lieferantenverzeichnis",
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
    placeholder: "Rechnungsdatum auswählen",
  },
  dueDate: {
    label: "Fälligkeitsdatum",
    description: "Zahlungsfrist",
    placeholder: "Fälligkeitsdatum auswählen",
  },
  currency: {
    code: "{{code}}",
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
