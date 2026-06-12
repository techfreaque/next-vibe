import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Abrechnung",
  tags: {
    payment: "zahlung",
    invoice: "rechnung",
    ar: "forderungen",
  },
  post: {
    title: "Rechnung duplizieren",
    titleShort: "Rechnung duplizieren",
    description:
      "Bestehende Rechnung als neuen Entwurf klonen. Kopiert alle Positionen, Kunden, Unternehmen und Währung. Erhält eine neue Rechnungsnummer und das heutige Datum.",
    form: {
      title: "Rechnung duplizieren",
      description: "Erstellt eine neue Entwurfsrechnung aus dieser Rechnung",
    },
    response: {
      success: "Rechnung dupliziert",
      message: "Statusmeldung",
      invoice: {
        title: "Neue Rechnung",
        subtitle: "Duplizierte Entwurfsrechnung",
        id: "Rechnungs-ID",
        companyId: "Unternehmens-ID",
        customerId: "Kunden-ID",
        invoiceSequenceNumber: "Rechnungsnummer",
        currency: "Währung",
        status: "Status",
        dueDate: "Fälligkeitsdatum",
        notes: "Notizen",
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
        title: "Konflikt",
        description: "Ein Konflikt ist aufgetreten",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen",
      },
    },
    success: {
      title: "Erfolg",
      description: "Rechnung als neuer Entwurf dupliziert",
    },
  },
  invoiceId: {
    label: "Rechnungs-ID",
    description: "ID der zu duplizierenden Rechnung",
    placeholder: "Rechnungs-ID eingeben",
  },
  widget: {
    back: "Zurück",
    submit: "Rechnung duplizieren",
    duplicated: "Rechnung dupliziert",
    invoiceNumber: "Rechnung Nr.",
    viewDuplicate: "Duplikat anzeigen",
  },
};
