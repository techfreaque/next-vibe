import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Abrechnung",
  tags: {
    payment: "zahlung",
    invoice: "rechnung",
    ar: "forderungen",
    creditNote: "gutschrift",
  },
  post: {
    title: "Gutschrift erstellen",
    titleShort: "Gutschrift erstellen",
    description:
      "Gutschrift zur ursprünglichen Rechnung erstellen. Vollgutschrift kehrt alle Positionen um. Teilgutschrift gilt für die angegebenen Positionen. Bucht eine Gegenbuchung: Soll Umsatz, Haben Forderungen.",
    form: {
      title: "Gutschrift erstellen",
      description: "Gutschrift gegen eine bestehende Rechnung ausstellen",
    },
    response: {
      success: "Gutschrift erstellt",
      message: "Statusmeldung",
      creditNote: {
        title: "Gutschrift",
        subtitle: "Details der erstellten Gutschrift",
        id: "Gutschrift-ID",
        invoiceId: "Ursprüngliche Rechnungs-ID",
        companyId: "Unternehmens-ID",
        currency: "Währung",
        status: "Status",
        amount: "Betrag",
        reason: "Grund",
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
        description: "Ungültige Parameter",
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
        title: "Gutschrift nicht möglich",
        description:
          "Gutschriften können nur für offene oder bezahlte Rechnungen ausgestellt werden",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen",
      },
    },
    success: {
      title: "Erfolg",
      description: "Gutschrift erstellt und Buchungssatz gebucht",
    },
    widget: {
      back: "Zurück",
      submit: "Gutschrift erstellen",
    },
  },
  invoiceId: {
    label: "Rechnungs-ID",
    description: "Die zu gutschreibende Rechnung",
    placeholder: "Rechnungs-ID eingeben",
  },
  companyId: {
    label: "Unternehmens-ID",
    description: "Unternehmen, das die Gutschrift ausstellt",
    placeholder: "Unternehmens-ID eingeben",
  },
  reason: {
    label: "Grund",
    description: "Warum diese Gutschrift ausgestellt wird",
    placeholder: "Grund für die Gutschrift beschreiben",
  },
  lineItems: {
    label: "Positionen",
    description:
      "Optionale Teilgutschrift-Positionen. Ohne Angabe wird eine Vollgutschrift angewendet.",
    placeholder: "",
  },
};
