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
    title: "Crea account",
    titleShort: "Nuovo account",
    description:
      "Aggiungi un account personalizzato al grafico degli account dell'azienda",
    companyId: {
      label: "Società ID",
      description: "La società per aggiungere il conto a",
      placeholder: "Entra in azienda UUID",
    },
    code: {
      label: "Codice contabile",
      description: "Codice numerico unico per l'account",
      placeholder: "ad esempio 1150",
    },
    name: {
      label: "Nome del conto",
      description: "Nome descrittivo dell'account",
      placeholder: "ad es. Petty Cash",
    },
    type: {
      label: "Tipo di conto",
      description: "Classifica dei conti di livello superiore",
      placeholder: "Selezionare il tipo",
    },
    subtype: {
      label: "Sottotitoli",
      description: "Classificazione dettagliata all'interno del tipo",
      placeholder: "Selezionare il sottotipo",
    },
    parentId: {
      label: "Account principale",
      description: "Conto madre opzionale per il raggruppamento gerarchico",
      placeholder: "Account principale UUID (opzionale)",
    },
    response: {
      id: "Account ID",
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
      title: "Account Creato",
      description: "Il conto è stato aggiunto",
    },
    widget: {
      viewButton: "Visualizza Account",
      addAnotherButton: "Aggiungi un altro",
      back: "Indietro",
    },
  },
  title: "Crea account",
  description: "Aggiungi un account personalizzato",
  category: "Grafico dei conti",
  tag: "Account",
};
