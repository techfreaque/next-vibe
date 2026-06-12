import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Angebote",
  tags: { payment: "zahlung", estimate: "angebot" },
  post: {
    title: "Angebot abrufen",
    titleShort: "Angebot anzeigen",
    description: "Ein Angebot mit allen Positionen abrufen",
    form: {
      title: "Angebot abrufen",
      description: "Ein Angebot mit allen Positionen abrufen",
    },
    response: { success: "Erfolgreich", message: "Statusmeldung" },
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
        description: "Unbekannter Fehler",
      },
      network: { title: "Netzwerkfehler", description: "Netzwerkfehler" },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Zugriff verweigert",
      },
      notFound: {
        title: "Nicht gefunden",
        description: "Angebot nicht gefunden",
      },
      conflict: {
        title: "Konflikt",
        description: "Aktion im aktuellen Status nicht möglich",
      },
      unsavedChanges: {
        title: "Nicht gespeichert",
        description: "Nicht gespeicherte Änderungen",
      },
    },
    success: {
      title: "Erfolgreich",
      description: "Ein Angebot mit allen Positionen abrufen",
    },
  },
  estimateId: {
    label: "Angebots-ID",
    description: "Das Angebot, auf das die Aktion angewendet wird",
  },
  widget: {
    back: "Zurück",
    submit: "Angebot abrufen",
    estimateNumber: "Angebot",
    valid: "Gültig bis",
    customer: "Kunde",
    lineItems: "Positionen",
    description: "Beschreibung",
    qty: "Menge",
    unitPrice: "Einzelpreis",
    tax: "MwSt.",
    total: "Gesamt",
    subtotal: "Zwischensumme",
    sendEstimate: "Senden",
    acceptEstimate: "Annehmen",
    declineEstimate: "Ablehnen",
    convertToInvoice: "In Rechnung umwandeln",
    duplicate: "Duplizieren",
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
