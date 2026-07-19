import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Abrechnung",
  tags: {
    payment: "zahlung",
    invoice: "rechnung",
    lines: "positionen",
  },
  post: {
    title: "Rechnungsposition hinzufügen",
    titleShort: "Zeile hinzufügen",
    description: "Eine Position zu einer Entwurfsrechnung hinzufügen",
    form: {
      title: "Rechnungsposition",
      description: "Abrechenbare Position definieren",
    },
    response: {
      success: "Position hinzugefügt",
      message: "Statusmeldung",
      line: {
        title: "Positionsdetails",
        subtitle: "Erstellte Rechnungsposition",
        id: "Positions-ID",
        invoiceId: "Rechnungs-ID",
        lineDescription: "Beschreibung",
        productId: "Produkt-ID",
        quantity: "Menge",
        unitPrice: "Stückpreis",
        taxRate: "Steuersatz",
        taxAmount: "Steuerbetrag",
        lineTotal: "Positionssumme",
        sortOrder: "Sortierreihenfolge",
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
        description: "Ungültige Positionsparameter",
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
        description: "Zugriff verboten",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Rechnung nicht gefunden",
      },
      conflict: {
        title: "Konflikt",
        description: "Rechnung ist kein Entwurf",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen",
      },
    },
    success: {
      title: "Erfolg",
      description: "Position zur Rechnung hinzugefügt",
    },
  },
  invoiceId: {
    label: "Rechnungs-ID",
    description: "Die Entwurfsrechnung, zu der diese Position gehört",
    placeholder: "Rechnungs-ID eingeben",
  },
  description: {
    label: "Beschreibung",
    description: "Was diese Position darstellt",
    placeholder: "z.B. Webentwicklung – 10 Stunden",
  },
  productId: {
    label: "Produkt-ID",
    description: "Optionale Produktreferenz",
    placeholder: "Produkt-ID eingeben",
  },
  quantity: {
    label: "Menge",
    description: "Anzahl der Einheiten",
    placeholder: "1",
  },
  unitPrice: {
    label: "Stückpreis",
    description: "Preis pro Einheit",
    placeholder: "0,00",
  },
  taxRate: {
    label: "Steuersatz",
    description: "Steuersatz als Dezimalzahl (z.B. 0,23 für 23%)",
    placeholder: "0,00",
  },
  widget: {
    searchProduct: "Produktkatalog durchsuchen",
    searchPlaceholder: "Name oder SKU…",
    searchButton: "Suchen",
    clearProduct: "Löschen",
    noProductResults: "Keine Treffer — unten manuell eingeben.",
    orManual: "Oder manuell eingeben",
    multiplier: "×",
    taxLabel: "Steuer",
    linePreview: "Positionssumme",
    lineAdded: "Position hinzugefügt",
    addAnotherLine: "Weitere Position hinzufügen",
    viewInvoice: "Rechnung anzeigen",
    submit: "Position hinzufügen",
  },
};
