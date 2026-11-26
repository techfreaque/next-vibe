import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "E-Rechnung (Peppol)",
  titleShort: "E-Rechnung",
  description:
    "Exportieren Sie eine ausgestellte Rechnung oder Gutschrift als Peppol-BIS-Billing-3.0-Datei (UBL, EN 16931).",
  invoiceId: {
    label: "Rechnung",
    description: "Die ausgestellte Rechnung oder Gutschrift für den Export",
  },
  response: {
    invoiceNumber: "Belegnummer",
    isCreditNote: "Gutschrift",
    fileName: "Dateiname",
    ready: "Versandbereit",
    missingFields: "Fehlende Angaben",
    xml: "XML",
  },
  widget: {
    back: "Zurück",
    submit: "E-Rechnung erstellen",
    invoice: "Rechnung {{number}}",
    creditNote: "Gutschrift {{number}}",
    ready: "Bereit. Alle Pflichtangaben nach EN 16931 sind vorhanden.",
    missing: "Ergänzen Sie diese Angaben, bevor Sie die Datei versenden:",
    download: "XML herunterladen",
    copy: "XML kopieren",
    copied: "XML kopiert",
    copyFailed: "XML konnte nicht kopiert werden",
    preview: "XML anzeigen",
    disclaimer: "Wir liefern Werkzeuge, keine Steuerberatung.",
  },
  fields: {
    bt1: "Belegnummer",
    bt2: "Ausstellungsdatum",
    bt5: "Währung",
    bt9: "Fälligkeitsdatum",
    bt27: "Name Ihres Unternehmens",
    bt31: "Ihre USt-IdNr.",
    bt34: "Ihre elektronische Adresse (USt-IdNr., Steuernummer oder Registernummer)",
    bt40: "Land Ihres Unternehmens",
    bt44: "Name des Kunden",
    bt48: "USt-IdNr. des Kunden",
    bt49: "Elektronische Adresse des Kunden (USt-IdNr., Steuernummer oder Registernummer)",
    bt55: "Kundenadresse mit Land",
    bt153: "Eine Bezeichnung auf jeder Position",
    bg25: "Mindestens eine Position",
  },
  errors: {
    validation: {
      title: "Ungültige Anfrage",
      description: "Prüfen Sie die Rechnungsreferenz.",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Die E-Rechnung konnte nicht geladen werden.",
    },
    unauthorized: {
      title: "Anmeldung erforderlich",
      description: "Bitte melden Sie sich an, um E-Rechnungen zu exportieren.",
    },
    forbidden: {
      title: "Kein Zugriff",
      description: "Sie haben keinen Zugriff auf diesen Beleg.",
    },
    notFound: {
      title: "Beleg nicht gefunden",
      description: "Diese Rechnung existiert nicht.",
    },
    server: {
      title: "Export fehlgeschlagen",
      description:
        "Die E-Rechnung konnte nicht erstellt werden. Bitte versuchen Sie es erneut.",
    },
    unknown: {
      title: "Unbekannter Fehler",
      description: "Etwas ist schiefgelaufen.",
    },
    unsavedChanges: {
      title: "Ungespeicherte Änderungen",
      description: "Speichern Sie zuerst Ihre Änderungen.",
    },
    conflict: {
      title: "Noch nicht ausgestellt",
      description:
        "Stellen Sie die Rechnung aus, bevor Sie sie als E-Rechnung exportieren.",
    },
  },
  success: {
    title: "E-Rechnung erstellt",
    description: "Die Peppol-Datei ist bereit.",
  },
  tags: { payment: "Zahlung", invoice: "Rechnung", eInvoice: "E-Rechnung" },
};
