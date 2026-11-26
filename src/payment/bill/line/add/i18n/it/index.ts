import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    payment: "pagamento",
    bill: "fatturazione",
    ap: "contabilità-pagabile",
  },
  post: {
    title: "Aggiungi Bill Line",
    titleShort: "Aggiungere la linea",
    description:
      "Aggiungere una voce di linea di spesa a un progetto di legge del fornitore",
    form: {
      title: "Nuova linea di Bill",
      description: "Inserisci i dettagli della spesa",
    },
    errors: {
      evidenceReview:
        "Verifica la fattura originale del fornitore prima di modificare l’imputazione.",
      validation: {
        title: "Errore di convalida",
        description: "Controlla tutti i campi",
      },
      unauthorized: {
        title: "Non firmata",
        description: "Accedi per aggiungere le linee di fattura",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Il ruolo contabile o amministrativo richiesto",
      },
      conflict: {
        title: "Bill non modificabile",
        description: "Solo le fatture DRAFT possono avere linee aggiunte",
      },
      server: {
        title: "Errore del server",
        description: "Non è possibile aggiungere la linea",
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
      title: "Linea Aggiunto",
      description: "Linea di erogazione aggiunta al disegno di legge",
    },
    response: {
      success: "Operazione riuscita",
      message: "Messaggio",
      line: {
        currency: "Valuta",
        title: "Dettagli della linea",
        subtitle: "Articolo di linea aggiunto",
        id: "Linea ID",
        billId: "Bill ID",
        lineDescription: "Designazione",
        productId: "Prodotto ID",
        quantity: "Quantità",
        unitPrice: "Prezzo unitario",
        taxRate: "Tasso d'imposta",
        taxAmount: "Importo fiscale",
        lineTotal: "Totale",
        expenseAccountId: "Conto passivo",
        sortOrder: "Ordinare",
        createdAt: "Creato",
        updatedAt: "Aggiornato",
      },
    },
  },
  billId: {
    label: "Bill ID",
    description: "Il disegno di legge per aggiungere questa linea a",
    placeholder: "Bill UUID",
  },
  description: {
    label: "Designazione",
    description: "Che cosa è stato acquistato",
    placeholder: "Forniture di ufficio",
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
    description: "Prezzo per unità",
    placeholder: "100.00",
  },
  taxRate: {
    label: "Tasso d'imposta",
    description: "Tasso di /tax VAT (0-1, ad esempio 0,19 per 19%)",
    placeholder: "0.19",
  },
  expenseAccountId: {
    label: "Conto passivo",
    description: "Che spese conto questo post a",
    placeholder: "Account UUID",
  },
  widget: {
    submit: "Aggiungere la linea",
    searchProduct: "Prodotto di ricerca",
    searchPlaceholder: "Nome del prodotto o SKU...",
    searchButton: "Cerca",
    clearProduct: "Azzera",
    noProductResults: "Nessun prodotto trovato.",
    orManual: "o inserire manualmente",
    multiplier: "×",
    taxLabel: "Tassa fiscale",
    linePreview: "Linea totale (anteprima)",
    addAnotherLine: "Aggiungi un'altra linea",
    viewBill: "Visualizza Bill",
  },
};
