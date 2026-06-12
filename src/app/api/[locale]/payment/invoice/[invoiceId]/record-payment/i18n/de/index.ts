import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Abrechnung",
  tags: {
    payment: "zahlung",
    invoice: "rechnung",
  },
  post: {
    title: "Manuelle Zahlung erfassen",
    titleShort: "Zahlung erfassen",
    description:
      "Manuelle Zahlung gegen eine Rechnung erfassen. Als bezahlt markieren, wenn vollständig beglichen.",
    form: {
      title: "Zahlung erfassen",
      description: "Zahlungsdetails zur Rechnung eingeben",
    },
    response: {
      success: "Zahlung erfasst",
      message: "Statusmeldung",
    },
    errors: {
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Authentifizierung erforderlich",
      },
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Zahlungsparameter",
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
        description: "Rechnung ist bereits bezahlt oder storniert",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen",
      },
    },
    success: {
      title: "Erfolg",
      description: "Manuelle Zahlung erfasst",
    },
  },
  invoiceId: {
    label: "Rechnungs-ID",
    description: "ID der Rechnung, gegen die die Zahlung verbucht wird",
    placeholder: "Rechnungs-ID eingeben",
  },
  amount: {
    label: "Bezahlter Betrag",
    description: "Erhaltener Betrag",
    placeholder: "0,00",
  },
  method: {
    label: "Zahlungsmethode",
    description: "Wie die Zahlung eingegangen ist",
    placeholder: "Methode auswählen",
  },
  paidAt: {
    label: "Zahlungsdatum",
    description: "Wann die Zahlung eingegangen ist",
    placeholder: "Datum auswählen",
  },
  accountNodeId: {
    label: "Kontoknotens-ID",
    description: "Optional: Buchungsknoten, der diese Zahlung erhalten hat",
    placeholder: "Knotens-ID eingeben",
  },
  widget: {
    back: "Zurück",
    submit: "Zahlung erfassen",
    paymentRecorded: "Zahlung wurde erfolgreich erfasst.",
    viewInvoice: "Rechnung ansehen",
  },
};
