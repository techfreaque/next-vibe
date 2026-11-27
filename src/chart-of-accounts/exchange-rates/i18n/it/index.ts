import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Contabilità",
  tags: {
    ledger: "libro-mastro",
    fx: "fx",
    rates: "tassi-di-cambio",
  },
  fields: {
    companyId: "Azienda",
    baseCurrency: "Valuta base",
    quoteCurrency: "Valuta quotata",
    rate: "Tasso di cambio",
    rateDate: "Data tasso",
    source: "Fonte",
    asOfDate: "Data rivalutazione",
    dryRun: "Solo anteprima",
    postReversalNextDay: "Storno automatico il giorno successivo",
    currency: "Valuta",
    limit: "Righe massime",
  },
  list: {
    title: "Tassi di cambio",
    titleShort: "Tassi FX",
    description:
      "Tassi di riferimento giornalieri BCE e tassi manuali per la contabilità multivaluta",
    syncEcbAction: "Sincronizza tassi BCE",
    setManualAction: "Aggiungi tasso manuale",
    revalueAction: "Rivalutazione cambi di fine periodo",
    empty:
      "Nessun tasso di cambio salvato. Sincronizza i tassi BCE o inserisci un tasso manuale.",
    countLabel: "Tassi salvati",
    latestDate: "Ultima data tasso",
    success: "Tassi di cambio caricati",
  },
  set: {
    title: "Imposta tasso di cambio manuale",
    description:
      "Salva un tasso manuale (1 valuta base = tasso valuta quotata). Il tasso manuale prevale su quello BCE nella stessa data.",
    action: "Salva tasso",
    success: "Tasso di cambio salvato",
  },
  sync: {
    title: "Sincronizza tassi giornalieri BCE",
    description:
      "Scarica gli ultimi tassi di riferimento euro pubblicati dalla Banca centrale europea",
    action: "Scarica tassi BCE ora",
    success: "Tassi giornalieri BCE sincronizzati",
    upsertedCount: "Tassi aggiornati",
  },
  revaluation: {
    title: "Rivalutazione cambi di fine periodo",
    description:
      "Rivaluta crediti, debiti e saldi bancari in valuta estera al tasso di chiusura",
    action: "Esegui rivalutazione FX",
    previewAction: "Anteprima rivalutazione",
    postAction: "Registra rivalutazione",
    success: "Rivalutazione FX completata",
    noAdjustments: "Nessun saldo in valuta estera richiede rivalutazione.",
    functionalCurrency: "Valuta funzionale",
    totalUnrealized: "Utile/perdita cambi non realizzato",
    journalEntryId: "Registrazione rivalutazione",
    reversalEntryId: "Storno giorno successivo",
    missingRates: "Valute senza tasso di chiusura",
    account: "Conto",
    foreignBalance: "Saldo originale",
    carryingFunctional: "Valore contabile",
    closingRate: "Tasso di chiusura",
    revaluedFunctional: "Valore rivalutato",
    unrealizedDelta: "Differenza non realizzata",
    previewBanner: "Solo anteprima. Nessuna scrittura registrata.",
    postedBanner: "Scrittura di rivalutazione FX registrata.",
  },
  errors: {
    validation: {
      title: "Dati non validi",
      description: "Controlla i codici valuta, la data e il tasso di cambio.",
    },
    unauthorized: {
      title: "Accesso richiesto",
      description: "Accedi per gestire i tassi di cambio.",
    },
    forbidden: {
      title: "Accesso negato",
      description: "Servono permessi contabili per questa operazione.",
    },
    notFound: {
      title: "Non trovato",
      description: "Azienda o dati sui tassi di cambio non trovati.",
    },
    conflict: {
      title: "Conflitto",
      description: "Periodo contabile aperto o conti FX mancanti.",
    },
    network: {
      title: "Errore di rete",
      description: "Impossibile raggiungere il feed tassi BCE.",
    },
    server: {
      title: "Errore server",
      description: "Errore imprevisto durante l'elaborazione FX.",
    },
    unknown: {
      title: "Errore sconosciuto",
      description: "Si è verificato un errore imprevisto.",
    },
    unsavedChanges: {
      title: "Modifiche non salvate",
      description: "Ci sono modifiche non salvate.",
    },
  },
};
