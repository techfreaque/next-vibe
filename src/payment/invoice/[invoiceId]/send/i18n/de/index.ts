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
      success: "Rechnung ausgestellt",
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
      title: "Rechnung ausgestellt",
      description: "Der Kundenlink kann geteilt werden.",
    },
  },
  invoiceId: {
    label: "Rechnungs-ID",
    description: "ID der zu versendenden Rechnung",
    placeholder: "Rechnungs-ID eingeben",
  },
  delivery: {
    share: "Rechnung teilen",
    description:
      "Kopiere den Kundenlink oder sende ihn an die in der Rechnung gespeicherte E-Mail-Adresse.",
    send: "Per E-Mail senden",
    confirmDescription: "Sende den Rechnungslink an die bestätigte Adresse.",
    recipient: "Rechnungsempfänger",
    noRecipient:
      "Für diese Rechnung ist keine gültige Empfängeradresse gespeichert. Du kannst den Link kopieren.",
    status: "E-Mail-Status",
    notIssued: "Du kannst nur ausgestellte Rechnungen teilen.",
    recipientChanged:
      "Der Rechnungsempfänger fehlt oder hat sich geändert. Öffne „Rechnung teilen“ erneut.",
    emailSubject: "Rechnung {{number}}",
    emailText:
      "{{company}} hat die Rechnung {{number}} ausgestellt. Hier kannst du sie öffnen:\n{{url}}",
    states: {
      ready: "Versandbereit",
      pending:
        "Der E-Mail-Versand läuft oder ist unbestätigt. Weitere Versuche sind pausiert.",
      accepted: "Vom Mailserver angenommen.",
      retryable:
        "Der Mailserver wurde nicht kontaktiert. Du kannst es erneut versuchen.",
      uncertain:
        "Der Versandstatus ist unklar. Kläre mit dem Empfänger, ob der Link angekommen ist.",
    },
  },
  widget: {
    back: "Zurück",
    submit: "Rechnung ausstellen",
    sent: "Teile den Kundenlink, um die Rechnung zu übermitteln.",
    copy: "Kundenlink kopieren",
    copied: "Link kopiert",
    copyError:
      "Der Link konnte nicht kopiert werden. Markiere und kopiere die Adresse oben.",
    viewUrl: "Kunden-Ansichtslink",
  },
};
