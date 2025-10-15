import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Titel",
    description: "Endpunkt-Beschreibung",
    form: {
      title: "Konfiguration",
      description: "Parameter konfigurieren",
    },
    response: {
      success: "Rechnung erfolgreich erstellt",
      message: "Statusmeldung",
      invoice: {
        title: "Rechnungsdetails",
        description: "Generierte Rechnungsinformationen",
        id: "Rechnungs-ID",
        userId: "Benutzer-ID",
        stripeInvoiceId: "Stripe-Rechnungs-ID",
        invoiceNumber: "Rechnungsnummer",
        amount: "Betrag",
        currency: "Währung",
        status: "Status",
        invoiceUrl: "Rechnungs-URL",
        invoicePdf: "Rechnungs-PDF",
        dueDate: "Fälligkeitsdatum",
        paidAt: "Bezahlt am",
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
        description: "Ungültige Anfrageparameter",
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
        description: "Ressource nicht gefunden",
      },
      conflict: {
        title: "Konflikt",
        description: "Datenkonflikt aufgetreten",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen",
      },
    },
    success: {
      title: "Erfolg",
      description: "Vorgang erfolgreich abgeschlossen",
    },
  },
  customerId: {
    label: "Kunden-ID",
    description: "Stripe-Kundenkennung",
    placeholder: "Kunden-ID eingeben",
  },
  amount: {
    label: "Betrag",
    description: "Rechnungsbetrag",
    placeholder: "Betrag eingeben",
  },
  currency: {
    label: "Währung",
    description: "Währungscode",
    placeholder: "Währung auswählen",
  },
  description: {
    label: "Beschreibung",
    description: "Rechnungsbeschreibung",
    placeholder: "Beschreibung eingeben",
  },
  dueDate: {
    label: "Fälligkeitsdatum",
    description: "Zahlungsfrist",
    placeholder: "Fälligkeitsdatum auswählen",
  },
  metadata: {
    label: "Metadaten",
    description: "Zusätzliche Metadaten",
    placeholder: "Metadaten als JSON eingeben",
  },
};
