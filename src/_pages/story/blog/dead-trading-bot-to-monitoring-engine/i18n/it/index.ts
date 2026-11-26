import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title:
      "Il mio bot di trading abbandonato è diventato un sistema di monitoraggio | next-vibe",
    description:
      "Anni fa ho abbandonato un bot di trading. Poi ho capito che la sua architettura (DataSource, indicatore, valutatore e azione) si poteva applicare a qualsiasi attività. L’ho ricostruita in next-vibe. Ogni nodo è un endpoint.",
    category: "Vibe Sense",
    imageAlt: "Flusso di monitoraggio di Vibe Sense in next-vibe",
    keywords:
      "senso dell'atmosfera, monitoraggio, trading bot, endpoints, EMA, pipeline, next-vibe, TypeScript",
    ogTitle:
      "Il mio robot di trading morto è diventato un motore di monitoraggio della piattaforma",
    ogDescription:
      "Il bot di trading aveva ragione su questa architettura. Mi sono sbagliato dove l'ho costruito.",
    twitterTitle: "Morto trading bot → motore di monitoraggio dal vivo",
    twitterDescription:
      "Ogni nodo e' un punto finale. La pipeline è solo endpoints che chiamano endpoints.",
  },
  backToBlog: "Torna al blog",
  hero: {
    eyebrow: "Vibe Sense",
    title: "Così la piattaforma monitora il proprio stato.",
    subtitle:
      "Ho abbandonato un robot commerciale anni fa. La sua architettura è diventata la parte più interessante di next-vibe. Ogni nodo nel grafico è un endpoint: chiamabile dallo CLI, scoperto da AI, cablato nella vostra piattaforma.",
    readTime: "14 min lettura",
  },
  origin: {
    title: "Il bot di trading che ho abbandonato",
    paragraph1:
      "Qualche anno fa ho falsificato OctoBot e ho costruito qualcosa che ho chiamato Octane. Python backend, React frontend. È possibile trascinare gli indicatori tecnici su una tela, evacuatori catena insieme, configurare le regole di esecuzione, impostare avvisi, ordini di fuoco. Aveva un costruttore di strategia visiva. Lo gestisco ancora per il mio portafoglio.",
    paragraph2:
      "L'ho abbandonata come base di codice. Il Python si stava diffondendo, l'architettura aveva accumulato abbastanza debiti che ogni cambiamento si sentiva costoso, e avevo altre cose da costruire.",
    paragraph3:
      "Ma continuavo a pensarci. In particolare su ciò che lo ha fatto funzionare come un sistema.",
    quoteText:
      "Il bot di trading aveva ragione su questa architettura. La cosa che ho sbagliato era costruirla in isolamento.",
    timeline: {
      octane: {
        label: "Octane (forcella di OctoBot)",
        description:
          "Visual strategy builder, drag-and-drop indicatori, Python backend. Abbandonato come base di codice.",
      },
      insight: {
        label: "La realizzazione",
        description:
          "Quella struttura non descrive il trading. Descrive qualsiasi processo di business con i dati nel tempo.",
      },
      rebuilt: {
        label: "Ricostruito dentro next-vibe",
        description:
          "Perfettamente digitato. Ogni nodo è un endpoint standard. Accessibile ovunque la piattaforma sia.",
      },
    },
  },
  insight: {
    title: "Ogni azienda è una serie di tempo",
    intro:
      "In un bot di trading, i pezzi sono semplici. Una fonte di dati: i dati dei prezzi, il volume, qualsiasi cosa stiate leggendo. Un indicatore: media mobile, RSI, MACD, prende dati grezzi, produce un segnale derivato. Un evaluator: il rapido MA è sopra il lento MA? Condizione booleana. Un'azione: quando l'evaluatore spara, fai qualcosa.",
    realization:
      "Quella struttura non descrive il trading. Descrive qualsiasi processo di business in cui si dispone di dati nel tempo, condizioni a cui si interessa, e le azioni che si desidera intraprendere quando tali condizioni sono soddisfatte.",
    examples: {
      userGrowth: {
        label: "Crescita dell'utente",
        description:
          "E' una serie temporale. Sta diminuendo? E' un evaluatore. Manda una campagna di vittoria. E' un'azione.",
      },
      emailHealth: {
        label: "Email campagna salute",
        description:
          "Tariffe aperte, tassi di rimbalzo, tassi di cancellazione. Tutte le serie temporali. Tutte le condizioni che puoi valutare. Tutto attivabile.",
      },
      creditEconomy: {
        label: "Economia di credito",
        description:
          "Spendere velocita'. Tasso di combustione vs. tasso di acquisto. Tutto.",
      },
      revenueAnomaly: {
        label: "Anomalie del reddito",
        description:
          "Rimborso punte di tasso superiore al 20% in un giorno: Thea viene notificato prima di vederlo in una dashboard.",
      },
    },
  },
  architecture: {
    title: "I quattro tipi di nodo",
    subtitle:
      "Tre tipi di nodo è necessario capire per leggere qualsiasi grafico. E poi un quarto che chiude il ciclo.",
    dataSource: {
      label: "DataSource",
      description:
        "Un endpoint di proprietà di dominio che interroga il tuo database e restituisce { timestamp, valore }[] per un determinato intervallo di tempo e risoluzione. Vive con il suo dominio. Conosce il suo schema.",
    },
    indicator: {
      label: "Indicator",
      description:
        "Un endpoint di calcolo puro e riutilizzabile: EMA, RSI, MACD, Bollinger Bands, morsetto, delta, media della finestra. No SQL. Nessuna conoscenza del dominio. Chiamalo su qualsiasi fonte di dati.",
    },
    evaluator: {
      label: "Evaluator",
      description:
        "Una soglia o una condizione. Prende una serie e fa una domanda. Questo valore è inferiore a 0,7? Questo rapporto ha superato il 20%? Emette un segnale: licenziato o non licenziato.",
    },
    action: {
      label: "Action",
      description:
        "Quando l'evaluatore a monte spara, viene chiamato un punto finale specifico. In-processo. No HTTP. Stessa validazione, stesso auth, stesso tipo di risposta di qualsiasi altra chiamata nel sistema.",
    },
    connector: "si nutre in",
  },
  unified: {
    title: "Ogni nodo è un endpoint",
    intro: "Ecco la cosa che voglio atterrare ora, prima di andare oltre.",
    oldApproach: {
      label: "vecchio approccio (Octane)",
      description:
        "EMA esiste solo come nodo in un grafico. Non puoi chiamarlo dallo CLI. Non si presenta come uno strumento AI. E' un dettaglio di implementazione privata.",
    },
    newApproach: {
      label: "Approccio next-vibe",
      description:
        "Ogni nodo Vibe Sense è un endpoint standard, definito con createEndpoint (), registrato nello stesso registro di fine anno come tutto il resto della piattaforma.",
    },
    cliCaption:
      "Puoi chiamare da CLI lo stesso endpoint EMA che usi come nodo nel grafo del funnel. La definizione, la validazione e l’autenticazione restano identiche.",
    insight:
      "L'endpoint SAME che è un nodo nel grafico deimbuti di contatto è anche uno strumento standalone su 13 piattaforme.",
    keyLine: "La pipeline è solo endpoints che chiamano endpoints.",
  },
  actionCallout: {
    title: "Ma le azioni non sono scambi commerciali",
    body: "Quando un segnale accende, il motore chiama qualsiasi punto finale. In-processo. Nessuna pista ciclabile HTTP. Un'allerta. Un innesco della campagna. Escalation AI con contesto pre-riempito. Thea viene notificato. Inizia una sequenza di win-back. Qualunque cosa sia collegata a quell'evaluatore.",
    noWebhook: "Niente webhook.",
    noAlerting: "Nessun servizio di allerta personalizzato.",
    noZapier: "No Zapier.",
    punchline: "La piattaforma si chiama.",
    examples: {
      alert: {
        label: "Avviso",
        description: "Chiamare il full-task: Thea lo raccoglie immediatamente.",
      },
      campaign: {
        label: "Campagna",
        description:
          "Trigger una sequenza di conversione quando la velocità del contatto attraversa una soglia.",
      },
      ai: {
        label: "Escalation AI",
        description:
          "Accendere un AI eseguire con contesto pre-riempito su quale segnale ha innescato.",
      },
    },
  },
  funnel: {
    title: "Camminare il grafico dell'imbuto di contatto",
    subtitle:
      "Questo è il grafo di acquisizione lead. Viene eseguito ogni sei ore. Seguiamolo dall’inizio alla fine.",
    column1: {
      label: "Colonna 1: fonti di dati",
      description:
        "Ogni endpoint si trova in leads/data-sources/. Riceve un intervallo temporale e una risoluzione, esegue la query SQL e restituisce { timestamp, value }[].",
      nodes: {
        created: {
          name: "leads.created",
          description:
            "Interroga i lead per created_at. Le ore senza nuovi lead non producono punti dati.",
        },
        converted: {
          name: "leads.converted",
          description:
            "Gruppo converted_at, conta i lead che hanno raggiunto lo stato SIGNED_UP.",
        },
        bounced: {
          name: "leads.bounced",
          description: "Lead con email respinte per intervallo temporale.",
        },
        active: {
          name: "leads.active",
          description:
            "Indicatore istantaneo con risoluzione ONE_DAY. Conta i lead che non hanno ancora raggiunto uno stato finale.",
        },
      },
    },
    column2: {
      label: "Colonna 2: Indicatori",
      description:
        'Calcolo puro. L\'endpoint EMA vive a analytics/indicatori/ema. Il suo grafico config è solo { tipo: "indicatore", indicatorId : "ema", params: { periodo: 7 } }.',
      nodes: {
        ema7: {
          name: "leads_created_ema7",
          description:
            "Indicatore EMA, periodo=7. Estende automaticamente la gamma di fetch a monte per il riscaldamento.",
        },
        conversionRate: {
          name: "conversion_rate",
          description:
            "Trasformazione: divide leads.converted per leads.created per ogni intervallo temporale. Limita il risultato tra 0 e 1.",
        },
      },
    },
    column3: {
      label: "Colonna 3: Valutazione",
      description:
        "Condizioni di soglia. Ogni uscita di un segnale: sparato o non licenziato.",
      nodes: {
        leadDrop: {
          name: "eval_lead_drop",
          description:
            "EMA (7) < 0.7 alla risoluzione ONE_WEEK. La velocità di creazione del contatto lisciata in 7 periodi scende sotto il 70%.",
        },
        zeroLeads: {
          name: "eval_zero_leads",
          description:
            "leads.created < 1/day. Passa un giorno intero senza nuovi lead.",
        },
        lowConversion: {
          name: "eval_low_conversion",
          description:
            "conversion_rate < 5%/settimana. La conversione deimbuti scende al di sotto del 5%.",
        },
      },
    },
  },
  domainOwned: {
    title: "Fonti dati di proprietà del dominio",
    subtitle:
      "Una delle decisioni architettoniche più soddisfatte: le fonti di dati vivono con il loro dominio, non in qualche directory centrale vibe-sense/.",
    leadsLabel: "Dominio di contatto",
    leadsCount: "... 15 fonti di dati totali",
    creditsLabel: "Dominio dei crediti",
    creditsCount: "... 17 fonti di dati totali",
    explanation:
      "lead/data-sources/leads-created conosce la tabella dei cavi. Importa da contatto/db. Usa LeadStatus da piste/enum. Se elimini il modulo di guida, le fonti di dati vanno con esso. Niente di orfano.",
    indicators: {
      label: "Indicatori analitici/indicatori/",
      description:
        "Calcolo puro: EMA, RSI, MACD, Bollinger Bands, morsetto, delta, media finestra. Nessuna conoscenza del dominio. Chiamali su qualsiasi fonte di dati.",
    },
    registration:
      "All'avvio, l'indicatore di registro auto-scopri entrambi. I endpoint della fonte di dati registrano come definizioni dei nodi. Indicatore endpoints registro come nodo definizioni. Aggiungete un nuovo dominio, aggiungete risorse/ endpoint dei dati, esportate graphSeeds. Appaiono.",
    keyLine: "Il dominio possiede la propria osservabilità.",
  },
  safety: {
    title: "Versione, backtest, persist",
    subtitle:
      "Tre cose che rendono Vibe Sense sicuro da eseguire in produzione.",
    versioning: {
      label: "Versione",
      description:
        "I grafici sono stati versioneti. Quando si modifica un grafico, si crea una nuova versione: mai mutare quella attiva. La nuova versione è una bozza. Lo promuovi in modo esplicito. Rollback e' banale.",
    },
    backtest: {
      label: "Backtest",
      description:
        "Prima di promuovere, è possibile backtest su una gamma storica di tempo. Valutare le condizioni. Registrazione dei segnali. Gli endpoint non sparano mai. Cancello chiuso.",
    },
    persist: {
      label: "Modalità persiste",
      always: {
        label: "always",
        description:
          "Ogni punto dati calcolato viene salvato nell’archivio. Gli indicatori basati su eventi contano per esempio i lead acquisiti o i crediti spesi al minuto.",
      },
      snapshot: {
        label: "snapshot",
        description:
          "Computato su richiesta, cache, ma non memorizzato nella tabella principale. Totale giornaliero, conteggi cumulativi.",
      },
      never: {
        label: "never",
        description:
          "Sempre ricomputato dal vivo da input. Uscite EMA, rapporti: nessun costo di archiviazione. Lookback auto-extended per il riscaldamento.",
      },
    },
  },
  ships: {
    title: "Che navi vs. cosa sta arrivando",
    prodReady: {
      label: "Produzione pronta oggi",
      items: {
        engine:
          "Motore completo: endpoint sorgente dati, endpoint indicatori (EMA, RSI, MACD, Bollinger, morsetto, delta, finestra), evaluatori di soglia, nodi trasformatori, nodi di azione endpoint.",
        execution:
          "Esecuzione topologica tramite grafo walker. Supporto multi-risoluzione con scale-up/down automatico. Estensione della gamma Lookback-aware.",
        versioning:
          "Versione, modalità di backtest con la storia a piena esecuzione, persistenza del segnale come percorso di audit.",
        cli: "Accesso da CLI: esegui vibe vibe-sense-ema, vibe vibe-sense-rsi o qualsiasi altro endpoint indicatore in autonomia.",
        mcp: "Registrazione MCP: gli endpoint degli indicatori appaiono nella lista degli strumenti. Thea può chiamare gli indicatori direttamente.",
        seeds:
          "29 grafi pronti all’uso in 9 ambiti: lead, crediti, utenti, abbonamenti, inviti, newsletter, pagamenti, messaggistica, chat IA e stato del sistema. Funzionano tutti subito con vibe dev.",
      },
    },
    coming: {
      label: "Prossima",
      items: {
        builder:
          "Visual drag-and-drop grafico costruttore. Il motore è completamente costruito. L'editor di tela è il prossimo capitolo.",
        trading:
          "Punti finali di trading. Fonte di dati di prezzo endpoints, scambio endpoint API, esecuzione dell'ordine cablato come nodi endpoint. Un grafico di trading è solo un altro grafico.",
        marketplace:
          "Mercato della strategia. Una volta che è possibile costruire grafici visivamente, è possibile condividerli. Importare una strategia di monitoraggio del contatto pre-costruita. Fork, modificalo.",
      },
    },
  },
  vision: {
    title: "Che cosa questo in realtà",
    paragraph1:
      "Ogni processo di business che può essere descritto come: dato questi dati, quando queste condizioni sono soddisfatte, fare questo. Questo è un grafico Vibe Sense. Monitoraggio, si'. Alerting, si'. Ma anche: qualifica di contatto automatizzata, rilevamento di anomalia di ricavi, bilanciamento dell'economia di credito, automazione di marketing.",
    paragraph2:
      "Il bot di trading aveva ragione su questa architettura. Indicatori, valutatori, azioni, modalità di backtest. La cosa che ho sbagliato era costruirla in isolamento. A Octane, EMA è stato bloccato all'interno della pipeline. In next-vibe, EMA è un endpoint di prima classe.",
    keyLine:
      "Non si costruisce un sistema di monitoraggio. Costruisci la tua piattaforma. Il sistema di monitoraggio è già lì.",
    closeTagline:
      "Definiscilo una volta. Esiste ovunque. La pipeline è solo endpoints che chiamano endpoints.",
    cta: {
      primary: "Visualizza su GitHub",
      secondary: "Torna al blog",
    },
    quickstart: {
      label: "Avvio rapido",
      description:
        "vibe dev inizia PostgreSQL in Docker, esegue migrazioni, dati dei semi, semi i grafici di Vibe Sense, backfill 365 giorni di dati storici e lancia il server dev. Aprire localhost:3000. I grafici sono in esecuzione.",
    },
  },
  ui: {
    emaFunctionLabel: "computeEma()",
  },
};
