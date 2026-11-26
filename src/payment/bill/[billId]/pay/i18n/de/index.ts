import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { payment: "zahlung", bill: "rechnung", ap: "kreditorenbuchhaltung" },
  enums: {
    billStatus: {
      DRAFT: "Entwurf",
      RECEIVED: "Eingegangen",
      APPROVED: "Genehmigt",
      PAID: "Bezahlt",
      DISPUTED: "Strittig",
    },
  },
  post: {
    title: "Rechnung bezahlen",
    titleShort: "Rechnung zahlen",
    description:
      "Genehmigte Rechnung als bezahlt markieren und Zahlungsbuchung erstellen",
    billId: {
      label: "Rechnung",
      description: "Die zu bezahlende Rechnung",
    },
    errors: {
      approvalPosting:
        "Vor der Zahlung muss die Freigabebuchung für diese Rechnung vorliegen.",
      paymentAccount:
        "Wählen Sie ein aktives Bank- oder Kassenkonto dieses Unternehmens.",
      paymentPosting:
        "Prüfen Sie Zahlungsdatum, Unternehmenswährung und Buchungskonten.",
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
        title: "Rechnung kann nicht bezahlt werden",
        description:
          "Nur freigegebene Rechnungen lassen sich als bezahlt markieren.",
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
      details: "Zahlungsdetails",
      loadingBill: "Rechnung wird geladen…",
      retry: "Erneut versuchen",
      submit: "Als bezahlt markieren",
      paymentRecorded: "Zahlung erfasst",
    },
  },
  accountNodeId: {
    label: "Bank- oder Kassenkonto",
    description: "Ohne Auswahl wird das Standardkonto für Zahlungen verwendet.",
  },
  paidAt: {
    label: "Zahlungsdatum",
    description: "Datum der Zahlung",
    placeholder: "2024-01-31",
  },
};
