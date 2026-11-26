import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Abrechnung",
  tags: {
    payment: "zahlung",
    invoice: "rechnung",
    ar: "forderungen",
  },
  post: {
    title: "Rechnung stornieren",
    titleShort: "Rechnung stornieren",
    description:
      "Entwurf oder offene Rechnung stornieren. Bezahlte Rechnungen können nicht storniert werden. Existiert ein Buchungssatz, wird er rückgebucht.",
    form: {
      title: "Rechnung stornieren",
      description: "Diese Aktion kann nicht rückgängig gemacht werden.",
    },
    response: {
      success: "Rechnung storniert",
      message: "Statusmeldung",
    },
    errors: {
      appliedPayments:
        "Eine Rechnung mit zugeordneten Zahlungen oder Gutschriften kann nicht storniert werden.",
      reversalPosting:
        "Prüfen Sie vor der Stornierung die Originalbuchung und die offene Buchungsperiode.",
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
        title: "Stornierung nicht möglich",
        description: "Bezahlte Rechnungen können nicht storniert werden",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen",
      },
    },
    success: {
      title: "Erfolg",
      description: "Rechnung erfolgreich storniert",
    },
  },
  invoiceId: {
    label: "Rechnungs-ID",
    description: "ID der zu stornierenden Rechnung",
    placeholder: "Rechnungs-ID eingeben",
  },
  widget: {
    invoice: "Rechnung",
    total: "Rechnungsbetrag",
    customer: "Kunde",
    openInvoice: "Rechnung öffnen",
    retry: "Erneut versuchen",
    loading: "Rechnung wird geladen …",
    unavailable: "Rechnung nicht verfügbar",
    reversal:
      "Eine Stornobuchung mit heutigem Datum gleicht die offene Forderung aus.",
    cancelOnly: "Die Rechnung wird storniert.",
    ineligible:
      "Nur Entwürfe und unbezahlte Rechnungen ohne Zuordnungen können storniert werden.",
    back: "Zurück",
    submit: "Rechnung stornieren",
    warning:
      "Diese Aktion kann nicht rückgängig gemacht werden. Die Rechnung wird dauerhaft storniert.",
    confirm: "Rechnung stornieren",
    voided: "Rechnung storniert",
    backToList: "Zurück zur Liste",
  },
};
