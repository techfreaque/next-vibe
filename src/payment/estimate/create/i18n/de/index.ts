import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Angebote",
  tags: {
    payment: "zahlung",
    estimate: "angebot",
    ar: "debitorenbuchhaltung",
  },
  post: {
    title: "Angebot erstellen",
    titleShort: "Angebot erstellen",
    description: "Neues Angebot als Entwurf erstellen",
    form: {
      title: "Neues Angebot",
      description: "Angebotsdetails eingeben",
    },
    response: {
      success: "Angebot erstellt",
      message: "Statusmeldung",
      estimate: {
        title: "Angebot",
        subtitle: "Erstelltes Angebot",
        id: "Angebots-ID",
        companyId: "Unternehmens-ID",
        estimateNumber: "Angebotsnummer",
        status: "Status",
        customerId: "Kunden-ID",
        customerEmail: "Kunden-E-Mail",
        customerName: "Kundenname",
        currency: "Währung",
        validUntil: "Gültig bis",
        title_field: "Titel",
        notes: "Anmerkungen",
        terms: "Konditionen",
        subtotal: "Zwischensumme",
        taxAmount: "Steuerbetrag",
        total: "Gesamtbetrag",
        invoiceId: "Rechnungs-ID",
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
        description: "Ungültige Angebotsparameter",
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
        title: "Zugriff verweigert",
        description: "Buchhalter- oder Adminrechte erforderlich",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Unternehmen nicht gefunden",
      },
      conflict: {
        title: "Konflikt",
        description: "Ein Konflikt ist aufgetreten",
      },
      unsavedChanges: {
        title: "Nicht gespeicherte Änderungen",
        description: "Es gibt nicht gespeicherte Änderungen",
      },
    },
    success: {
      title: "Erfolgreich",
      description: "Angebot als Entwurf erstellt",
    },
    widget: {
      back: "Zurück",
      submit: "Angebot erstellen",
      viewButton: "Angebot ansehen",
    },
  },
  companyId: {
    label: "Unternehmens-ID",
    description: "Das Unternehmen, das dieses Angebot ausstellt",
    placeholder: "Unternehmens-ID eingeben",
  },
  customerId: {
    label: "Kunden-ID",
    description: "Optional: UUID des Kunden",
    placeholder: "Kunden-ID eingeben",
  },
  customerEmail: {
    label: "Kunden-E-Mail",
    description: "E-Mail-Adresse des Kunden",
    placeholder: "kunde@beispiel.de",
  },
  customerName: {
    label: "Kundenname",
    description: "Name des Kunden",
    placeholder: "Kundenname eingeben",
  },
  currency: {
    label: "Währung",
    description: "Angebotswährung",
    placeholder: "EUR",
  },
  validUntil: {
    label: "Gültig bis",
    description: "Datum, bis zu dem das Angebot gültig ist",
    placeholder: "Ablaufdatum auswählen",
  },
  title: {
    label: "Titel",
    description: "Kurztitel für dieses Angebot",
    placeholder: "z.B. Website-Redesign-Angebot",
  },
  notes: {
    label: "Anmerkungen",
    description: "Optionale Anmerkungen auf dem Angebot",
    placeholder: "z.B. Preise 30 Tage gültig",
  },
  terms: {
    label: "Konditionen",
    description: "Zahlungs- oder Lieferbedingungen",
    placeholder: "z.B. 50% Anzahlung, 50% bei Lieferung",
  },
  lines: {
    label: "Positionen",
    description: "Im Angebot enthaltene Positionen",
  },
};
