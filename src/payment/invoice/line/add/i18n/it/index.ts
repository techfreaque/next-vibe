import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Fatturazione",
  tags: {
    payment: "pagamento",
    invoice: "fattura",
    lines: "linee",
  },
  post: {
    title: "Aggiungere la linea di fatturazione",
    titleShort: "Aggiungere la linea",
    description: "Aggiungere una voce di linea a un progetto di fattura",
    form: {
      title: "Articolo della linea",
      description: "Definire l'elemento fatturabile da aggiungere",
    },
    response: {
      success: "Linea aggiunta",
      message: "Messaggio di stato",
      line: {
        currency: "Valuta",
        title: "Dettagli della linea",
        subtitle: "Linea di fatturazione creata",
        id: "Linea ID",
        invoiceId: "Fatturazione ID",
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
        description: "Parametri dell'elemento linea non valida",
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
        description: "Accesso non consentito",
      },
      notFound: {
        title: "Non trovato",
        description: "Fattura non trovata",
      },
      conflict: {
        title: "Conflitto",
        description: "La fattura non è in progetto di stato",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Ci sono cambiamenti non rilevati",
      },
    },
    success: {
      title: "Operazione riuscita",
      description: "Articolo di linea aggiunto alla fattura",
    },
  },
  invoiceId: {
    label: "Fatturazione ID",
    description: "Il progetto di fattura per aggiungere questa linea a",
    placeholder: "Inserire la fattura ID",
  },
  description: {
    label: "Designazione",
    description: "Ciò che questo prodotto di linea rappresenta",
    placeholder: "ad es. Sviluppo web - 10 ore",
  },
  productId: {
    label: "Prodotto ID",
    description: "Riferimento del prodotto opzionale",
    placeholder: "Inserisci il prodotto ID",
  },
  quantity: {
    label: "Quantità",
    description: "Numero di unità",
    placeholder: "1",
  },
  unitPrice: {
    label: "Prezzo unitario",
    description: "Prezzo per unità",
    placeholder: "0.00",
  },
  taxRate: {
    label: "Tasso d'imposta",
    description: "Tasso d'imposta come decimale (ad esempio 0.23 per il 23%)",
    placeholder: "0.00",
  },
  widget: {
    searchProduct: "Catalogo prodotti",
    searchPlaceholder: "Nome o SKU...",
    searchButton: "Cerca",
    clearProduct: "Azzera",
    noProductResults:
      "Nessuna corrispondenza. inserire manualmente di seguito.",
    orManual: "O inserire manualmente",
    multiplier: "×",
    taxLabel: "Tassa fiscale",
    linePreview: "Totale linea",
    lineAdded: "Linea aggiunta",
    addAnotherLine: "Aggiungi un'altra linea",
    viewInvoice: "Visualizza Fattura",
    submit: "Aggiungere la linea",
  },
};
