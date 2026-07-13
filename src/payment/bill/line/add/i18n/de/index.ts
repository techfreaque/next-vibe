import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { payment: "zahlung", bill: "rechnung", ap: "kreditorenbuchhaltung" },
  post: {
    title: "Rechnungsposition hinzufügen",
    titleShort: "Zeile hinzufügen",
    description:
      "Ausgabenposition zu einer Entwurfs-Lieferantenrechnung hinzufügen",
    form: {
      title: "Neue Rechnungsposition",
      description: "Ausgabendetails eingeben",
    },
    errors: {
      validation: { title: "Validierungsfehler", description: "Felder prüfen" },
      unauthorized: {
        title: "Nicht angemeldet",
        description: "Anmelden um Positionen hinzuzufügen",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Buchhaltungs- oder Adminrolle erforderlich",
      },
      conflict: {
        title: "Rechnung nicht editierbar",
        description: "Nur Entwurfsrechnungen können bearbeitet werden",
      },
      server: {
        title: "Serverfehler",
        description: "Position konnte nicht hinzugefügt werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      network: { title: "Netzwerkfehler", description: "Verbindung prüfen" },
      notFound: {
        title: "Rechnung nicht gefunden",
        description: "Diese Rechnung existiert nicht",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen",
      },
    },
    success: {
      title: "Position hinzugefügt",
      description: "Ausgabenposition zur Rechnung hinzugefügt",
    },
    response: {
      success: "Erfolg",
      message: "Meldung",
      line: {
        title: "Positionsdetails",
        subtitle: "Hinzugefügte Position",
        id: "Positions-ID",
        billId: "Rechnungs-ID",
        lineDescription: "Beschreibung",
        productId: "Produkt-ID",
        quantity: "Menge",
        unitPrice: "Einzelpreis",
        taxRate: "MwSt-Satz",
        taxAmount: "MwSt-Betrag",
        lineTotal: "Positionsbetrag",
        expenseAccountId: "Aufwandskonto",
        sortOrder: "Reihenfolge",
        createdAt: "Erstellt",
        updatedAt: "Aktualisiert",
      },
    },
  },
  billId: {
    label: "Rechnungs-ID",
    description: "Die Rechnung, zu der diese Position gehört",
    placeholder: "Rechnungs-UUID",
  },
  description: {
    label: "Beschreibung",
    description: "Was wurde eingekauft",
    placeholder: "Büromaterial",
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
    description: "Preis pro Einheit",
    placeholder: "100,00",
  },
  taxRate: {
    label: "MwSt-Satz",
    description: "MwSt-Satz (0–1, z.B. 0,19 für 19%)",
    placeholder: "0,19",
  },
  expenseAccountId: {
    label: "Aufwandskonto",
    description: "Auf welches Aufwandskonto diese Position gebucht wird",
    placeholder: "Konto-UUID",
  },
  widget: {
    submit: "Position hinzufügen",
    searchProduct: "Produkt suchen",
    searchPlaceholder: "Produktname oder SKU…",
    searchButton: "Suchen",
    clearProduct: "Löschen",
    noProductResults: "Keine Produkte gefunden.",
    orManual: "oder manuell eingeben",
    multiplier: "×",
    taxLabel: "MwSt.",
    linePreview: "Positionssumme (Vorschau)",
    addAnotherLine: "Weitere Position hinzufügen",
    viewBill: "Rechnung anzeigen",
  },
};
