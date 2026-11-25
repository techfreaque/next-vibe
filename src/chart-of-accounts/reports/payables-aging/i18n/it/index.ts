import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Debiti verso fornitori",
  titleShort: "Scadenzario fornitori",
  description: "Debiti verso fornitori per giorni di ritardo.",
  tag: "Scadenzario fornitori",
  company: {
    label: "Azienda",
    description:
      "Scegli l’azienda di cui vuoi esaminare le fatture di acquisto.",
    choose: "Scegli un’azienda",
    empty: "Seleziona un’azienda per vedere i debiti verso i suoi fornitori.",
  },
  currency: {
    label: "Valuta",
    description:
      "Mostra le fatture in una sola valuta. Gli importi non vengono convertiti.",
    default: "Valuta aziendale",
    codes: {
      EUR: "EUR",
      USD: "USD",
      PLN: "PLN",
    },
  },
  agingDate: {
    label: "Data di calcolo",
    description: "Data usata per calcolare i giorni di ritardo.",
  },
  columns: {
    supplier: "Fornitore",
    vat: "Partita IVA",
    current: "Non scadute",
    days1to30: "1–30 giorni",
    days31to60: "31–60 giorni",
    days61to90: "61–90 giorni",
    over90: "Da 91 giorni",
    undated: "Senza scadenza",
    total: "Totale",
    billNumber: "Numero fattura",
    billDate: "Data fattura",
    dueDate: "Scadenza",
    billAmount: "Importo in centesimi",
  },
  approved: {
    title: "Approvate e non pagate",
    empty: "Nessuna fattura approvata da pagare",
    emptyDescription:
      "Qui compariranno le fatture approvate con un importo ancora dovuto.",
  },
  received: {
    title: "Da approvare",
    empty: "Nessuna fattura da approvare",
    emptyDescription:
      "Le fatture ricevute compaiono qui fino all’approvazione.",
  },
  disputed: {
    title: "Contestazioni",
    empty: "Nessuna fattura contestata",
    emptyDescription:
      "Le fatture contestate sono escluse dai totali delle fatture approvate e in attesa.",
  },
  widget: {
    asOf: "Situazione al {{date}}",
    back: "Indietro",
    loading: "Caricamento dei debiti verso fornitori",
    details: "Fatture di {{supplier}}",
    unknownSupplier: "Fornitore sconosciuto",
    datedBill: "Fattura del {{date}}",
    due: "Scade il {{date}}",
  },
  success: {
    title: "Debiti verso fornitori caricati",
    description:
      "Puoi esaminare le fatture di acquisto dell’azienda selezionata.",
  },
  errors: {
    validation: {
      title: "Controlla i filtri del report",
      description: "Scegli una data e una valuta valide.",
    },
    unauthorized: {
      title: "Accesso richiesto",
      description: "Accedi per vedere i debiti verso fornitori.",
    },
    forbidden: {
      title: "Azienda non disponibile",
      description:
        "Non hai accesso alle fatture di acquisto di questa azienda.",
    },
    notFound: {
      title: "Elemento non trovato",
      description: "Impossibile trovare l’elemento richiesto.",
    },
    server: {
      title: "Impossibile caricare i debiti",
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
