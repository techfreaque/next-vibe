import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  enums: {
    resolution: {
      "1m": "1 minuto",
      "3m": "3 processo verbale",
      "5m": "5 minuti",
      "15m": "15 minuti",
      "30m": "30 minuti",
      "1h": "1 ora",
      "4h": "4 ore",
      "1d": "1 giorno",
      "1w": "1 settimana",
      "1M": "1 Mese",
    },
    runStatus: {
      running: "Esecuzione",
      completed: "Completo",
      failed: "Sfigato",
    },
    backtestActionMode: {
      simulate: "Simulazione",
      execute: "Esecuzione",
    },
    graphOwnerType: {
      system: "Sistema",
      admin: "Amministratore",
      user: "Utente",
    },
    triggerType: {
      manual: "Manuale",
      cron: "Programmato",
    },
  },
  // Standard vibe-sense field labels (used by shared/fields.ts helpers)
  fields: {
    source: { label: "Fonte", description: "Serie di tempo di input" },
    resolution: { label: "Risoluzione", description: "Tempo di calcolo" },
    range: {
      label: "Gamma di intervallo",
      description: "Periodo di tempo per calcolare",
    },
    lookback: {
      label: "Lookback",
      description:
        "Barre extra prima dell'inizio della gamma per il riscaldamento",
    },
    result: { label: "Risultato", description: "Serie di tempo di uscita" },
    meta: { label: "Meta", description: "metadati di esecuzione del nodo" },
  },
  tags: {
    vibeSense: "vibe-sense",
    analytics: "analisi",
    pipeline: "pipeline",
  },

  // Graph list
  graphs: {
    list: {
      title: "Grafi di pipelina",
      description: "Elenca tutti i grafici visibili all'utente corrente",
      container: {
        title: "Grafi",
        description: "Tutti i grafici delle tubazioni",
      },
      response: {
        graphs: "Grafi",
      },
      success: {
        title: "Grafi caricati",
        description: "I grafi di pipeline recuperati con successo",
      },
      errors: {
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Accedi per continuare",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Accesso all'amministratore richiesto",
        },
        server: {
          title: "Errore del server",
          description: "Non caricate i grafici",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore imprevisto",
        },
        validation: {
          title: "Convalida fallita",
          description: "Richiesta non valida",
        },
        notFound: {
          title: "Account o sessione non trovati",
          description: "Nessun grafico trovato",
        },
        conflict: { title: "Conflitto", description: "conflitto di risorse" },
        network: {
          title: "Errore di rete",
          description: "La richiesta di rete è fallita",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Salvare le modifiche prima",
        },
      },
    },
    create: {
      title: "Creare Graph",
      description: "Creare un nuovo grafico delle tubazioni",
      fields: {
        name: {
          label: "Nome",
          description: "Nome dell'esposizione del grafico",
          placeholder: "Il mio grafico",
        },
        slug: {
          label: "Slug",
          description: "Identificatore unico",
          placeholder: "il mio",
        },
        description: {
          label: "Designazione",
          description: "Descrizione facoltativa",
          placeholder: "",
        },
        config: {
          label: "Configurazione",
          description: "Configurazione del grafico DAG",
        },
      },
      response: {
        id: "Grafico ID",
      },
      success: {
        title: "Grafio creato",
        description: "Grafico Pipeline creato con successo",
      },
      errors: {
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Accedi per continuare",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Accesso all'amministratore richiesto",
        },
        server: {
          title: "Errore del server",
          description: "Non creato grafico",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore imprevisto",
        },
        validation: {
          title: "Convalida fallita",
          description: "Configurazione del grafico non valido",
        },
        notFound: {
          title: "Account o sessione non trovati",
          description: "Risorsa non trovata",
        },
        conflict: {
          title: "Conflitto",
          description: "Graph slug esiste già",
        },
        network: {
          title: "Errore di rete",
          description: "La richiesta di rete è fallita",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Salvare le modifiche prima",
        },
      },
    },
    get: {
      title: "Ottieni Graph",
      description: "Ottieni un grafico specifico da ID",
      fields: {
        id: {
          label: "Grafico ID",
          description: "UUID della versione del grafico",
        },
      },
      response: {
        graph: "Grafico",
      },
      success: {
        title: "Grafica caricata",
        description: "Graph recuperato con successo",
      },
      errors: {
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Accedi per continuare",
        },
        forbidden: { title: "Accesso negato", description: "Accesso negato" },
        server: {
          title: "Errore del server",
          description: "Non caricate il grafico",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore imprevisto",
        },
        validation: { title: "Convalida fallita", description: "Invalid ID" },
        notFound: {
          title: "Account o sessione non trovati",
          description: "Grafico non trovato",
        },
        conflict: { title: "Conflitto", description: "conflitto di risorse" },
        network: {
          title: "Errore di rete",
          description: "La richiesta di rete è fallita",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Salvare le modifiche prima",
        },
      },
    },
    edit: {
      title: "Modifica del grafico",
      description:
        "Branch e modificare un grafico (crea una nuova versione, non muta mai)",
      fields: {
        id: {
          label: "Grafico ID",
          description: "UUID della versione a ramo da",
        },
        config: {
          label: "Configurazione",
          description: "Configurazione del grafico aggiornato",
        },
        name: { label: "Nome", description: "Nome aggiornato" },
        description: {
          label: "Designazione",
          description: "Descrizione aggiornata",
        },
      },
      response: {
        id: "Nuova versione ID",
      },
      success: {
        title: "Grafica ramificata",
        description: "Nuova versione del grafico creata con successo",
      },
      errors: {
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Accedi per continuare",
        },
        forbidden: { title: "Accesso negato", description: "Accesso negato" },
        server: {
          title: "Errore del server",
          description: "Non è possibile modificare il grafico",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore imprevisto",
        },
        validation: {
          title: "Convalida fallita",
          description: "Individuazione non valida",
        },
        notFound: {
          title: "Account o sessione non trovati",
          description: "Grafico non trovato",
        },
        conflict: { title: "Conflitto", description: "conflitto di risorse" },
        network: {
          title: "Errore di rete",
          description: "La richiesta di rete è fallita",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Salvare le modifiche prima",
        },
      },
    },
    promote: {
      title: "Promuovere il sistema",
      description:
        "Promuovere un grafico di amministrazione a proprietà del sistema (solo lettura, condiviso)",
      fields: {
        id: {
          label: "Grafico ID",
          description: "UUID del grafico per promuovere",
        },
      },
      response: {
        id: "Grafico ID",
      },
      success: {
        title: "Grafio promosso",
        description: "Grafico promosso a sistema con successo",
      },
      errors: {
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Accedi per continuare",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Accesso all'amministratore richiesto",
        },
        server: {
          title: "Errore del server",
          description: "Non è riuscito a promuovere il grafico",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore imprevisto",
        },
        validation: { title: "Convalida fallita", description: "Invalid ID" },
        notFound: {
          title: "Account o sessione non trovati",
          description: "Grafico non trovato",
        },
        conflict: { title: "Conflitto", description: "conflitto di risorse" },
        network: {
          title: "Errore di rete",
          description: "La richiesta di rete è fallita",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Salvare le modifiche prima",
        },
      },
    },
    trigger: {
      title: "Grafica del tritatore",
      description: "Attivare manualmente l'esecuzione del grafico richiesta",
      fields: {
        id: {
          label: "Grafico ID",
          description: "UUID del grafico per attivare",
        },
        rangeFrom: { label: "Da", description: "Inizio gamma (data ISO)" },
        rangeTo: { label: "A", description: "Intervallo finale (data ISO)" },
      },
      response: {
        nodeCount: "Nodi giustiziati",
        errorCount: "Errori",
        errors: "Errori",
      },
      success: {
        title: "Grafica eseguita",
        description: "Graphic correva con successo",
      },
      errors: {
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Accedi per continuare",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Accesso all'amministratore richiesto",
        },
        server: {
          title: "Errore del server",
          description: "Esecuzione del grafico guasto",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore imprevisto",
        },
        validation: {
          title: "Convalida fallita",
          description: "Parametri non validi",
        },
        notFound: {
          title: "Account o sessione non trovati",
          description: "Grafico non trovato",
        },
        conflict: { title: "Conflitto", description: "conflitto di risorse" },
        network: {
          title: "Errore di rete",
          description: "La richiesta di rete è fallita",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Salvare le modifiche prima",
        },
      },
    },
    backtest: {
      title: "Esegui il backup",
      description:
        "Eseguire un backtest su una gamma storica (azioni simulate)",
      fields: {
        id: {
          label: "Grafico ID",
          description: "UUID della versione del grafico",
        },
        rangeFrom: { label: "Da", description: "Inizio della gamma di backup" },
        rangeTo: { label: "A", description: "Fine della gamma di backup" },
        resolution: {
          label: "Risoluzione",
          description: "Tempi di valutazione",
        },
      },
      response: {
        runId: "Correre ID",
        eligible: "Idonea",
        ineligibleNodes: "Nodi ineleggibili",
      },
      success: {
        title: "Indietro completo",
        description: "Backtest corse con successo",
      },
      errors: {
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Accedi per continuare",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Accesso all'amministratore richiesto",
        },
        server: {
          title: "Errore del server",
          description: "Il ritorno è fallito",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore imprevisto",
        },
        validation: {
          title: "Convalida fallita",
          description: "Parametri non validi",
        },
        notFound: {
          title: "Account o sessione non trovati",
          description: "Grafico non trovato",
        },
        conflict: { title: "Conflitto", description: "conflitto di risorse" },
        network: {
          title: "Errore di rete",
          description: "La richiesta di rete è fallita",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Salvare le modifiche prima",
        },
      },
    },
    data: {
      title: "Dati del grafico",
      description:
        "Recuperare i dati delle serie temporali per un grafico (esecuzione richiesta)",
      fields: {
        id: { label: "Grafico ID", description: "UUID del grafico" },
        rangeFrom: { label: "Da", description: "Inizio gamma" },
        rangeTo: { label: "A", description: "Ampiezza" },
      },
      response: {
        series: "Serie",
        signals: "Segnali",
      },
      success: {
        title: "Dati caricati",
        description: "Dati grafici recuperati con successo",
      },
      errors: {
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Accedi per continuare",
        },
        forbidden: { title: "Accesso negato", description: "Accesso negato" },
        server: {
          title: "Errore del server",
          description: "Non riuscito a recuperare i dati",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore imprevisto",
        },
        validation: {
          title: "Convalida fallita",
          description: "Parametri non validi",
        },
        notFound: {
          title: "Account o sessione non trovati",
          description: "Grafico non trovato",
        },
        conflict: { title: "Conflitto", description: "conflitto di risorse" },
        network: {
          title: "Errore di rete",
          description: "La richiesta di rete è fallita",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Salvare le modifiche prima",
        },
      },
    },
  },

  // Indicator node definitions
  indicators: {
    ema: {
      description:
        "Media mobile esponenziale - pesi prezzi recenti più pesantemente",
      input: { source: { label: "Fonte" } },
      output: { value: { label: "EMA" } },
      params: {
        period: { label: "Periodo", description: "Numero di periodi (1–500)" },
      },
    },
    rsi: {
      description:
        "Indice di resistenza relativa - oscillatore di slancio (0–100)",
      input: { source: { label: "Fonte" } },
      output: { value: { label: "RSI" } },
      params: {
        period: {
          label: "Periodo",
          description: "Durata del lookback (2–100)",
        },
      },
    },
    bollinger: {
      description:
        "Bollinger Bands - busta di volatilità intorno a una media mobile",
      input: { source: { label: "Fonte" } },
      output: {
        upper: { label: "Banda superiore" },
        middle: { label: "Banda mediana" },
        lower: { label: "Banda inferiore" },
      },
      params: {
        period: { label: "Periodo", description: "Periodo medio mobile" },
        stdDev: {
          label: "Std Dev",
          description: "moltiplicatore di deviazione standard",
        },
      },
    },
    macd: {
      description: "MACD - indicatore di slancio alla tendenza",
      input: { source: { label: "Fonte" } },
      output: {
        macd: { label: "MACD" },
        signal: { label: "Signal" },
        histogram: { label: "Istogramma" },
      },
      params: {
        fastPeriod: {
          label: "Periodo veloce",
          description: "Periodo EMA veloce",
        },
        slowPeriod: {
          label: "Periodo lento",
          description: "Periodo lento EMA",
        },
        signalPeriod: {
          label: "Periodo di firma",
          description: "Segnale periodo EMA",
        },
      },
    },
    ratio: {
      description: "Computo A / B per timestamp",
      input: { a: { label: "Numeratore" }, b: { label: "Denominatore" } },
      output: { value: { label: "Rapporto" } },
    },
    delta: {
      description: "Variazione periodica-periodo",
      input: { source: { label: "Fonte" } },
      output: { value: { label: "Delta" } },
    },
    clamp: {
      description: "Valori di morsetto a [min, max]",
      input: { source: { label: "Fonte" } },
      output: { value: { label: "Morsetto" } },
      params: {
        min: { label: "Minimo", description: "Limite più basso" },
        max: { label: "Massimo", description: "Legato superiore" },
      },
    },
    windowAvg: {
      description: "Media di rotolamento nei periodi N",
      input: { source: { label: "Fonte" } },
      output: { value: { label: "Avvertimenti" } },
      params: {
        size: { label: "Finestra", description: "Numero di periodi (1–500)" },
      },
    },
    windowSum: {
      description: "Sommario di rotolamento per periodi N",
      input: { source: { label: "Fonte" } },
      output: { value: { label: "Su." } },
      params: {
        size: { label: "Finestra", description: "Numero di periodi (1–500)" },
      },
    },
    windowMin: {
      description: "Minimo di rotolamento durante i periodi N",
      input: { source: { label: "Fonte" } },
      output: { value: { label: "Minimo" } },
      params: {
        size: { label: "Finestra", description: "Numero di periodi (1–500)" },
      },
    },
    windowMax: {
      description: "Laminazione massima per periodi N",
      input: { source: { label: "Fonte" } },
      output: { value: { label: "Massimo" } },
      params: {
        size: { label: "Finestra", description: "Numero di periodi (1–500)" },
      },
    },
  },

  // Data source node definitions
  dataSources: {
    leadsCreated: {
      description: "Numero di nuovi cavi creati al minuto",
      output: { value: { label: "Piombo Creato" } },
    },
    leadsConverted: {
      description: "Numero di cavi convertiti agli utenti al minuto",
      output: { value: { label: "Piombo convertiti" } },
    },
    leadsActive: {
      description: "Totale attivo conteggio piombo (snapshot al giorno)",
      output: { value: { label: "Contatto attivo" } },
    },
    leadsBounced: {
      description: "Numero di email di piombo rimbalzi al minuto",
      output: { value: { label: "Contatto rimbalzato" } },
    },
    leadsEngagements: {
      description: "Totale eventi di fidanzamento (apre + clic) al minuto",
      output: { value: { label: "Impegni di piombo" } },
    },
    leadsEmailsSent: {
      description: "Numero di email di campagna inviate al minuto",
      output: { value: { label: "Inviare email" } },
    },
    leadsUnsubscribed: {
      description: "Numero di piste che non sono state sottoscritte al minuto",
      output: { value: { label: "Contatto non sottoscritto" } },
    },
    leadsEmailOpens: {
      description: "Numero di e-mail si apre tracciato al minuto",
      output: { value: { label: "Apri email" } },
    },
    leadsEmailClicks: {
      description: "Numero di collegamenti e-mail clicca per il minuto",
      output: { value: { label: "Email Clicks" } },
    },
    leadsNewsletterSubscribers: {
      description:
        "Totale contatti con l'abbonamento alla newsletter (snapshot al giorno)",
      output: { value: { label: "Iscriviti alla newsletter" } },
    },
    leadsWebsiteUsers: {
      description:
        "Totale conduce con lo stato dell'utente del sito web (snapshot al giorno)",
      output: { value: { label: "Utenti del sito web" } },
    },
    leadsCampaignRunning: {
      description:
        "Totale conduce attualmente in una campagna e-mail attiva (snapshot al giorno)",
      output: { value: { label: "In campagna" } },
    },
    leadsInContact: {
      description:
        "Totale conduce attualmente in stato di contatto (snapshot al giorno)",
      output: { value: { label: "In contatto" } },
    },
    leadsWebsiteVisits: {
      description:
        "Numero di eventi di coinvolgimento del sito web visita al minuto",
      output: { value: { label: "Visite al sito" } },
    },
    leadsFormSubmits: {
      description: "Numero di eventi di fidanzamento al minuto",
      output: { value: { label: "Modulo di presentazione" } },
    },
    usersRegistered: {
      description: "Numero di nuove registrazioni utente al minuto",
      output: { value: { label: "Utenti registrati" } },
    },
    usersActiveTotal: {
      description:
        "Totale attivo verificato conteggio utente (snapshot al giorno)",
      output: { value: { label: "Utenti attivi" } },
    },
    usersBanned: {
      description: "Numero di utenti vietati al minuto (circa)",
      output: { value: { label: "Utenti Banati" } },
    },
    usersEmailVerified: {
      description: "Utenti totali con e-mail verificata (snapshot al giorno)",
      output: { value: { label: "E-mail verificato" } },
    },
    usersMarketingConsent: {
      description:
        "Totale utenti che hanno dato il consenso di marketing (snapshot al giorno)",
      output: { value: { label: "Consenso di marketing" } },
    },
    usersWithStripe: {
      description:
        "Totale utenti collegati a un cliente Stripe (snapshot al giorno)",
      output: { value: { label: "Utenti Stripe" } },
    },
    usersTwoFaEnabled: {
      description: "Totale utenti con 2FA abilitato (snapshot al giorno)",
      output: { value: { label: "2FA Abilitato" } },
    },
    usersLoginAttemptsTotal: {
      description: "Totale tentativi di login al minuto",
      output: { value: { label: "I tentativi di registrazione" } },
    },
    usersLoginAttemptsFailed: {
      description: "tentativi di login non funzionanti al minuto",
      output: { value: { label: "Login non registrati" } },
    },
    creditsSpentTotal: {
      description: "Crediti totali spesi al minuto in tutti i portafogli",
      output: { value: { label: "Credits Spent" } },
    },
    creditsSpentByUsers: {
      description: "Crediti spesi da utenti autenticati al minuto",
      output: { value: { label: "Credits Spent (Users)" } },
    },
    creditsSpentByLeads: {
      description: "Crediti gratuiti spesi da piste al minuto",
      output: { value: { label: "Credits Spent (Leads)" } },
    },
    creditsPurchased: {
      description:
        "Crediti acquistati o aggiunti tramite abbonamento al minuto",
      output: { value: { label: "Crediti acquistati" } },
    },
    creditsFreeGrants: {
      description: "Concessioni di credito gratuite emesse a lead al minuto",
      output: { value: { label: "Sovvenzioni gratuite" } },
    },
    creditsEarned: {
      description: "Crediti guadagnati tramite referrals al minuto",
      output: { value: { label: "Crediti acquisiti" } },
    },
    creditsExpired: {
      description: "Crediti scaduti al minuto",
      output: { value: { label: "Crediti scaduti" } },
    },
    creditsRefunded: {
      description: "Crediti rimborsati al minuto",
      output: { value: { label: "Crediti rimborsati" } },
    },
    creditsBalanceTotal: {
      description:
        "Saldo crediti complessivo di tutti i portafogli degli utenti (rilevazione giornaliera)",
      output: { value: { label: "Saldo crediti" } },
    },
    creditsSubscriptionRevenue: {
      description: "Crediti da pacchetti tipo abbonamento al minuto",
      output: { value: { label: "Entrate d'abbonamento" } },
    },
    creditsTransferVolume: {
      description:
        "Volume di trasferimento di credito tra portafogli al minuto",
      output: { value: { label: "Volume di trasferimento" } },
    },
    creditsFreePoolUtilization: {
      description:
        "Percentuale di piscina di credito gratuita consumata (snapshot al giorno)",
      output: { value: { label: "Uso gratuito della piscina" } },
    },
  },

  // Evaluator node definitions
  evaluators: {
    threshold: {
      description:
        "Fuoco quando un valore della serie soddisfa un confronto contro una costante",
      input: {
        series: { label: "Serie" },
      },
      output: {
        signal: { label: "Signal" },
      },
      params: {
        op: {
          label: "Operatore",
          description: "Operatore di confronto",
        },
        value: {
          label: "Valore",
          description: "Costante per confrontare contro",
        },
      },
    },
    and: {
      description:
        "Fuoco quando tutti i segnali di ingresso fuoco allo stesso timestamp",
      input: { signals: { label: "Segnali" } },
      output: { signal: { label: "Signal" } },
    },
    or: {
      description:
        "Fuoco quando qualsiasi segnale di ingresso accende in un determinato timestamp",
      input: { signals: { label: "Segnali" } },
      output: { signal: { label: "Signal" } },
    },
    not: {
      description: "Invertisce un flusso di segnale",
      input: { signal: { label: "Signal" } },
      output: { signal: { label: "Invertito" } },
    },
    crossover: {
      description: "Fuoco quando la serie A attraversa la serie B",
      input: {
        seriesA: { label: "Serie A" },
        seriesB: { label: "Serie B" },
      },
      output: { signal: { label: "Signal" } },
    },
    script: {
      description:
        "Sandboxed evaluator personalizzato - riceve serie di input, eventi di segnale di reso",
      input: { inputs: { label: "Ingressi" } },
      output: { signal: { label: "Signal" } },
      params: {
        fn: {
          label: "Funzione",
          description:
            "JS funzione corpo ricevente serie di input array, eventi di segnale di ritorno",
        },
      },
    },
  },

  // Transformer node definitions
  transformers: {
    merge: {
      description: "Somma due serie a timestamp corrispondenti",
      input: {
        a: { label: "Serie A" },
        b: { label: "Serie B" },
      },
      output: { value: { label: "Meritato" } },
    },
    ratio: {
      description: "Computo A / B per timestamp",
      input: {
        a: { label: "Numeratore" },
        b: { label: "Denominatore" },
      },
      output: { value: { label: "Rapporto" } },
    },
    delta: {
      description: "Variazione periodica-periodo",
      input: { source: { label: "Fonte" } },
      output: { value: { label: "Delta" } },
    },
    clamp: {
      description: "Valori di morsetto a [min, max]",
      input: { source: { label: "Fonte" } },
      output: { value: { label: "Morsetto" } },
      params: {
        min: { label: "Minimo", description: "Limite più basso" },
        max: { label: "Massimo", description: "Legato superiore" },
      },
    },
    windowAvg: {
      description: "Media di rotolamento nei periodi N",
      input: { source: { label: "Fonte" } },
      output: { value: { label: "Avvertimenti" } },
      params: {
        size: { label: "Finestra", description: "Numero di periodi (1–500)" },
      },
    },
    windowSum: {
      description: "Sommario di rotolamento per periodi N",
      input: { source: { label: "Fonte" } },
      output: { value: { label: "Su." } },
      params: {
        size: { label: "Finestra", description: "Numero di periodi (1–500)" },
      },
    },
    windowMin: {
      description: "Minimo di rotolamento durante i periodi N",
      input: { source: { label: "Fonte" } },
      output: { value: { label: "Minimo" } },
      params: {
        size: { label: "Finestra", description: "Numero di periodi (1–500)" },
      },
    },
    windowMax: {
      description: "Laminazione massima per periodi N",
      input: { source: { label: "Fonte" } },
      output: { value: { label: "Massimo" } },
      params: {
        size: { label: "Finestra", description: "Numero di periodi (1–500)" },
      },
    },
    fieldPick: {
      description: "Estrarre un campo chiamato da una serie multi-valore",
      input: { source: { label: "Valore multi-" } },
      output: { value: { label: "Campo di applicazione" } },
      params: {
        field: {
          label: "Nome del campo",
          description: "Nome del campo da estrarre",
        },
      },
    },
    jsonPath: {
      description:
        "Estrarre un valore attraverso il percorso di notazione dot da DataPoint meta",
      input: { source: { label: "Fonte" } },
      output: { value: { label: "Valore" } },
      params: {
        path: {
          label: "Sentiero",
          description: "Percorso di notazione, ad esempio data.stats.total",
        },
      },
    },
    script: {
      description: "Trasformazione di script sandbox personalizzata",
      input: { inputs: { label: "Ingressi" } },
      output: { value: { label: "Risultato" } },
      params: {
        fn: {
          label: "Funzione",
          description:
            "Funzione freccia JS che riceve array di serie di input, restituendo DataPoint[]",
        },
      },
    },
  },

  // Shared data-source chart widget UI
  dataSourceWidget: {
    addToGraph: "Aggiungi al grafico",
    newGraph: "Nuovo grafico",
    loading: "Caricamento dati...",
    noData: "Nessun dato per questo periodo",
  },

  // Cleanup task
  cleanup: {
    post: {
      title: "Detergente di Vibe",
      description:
        "Eseguire la pulizia della ritenzione per i punti di dati e scadere snapshot",
      success: {
        title: "Pulizia completa",
        description: "Pulizia della conservazione finito",
      },
      response: {
        nodesProcessed: "Nomi trattati",
        totalDeleted: "Righe cancellate",
        snapshotsDeleted: "Istantanee cancellate",
      },
      errors: {
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Accedi per continuare",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Accesso all'amministratore richiesto",
        },
        server: {
          title: "Errore del server",
          description: "La pulizia non è riuscita",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore imprevisto",
        },
        validation: {
          title: "Convalida fallita",
          description: "Richiesta non valida",
        },
        notFound: {
          title: "Account o sessione non trovati",
          description: "Account o sessione non trovati",
        },
        conflict: { title: "Conflitto", description: "Conflitto" },
        network: {
          title: "Errore di rete",
          description: "La richiesta di rete è fallita",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Salvare le modifiche prima",
        },
      },
    },
    name: "Detergente di Vibe",
    description: "Prunes vecchi datapoint e scade la cache snapshot",
  },
};
