import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Abrechnung",
  tags: {
    payment: "zahlung",
    invoice: "rechnung",
    ar: "forderungen",
  },
  post: {
    title: "Zahlungserinnerung senden",
    titleShort: "Erinnerung senden",
    description:
      "Zahlungserinnerung für eine überfällige Rechnung senden. Rechnung muss offen und das Fälligkeitsdatum überschritten sein. Die Erinnerung wird als Kundennotiz protokolliert.",
    form: {
      title: "Erinnerung senden",
      description: "Kunden über ihre überfällige Zahlung benachrichtigen",
    },
    response: {
      success: "Erinnerung gesendet",
      message: "Statusmeldung",
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
        title: "Nicht überfällig",
        description:
          "Erinnerungen können nur für offene, überfällige Rechnungen gesendet werden",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen",
      },
    },
    success: {
      title: "Erfolg",
      description: "Zahlungserinnerung gesendet und protokolliert",
    },
  },
  invoiceId: {
    label: "Rechnungs-ID",
    description: "ID der überfälligen Rechnung",
    placeholder: "Rechnungs-ID eingeben",
  },
  message: {
    label: "Eigene Nachricht",
    description: "Optionale persönliche Nachricht für die Erinnerung",
    placeholder: "Persönliche Notiz zur Erinnerung hinzufügen...",
  },
  widget: {
    back: "Zurück",
    submit: "Erinnerung senden",
    reminderSent: "Erinnerung gesendet. Der Kunde wurde benachrichtigt.",
    viewInvoice: "Rechnung ansehen",
  },
};
