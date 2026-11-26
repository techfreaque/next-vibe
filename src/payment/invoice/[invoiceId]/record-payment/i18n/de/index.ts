import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Abrechnung",
  enums: {
    manualPaymentMethod: {
      cash: "Bargeld",
      bankTransfer: "Banküberweisung",
      other: "Sonstiges",
    },
  },
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
      receiptKeyConflict:
        "Dieser Zahlungsschlüssel gehört bereits zu einer anderen Zahlung.",
      paymentPrecision:
        "Geben Sie einen positiven Betrag mit höchstens zwei Nachkommastellen ein.",
      paymentStatus:
        "Zahlungen können für offene Rechnungen mit einem positiven Betrag erfasst werden.",
      overpayment: "Die Zahlung übersteigt den offenen Rechnungsbetrag.",
      fullPayment:
        "Geben Sie bei einer Rechnung ohne Unternehmen den gesamten offenen Betrag ein.",
      issuancePosting:
        "Vor der Zahlung muss eine Forderung in Höhe des Rechnungsbetrags gebucht sein.",
      paymentAccount:
        "Wählen Sie ein aktives Bank- oder Kassenkonto dieses Unternehmens.",
      paymentPosting:
        "Prüfen Sie Zahlungsdatum, Unternehmenswährung und Buchungskonten.",
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
  receiptKey: {
    label: "Zahlungsschlüssel",
    description:
      "Verwenden Sie bei einem erneuten Versuch denselben Schlüssel. Nutzen Sie für eine weitere Zahlung einen neuen Schlüssel.",
  },
  accountNodeId: {
    label: "Zahlungskonto",
    description:
      "Wählen Sie das Bank- oder Kassenkonto, auf dem die Zahlung eingegangen ist.",
    placeholder: "Konto auswählen",
    automatic: "Standardkonto verwenden",
  },
  widget: {
    details: "Zahlungsdetails",
    back: "Zurück",
    submit: "Zahlung erfassen",
    paymentRecorded: "Zahlung wurde erfolgreich erfasst.",
    viewInvoice: "Rechnung ansehen",
    amountDue: "{{amount}} offen",
    notOpenTitle: "Diese Rechnung ist nicht offen",
    notOpenMessage:
      "Zahlungen gehen nur auf ausgestellte, unbezahlte Rechnungen. Stellen Sie die Rechnung zuerst aus oder öffnen Sie die richtige.",
  },
};
