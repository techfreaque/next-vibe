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
    title: "Rechnungsstatus prüfen",
    titleShort: "Rechnungsstatus prüfen",
    description:
      "Ändert den Status einer Eingangsrechnung im Entwurf oder mit Status Erhalten.",
    billId: {
      label: "Rechnungs-ID",
      description: "Die zu genehmigende Rechnung",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungültige Rechnungs-ID",
      },
      unauthorized: {
        title: "Nicht angemeldet",
        description: "Anmelden um Rechnungen zu genehmigen",
      },
      forbidden: {
        title: "Zugriff verweigert",
        description: "Buchhaltungs- oder Adminrolle erforderlich",
      },
      conflict: {
        title: "Bereits genehmigt",
        description: "Rechnung ist bereits genehmigt oder bezahlt",
      },
      server: {
        title: "Serverfehler",
        description: "Rechnung konnte nicht genehmigt werden",
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
      title: "Rechnung genehmigt",
      description: "Rechnungsstatus erfolgreich aktualisiert",
    },
    response: {
      status: "Neuer Status",
      journalEntryId: "Buchungssatz-ID",
    },
    widget: {
      back: "Zurück",
      submit: "Statusänderung bestätigen",
      confirmTitle: "Rechnung genehmigen?",
      confirmDescription:
        "Ein Entwurf wechselt zu Erhalten. Eine erhaltene Rechnung wird freigegeben. Wenn die Buchhaltung eingerichtet ist, wird ein Buchungssatz erstellt.",
      confirmButton: "Ja, genehmigen",
      cancelButton: "Abbrechen",
      approved: "Rechnungsstatus aktualisiert",
    },
  },
};
