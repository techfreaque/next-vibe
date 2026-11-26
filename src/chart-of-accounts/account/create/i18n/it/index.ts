import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    accountType: {
      ASSET: "Benefici",
      LIABILITY: "Responsabilità",
      EQUITY: "Equità",
      REVENUE: "Entrate",
      EXPENSE: "Spese",
    },
    accountSubtype: {
      CURRENT_ASSET: "Attualità",
      FIXED_ASSET: "Attivo fisso",
      BANK: "Banca",
      CASH: "Contanti",
      ACCOUNTS_RECEIVABLE: "Conti crediti",
      INVENTORY: "Inventario",
      PREPAID: "Prepagato",
      ACCOUNTS_PAYABLE: "Conti pagabili",
      VAT_PAYABLE: "VAT Payable",
      VAT_RECEIVABLE: "VAT Recepibile",
      ACCRUED_LIABILITY: "Responsabilità acquisita",
      SHORT_TERM_DEBT: "Debiti a breve termine",
      LONG_TERM_DEBT: "Debiti a lungo termine",
      SHARE_CAPITAL: "Capitale sociale",
      RETAINED_EARNINGS: "Guadagni incassati",
      REVENUE_SALES: "Entrate di vendita",
      REVENUE_SERVICE: "Entrate di servizio",
      COGS: "Costo dei beni venduti",
      PAYROLL: "Pagamenti",
      RENT: "Affitto",
      UTILITIES: "Utilità",
      OPEX: "Spese operative",
      FINANCIAL_INCOME: "Reddito finanziario",
      FINANCIAL_EXPENSE: "Spese finanziarie",
      TAX_EXPENSE: "Spese fiscali",
      OTHER: "Altro",
    },
  },
  post: {
    title: "Crea conto",
    titleShort: "Nuovo conto",
    description:
      "Aggiungi un account personalizzato al grafico degli account dell'azienda",
    companyId: {
      label: "Società",
      description: "Il piano dei conti di questa società riceve il conto",
      placeholder: "Scegli una società",
    },
    code: {
      label: "Codice contabile",
      description: "Codice numerico unico per l'account",
      placeholder: "ad esempio 1150",
    },
    name: {
      label: "Nome del conto",
      description: "Nome descrittivo dell'account",
      placeholder: "ad es. Piccola cassa",
    },
    type: {
      label: "Tipo di conto",
      description: "Classifica dei conti di livello superiore",
      placeholder: "Selezionare il tipo",
    },
    subtype: {
      label: "Sottotipo di conto",
      description: "Classificazione dettagliata all'interno del tipo",
      placeholder: "Selezionare il sottotipo",
    },
    parentId: {
      label: "Conto padre",
      description: "Raggruppa il conto sotto un altro nei report",
      placeholder: "Nessuno (livello superiore)",
    },
    response: {
      id: "Conto",
      code: "Codice",
      name: "Nome",
    },
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Login richiesto",
      },
      validation: {
        title: "Errore di convalida",
        description: "Controlla tutti i campi obbligatori",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Autorizzazioni insufficienti",
      },
      server: {
        title: "Errore del server",
        description: "Non è possibile creare account",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      conflict: {
        title: "Codice Taken",
        description: "Un account con questo codice esiste già",
      },
      network: {
        title: "Errore di rete",
        description: "Non è possibile raggiungere il server",
      },
      notFound: { title: "Non trovato", description: "Società non trovata" },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
    },
    success: {
      title: "Conto creato",
      description: "Il conto è stato aggiunto",
    },
    widget: {
      viewButton: "Apri il conto",
      addAnotherButton: "Aggiungi un altro conto",
      back: "Indietro",
      save: "Crea conto",
      sectionAccount: "Conto",
      sectionClassification: "Classificazione",
    },
  },
  title: "Crea conto",
  description: "Aggiungi un account personalizzato",
  category: "Grafico dei conti",
  tag: "Account",
};
