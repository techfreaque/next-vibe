import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { payment: "zahlung", bill: "rechnung", ap: "kreditorenbuchhaltung" },
  post: {
    title: "Rechnung bezahlen",
    titleShort: "Rechnung zahlen",
    description:
      "Genehmigte Rechnung als bezahlt markieren und Zahlungsbuchung erstellen",
    billId: {
      label: "Rechnungs-ID",
      description: "Die zu bezahlende Rechnung",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Eingabe",
      },
      unauthorized: {
        title: "Nicht angemeldet",
        description: "Anmelden um Rechnungen zu bezahlen",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Buchhaltungs- oder Adminrolle erforderlich",
      },
      conflict: {
        title: "Ungültiger Status",
        description: "Rechnung muss genehmigt sein vor Zahlung",
      },
      server: {
        title: "Serverfehler",
        description: "Zahlung konnte nicht erfasst werden",
      },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
      },
      network: { title: "Netzwerkfehler", description: "Verbindung prüfen" },
      notFound: {
        title: "Rechnung nicht gefunden",
        description: "Diese Rechnung existiert nicht",
      },
      unsavedChanges: {
        title: "Ungespeicherte Änderungen",
        description: "Es gibt ungespeicherte Änderungen",
      },
    },
    success: {
      title: "Rechnung bezahlt",
      description: "Rechnung als bezahlt markiert",
    },
    response: {
      status: "Status",
      paidAt: "Bezahlt am",
    },
    widget: {
      back: "Zurück",
      submit: "Als bezahlt markieren",
      paymentRecorded: "Zahlung erfasst",
    },
  },
  accountNodeId: {
    label: "Bank- / Kassenkonto",
    description: "Konto, von dem die Zahlung erfolgt (Bank oder Kasse)",
    placeholder: "Konto-UUID",
  },
  paidAt: {
    label: "Zahlungsdatum",
    description: "Datum der Zahlung",
    placeholder: "2024-01-31",
  },
};
