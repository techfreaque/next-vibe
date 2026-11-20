import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Finanza",
  documents: {
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
      alerts: "Avvisi sollevati",
    },
  },
  ingest: {
    title: "Ingestione finanziaria",
    titleShort: "Ingest",
    description:
      "Sollevamento di ricavi reali (Stripe, NOWPayments) e bilancia dei fornitori reali. Computa il margine giornaliero e solleva gli avvisi. Non ci sono soldi.",
    task: {
      balances:
        "Ore: leggere ogni saldo del fornitore, misurare la spesa, sgomberi di bandiera e punte.",
      revenue:
        "Quotidiano: tirare Stripe e NOWPayments entrate, roll up margine, rimborsi di bandiera, dispute e margine sottile.",
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
      margin: "Margine: entrate nette - tasse - costi a monte",
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
      missingCost: "Nessun dato completo di costo",
      noSources: "Nessuna fonte finanziaria ha segnalato i dati.",
      never: "mai",
      neverRun: "Non ancora.",
      margin: {
        title: "Margine (ultimi 7 giorni)",
        revenue: "Entrate nette",
        cost: "Costo a monte",
        fees: "Tasse del processore",
        margin: "Margine lorda",
        pct: "Margine %",
        empty: "Non ci sono ancora rotture. Esegui un ingerito.",
        costUnknown: "costo sconosciuto",
        missingPct: "Percentuale di margine non disponibile",
        costIncomplete:
          "Il costo è disponibile per {{tracked}} giorni su {{total}}. Ricavi netti registrati nel periodo: {{revenue}}.",
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
