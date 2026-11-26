import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    payment: "pagamento",
    dashboard: "cruscotto",
  },
  get: {
    title: "Dashboard di pagamento",
    titleShort: "Dashboard",
    description:
      "Panoramica delle fatture, delle fatture e dell'attività di pagamento",
    form: {
      title: "Dashboard",
      description: "Panoramica dei pagamenti per la tua azienda",
    },
    response: {
      invoiceNumber: "Numero fattura",
      customerName: "Cliente",
      amountDue: "Importo dovuto",
      estimates: "Preventivi",
      byCurrency: "Totali per valuta",
      openInvoices: "Fatture aperte",
      overdueInvoices: "Più tardi.",
      unpaidBills: "Bills non retribuiti",
      draftInvoices: "Progetto di fatturazione",
      currency: "Valuta",
      recentInvoices: "Fatture recenti",
      openCount: "Conto aperto",
      openTotal: "Totale aperto",
      overdueCount: "Conto sovrapposto",
      overdueTotal: "Totale parziale",
      unpaidCount: "Conto non retribuito",
      unpaidTotal: "Totale non pagato",
      draftCount: "Progetto di conto",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Parametri della richiesta non validi",
      },
      network: {
        title: "Errore di rete",
        description: "Errore di connessione di rete",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per continuare",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Deve essere un membro di questa azienda",
      },
      notFound: {
        title: "Non trovato",
        description: "Società non trovata",
      },
      server: {
        title: "Errore del server",
        description: "Si è verificato un errore interno del server",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore sconosciuto",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Ci sono cambiamenti non rilevati",
      },
      conflict: {
        title: "Conflitto",
        description: "Si è verificato un conflitto",
      },
    },
    success: {
      title: "Operazione riuscita",
      description: "Dati di Dashboard caricato",
    },
  },
  companyId: {
    label: "Azienda",
    description: "La società per mostrare i dati del cruscotto per",
    placeholder: "Entra in azienda ID",
  },
  widget: {
    creditNote: "Nota di credito",
    documentCountOne: "1 documento",
    estimateDraftOne: "1 bozza",
    documentCount: "{{count}} documenti",
    draftHint: "Non ancora emesse",
    noRecentEstimatesHint:
      "I preventivi inviati compaiono qui con la risposta del cliente.",
    columns: {
      number: "Numero",
      customer: "Cliente",
      status: "Stato",
      total: "Totale",
      open: "Aperto",
    },
    unnumberedInvoice: "Fattura senza numero",
    subtitle:
      "Fatture, preventivi e bollette che emetti. I pagamenti con carta e cripto sono nelle transazioni di pagamento.",
    estimatesSent: "Preventivi inviati",
    estimateDrafts: "{{count}} bozze",
    recentEstimates: "Preventivi recenti",
    noRecentEstimates: "Nessun preventivo finora",
    validUntil: "Valido fino al {{date}}",
    notInvoicesHint:
      "I pagamenti con carta e cripto sono transazioni del fornitore, non fatture. Qui ci sono solo le fatture che emetti tu.",
    openTransactions: "Apri le transazioni di pagamento",
    commercialDocuments: "Documenti commerciali",
    processorDiagnostics: "Transazioni di pagamento",
    loading: "Caricamento cruscotto...",
    noData: "Nessuna azienda selezionata.",
    noDataHint:
      "Selezionare un'azienda per visualizzare la panoramica dei pagamenti.",
    openInvoices: "Fatture aperte",
    overdue: "Più tardi.",
    unpaidBills: "Bills non retribuiti",
    draftInvoices: "Bozze di fattura",
    quickActions: "Azioni rapide",
    newInvoice: "Nuova fattura",
    allInvoices: "Tutte le fatture",
    newEstimate: "Nuova stima",
    allEstimates: "Stime",
    allBills: "Bills",
    recentInvoices: "Fatture recenti",
    noRecentInvoices: "Nessuna fattura emessa finora",
    view: "Vista",
    due: "Due",
    status: {
      draft: "Progetto",
      open: "Aperto",
      paid: "Pagato",
      void: "Void",
      uncollectible: "Incoltoso",
    },
  },
};
