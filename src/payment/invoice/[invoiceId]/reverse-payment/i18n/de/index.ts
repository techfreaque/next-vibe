import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Zahlungseingang stornieren",
  description:
    "Gib den Grund für die Korrektur an. Die ursprüngliche Buchung bleibt im Journal.",
  invoiceId: "Rechnungsreferenz",
  entryId: "Buchungsreferenz des Zahlungseingangs",
  date: "Stornodatum",
  reason: "Stornogrund",
  reasonPlaceholder: "Zum Beispiel: Die Bank hat die Zahlung zurückgebucht",
  datePlaceholder: "Heute",
  viewInvoice: "Rechnung ansehen",
  reversal: "Stornobuchung",
  originalDate: "Zahlungsdatum",
  receiptAmount: "Zahlungsbetrag",
  postingStatus: "Buchungsstatus",
  viewReversal: "Stornobuchung öffnen",
  cancel: "Abbrechen",
  confirmTitle: "Diese Zahlung stornieren?",
  confirm: "Storno buchen",
  success: {
    title: "Zahlungseingang storniert",
    description: "Der offene Rechnungsbetrag berücksichtigt die Stornierung.",
  },
  invalidDate:
    "Das Stornodatum muss zwischen dem Zahlungseingang und heute liegen.",
  noPeriod: "Für dieses Datum gibt es keine offene Buchungsperiode.",
  invalidReceipt:
    "Dieser Zahlungseingang lässt sich für diese Rechnung nicht stornieren.",
  invalidLines:
    "Die gespeicherten Buchungszeilen sind unvollständig oder gehören zu einer anderen Währung oder Firma.",
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
  tags: { payment: "payment", invoice: "invoice" },
};
