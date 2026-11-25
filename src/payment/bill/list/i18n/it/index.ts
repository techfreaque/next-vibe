import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    payment: "pagamento",
    bill: "fatturazione",
    ap: "contabilità-pagabile",
  },
  get: {
    title: "Biglietti del fornitore",
    titleShort: "Biglietti del fornitore",
    description:
      "Conti di ricerca pagabili per numero di fattura, nome del fornitore o disegno di legge ID, e filtro per società o stato.",
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Controllare i parametri del filtro",
      },
      unauthorized: {
        title: "Non firmata",
        description: "Accedi per visualizzare le bollette",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Tu non sei un membro di questa azienda",
      },
      conflict: { title: "Conflitto", description: "Conflittuale dei dati" },
      server: {
        title: "Errore del server",
        description: "Non poteva caricare le bollette",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      network: {
        title: "Errore di rete",
        description: "Controlla la connessione",
      },
      notFound: { title: "Non trovato", description: "Società non trovata" },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
    },
    success: {
      title: "Bills Caricato",
      description: "Le bollette del fornitore recuperate",
    },
    response: {
      totalCount: "Totale",
      id: "ID",
      supplierName: "Fornitore",
      billNumber: "Bill!",
      billDate: "Data di pubblicazione",
      dueDate: "Data di scadenza",
      currency: "Valuta",
      billTotal: "Importo",
      status: "Stato",
      createdAt: "Creato",
    },
  },
  companyId: {
    label: "Società",
    description: "Filtra per azienda",
    placeholder: "Società UUID",
  },
  search: {
    label: "Documenti di ricerca",
    description:
      "Conti di ricerca pagabili per numero di fattura, nome del fornitore o disegno di legge ID, e filtro per società o stato.",
    placeholder: "Numero di fattura o fornitore",
  },
  status: {
    label: "Stato",
    description: "Filtra per stato di fattura",
    placeholder: "Qualsiasi stato",
  },
  page: { label: "Pagina", description: "Numero di pagina" },
  pageSize: { label: "Per pagina", description: "Risultati per pagina" },
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
    filters: "Filtri",
    pageCount: "Totale pagine",
    back: "Indietro",
    title: "Biglietti del fornitore",
    newBill: "Registrazione",
    loading: "Caricamento di bollette...",
    empty: {
      title: "Nessuna fattura del fornitore",
      hint: "Registrare una fattura quando si riceve una fattura da un fornitore.",
      cta: "Registrazione",
    },
    company: {
      select: "Selezionare la società",
      selected: "Azienda Selezionata",
    },
    due: "Due",
    overdue: "Più tardi.",
    view: "Vista",
  },
};
