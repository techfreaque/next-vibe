import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Angebote",
  tags: {
    payment: "zahlung",
    estimate: "angebot",
    list: "liste",
  },
  get: {
    title: "Angebote",
    titleShort: "Angebote",
    description: "Paginierte Angebotsliste eines Unternehmens abrufen",
    form: {
      title: "Angebotsfilter",
      description: "Angebote filtern und paginieren",
    },
    response: {
      totalCount: "Gesamtanzahl",
      id: "Angebots-ID",
      estimateNumber: "Angebotsnummer",
      status: "Status",
      customerId: "Kunden-ID",
      customerName: "Kundenname",
      currency: "Währung",
      total: "Gesamtbetrag",
      validUntil: "Gültig bis",
      lineCount: "Anzahl Positionen",
      createdAt: "Erstellt am",
      updatedAt: "Aktualisiert am",
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
      server: { title: "Serverfehler", description: "Interner Serverfehler" },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unbekannter Fehler",
      },
      network: {
        title: "Netzwerkfehler",
        description: "Netzwerkfehler aufgetreten",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Zugriff verweigert",
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
      description: "Angebote abgerufen",
    },
  },
  companyId: {
    label: "Unternehmens-ID",
    description: "Nach Unternehmen filtern",
    placeholder: "Unternehmens-ID eingeben",
  },
  status: {
    label: "Status",
    description: "Nach Status filtern",
    placeholder: "Alle Status",
  },
  customerId: {
    label: "Kunden-ID",
    description: "Nach Kunde filtern",
    placeholder: "Kunden-ID eingeben",
  },
  page: {
    label: "Seite",
    description: "Seitennummer",
  },
  pageSize: {
    label: "Seitengröße",
    description: "Einträge pro Seite",
  },
  widget: {
    back: "Zurück",
    title: "Angebote",
    newEstimate: "Neues Angebot",
    loading: "Angebote werden geladen...",
    noEstimates: "Noch keine Angebote.",
    noEstimatesHint: "Erstellen Sie Ihr erstes Angebot.",
    empty: {
      title: "Noch keine Angebote.",
      hint: "Erstes Angebot erstellen und loslegen.",
      cta: "Neues Angebot",
    },
    valid: "Gültig bis",
    lines: "Positionen",
    line: "Position",
    view: "Ansehen",
    status: {
      draft: "Entwurf",
      sent: "Gesendet",
      accepted: "Angenommen",
      declined: "Abgelehnt",
      expired: "Abgelaufen",
      converted: "Umgewandelt",
    },
  },
};
