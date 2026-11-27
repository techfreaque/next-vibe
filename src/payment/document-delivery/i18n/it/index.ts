import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    payment: "pagamenti",
    pdf: "pdf",
    email: "email",
  },
  pdf: {
    invoiceTitle: "PDF fattura",
    invoiceDescription:
      "Scarica la fattura PDF/A-3 con dati legali, codice QR di pagamento e XML ZUGFeRD incorporato.",
    estimateTitle: "PDF preventivo",
    estimateDescription: "Scarica il preventivo in formato PDF.",
    success: "PDF generato",
    downloadAction: "Scarica PDF",
    zugferdBadge: "ZUGFeRD / Factur-X EN 16931 incorporato",
    qrBadgeEpc: "QR SEPA EPC / GiroCode incluso",
    qrBadgePayBySquare: "QR PAY by square incluso",
    filename: "Nome file",
    documentNumber: "Numero documento",
    paymentUrl: "Link pagamento online",
    qrSection: "Codice QR pagamento",
    back: "Indietro",
  },
  deliver: {
    logTitle: "Registro invii e-mail",
    logDescription:
      "Controlla le e-mail inviate e reinvia l’allegato PDF tramite il mailer di piattaforma.",
    logSuccess: "Registro caricato",
    sendTitle: "Invia documento via e-mail",
    sendDescription: "Invia il PDF al cliente dall’account di sistema hi@.",
    sendSuccess: "E-mail inviata con allegato PDF",
    recipientEmail: "E-mail destinatario",
    recipientName: "Nome destinatario",
    customMessage: "Messaggio personale (facoltativo)",
    isResend: "Reinvia",
    sendAction: "Invia e-mail con PDF",
    resendAction: "Reinvia PDF",
    emptyLog: "Nessuna e-mail inviata",
    emptyLogHint: "Invia il PDF qui sopra per registrare la consegna.",
    sentAt: "Inviata il",
    sender: "Mittente",
    status: "Stato",
    attachment: "Allegato",
    statusSent: "Inviata",
    statusFailed: "Fallita",
    resendBadge: "Reinviata",
    subjectInvoice: "Fattura {{number}} da {{company}}",
    subjectCreditNote: "Nota di credito {{number}} da {{company}}",
    subjectEstimate: "Preventivo {{number}} da {{company}}",
    bodyIntro: "In allegato trova {{document}} in formato PDF.",
    bodyPayOnline: "Paga online:",
    bodyViewLink: "Visualizza documento:",
    theaBlocked: "Le e-mail ERP devono usare l’account hi@, mai thea@.",
    mailerUnavailable:
      "Il mailer della piattaforma non è configurato. Controlla l’account SMTP predefinito.",
  },
  fields: {
    invoiceId: "Fattura",
    estimateId: "Preventivo",
    documentType: "Tipo documento",
    pdfBase64: "Dati PDF",
    contentType: "Tipo contenuto",
    hasZugferd: "ZUGFeRD incorporato",
    qrKind: "Formato QR",
    qrSvg: "Anteprima QR",
    deliveries: "Invii",
    deliveryId: "Invio",
    messageId: "ID messaggio",
  },
  errors: {
    validation: {
      title: "Controlla i dati",
      description: "Inserisci un documento e un indirizzo e-mail validi.",
    },
    network: {
      title: "Errore di rete",
      description: "Controlla la connessione e riprova.",
    },
    unauthorized: {
      title: "Accesso richiesto",
      description: "Accedi per scaricare PDF e inviare documenti.",
    },
    forbidden: {
      title: "Accesso negato",
      description: "Il tuo ruolo aziendale non consente questa azione.",
    },
    notFound: {
      title: "Documento non trovato",
      description:
        "La fattura, nota di credito o preventivo richiesto non esiste.",
    },
    server: {
      title: "Invio non riuscito",
      description: "Impossibile generare il PDF o inviare l’e-mail.",
    },
    unknown: {
      title: "Errore imprevisto",
      description: "Riprova.",
    },
    unsavedChanges: {
      title: "Modifiche non salvate",
      description: "Le modifiche sono ancora nel modulo.",
    },
    conflict: {
      title: "Documento non pronto",
      description: "Emetti il documento prima di inviarlo via e-mail.",
    },
  },
};
