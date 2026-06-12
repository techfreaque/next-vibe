import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Angebote",
  tags: { payment: "zahlung", estimate: "angebot" },
  post: {
    title: "Angebot versenden",
    titleShort: "Angebot senden",
    description: "Angebot als an Kunden versendet markieren",
    form: {
      title: "Angebot versenden",
      description: "Angebot als an Kunden versendet markieren",
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
      description: "Angebot als an Kunden versendet markieren",
    },
  },
  estimateId: {
    label: "Angebots-ID",
    description: "Das Angebot, auf das die Aktion angewendet wird",
  },
  widget: {
    back: "Zurück",
    submit: "Angebot senden",
    sent: "Angebot als an den Kunden versendet markiert.",
    sendNote:
      "Der Status des Angebots wird auf 'Versendet' gesetzt. Der Kunde kann es dann annehmen oder ablehnen.",
  },
};
