import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Stime",
  tags: {
    payment: "pagamento",
    estimate: "Grafico",
    list: "elenco",
  },
  get: {
    title: "Stime di vendita",
    titleShort: "Stime di vendita",
    description:
      "Stime di ricerca per riferimento, cliente, e-mail, titolo o stima ID, e filtro per società o stato.",
    form: {
      title: "Filtri stimati",
      description: "Filtro e paginate stime",
    },
    response: {
      totalCount: "Conto totale",
      id: "Stima ID",
      estimateNumber: "Numero di stima",
      status: "Stato",
      customerId: "Cliente ID",
      customerName: "Nome del cliente",
      currency: "Valuta",
      total: "Totale",
      validUntil: "Valido fino a quando",
      lineCount: "Contatore di linea",
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
        description: "Parametri non validi",
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
      forbidden: { title: "Accesso negato", description: "Accesso negato" },
      notFound: { title: "Non trovato", description: "Società non trovata" },
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
      description: "Stime recuperate",
    },
  },
  enums: {
    estimateStatus: {
      DRAFT: "Progetto",
      SENT: "Inviato",
      ACCEPTED: "Accettato",
      DECLINED: "Declinato",
      EXPIRED: "Scadenza",
      CONVERTED: "Convertito",
    },
  },
  companyId: {
    label: "Società ID",
    description: "Filtra per azienda",
    placeholder: "Entra in azienda ID",
  },
  search: {
    label: "Documenti di ricerca",
    description:
      "Stime di ricerca per riferimento, cliente, e-mail, titolo o stima ID, e filtro per società o stato.",
    placeholder: "Numero di stima, cliente o titolo",
  },
  status: {
    label: "Stato",
    description: "Filtra per stato",
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
    description: "Elementi per pagina",
  },
  widget: {
    pageCount: "Totale pagine",
    back: "Indietro",
    title: "Stime di vendita",
    newEstimate: "Nuova stima",
    loading: "Caricamento delle stime...",
    noEstimates: "Non ci sono ancora stime.",
    noEstimatesHint: "Crea il tuo primo preventivo per iniziare.",
    empty: {
      title: "Non ci sono ancora stime.",
      hint: "Crea il tuo primo preventivo per iniziare.",
      cta: "Nuova stima",
    },
    valid: "Valido",
    lines: "linee",
    line: "linea",
    view: "Vista",
    status: {
      draft: "Progetto",
      sent: "Inviato",
      accepted: "Accettato",
      declined: "Declinato",
      expired: "Scadenza",
      converted: "Convertito",
    },
  },
};
