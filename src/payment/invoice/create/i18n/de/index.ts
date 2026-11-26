import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Abrechnung",
  tags: {
    payment: "zahlung",
    invoice: "rechnung",
    ar: "forderungen",
  },
  post: {
    title: "Neue Rechnung",
    titleShort: "Neue Rechnung",
    description: "Bereiten Sie eine Rechnung für Ihren Kunden vor.",
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
      draftSaved: "Rechnungsentwurf gespeichert",
      draftSavedNumber: "Rechnungsentwurf Nr. {{number}} gespeichert",
      details: "Rechnungsdetails",
      draftHint: "Speichern Sie einen Entwurf zur Prüfung vor der Ausstellung.",
      items: "Positionen",
      itemsDescription:
        "Optionale Positionen für den Entwurf. Geben Sie den Steuersatz als Dezimalzahl von 0 bis 1 an.",
      itemsHint:
        "Fügen Sie Waren oder Leistungen hinzu, um den Rechnungsbetrag zu berechnen.",
      item: "Beschreibung",
      quantity: "Menge",
      unitPrice: "Einzelpreis",
      manualTaxRate: "Anderer Satz",
      taxRate: "USt. %",
      addItem: "Position hinzufügen",
      removeItem: "Position entfernen",
      itemError:
        "Geben Sie eine Beschreibung, eine positive Menge, einen Preis und einen USt.-Satz zwischen 0 und 100 % ein.",
      itemsTotalError:
        "Der Gesamtbetrag ist für eine einzelne Rechnung zu hoch.",
      summary: "Zusammenfassung",
      net: "Netto",
      tax: "Umsatzsteuer",
      total: "Gesamt",
      customerSelected: "Kunde ausgewählt",
      clearCustomer: "Kundenauswahl aufheben",
      lineTotal: "Positionssumme",
      companyCurrencyValue: "Unternehmenswährung: {{currency}}",
      companyCurrency: "Ohne Auswahl gilt die Unternehmenswährung.",
      back: "Zurück",
      submit: "Entwurf speichern",
      saving: "Entwurf wird gespeichert…",
      retrySave: "Entwurf erneut speichern",
      saveFailed: "Rechnungsentwurf konnte nicht gespeichert werden",
      saveFailedHint:
        "Ihre Eingaben sind noch da. Prüfen Sie sie und speichern Sie den Entwurf erneut.",
      viewButton: "Rechnung anzeigen",
    },
  },
  companyId: {
    label: "Unternehmen",
    description: "Die Firma, die diese Rechnung ausstellt",
    placeholder: "Firmen-ID eingeben",
  },
  customerId: {
    label: "Kunde",
    description: "Suchen Sie den Kunden anhand seines Namens.",
    placeholder: "Kunden-ID eingeben",
  },
  dueDate: {
    label: "Fälligkeitsdatum",
    description: "Wann diese Rechnung fällig ist",
    placeholder: "Datum auswählen",
  },
  currency: {
    code: "{{code}}",
    label: "Währung",
    description: "Rechnungswährung",
    placeholder: "Unternehmenswährung",
  },
  notes: {
    label: "Hinweise",
    description: "Optionale Hinweise auf der Rechnung",
    placeholder: "z.B. Zahlungsziel: 30 Tage",
  },
  supplyDate: {
    label: "Leistungsdatum",
    description:
      "Tag der Lieferung oder Leistung. Standard ist das Rechnungsdatum.",
  },
  vatTreatment: {
    label: "Umsatzsteuer-Behandlung",
    description:
      "Inländische Umsatzsteuer, Reverse-Charge oder eine Befreiung. Reverse-Charge und EU-Umsätze brauchen die USt-IdNr. des Kunden.",
    options: {
      DOMESTIC: "Inlandsumsatz mit Umsatzsteuer",
      REVERSE_CHARGE_DOMESTIC: "Reverse-Charge im Inland",
      EU_SERVICES_REVERSE_CHARGE:
        "Leistung an ein EU-Unternehmen (Reverse-Charge)",
      EU_GOODS_EXEMPT: "Lieferung an ein EU-Unternehmen (steuerfrei)",
      EXPORT_EXEMPT: "Ausfuhr außerhalb der EU (steuerfrei)",
      EXEMPT: "Steuerfreier Umsatz",
    },
  },
};
