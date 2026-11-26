import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Abrechnung",
  tags: {
    payment: "zahlung",
    invoice: "rechnung",
    ar: "forderungen",
    creditNote: "gutschrift",
  },
  post: {
    title: "Gutschrift erstellen",
    titleShort: "Gutschrift erstellen",
    description:
      "Erstellen Sie eine vollständige oder teilweise Gutschrift zu einer gebuchten Rechnung. Sie korrigiert Forderung, Erlös und Umsatzsteuer.",
    form: {
      title: "Gutschrift erstellen",
      description: "Gutschrift gegen eine bestehende Rechnung ausstellen",
    },
    response: {
      success: "Gutschrift erstellt",
      message: "Statusmeldung",
      creditNote: {
        title: "Gutschrift",
        subtitle: "Details der erstellten Gutschrift",
        id: "Gutschrift-ID",
        invoiceId: "Ursprüngliche Rechnungs-ID",
        companyId: "Unternehmens-ID",
        currency: "Währung",
        status: "Status",
        amount: "Betrag",
        reason: "Grund",
        createdAt: "Erstellt am",
        updatedAt: "Aktualisiert am",
      },
    },
    errors: {
      creditLines:
        "Verwenden Sie positive Mengen und die USt.-Sätze der Originalrechnung.",
      creditLimit:
        "Die Gutschrift übersteigt den verbleibenden Netto-, Steuer- oder Bruttobetrag der Originalrechnung.",
      originalPosting:
        "Klären Sie die Buchung der Originalrechnung vor der Gutschrift.",
      posting:
        "Prüfen Sie Unternehmenswährung, offene Buchungsperiode und die ursprünglichen Buchungskonten.",
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
        title: "Gutschrift nicht möglich",
        description:
          "Gutschriften können nur für offene oder bezahlte Rechnungen ausgestellt werden",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen",
      },
    },
    success: {
      title: "Erfolg",
      description: "Gutschrift erstellt und Buchungssatz gebucht",
    },
    widget: {
      readFailed: "Die gewählte Rechnung konnte nicht geladen werden.",
      retryRead: "Rechnung erneut laden",
      number: "Gutschriftnummer",
      amountLabel: "{{label}} · {{amount}}",
      available: "Verfügbarer Gutschriftsbetrag",
      dismiss: "Schließen",
      namedSource: "Ursprungsrechnung {{reference}}",
      sourceInvoice: "Ursprungsrechnung",
      changeInvoice: "Rechnung wechseln",
      openNamedNote: "Gutschrift {{reference}} öffnen",
      openNote: "Gutschrift öffnen",
      reviewCredit: "Gutschrift prüfen",
      backToItems: "Zurück zu den Positionen",
      reviewStep: "Positionen der Gutschrift",
      openNamedSource: "Rechnung {{reference}} öffnen",
      openSource: "Ursprungsrechnung öffnen",
      chooseInvoice: "Ausgestellte Rechnung auswählen",
      full: "Gesamte Rechnung",
      partial: "Einzelne Positionen",
      creditTotal: "Gutschriftsbetrag",
      unavailable: "Für diese Rechnung ist keine Gutschrift möglich.",
      issue: "Gutschrift ausstellen",
      issued: "Gutschrift ausgestellt",
      back: "Zurück",
      submit: "Gutschrift erstellen",
    },
  },
  invoiceId: {
    label: "Rechnungs-ID",
    description: "Die zu gutschreibende Rechnung",
    placeholder: "Rechnungs-ID eingeben",
  },
  companyId: {
    label: "Unternehmens-ID",
    description: "Unternehmen, das die Gutschrift ausstellt",
    placeholder: "Unternehmens-ID eingeben",
  },
  reason: {
    label: "Grund",
    description: "Warum diese Gutschrift ausgestellt wird",
    placeholder: "Grund für die Gutschrift beschreiben",
  },
  lineItems: {
    label: "Positionen",
    description:
      "Optionale Teilgutschrift-Positionen. Ohne Angabe wird eine Vollgutschrift angewendet.",
    placeholder: "",
  },
};
