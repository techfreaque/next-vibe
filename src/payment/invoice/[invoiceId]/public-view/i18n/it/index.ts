import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Pagamenti",
  tags: { payment: "pagamento", invoice: "fattura" },
  get: {
    title: "Visualizza Fattura",
    titleShort: "Visualizza Fattura",
    description:
      "Visualizzazione della fattura pubblica tramite link di token sicuro",
    form: {
      title: "Fatturato",
      description: "Visualizza i dettagli della fattura",
    },
    response: {
      id: "Fatturazione ID",
      invoiceNumber: "Numero di fatturazione",
      currency: "Valuta",
      status: "Stato",
      amount: "Importo",
      dueDate: "Data di scadenza",
      notes: "Osservazioni",
      createdAt: "Data di pubblicazione",
      companyName: "Società",
      companyEmail: "Email della società",
      paymentUrl: "Link di pagamento online",
      bankIban: "IBAN",
      bankBic: "BIC",
      qrKind: "Standard QR di pagamento",
      qrSvg: "Codice QR di pagamento",
      lineId: "Linea ID",
      lineDescription: "Designazione",
      productId: "Prodotto",
      quantity: "Quantità",
      unitPrice: "Prezzo unitario",
      taxRate: "Tasso d'imposta",
      taxAmount: "Imposte",
      lineTotal: "Totale",
      sortOrder: "Ordinanza",
      lineCreatedAt: "Creato",
      lineUpdatedAt: "Aggiornato",
    },
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per continuare",
      },
      validation: {
        title: "Link non valido",
        description: "Il link di fattura è invalido o malformato",
      },
      server: {
        title: "Errore del server",
        description: "Errore del server interno",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore sconosciuto",
      },
      network: {
        title: "Errore di rete",
        description: "Si è verificato un errore di rete",
      },
      forbidden: {
        title: "Accesso negato",
        description: "link fattura non valido o scaduto",
      },
      notFound: { title: "Non trovato", description: "Fattura non trovata" },
      conflict: { title: "Conflitto", description: "Discussione su Fatturato" },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Ci sono cambiamenti non rilevati",
      },
    },
    success: { title: "Fatturato", description: "I dati della fattura" },
  },
  invoiceId: {
    label: "Fatturazione ID",
    description: "La fattura da visualizzare",
  },
  token: {
    label: "Visualizza Token",
    description: "Accesso sicuro al gettone dalla tua email di fattura",
  },
  widget: {
    submit: "Visualizza Fattura",
    payOnline: "Paga online",
    bankTransfer: "Bonifico bancario",
    scanToPay: "Scansiona con la tua app bancaria",
    epcQr: "SEPA GiroCode (EPC)",
    payBySquareQr: "PAY by square",
  },
};
