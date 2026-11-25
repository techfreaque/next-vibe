import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Abrechnung",
  tags: {
    payment: "zahlung",
    invoice: "rechnung",
    ar: "forderungen",
  },
  post: {
    title: "Zahlungserinnerung vorbereiten",
    titleShort: "Erinnerung vorbereiten",
    description:
      "Erstellen Sie einen Entwurf mit dem offenen Betrag und einer optionalen Nachricht.",
    form: {
      title: "Erinnerung vorbereiten",
      description:
        "Prüfen Sie den offenen Betrag, bevor Sie den Entwurf weitergeben.",
    },
    response: {
      success: "Erinnerungsentwurf bereit",
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
          "Die Rechnung muss offen, unbezahlt oder teilbezahlt und bereits fällig sein.",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen",
      },
    },
    success: {
      title: "Erinnerungsentwurf bereit",
      description:
        "Im Rechnungsverlauf gespeichert. Die Erinnerung kann jetzt an den Kunden weitergegeben werden.",
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
    copy: "Erinnerung kopieren",
    copied: "Erinnerung kopiert",
    copyFailed: "Kopieren fehlgeschlagen. Erneut versuchen",
    download: "Erinnerung herunterladen",
    subject: "Zahlungserinnerung zur Rechnung {{number}}",
    body: "Der offene Betrag beträgt {{amount}}. Die Zahlung war am {{date}} fällig.",
    back: "Zurück",
    submit: "Erinnerung vorbereiten",
    reminderSent:
      "Im Rechnungsverlauf gespeichert. Die Erinnerung kann jetzt an den Kunden weitergegeben werden.",
    viewInvoice: "Rechnung ansehen",
  },
};
