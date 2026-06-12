import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Abrechnung",
  tags: {
    payment: "zahlung",
    invoice: "rechnung",
  },
  post: {
    title: "Rechnung versenden",
    titleShort: "Rechnung senden",
    description:
      "Entwurfsrechnung als versendet markieren — Status wechselt zu Offen",
    form: {
      title: "Rechnung versenden",
      description: "Sendet die Rechnung an den Kunden",
    },
    response: {
      success: "Rechnung versendet",
      message: "Statusmeldung",
      viewUrl: "Kunden-Ansichts-URL",
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
    submit: "Rechnung senden",
    sent: "Rechnung versendet",
    viewUrl: "Kunden-Ansichtslink",
  },
};
