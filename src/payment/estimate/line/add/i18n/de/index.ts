import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Angebote",
  tags: { payment: "zahlung", estimate: "angebot", lines: "positionen" },
  post: {
    title: "Angebotsposition hinzufügen",
    titleShort: "Zeile hinzufügen",
    description: "Dem Angebot eine Position hinzufügen",
    form: {
      title: "Angebotsposition hinzufügen",
      description: "Produkt oder Dienstleistung zum Angebot hinzufügen",
    },
    response: {
      success: "Erfolgreich",
      message: "Statusmeldung",
      line: {
        title: "Position",
        subtitle: "Hinzugefügte Position",
        id: "Positions-ID",
        estimateId: "Angebots-ID",
        lineDescription: "Beschreibung",
        productId: "Produkt-ID",
        quantity: "Menge",
        unitPrice: "Einzelpreis",
        taxRate: "Steuersatz",
        taxAmount: "Steuerbetrag",
        lineTotal: "Zeilensumme",
        sortOrder: "Reihenfolge",
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
        description: "Position prüfen",
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
      forbidden: { title: "Zugriff verweigert", description: "Kein Zugriff" },
      notFound: {
        title: "Nicht gefunden",
        description: "Angebot nicht gefunden",
      },
      conflict: {
        title: "Konflikt",
        description: "Angebot muss im Entwurfsstatus sein",
      },
      unsavedChanges: {
        title: "Nicht gespeichert",
        description: "Nicht gespeicherte Änderungen",
      },
    },
    success: {
      title: "Position hinzugefügt",
      description: "Position wurde dem Angebot hinzugefügt",
    },
  },
  estimateId: {
    label: "Angebots-ID",
    description: "Das Angebot, dem eine Position hinzugefügt wird",
    placeholder: "Angebots-UUID",
  },
  description: {
    label: "Beschreibung",
    description: "Produkt- oder Dienstleistungsbeschreibung",
    placeholder: "z.B. Webentwicklung - 10 Stunden",
  },
  productId: {
    label: "Produkt-ID",
    description: "Optionale Produktreferenz",
    placeholder: "Produkt-UUID",
  },
  quantity: {
    label: "Menge",
    description: "Anzahl der Einheiten",
    placeholder: "1",
  },
  unitPrice: {
    label: "Einzelpreis",
    description: "Preis pro Einheit (ohne Steuer)",
    placeholder: "0,00",
  },
  taxRate: {
    label: "Steuersatz",
    description: "Steuersatz als Dezimalzahl (z.B. 0,23 für 23%)",
    placeholder: "0,23",
  },
  widget: {
    searchProduct: "Produkt suchen",
    searchPlaceholder: "Produktname oder SKU...",
    searchButton: "Suchen",
    clearProduct: "Entfernen",
    noProductResults: "Keine Produkte gefunden.",
    orManual: "oder manuell eingeben",
    multiplier: "×",
    taxLabel: "Steuer",
    linePreview: "Zeilensumme",
    addAnotherLine: "Weitere Position hinzufügen",
    viewEstimate: "Zurück zum Angebot",
    submit: "Position hinzufügen",
  },
};
