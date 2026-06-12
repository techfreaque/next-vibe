import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Angebote",
  tags: { payment: "zahlung", estimate: "angebot", invoice: "rechnung" },
  post: {
    title: "Angebot in Rechnung umwandeln",
    titleShort: "In Rechnung umwandeln",
    description: "Angenommenes Angebot in einen Rechnungsentwurf umwandeln",
    form: {
      title: "In Rechnung umwandeln",
      description: "Dieses Angebot in eine Rechnung umwandeln",
    },
    response: {
      success: "In Rechnung umgewandelt",
      message: "Statusmeldung",
      invoiceId: "Erstellte Rechnungs-ID",
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
        description: "Angebot muss GESENDET oder ANGENOMMEN sein",
      },
      unsavedChanges: {
        title: "Nicht gespeichert",
        description: "Nicht gespeicherte Änderungen",
      },
    },
    success: {
      title: "Erfolgreich",
      description: "Angebot in Rechnung umgewandelt",
    },
  },
  estimateId: {
    label: "Angebots-ID",
    description: "Das umzuwandelnde Angebot",
  },
  widget: {
    back: "Zurück",
    submit: "In Rechnung umwandeln",
    converted: "Aus diesem Angebot wurde eine Rechnung erstellt.",
    viewInvoice: "Rechnung ansehen",
    convertNote:
      "Ein Rechnungsentwurf mit denselben Positionen wird erstellt. Das Angebot wird als umgewandelt markiert.",
  },
};
