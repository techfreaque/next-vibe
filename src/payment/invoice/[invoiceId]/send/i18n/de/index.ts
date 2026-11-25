import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Abrechnung",
  tags: {
    payment: "zahlung",
    invoice: "rechnung",
  },
  post: {
    title: "Rechnung ausstellen",
    titleShort: "Rechnung ausstellen",
    description: "Stellen Sie den Entwurf aus und buchen Sie die Forderung.",
    form: {
      title: "Rechnung ausstellen",
      description: "Nach der Ausstellung steht ein Link für den Kunden bereit.",
    },
    response: {
      success: "Rechnung versendet",
      message: "Statusmeldung",
      viewUrl: "Kunden-Ansichts-URL",
    },
    errors: {
      invoiceLines:
        "Fügen Sie vor der Ausstellung Rechnungspositionen mit einem positiven Gesamtbetrag hinzu.",
      posting:
        "Prüfen Sie Rechnungsbetrag, Unternehmenswährung, Buchungsperiode und Buchungskonten.",
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
        description: "Rechnung ist kein Entwurf",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen",
      },
    },
    success: {
      title: "Erfolg",
      description: "Rechnung als versendet markiert",
    },
  },
  invoiceId: {
    label: "Rechnungs-ID",
    description: "ID der zu versendenden Rechnung",
    placeholder: "Rechnungs-ID eingeben",
  },
  widget: {
    back: "Zurück",
    submit: "Rechnung ausstellen",
    sent: "Rechnung ausgestellt",
    viewUrl: "Kunden-Ansichtslink",
  },
};
