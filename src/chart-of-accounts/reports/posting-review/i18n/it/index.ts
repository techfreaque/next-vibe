import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Controllo delle scritture",
  description:
    "Controlla le registrazioni attive e i collegamenti alle fatture di vendita emesse e alle fatture di acquisto approvate o pagate.",
  tag: "Verifica contabile",
  company: {
    label: "Azienda",
    description: "Scegli l’azienda di cui vuoi controllare le registrazioni.",
    choose: "Scegli un’azienda",
    empty:
      "Seleziona un’azienda per controllare il giornale e i collegamenti ai documenti.",
  },
  filters: {
    issue: "Anomalia",
    all: "Tutte le anomalie",
    matches: "Anomalie corrispondenti",
  },
  issues: {
    missingLines: "Righe contabili mancanti",
    invalidLegs: "Righe contabili non valide",
    invoiceLink: "Collegamenti fatture di vendita",
    billLink: "Collegamenti fatture di acquisto",
  },
  reasons: {
    fewLines:
      "La registrazione ha meno di due righe. Aprila e controlla il documento di origine.",
    invalidLegs:
      "Almeno una valuta non è bilanciata oppure una riga contiene un importo, un conto o un segno non valido. Apri la registrazione per controllare le righe.",
    noBacklink:
      "Il documento non ha una scrittura collegata. Controlla l’origine prima di contabilizzare o registrare un pagamento.",
    wrongPosting:
      "La scrittura collegata manca, appartiene a un altro documento o non è più attiva. Controlla lo storico contabile.",
    controlLeg:
      "La scrittura collegata ha un saldo, una valuta o un importo di contropartita non valido. Controlla l’origine prima di registrare un pagamento.",
  },
  columns: {
    record: "Elemento",
    date: "Data",
    reason: "Esito del controllo",
    counterparty: "Controparte",
    open: "Apri elemento",
  },
  records: {
    journal: "Scrittura contabile",
    invoice: "Fattura di vendita",
    bill: "Fattura di acquisto",
    journalDate: "Data registrazione",
    invoiceDate: "Fattura creata il",
    billDate: "Data fattura",
    dateInfo: "{{label}} {{date}}",
    openJournal: "Apri scrittura",
    openInvoice: "Apri fattura di vendita",
    openBill: "Apri fattura di acquisto",
  },
  pagination: {
    pageLabel: "Pagina",
    pageSize: "Elementi per pagina",
    totalPages: "Pagine totali",
    previous: "Indietro",
    next: "Avanti",
    pageInfo: "Pagina {{page}} di {{total}}",
    firstPage: "Prima pagina",
    emptyPage: "Questa pagina non contiene elementi",
  },
  widget: {
    loading: "Caricamento del controllo contabile",
    empty: "Nessuna anomalia corrispondente",
    coverage:
      "Il controllo riguarda le scritture originali attive e le fatture positive emesse, approvate o pagate secondo il tipo.",
    back: "Indietro",
  },
  success: {
    title: "Controllo completato",
    description:
      "Scritture e collegamenti ai documenti sono stati controllati.",
  },
  errors: {
    validation: {
      title: "Controlla i filtri del report",
      description:
        "Scegli un filtro, un numero di pagina e una dimensione di pagina validi.",
    },
    unauthorized: {
      title: "Accesso richiesto",
      description: "Accedi per controllare le registrazioni contabili.",
    },
    forbidden: {
      title: "Azienda non disponibile",
      description: "Non hai accesso alla contabilità di questa azienda.",
    },
    notFound: {
      title: "Elemento non trovato",
      description: "Impossibile trovare l’elemento richiesto.",
    },
    server: {
      title: "Impossibile caricare il controllo contabile",
      description: "Riprova a caricare il report.",
    },
    network: {
      title: "Connessione non disponibile",
      description: "Controlla la connessione e riprova.",
    },
    conflict: {
      title: "Conflitto nel report",
      description: "Aggiorna la pagina e riapri il report.",
    },
    unknown: {
      title: "Errore imprevisto",
      description: "Riprova o contatta l’assistenza.",
    },
    unsavedChanges: {
      title: "Modifiche non salvate",
      description: "Salva o annulla le modifiche prima di uscire.",
    },
  },
};
