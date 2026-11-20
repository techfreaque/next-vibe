import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    payment: "pagamento",
    dashboard: "cruscotto"
  },
  get: {
    title: "Dashboard di pagamento",
    titleShort: "Dashboard",
    description: "Panoramica delle fatture, delle fatture e dell'attività di pagamento",
    form: {
      title: "Dashboard",
      description: "Panoramica dei pagamenti per la tua azienda"
    },
    response: {
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
      draftCount: "Progetto di conto"
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Parametri della richiesta non validi"
      },
      network: {
        title: "Errore di rete",
        description: "Errore di connessione di rete"
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per continuare"
      },
      forbidden: {
        title: "Accesso negato",
        description: "Deve essere un membro di questa azienda"
      },
      notFound: {
        title: "Non trovato",
        description: "Società non trovata"
      },
      server: {
        title: "Errore del server",
        description: "Si è verificato un errore interno del server"
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore sconosciuto"
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Ci sono cambiamenti non rilevati"
      },
      conflict: {
        title: "Conflitto",
        description: "Si è verificato un conflitto"
      }
    },
    success: {
      title: "Operazione riuscita",
      description: "Dati di Dashboard caricato"
    }
  },
  companyId: {
    label: "Società ID",
    description: "La società per mostrare i dati del cruscotto per",
    placeholder: "Entra in azienda ID"
  },
  widget: {
    loading: "Caricamento cruscotto...",
    noData: "Nessuna azienda selezionata.",
    noDataHint: "Selezionare un'azienda per visualizzare la panoramica dei pagamenti.",
    openInvoices: "Fatture aperte",
    overdue: "Più tardi.",
    unpaidBills: "Bills non retribuiti",
    draftInvoices: "Progetti",
    quickActions: "Azioni rapide",
    newInvoice: "Nuova fattura",
    allInvoices: "Tutte le fatture",
    newEstimate: "Nuova stima",
    allEstimates: "Stime",
    allBills: "Bills",
    recentInvoices: "Fatture recenti",
    noRecentInvoices: "Nessuna fattura recente.",
    view: "Vista",
    due: "Due",
    status: {
      draft: "Progetto",
      open: "Aperto",
      paid: "Pagato",
      void: "Void",
      uncollectible: "Incoltoso"
    }
  }
};
