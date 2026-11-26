import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    payment: "pagamento",
    bill: "fatturazione",
    ap: "contabilità-pagabile",
  },
  get: {
    title: "Dettagli di Bill",
    titleShort: "Dettagli di Bill",
    description:
      "Ottieni una fattura del fornitore con tutti gli articoli della linea",
    billId: {
      label: "Bill ID",
      description: "Il disegno di legge per recuperare",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "fattura non valida ID",
      },
      unauthorized: {
        title: "Non firmata",
        description: "Accedi per visualizzare le bollette",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non un membro di questa società",
      },
      conflict: { title: "Conflitto", description: "Conflittuale dei dati" },
      server: {
        title: "Errore del server",
        description: "Non poteva caricare la bolletta",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      network: {
        title: "Errore di rete",
        description: "Controlla la connessione",
      },
      notFound: {
        title: "Bill non trovato",
        description: "Questa legge non esiste",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
    },
    success: {
      title: "Caricamento in corso",
      description: "Dettagli di fattura recuperati",
    },
    response: {
      id: "ID",
      companyId: "Società ID",
      supplierName: "Fornitore",
      supplierVatNumber: "Fornitore VAT",
      billNumber: "Numero della fattura",
      billDate: "Data di pubblicazione",
      dueDate: "Data di scadenza",
      currency: "Valuta",
      subtotal: "Totale parziale",
      taxAmount: "Imposte",
      total: "Totale",
      status: "Stato",
      notes: "Osservazioni",
      journalEntryId: "Entrata del giornale",
      paidAt: "Pagato a",
      createdAt: "Creato",
      updatedAt: "Aggiornato",
      lines: "Elementi di linea",
      lineId: "Linea ID",
      lineDescription: "Designazione",
      quantity: "Qty",
      unitPrice: "Prezzo unitario",
      taxRate: "Tasso d'imposta",
      lineTaxAmount: "Imposte",
      lineTotal: "Totale",
    },
  },
  enums: {
    billStatus: {
      DRAFT: "Progetto",
      RECEIVED: "Ricevuto.",
      APPROVED: "Approvazione",
      PAID: "Pagato",
      DISPUTED: "Disputato",
    },
  },
  widget: {
    lineReviewRequired:
      "Il totale delle righe non coincide con l’importo registrato. Verifica la fattura originale prima di modificarla o approvarla.",
    removeAction: "Rimuovi",
    removeLine: "Rimuovi {{description}}",
    grossTotal: "Totale lordo",
    taxPending:
      "L’imposta del fornitore è da confermare. Verifica l’importo sul documento prima di registrare la ricezione o contabilizzare la fattura.",
    confirmSupplierTax: "Conferma l’imposta del fornitore",
    bankDocumentMissing:
      "Documento del fornitore in attesa. Collegalo qui o conferma il costo lordo dal documento bancario al momento dell’approvazione.",
    bankDocumentTaxReview:
      "Documento del fornitore collegato dopo la contabilizzazione. Esamina separatamente eventuali riclassificazioni fiscali o contabili. La registrazione iniziale rimane invariata.",
    linkBankDocument: "Collega il documento del fornitore",
    inputVat: "Detrazione IVA",
    taxIncludedCost: "IVA inclusa nel costo",
    reverseCharge: "IVA a debito per inversione contabile",

    markReceived: "Mark ricevuto",
    back: "Indietro",
    submit: "Guarda Bill",
    billNumber: "Bill Bill",
    supplier: "Fornitore",
    overdue: "Più tardi.",
    billDate: "Data di pubblicazione",
    dueDate: "Due",
    paidAt: "Pagato",
    journalEntry: "Entrata del giornale",
    lineItems: "Elementi di linea",
    description: "Designazione",
    qty: "Qty",
    unitPrice: "Prezzo unitario",
    tax: "Imposte",
    total: "Totale",
    subtotal: "Totale parziale",
    approveBill: "Approvo Bill",
    payBill: "Paga Bill",
    addLine: "Aggiungere la linea",
    accountingEvidence: "Registrazioni contabili",
    approvalJournal: "Registrazione della fattura",
    settlementJournal: "Registrazione del pagamento",
    approveConfirmTitle: "Approva questo disegno di legge?",
    approveConfirmDescription:
      "Questo avanzerà lo stato di fattura. Una volta approvato, verrà postata una voce di giornale. Questo non può essere annullato.",
    approveConfirmProceed: "Sì, Approvo",
    approveConfirmCancel: "Annulla",
    status: {
      draft: "Progetto",
      received: "Ricevuto.",
      approved: "Approvazione",
      paid: "Pagato",
      disputed: "Disputato",
    },
  },
};
