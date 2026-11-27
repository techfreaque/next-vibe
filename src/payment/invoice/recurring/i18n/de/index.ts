import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    payment: "zahlung",
    recurring: "wiederkehrend",
    settings: "einstellungen",
  },
  settings: {
    title: "Zahlungseinstellungen",
    description:
      "IBAN/BIC für PDFs und QR-Codes hinterlegen, Stripe-Zahlungslinks aktivieren und wiederkehrende Rechnungen freischalten.",
    saveTitle: "Zahlungseinstellungen speichern",
    saveSuccess: "Zahlungseinstellungen gespeichert",
    loadSuccess: "Zahlungseinstellungen geladen",
    bankSection: "Bankverbindung",
    bankAccountHolder: "Kontoinhaber",
    bankIban: "IBAN",
    bankBic: "BIC / SWIFT",
    stripeSection: "Stripe-Onlinezahlungslinks",
    stripeEnabled:
      "Stripe-Zahlungslinks für ausgestellte Rechnungen aktivieren",
    stripeAccountLabel: "Stripe-Kontobezeichnung",
    stripeClearingAccountId: "Stripe-Verrechnungskonto",
    autoBookStripePayments:
      "Stripe-Zahlungen automatisch im Hauptbuch verbuchen",
    recurringSection: "Automatisierung wiederkehrender Rechnungen",
    recurringInvoicesEnabled:
      "Automatische Ausstellung wiederkehrender Rechnungen für diese Firma aktivieren",
    saveAction: "Einstellungen speichern",
  },
  checkout: {
    title: "Stripe-Zahlungslink erstellen",
    description:
      "Stripe-Checkout-Link für diese ausgestellte Rechnung vorbereiten oder erneuern.",
    success: "Stripe-Zahlungslink bereit",
    paymentUrl: "Zahlungslink",
    sessionId: "Checkout-Sitzung",
    amountCents: "Offener Betrag (Cent)",
    reused: "Vorhandener Link wiederverwendet",
    action: "Zahlungslink erstellen",
    openPay: "Online bezahlen",
  },
  recurring: {
    listTitle: "Wiederkehrende Rechnungen",
    listDescription:
      "Monatliche, quartalsweise und jährliche Rechnungspläne verwalten. Standardmäßig pro Firma deaktiviert.",
    listSuccess: "Zeitpläne geladen",
    createTitle: "Neuer Rechnungsplan",
    createDescription:
      "Kunde, Intervall, nächstes Datum und Positionen festlegen.",
    createSuccess: "Rechnungsplan erstellt",
    toggleTitle: "Rechnungsplan aktualisieren",
    toggleDescription:
      "Zeitplan aktivieren, pausieren oder Enddatum festlegen.",
    toggleSuccess: "Rechnungsplan aktualisiert",
    runTitle: "Fällige wiederkehrende Rechnungen ausführen",
    runDescription:
      "Fällige aktive Zeitpläne prüfen oder Rechnungen automatisch ausstellen.",
    runSuccess: "Lauf abgeschlossen",
    companyDisabledBanner:
      "Die automatische Ausstellung ist für diese Firma deaktiviert. Aktivieren Sie sie in den Zahlungseinstellungen.",
    openSettings: "Zahlungseinstellungen",
    newSchedule: "Neuer Zeitplan",
    runDue: "Fällige ausführen",
    previewRun: "Vorschau prüfen",
    applyRun: "Fällige Rechnungen ausstellen",
    empty: "Noch keine wiederkehrenden Pläne",
    emptyHint:
      "Erstellen Sie einen monatlichen oder jährlichen Plan für wiederkehrende Abrechnungen.",
    enabled: "Aktiv",
    paused: "Pausiert",
    enableAction: "Aktivieren",
    pauseAction: "Pausieren",
    frequency: {
      MONTHLY: "Monatlich",
      QUARTERLY: "Quartalsweise",
      YEARLY: "Jährlich",
    },
    status: {
      preview: "Fällig (Vorschau)",
      created: "Entwurf erstellt",
      issued: "Ausgestellt",
      skipped_ended: "Beendet",
      failed: "Fehlgeschlagen",
    },
    cronName: "Wiederkehrende Rechnungen",
    cronDescription:
      "Stellt fällige wiederkehrende Rechnungen für aktivierte Firmen automatisch aus.",
  },
  fields: {
    companyId: "Firma",
    invoiceId: "Rechnung",
    scheduleId: "Zeitplan",
    title: "Bezeichnung",
    customerName: "Kundenname",
    customerEmail: "Kunden-E-Mail",
    frequency: "Intervall",
    nextRunDate: "Nächstes Datum",
    endDate: "Enddatum (optional)",
    dueDays: "Zahlungsziel (Tage)",
    currency: "Währung",
    notes: "Hinweise",
    lineDescription: "Positionsbeschreibung",
    lineQuantity: "Menge",
    lineUnitPrice: "Einzelpreis",
    lineTaxRate: "Steuersatz (z. B. 0.19)",
    isEnabled: "Aktiviert",
    autoIssue: "Automatisch ausstellen",
    autoSendEmail: "PDF automatisch über hi@ senden",
    dryRun: "Nur Vorschau",
    asOfDate: "Stichtag (YYYY-MM-DD)",
    schedules: "Zeitpläne",
    companyEnabled: "Automatik für Firma aktiv",
    processedCount: "Verarbeitet",
    issuedCount: "Ausgestellt",
    failedCount: "Fehlgeschlagen",
    items: "Ergebnisse",
    lastRunAt: "Letzter Lauf",
  },
  errors: {
    validation: {
      title: "Eingabe prüfen",
      description: "Prüfen Sie Daten, Beträge und Pflichtfelder.",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Verbindung prüfen und erneut versuchen.",
    },
    unauthorized: {
      title: "Anmeldung erforderlich",
      description: "Melden Sie sich an, um Zahlungseinstellungen zu verwalten.",
    },
    forbidden: {
      title: "Zugriff verweigert",
      description: "Ihre Unternehmensrolle erlaubt diese Aktion nicht.",
    },
    notFound: {
      title: "Eintrag nicht gefunden",
      description: "Firma, Rechnung oder Zeitplan existiert nicht.",
    },
    server: {
      title: "Vorgang fehlgeschlagen",
      description: "Bitte erneut versuchen.",
    },
    unknown: {
      title: "Unerwarteter Fehler",
      description: "Bitte erneut versuchen.",
    },
    unsavedChanges: {
      title: "Ungespeicherte Änderungen",
      description: "Ihre Änderungen befinden sich noch im Formular.",
    },
    conflict: {
      title: "Aktion blockiert",
      description: "Prüfen Sie den Status der Rechnung oder Einstellungen.",
    },
  },
};
