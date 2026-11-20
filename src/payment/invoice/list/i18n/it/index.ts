import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Fatturazione",
  tags: {
    payment: "pagamento",
    invoice: "fattura",
  },
  get: {
    title: "Fatture del cliente",
    titleShort: "Fatture del cliente",
    description:
      "Ricerca fatture per numero di documento, fattura ID o cliente ID e filtro per società o stato.",
    form: {
      title: "Filtri di fattura",
      description: "Filtra l'elenco delle fatture",
    },
    response: {
      total: "Totale",
      invoices: "Fatture",
      id: "Fatturazione ID",
      invoiceSequenceNumber: "Numero di fatturazione",
      customerId: "Cliente ID",
      currency: "Valuta",
      status: "Stato",
      amount: "Importo",
      dueDate: "Data di scadenza",
      notes: "Osservazioni",
      lineCount: "Contatore di linea",
      amountPaid: "Importo pagato",
      amountDue: "Importo dovuto",
      isOverdue: "Più tardi.",
      createdAt: "Creato a",
      updatedAt: "Aggiornato At",
    },
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per continuare",
      },
      validation: {
        title: "Errore di convalida",
        description: "Parametri del filtro non valido",
      },
      server: {
        title: "Errore del server",
        description: "Si è verificato un errore interno del server",
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
        description: "Deve essere un membro di questa azienda",
      },
      notFound: {
        title: "Non trovato",
        description: "Società non trovata",
      },
      conflict: {
        title: "Conflitto",
        description: "Si è verificato un conflitto",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Ci sono cambiamenti non rilevati",
      },
    },
    success: {
      title: "Operazione riuscita",
      description: "Elenco delle fatture recuperate",
    },
  },
  enums: {
    invoiceStatus: {
      draft: "Progetto",
      open: "Aperto",
      paid: "Pagato",
      void: "Void",
      uncollectible: "Incoltoso",
    },
  },
  companyId: {
    label: "Società ID",
    description: "Filtra le fatture per questa azienda",
    placeholder: "Entra in azienda ID",
  },
  search: {
    label: "Documenti di ricerca",
    description:
      "Ricerca fatture per numero di documento, fattura ID o cliente ID e filtro per società o stato.",
    placeholder: "Numero di documento o ID",
  },
  status: {
    label: "Stato",
    description: "Filtra per lo stato della fattura",
    placeholder: "Tutti gli stati",
  },
  customerId: {
    label: "Cliente ID",
    description: "Filtra dal cliente",
    placeholder: "Inserisci il cliente ID",
  },
  page: {
    label: "Pagina",
    description: "Numero di pagina",
  },
  pageSize: {
    label: "Dimensione della pagina",
    description: "Risultati per pagina",
  },
  widget: {
    pageCount: "Totale pagine",
    title: "Fatture del cliente",
    newInvoice: "Nuova fattura",
    loading: "Caricamento delle fatture...",
    noInvoices: "Non ho ancora fatture.",
    noInvoicesHint: "Crea la tua prima fattura per iniziare.",
    overdue: "Più tardi.",
    due: "Due",
    lines: "linee",
    line: "linea",
    view: "Vista",
    back: "Indietro",
    empty: {
      title: "Non ho ancora fatture.",
      hint: "Crea la tua prima fattura per iniziare.",
      cta: "Nuova fattura",
    },
    status: {
      draft: "Progetto",
      open: "Aperto",
      paid: "Pagato",
      void: "Void",
      uncollectible: "Incoltoso",
    },
  },
};
