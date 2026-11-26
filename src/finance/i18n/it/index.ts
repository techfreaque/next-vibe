import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  profit: {
    run: "Mostra il rendiconto",
    unallocatedRevenue:
      "Ricavi contabilizzati senza attribuzione ai modelli: {{amount}}",
    estimatedCosts: "Costi stimati dei modelli: {{amount}}",
    usageValue:
      "Utilizzo a pagamento valutato ai prezzi di acquisto noti: {{amount}}",
    estimatedMargin: "Margine di utilizzo stimato: {{amount}}",
    marginUnknown:
      "Margine non disponibile. Mancano dati sul finanziamento o sul valore dell’utilizzo.",
    missingPrice:
      "Prezzo di acquisto non confermato per {{credits}} crediti consumati.",
    title: "Conto economico mensile",
    description:
      "Esamina ricavi, costi e risultato netto contabilizzati per mese.",
    revenue: "Ricavi netti",
    expenses: "Costi",
    net: "Utile o perdita netta",
    empty: "In questo mese non sono stati registrati ricavi né costi.",
    areas: "Fonti dei costi",
    signedExpenseAreas:
      "Gli storni e gli altri accrediti riducono i costi. Un totale negativo indica che gli accrediti hanno superato gli addebiti del mese.",
    openLedger: "Vedi le scritture",
    noAccounts: "Nessun movimento.",
    estimatesHint:
      "Stime d’uso in USD per un massimo di 20 modelli dei prestatori associati. Sono esclusi abbonamenti fissi e costi privi di dati d’uso.",
    estimatesEmpty:
      "Non sono disponibili stime dei costi dei modelli per questa selezione.",
    unknownModel: "Modello non identificato",
    paid: "Crediti acquistati: {{amount}}",
    free: "Quota gratuita: {{amount}}",
    gifted: "Crediti in omaggio: {{amount}}",
    unknownFunding: "Finanziamento sconosciuto: {{amount}}",
    missing: "Mancano dati di costo esatti per {{credits}} crediti consumati.",
  },
  suppliers: {
    bankTransaction: "Operazione bancaria",
    bankLoading: "Caricamento dell’operazione bancaria…",
    bankUnavailable: "L’operazione bancaria verificata non è disponibile.",
    previewBankLink: "Verifica il collegamento",
    linkToBankBill: "Collega il documento",
    bankDraftBill: "Fattura da movimento bancario (facoltativa)",
    sponsorshipSource: "Sponsorizzazione del creator",
    confirmSeparateBankBill:
      "Conferma che la spesa è distinta dalle bozze bancarie",
    possibleBankDuplicate:
      "Una fattura derivata dalla banca ha dati simili. Selezionala per collegare il documento o conferma che si tratta di una spesa distinta.",
    monthlyReview: "Anteprima mensile delle fonti",
    monthlyReviewHint:
      "Controlla le letture salvate e i pagamenti anticipati confermati per il mese. Gli intervalli incompleti possono lasciare lacune.",
    counterTotal: "Utilizzo da contatore (USD): {{amount}}",
    estimatedTotal: "Utilizzo stimato (USD): {{amount}}",
    unclassifiedTotal: "Utilizzo con base sconosciuta (USD): {{amount}}",
    readingCoverage:
      "{{readings}} letture, di cui {{missing}} senza costi di intervallo.",
    receiptTotal:
      "Pagamenti anticipati confermati: {{amount}} in {{count}} documenti, di cui {{posted}} contabilizzati.",
    noReceipts:
      "Nessuna ricevuta di pagamento anticipato confermata per questo mese.",
    ledgerPrepaid: "Saldo prepagato contabilizzato",
    estimates: "Costi stimati dei modelli",
    estimatesHint:
      "Le 20 stime d’uso più elevate per i prestatori associati. Sono esclusi gli abbonamenti fissi e i costi privi di dati d’uso.",
    month: "Mese (AAAA-MM)",
    monthly: "Costi mensili contabilizzati",
    noMonthly: "Nessun costo registrato per questo mese.",
    area: {
      referral: "Commissioni di affiliazione",
      provider: "Prestatori",
      processor: "Elaborazione dei pagamenti",
      sponsorship: "Sponsorizzazioni",
      supplier: "Altri giustificativi fornitori",
      unallocated: "Senza attribuzione",
    },
    spendBasis: {
      counter: "Contatore del prestatore",
      "balance-delta": "Stima dalla variazione del saldo",
      "usage-estimate": "Stima dall’utilizzo interno",
    },
    title: "Giustificativi fornitori",
    description:
      "Verifica i saldi dei prestatori e i giustificativi dei fornitori.",
    record: "Registra un giustificativo",
    recordDescription:
      "Controlla il giustificativo prima di creare una fattura o una scrittura.",
    company: "Società",
    vendor: "Fornitore",
    chooseSupplier: "Scegli un fornitore",
    operation: "Operazione",
    provider: "Prestatore",
    reference: "Riferimento del documento",
    invoiceReference: "Numero della fattura fornitore",
    servicePeriodStart: "Inizio del periodo di servizio (AAAA-MM-GG)",
    servicePeriodEnd: "Fine del periodo di servizio (AAAA-MM-GG)",
    date: "Data contabile (AAAA-MM-GG)",
    gross: "Importo lordo",
    tax: "Imposta confermata",
    currency: "Valuta (EUR, USD o PLN)",
    memo: "Descrizione",
    preview: "Solo anteprima",
    debit: "Conto in dare o di costo",
    credit: "Conto in avere",
    result: "Esito",
    balances: "Saldi dei prestatori",
    observed: "Saldo rilevato",
    interval: "Ultimo costo per intervallo, base non verificata",
    unavailable: "Non disponibile",
    recent: "Giustificativi recenti",
    noBindings: "Nessun prestatore è associato alla società.",
    noEvidence: "Non è stato registrato alcun giustificativo fornitore.",
    run: "Mostra i giustificativi fornitori",
    previewEvidence: "Visualizza anteprima del giustificativo",
    invalid:
      "Controlla riferimento, importi confermati, valuta della società, conti e periodo aperto.",
    conflict: "Questo riferimento è già associato a un altro giustificativo.",
    taxHint: "Inserisci 0 se il giustificativo conferma l’assenza di imposte.",
    referralHint:
      "Seleziona il fornitore con l’indirizzo email verificato del beneficiario. Inserisci importo lordo, valuta e imposta dal documento della commissione. La richiesta di pagamento riporta soltanto i crediti.",
    evidenceHint:
      "Usa la ricevuta o l’estratto originale. Il solo saldo del prestatore non basta.",
    openBill: "Apri fattura",
    openJournal: "Apri scrittura",
    banked:
      "Saldi e costi rilevati servono alla verifica. I costi storici possono essere stimati.",
    kind: {
      processorFee: "Usa la commissione di pagamento verificata",
      fundBill: "Fattura per importo prepagato",
      bind: "Associa un prestatore",
      bill: "Fattura fornitore",
      fund: "Ricarica il saldo prepagato",
      consume: "Usa il saldo prepagato",
      paid: "Registra un costo pagato",
      sponsorship: "Usa un documento di sponsorizzazione",
      referral: "Prepara il documento di commissione",
    },
    outcome: {
      linked: "Documento del fornitore collegato",
      preview: "Anteprima convalidata",
      bound: "Prestatore associato",
      bill: "Bozza della fattura creata",
      posted: "Scrittura contabilizzata",
      replayed: "Già registrato",
      review:
        "Verifica necessaria. La fonte da sola non documenta il regolamento nella valuta della società né l’imposta.",
    },
  },
  spendAlert: {
    explained: "Il registro spiega il picco di utilizzo su {{provider}}.",
    unexplained: "Chiave API potenzialmente compromessa su {{provider}}.",
    cap: "Spesi {{spend}} in {{hours}} ore ({{rate}}/ora, tetto di {{cap}}/ora).",
    drain:
      "La spesa di {{rate}}/ora è pari a {{ratio}} volte la media recente di {{baseline}}/ora su {{coveredHours}} ore rilevate (soglia: {{limit}} volte).",
    ledgerCost:
      "Il registro riporta costi del fornitore pari a {{cost}} in questo periodo.",
    topWallets: "Portafogli con il maggior consumo di crediti: {{wallets}}.",
  },
  category: "Finanza",
  documents: {
    status: "Stato",
    activeFilters: "{{label}} attivi",
    loadFailed: "Impossibile caricare i documenti",
    loadFailedHint: "Carichi di nuovo l’elenco.",
    scopeDenied: "Non può accedere ai documenti selezionati.",
    retry: "Riprova",
    openAction: "Apri",
    pickAction: "Seleziona",
    pageSingle: "Pagina {{page}} di {{pages}} · {{total}} risultato",
    clearCompany: "Rimuovi filtro azienda",
    clearCustomer: "Rimuovi filtro cliente",
    pageTotals: "Totali · {{currency}}",
    pageDocumentCount: "Documenti in questa pagina: {{count}}",
    search: "Documenti di ricerca",
    matches: "Documenti di corrispondenza ({{count}})",
    emptyTitle: "Nessun documento corrisponde a questi filtri",
    emptyHint: "Modifica la ricerca o i filtri e riprova.",
    allCompanies: "Tutte le aziende che puoi accedere",
    chooseCompany: "Selezionare l'azienda",
    allCustomers: "Tutti i clienti",
    chooseCustomer: "Seleziona il cliente",
    apply: "Applicare i filtri",
    clear: "Cancella filtri",
    page: "Pagina {{page}} dei risultati {{pages}} · {{total}}",
    previous: "Pagina precedente",
    next: "Pagina successiva",
    select: "Selezionare {{reference}}",
    open: "Aprire {{reference}}",
    noReference: "Nessun riferimento",
    invoices: "Fatture del cliente",
    bills: "Fatture del fornitore",
    estimates: "Stime delle vendite",
    heading: "Documenti commerciali",
  },
  tags: {
    finance: "Finanziamenti",
    vibeSense: "vibe-sense",
  },
  enums: {
    source: {
      stripe: "Stripe",
      nowpayments: "NOWPayments",
      openrouter: "OpenRouter",
      nanoGpt: "NanoGPT",
      venice: "Venice",
      uncensoredAi: "uncensored.ai",
      gab: "Gab AI",
      freedomGpt: "FreedomGPT",
      modelsLab: "ModelsLab",
      edenAi: "Eden AI",
    },
    provider: {
      all: "Tutti i fornitori",
    },
    eventKind: {
      charge: "Caricamento",
      refund: "Rimborso",
      dispute: "Controversia",
      cancellation: "Cancellazione",
      payout: "Pagamenti",
      fee: "Tassa di processore",
    },
    runStatus: {
      ok: "OK",
      skipped: "Asciugata",
      failed: "Sfigato",
    },
    alertType: {
      lowBalance: "Basso saldo prepagato",
      negativeMargin: "Margine negativo",
      thinMargin: "Margine sottile",
      balanceDrain: "Consumo del saldo",
      spendSpike: "Trascorrere il picco",
      refundSpike: "Spicca di rimborso",
      disputeSpike: "Spicca di dispersione",
      cancellationSpike: "Spicca di cancellazione",
      billingGap: "Spazzola di fatturazione",
    },
    severity: {
      warning: "Avvertenza",
      critical: "Critica",
    },
    threshold: {
      openrouterAutoTopUpFloorUsd:
        "OpenRouter auto piano di allarme superiore (USD)",
      openrouterAutoTopUpGraceHours:
        "OpenRouter auto top-up periodo di grazia (ore)",
      uncensoredAiLowBalanceCredits:
        "Soglia minima del saldo uncensored.ai (crediti)",
      freedomGptLowBalanceCredits:
        "Soglia minima del saldo FreedomGPT (crediti)",
      gabLowBalanceCredits: "Soglia minima del saldo Gab AI (crediti)",
      nanoGptAutoTopUpFloorUsd: "NanoGPT auto piano di allarme superiore (USD)",
      nanoGptAutoTopUpGraceHours: "NanoGPT auto top-up periodo di grazia (ore)",
      veniceAutoTopUpFloorUsd: "Venice auto piano di allarme superiore (USD)",
      modelsLabLowBalanceUsd: "Soglia saldo ModelsLab (USD)",
      edenAiLowBalanceUsd: "Soglia saldo Eden AI (USD)",
      veniceAutoTopUpGraceHours: "Venice auto top-up periodo di grazia (ore)",
      marginFloorPct: "Piano marginale (%)",
      drainMultiplier: "Moltiplicatore drenante (x media di trailing)",
      hourlySpendCapUsd: "Tappo di spesa oraria per fornitore ($/h)",
      minSpikeUsd: "Spesa minima per giudicare un picco ($)",
      refundRatePct: "Limite di tasso di rimborso (% delle spese)",
      disputeCountDaily: "Controversie al giorno",
      cancellationMultiplier: "Spicca di cancellazione (x media di trailing)",
      cancellationMin: "Cancellazioni minime per giudicare un picco",
      billingGapPct: "Limite di gap di fatturazione (% sopra fatturato)",
      alertDedupHours: "Finestra di avviso ripetitivo (ore)",
      minRevenueUsd: "Ricavi giornalieri minimi a margine di giudizio ($)",
      minCostUsd: "Costo minimo giornaliero per giudicare il margine ($)",
    },
    scope: {
      all: "Tutto",
      balances: "Il fornitore bilancia solo",
      revenue: "Entrate solo",
    },
    costCoverage: {
      complete: "Completato",
      partial: "Costo parziale",
      none: "Costo sconosciuto",
    },
    metric: {
      stripeRevenue: "Entrate Stripe (grossa, $)",
      nowpaymentsRevenue: "Entrate NOWPayments (grossa, $)",
      netRevenue: "Entrate nette ($)",
      refunds: "Rimborso ($)",
      upstreamCost: "Costo a monte ($)",
      internalBilled: "Fatturato agli utenti ($)",
      grossMarginUsd: "Margine lordo ($)",
      grossMarginPct: "Margine lordo (%)",
      providerSpend: "Spese del fornitore ($)",
      providerBalance: "Bilancio del fornitore rimanente ($)",
      providerBalanceNative:
        "Saldo del fornitore rimanente (crediti del fornitore)",
      providerCost: "Costo del fornitore dai nostri registri ($)",
      costTotal: "Costo fornitori totale ($)",
      costPaid: "Costo fornitori dell’uso a pagamento ($)",
      costFree: "Costo fornitori dell’uso gratuito ($)",
      consumedList: "Crediti consumati a prezzo di listino ($)",
      earned: "Guadagnato: crediti pagati al prezzo pagato ($)",
      freeList: "Crediti gratuiti consumati a prezzo di listino ($)",
      aiMarginUsd: "Margine IA: guadagnato meno costo fornitori ($)",
      aiMarginPct: "Margine IA (% del guadagnato)",
      paidMarginUsd: "Margine dell’uso a pagamento ($)",
      paidMarginPct: "Margine dell’uso a pagamento (%)",
      alerts: "Avvisi sollevati",
    },
  },
  ingest: {
    title: "Ingestione finanziaria",
    titleShort: "Ingest",
    description:
      "Sollevamento di ricavi reali (Stripe, NOWPayments) e bilancia dei fornitori reali. Computa il margine giornaliero e solleva gli avvisi. Non ci sono soldi.",
    task: {
      balancesName: "Sincronizzazione dei saldi dei fornitori",
      revenueName: "Sincronizzazione dei ricavi",
      balances:
        "Ogni ora rileva i saldi dei fornitori e le spese, segnalando cali anomali e picchi di consumo.",
      revenue:
        "Ogni giorno acquisisce i ricavi da Stripe e NOWPayments, calcola il margine e segnala rimborsi, contestazioni e margini bassi.",
    },
    fields: {
      scope: {
        label: "Ambito",
        description: "Cosa tirare",
      },
      dryRun: {
        label: "Simulazione",
        description: "Leggere e calcolare, conservare nulla, non inviare nulla",
      },
      windowDays: {
        label: "Finestre delle entrate (giorni)",
        description:
          "Fino a che punto tornano a ri-pull entrate. Predefinito 3.",
      },
      backfillFrom: {
        label: "Backfill da (YYYY - MM - DD)",
        description:
          "Ricomputare i rollup giornalieri da questo giorno UTC attraverso il backfill-to (default oggi). Ricostruisce le entrate dalla nostra storia di pagamento completo; scrive sempre (ignores a secco). Lasciare vuoto per un normale ingerimento.",
      },
      backfillTo: {
        label: "Backfill a (YYYY - MM - DD)",
        description: "Ultimo giorno UTC per ricomputare. Predefinito: oggi.",
      },
    },
    response: {
      dryRun: "Simulazione",
      ranAt: "Ran a",
      sources: "Fonti",
      days: "Margine giornaliera",
      alertsRaised: "Avvisi sollevati",
      alertsSuppressed: "Alerts soppresso (duplicato)",
      alerts: "Avvisi",
    },
    widget: {
      hint: "Legge solo i nostri conti. Una fonte senza un punto finale è saltata e la ragione registrata.",
      submit: "Correre ingest",
      submitting: "Correre...",
      result: "Risultato di ingestione",
      resultDry: "Corsa a secco (niente immagazzinato, niente inviato)",
      events: "righe {{count}}",
      margin: "Incassi e spesa fornitori al giorno (non è un margine)",
      dayLine: "incassato {{cash}} · spesa fornitori {{cost}}",
      costUnknown: "costo sconosciuto",
      alerts: "avvisi: {{raised}} sollevato, {{suppressed}} soppresso",
    },
  },
  status: {
    title: "Finanza",
    titleShort: "Finanza",
    description:
      "Revenue vs costo a monte: bilancia dei fornitori, margine, avvisi e soglie.",
    response: {
      lastIngestAt: "Ultimo tentativo di sincronizzazione",
      lastSuccessfulIngestAt: "Ultima sincronizzazione di sorgente di successo",
      asOf: "Stato controllato",
      sources: "Fonti",
      week: "Ultimi 7 giorni",
      days: "Margine giornaliera",
      alerts: "Avvisi recenti",
      thresholds: "Soglia",
    },
    widget: {
      back: "Indietro",
      title: "Finanza",
      refresh: "Aggiorna",
      runIngest: "Correre ingest",
      loading: "Caricamento in corso...",
      lastIngest: "Ultima sincronizzazione tentativo {{when}}",
      lastSuccessful: "Ultima sincronizzazione di successo {{when}}",
      snapshot: "Ultima lettura del provider {{when}}",
      stale: "Lettura di stallo",
      noBalance: "Nessun saldo riportato",
      noSources: "Nessuna fonte finanziaria ha segnalato i dati.",
      never: "mai",
      neverRun: "Non ancora.",
      margin: {
        title: "Margine IA (ultimi 7 giorni)",
        earned: "Guadagnato dai crediti pagati",
        cost: "Costo fornitori",
        margin: "Margine IA",
        pct: "Margine IA %",
        paidPct: "Margine dell’uso a pagamento %",
        basis:
          "Guadagnato = crediti pagati consumati al prezzo pagato. Costo = costo fornitori di tutto l’uso, inclusi {{free}} di crediti gratuiti a prezzo di listino.",
        cash: "Incassi netti: {{net}}, commissioni di pagamento {{fees}}. Flusso di cassa, mai sottratto dal costo fornitori.",
        cashDay: "incassato {{net}}",
        empty: "Nessun uso negli ultimi 7 giorni.",
        missingPct: "Niente guadagnato",
      },
      providers: {
        title: "Bilancia del fornitore",
        lastSpend: "Data dell'ultima lettura: {{amount}}",
        lastSpendEstimate: "Spesa stimata dall'ultima lettura: {{amount}}",
        previousDaySpend: "Addebiti API del giorno {{day}} (UTC): {{amount}}",
        lastNativeSpend:
          "API carica attraverso l'ultima ora chiusa: {{amount}}",
        noSpend: "Nessuna spesa misurata ancora",
      },
      revenue: {
        title: "Fonti delle entrate",
        fallback: "Fallback: i propri record",
      },
      alerts: {
        title: "Avvisi recenti",
        empty: "Nessun avviso registrato",
      },
      thresholds: {
        title: "Soglia",
        hint: "I default si applicano fino a quando non si imposta un valore. Gli avvisi si ripetono al massimo una volta per finestra.",
        custom: "Personalizzato",
        default: "Predefinito",
        edit: "Modifica",
      },
    },
  },
  thresholds: {
    title: "Impostare la soglia di finanza",
    titleShort: "Set Threshold",
    description:
      "Superare una soglia di allarme. Un override disabilitato ritorna al default.",
    fields: {
      key: { label: "Soglia", description: "Quale limite di cambiamento" },
      value: { label: "Valore", description: "Il nuovo limite" },
      enabled: {
        label: "Utilizzare questo valore",
        description: "Off: rientrare al default",
      },
      note: {
        label: "Nota",
        description: "Perché questo limite",
        placeholder: "ad esempio la settimana di lancio, si aspettano rimborsi",
      },
    },
    response: { key: "Soglia salvata" },
    widget: {
      back: "Indietro",
      hint: "Le modifiche si applicano al prossimo ingestionamento.",
    },
  },
  series: {
    title: "Serie di finanza",
    titleShort: "Finanza",
    description:
      "Serie temporali dal monitor finanziario: ricavi per processore, ricavi netti, costi a monte, margine, spesa e bilancia dei fornitori, avvisi.",
    fields: {
      resolution: {
        label: "Risoluzione",
        description: "Dimensione del secchio",
      },
      range: {
        label: "Gamma di intervallo",
        description: "Campo di tempo per la presa",
      },
      lookback: {
        label: "Lookback",
        description: "Barre riscaldate prima della gamma",
      },
      metric: { label: "Metrico", description: "Che serie a grafico" },
      provider: {
        label: "Fornitore",
        description: "Filtra la spesa e il saldo del fornitore",
      },
      costProvider: {
        label: "Fornitore di costo",
        description:
          "ID del fornitore API per il costo, ad es. openrouter, nano-gpt o unattributed",
      },
      result: { label: "Serie", description: "Serie di tempo di finanza" },
      meta: { label: "Meta", description: "metadati di esecuzione" },
    },
  },
  errors: {
    validation: {
      title: "Input non valido",
      description: "Controllare i campi evidenziati",
    },
    unauthorized: {
      title: "Non firmato",
      description: "Accedi come amministratore",
    },
    forbidden: {
      title: "Admins solo",
      description:
        "Gli strumenti finanziari hanno bisogno del ruolo di amministratore",
    },
    notFound: {
      title: "Account o sessione non trovati",
      description: "Questa voce non esiste",
    },
    conflict: {
      title: "Conflitto",
      description:
        "L'ingresso è cambiato nel frattempo, ricarica e riprovazione",
    },
    server: {
      title: "Errore del server",
      description: "Non è possibile completare la richiesta",
    },
    network: {
      title: "Errore di rete",
      description: "Richiesta non ha raggiunto il server",
    },
    unknown: {
      title: "Errore sconosciuto",
      description: "Qualcosa di imprevisto è fallito",
    },
    unsavedChanges: {
      title: "Modifiche non salvate",
      description: "Salvare o scartare le modifiche prima",
    },
    invalidThreshold: "Una soglia richiede un numero non negativo",
    ingestFailed: "Ingestione finanziaria fallita: {{error}}",
    backfill: {
      invalidRange:
        "Il backup ha bisogno di un valido dalla data o prima della data (YYYY - MM - DD)",
      tooWide:
        "La gamma di riempimento è troppo ampia: alla maggior parte dei giorni {{max}} per corsa",
    },
  },
  success: {
    title: "Fatto",
    description: "Salvataggio",
  },
};
