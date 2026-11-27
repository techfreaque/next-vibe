import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    payment: "zahlung",
    pdf: "pdf",
    email: "email",
  },
  pdf: {
    invoiceTitle: "Rechnungs-PDF",
    invoiceDescription:
      "PDF/A-3-Rechnung mit Pflichtangaben, Zahlungs-QR-Code und eingebettetem ZUGFeRD-XML herunterladen.",
    estimateTitle: "Angebots-PDF",
    estimateDescription: "Angebot als PDF herunterladen.",
    success: "PDF erstellt",
    downloadAction: "PDF herunterladen",
    zugferdBadge: "ZUGFeRD / Factur-X EN 16931 eingebettet",
    qrBadgeEpc: "EPC / GiroCode SEPA-QR enthalten",
    qrBadgePayBySquare: "PAY by square QR enthalten",
    filename: "Dateiname",
    documentNumber: "Belegnummer",
    paymentUrl: "Online-Zahlungslink",
    qrSection: "Zahlungs-QR-Code",
    back: "Zurück",
  },
  deliver: {
    logTitle: "E-Mail-Versandprotokoll",
    logDescription:
      "Versendete Rechnungs-E-Mails prüfen und den PDF-Anhang erneut über den Plattform-Mailer senden.",
    logSuccess: "Versandprotokoll geladen",
    sendTitle: "Beleg per E-Mail senden",
    sendDescription:
      "PDF-Beleg über das Plattform-Konto hi@ an den Kunden senden.",
    sendSuccess: "E-Mail mit PDF-Anhang gesendet",
    recipientEmail: "Empfänger-E-Mail",
    recipientName: "Empfängername",
    customMessage: "Persönliche Nachricht (optional)",
    isResend: "Erneut senden",
    sendAction: "E-Mail mit PDF senden",
    resendAction: "PDF erneut senden",
    emptyLog: "Noch keine E-Mails gesendet",
    emptyLogHint:
      "Senden Sie das PDF oben, um den Versand hier zu protokollieren.",
    sentAt: "Gesendet am",
    sender: "Absender",
    status: "Status",
    attachment: "Anhang",
    statusSent: "Gesendet",
    statusFailed: "Fehlgeschlagen",
    resendBadge: "Erneut gesendet",
    subjectInvoice: "Rechnung {{number}} von {{company}}",
    subjectCreditNote: "Gutschrift {{number}} von {{company}}",
    subjectEstimate: "Angebot {{number}} von {{company}}",
    bodyIntro: "Im Anhang erhalten Sie {{document}} als PDF.",
    bodyPayOnline: "Online bezahlen:",
    bodyViewLink: "Beleg ansehen:",
    theaBlocked:
      "ERP-E-Mails müssen über das Plattform-Konto hi@ gesendet werden, niemals über thea@.",
    mailerUnavailable:
      "Plattform-Mailer ist nicht konfiguriert. Prüfen Sie das Standard-SMTP-Konto.",
  },
  fields: {
    invoiceId: "Rechnung",
    estimateId: "Angebot",
    documentType: "Belegart",
    pdfBase64: "PDF-Daten",
    contentType: "Inhaltstyp",
    hasZugferd: "ZUGFeRD eingebettet",
    qrKind: "QR-Format",
    qrSvg: "QR-Vorschau",
    deliveries: "Sendungen",
    deliveryId: "Sendung",
    messageId: "Nachrichten-ID",
  },
  errors: {
    validation: {
      title: "Eingabe prüfen",
      description: "Geben Sie einen gültigen Beleg und eine E-Mail-Adresse an.",
    },
    network: {
      title: "Netzwerkfehler",
      description: "Verbindung prüfen und erneut versuchen.",
    },
    unauthorized: {
      title: "Anmeldung erforderlich",
      description:
        "Melden Sie sich an, um Beleg-PDFs und E-Mail-Versand zu nutzen.",
    },
    forbidden: {
      title: "Zugriff verweigert",
      description: "Ihre Unternehmensrolle erlaubt diese Aktion nicht.",
    },
    notFound: {
      title: "Beleg nicht gefunden",
      description:
        "Die angeforderte Rechnung, Gutschrift oder das Angebot existiert nicht.",
    },
    server: {
      title: "Belegversand fehlgeschlagen",
      description:
        "PDF konnte nicht erstellt oder E-Mail nicht gesendet werden.",
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
      title: "Beleg nicht bereit",
      description:
        "Stellen Sie den Beleg aus, bevor Sie ihn per E-Mail versenden.",
    },
  },
};
