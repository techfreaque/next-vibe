import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Stime",
  tags: { payment: "pagamento", estimate: "Grafico", lines: "linee" },
  post: {
    title: "Aggiungere la linea di stima",
    titleShort: "Aggiungere la linea",
    description: "Aggiungere una voce di linea a un preventivo",
    form: {
      title: "Aggiungere la linea di stima",
      description: "Aggiungi un prodotto o un servizio a questa stima",
    },
    response: {
      success: "Operazione riuscita",
      message: "Messaggio di stato",
      line: {
        title: "Articolo della linea",
        subtitle: "Dettagli della linea aggiuntiva",
        id: "Linea ID",
        estimateId: "Stima ID",
        lineDescription: "Designazione",
        productId: "Prodotto ID",
        quantity: "Quantità",
        unitPrice: "Prezzo unitario",
        taxRate: "Tasso d'imposta",
        taxAmount: "Importo fiscale",
        lineTotal: "Totale",
        sortOrder: "Ordinare",
        createdAt: "Creato a",
        updatedAt: "Aggiornato At",
      },
    },
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per continuare",
      },
      validation: {
        title: "Errore di convalida",
        description: "Controllare i dettagli dell'articolo della linea",
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
      notFound: { title: "Non trovato", description: "Stima non trovata" },
      conflict: {
        title: "Conflitto",
        description:
          "La stima deve essere nello stato DRAFT per aggiungere le linee",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Ci sono cambiamenti non rilevati",
      },
    },
    success: {
      title: "Linea Aggiunto",
      description: "Elemento di linea aggiunto alla stima",
    },
  },
  estimateId: {
    label: "Stima ID",
    description: "La stima per aggiungere una linea a",
    placeholder: "Stima UUID",
  },
  description: {
    label: "Designazione",
    description: "Descrizione del prodotto o del servizio",
    placeholder: "ad es. Sviluppo web - 10 ore",
  },
  productId: {
    label: "Prodotto ID",
    description: "Riferimento del prodotto opzionale",
    placeholder: "Prodotto UUID",
  },
  quantity: {
    label: "Quantità",
    description: "Numero di unità",
    placeholder: "1",
  },
  unitPrice: {
    label: "Prezzo unitario",
    description: "Prezzo per unità (IVA esclusa)",
    placeholder: "0.00",
  },
  taxRate: {
    label: "Tasso d'imposta",
    description: "Tasso d'imposta come decimale (ad esempio 0.23 per il 23%)",
    placeholder: "0.23",
  },
  widget: {
    searchProduct: "Prodotto di ricerca",
    searchPlaceholder: "Nome del prodotto o SKU...",
    searchButton: "Cerca",
    clearProduct: "Azzera",
    noProductResults: "Nessun prodotto trovato.",
    orManual: "o inserire manualmente",
    multiplier: "×",
    taxLabel: "Tassa fiscale",
    linePreview: "Totale linea",
    addAnotherLine: "Aggiungi un'altra riga",
    viewEstimate: "Torna alla stima",
    submit: "Aggiungere la linea",
  },
};
