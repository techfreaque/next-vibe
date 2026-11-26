import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Aiuto & Documentazione",
  tag: "Aiuto",
  uncategorized: "Altro",
  admin: {
    recordBackTo: "Torna a {{section}}",
    recordAccessDenied: "Non hai accesso a questo record",
    overviewLoadError: "Impossibile caricare il riepilogo",
    accountMenu: "Impostazioni account",
    homeDescription:
      "Gestisci la piattaforma e verifica le attività da seguire.",
    new: "Nuovo",
    destinations: "Elenchi e report",
    noDestinations: "In questa area non sono disponibili elenchi o report.",
    automations: "Automazioni",
    developer: "Strumenti per sviluppatori",
    openDeveloper: "Apri il catalogo per sviluppatori",
    title: "Amministrazione",
    workspaces: "Aree di lavoro",
    pinned: "Strumenti fissati",
    categoryTools: "Strumenti di quest’area",
    results: "Risultati di ricerca",
    tool: "Strumento",
  },
  erp: {
    navigation: {
      sales: "Vendite",
      purchases: "Acquisti",
      invoices: "Fatture emesse",
      estimates: "Preventivi",
      bills: "Fatture fornitori",
    },
    overview: {
      chooseCompany:
        "Selezioni l’azienda di cui desidera consultare il report.",
      loading: "Caricamento del riepilogo aziendale",
      loadError: "Impossibile caricare il riepilogo aziendale",
    },
    home: "Pagina iniziale",
    title: "Area contabilità",
    description:
      "Configura la tua azienda, gestisci le fatture e prepara i conti per la chiusura del mese.",
    companies: "Gestisci le aziende",
    activeDescription: "Controlla i conti e prepara la prossima fattura.",
    newInvoice: "Nuova fattura",
    createCompany: "Configura la tua azienda",
    companySwitch: {
      label: "Azienda per la contabilità",
      select: "Seleziona azienda",
      current: "Azienda corrente: {{name}}",
    },
    workflows: "Attività frequenti",
    sales: {
      title: "Fattura a un cliente",
      description:
        "Prepara una bozza di fattura o apri una fattura esistente per registrare un incasso.",
      primary: "Crea fattura di vendita",
      secondary: "Vedi fatture di vendita",
    },
    expenses: {
      title: "Registra una fattura fornitore",
      description:
        "Registra gli importi dovuti ai fornitori e monitora i pagamenti dalla fattura.",
      primary: "Crea fattura di acquisto",
      secondary: "Vedi fatture di acquisto",
    },
    receivables: {
      title: "Controlla i crediti",
      description: "Vedi gli importi non incassati per fascia di ritardo.",
      primary: "Vedi crediti",
    },
    payables: {
      title: "Controlla i debiti verso fornitori",
      description:
        "Vedi gli importi aperti e le fatture da approvare o contestate.",
      primary: "Vedi debiti verso fornitori",
    },
    bank: {
      title: "Importa movimenti bancari",
      description:
        "Importa un estratto CSV, poi controlla i movimenti da riconciliare.",
      primary: "Importa estratto conto",
      secondary: "Vedi movimenti da riconciliare",
    },
    stock: {
      title: "Controlla il magazzino",
      description: "Verifica le scorte e individua gli articoli da riordinare.",
      primary: "Apri magazzino",
    },
    tax: {
      title: "Verifica l’IVA",
      description:
        "Controlla gli importi IVA del periodo prima della dichiarazione.",
      primary: "Apri il report IVA",
    },
    exports: {
      title: "Controlla ed esporta il giornale",
      description:
        "Controlla le anomalie o scarica le scritture contabilizzate in formato CSV.",
      primary: "Controlla le registrazioni",
      secondary: "Apri esportazione del giornale",
    },
    close: {
      title: "Chiudi un periodo contabile",
      description:
        "Verifica il bilancio di verifica prima di chiudere il periodo.",
      primary: "Vedi periodi",
      secondary: "Apri il bilancio di verifica",
    },
  },
  catalog: {
    moreMatches: "Altri risultati ({{count}})",
    title: "Catalogo degli strumenti",
    searchLabel: "Cerca il catalogo degli strumenti",
    searchAction: "Strumenti di ricerca",
    clearSearch: "Ricerca di strumenti trasparente",
    overview: "Panoramica aziendale",
    allTools: "Tutti gli strumenti",
    selectRecord: "Selezioni una voce per visualizzarne i dettagli.",
    openRecord: "Apri la voce",
    findRecord: "Trova un record",
    recordPlaceholder: "Nome, e-mail o riferimento",
    loadError: "Il catalogo non poteva caricare",
    retry: "Riprova",
    noTools: "Non ci sono strumenti disponibili in questa vista",
    noMatches:
      "Nessun strumento corrisponde “ {{query}} ”. Prova un altro nome di strumento.",
    openPrimary: "Aprire {{title}}",
    allInCategory: "Tutti gli strumenti",
    general: "Generale",
    toolUnavailable: "Disponibile su un'altra piattaforma",
    previous: "Precedente",
    next: "Avanti",
    page: "Pagina {{page}} di {{total}}",
    openSidebar: "Aprire la barra laterale dello strumento",
    browse: "Sfoglia gli strumenti",
    toolUnavailableHint:
      "Il collegamento potrebbe essere scaduto oppure il suo ruolo non consente l’accesso. Consulti gli strumenti disponibili.",
    openError: "Impossibile aprire lo strumento",
    toolNotFound: "Questo strumento non è disponibile",
    localInstance: "Esempio locale",
    allowTool: "Consentire AI per chiamare questo strumento",
    blockTool: "Bloccare AI chiamando questo strumento",
    pinWeb: "Perno a barra laterale",
    unpinWeb: "Unpin dalla barra laterale",
    webSidebar: "Web sidebar",
    webSidebarHint: "Strumenti appiattiti alla barra laterale.",
  },
  groups: {
    ai: "IA",
    analytics: "Crescita",
    business: "Gestione aziendale",
    system: "Operazioni",
    comms: "Comms",
    platform: "Piattaforma",
    people: "Persone e CRM",
    billing: "Fatturazione",
    content: "Contenuti",
  },
  get: {
    title: "Guida agli strumenti - Scopri gli strumenti disponibili",
    titleShort: "Aiuto per gli attrezzi",
    description:
      "Cerca e scopri tutti gli strumenti a tua disposizione. Chiama senza params per elencare tutti gli strumenti e le categorie. Usa la query per cercare per nome/descrizione/alias. Utilizzare toolName per ottenere lo schema completo dei parametri per uno strumento specifico. Utilizzare la categoria per filtrare per categoria. Supporta l'impaginazione tramite pagina/ pageSize. Dimensione della pagina predefinita per AI / MCP è 100.",
    tags: {
      tools: "strumenti",
    },
    fields: {
      interactive: {
        label: "Interattivo interattivo",
        description: "Aprire il browser completo dello strumento interattivo",
      },
      query: {
        label: "Ricerca Query (opzionale)",
        description:
          'Filtra gli strumenti per parola chiave. Le parole separate dallo spazio sono tutte richieste (ad esempio "fetch url" abbina gli strumenti con entrambe le parole). Case-insensibile match tra nome, alias, descrizione, tags - nome/alias match rango più alto. Nome esatto/alias match auto-shows completo dettaglio. Omettere di elencare tutti gli strumenti.',
        placeholder: "ad esempio, fetch url, image gen, memory...",
      },
      category: {
        label: "Categoria Filtro",
        description:
          "Filtra gli strumenti per categoria o nome sottocategoria (case-insensibili). Accetta una chiave di categoria madre (ad esempio 'ai') o un nome sottocategoria (ad esempio 'Search'). Omettere di vedere tutte le categorie.",
      },
      toolName: {
        label: "Nome strumento (Dettaglio)",
        description:
          "Ottenere lo schema completo dei parametri per uno strumento specifico dal suo toolName esatto (ad esempio agent_search_brave_GET) o alias. Utilizzare questo prima di chiamare uno strumento non familiare.",
      },
      page: {
        label: "Pagina",
        description: "Numero di pagina per i risultati impaginati (default: 1)",
        title: "Numero di pagina attuale",
      },
      pageSize: {
        label: "Dimensione della pagina",
        description:
          "Numero di risultati per pagina. AI / MCP predefinito: 100. Predefinizione Web/CLI: 800. 1000.",
        title: "Efficace dimensione pagina",
      },
      tools: {
        title: "Strumenti disponibili",
      },
      totalCount: {
        title: "Conteggio totale degli utensili",
      },
      matchedCount: {
        title: "Conteggio utensili abbinato",
      },
      categories: {
        title: "Categorie degli strumenti",
      },
      hint: {
        title: "Suggerimenti di utilizzo",
      },
      pinnedCount: {
        title: "Conteggio utensili Pinned",
      },
      allowedCount: {
        title: "Conto degli strumenti consentiti",
      },
      webPinnedCount: {
        title: "Conteggio di strumenti web-pinned",
      },
      currentPage: {
        title: "Pagina corrente",
      },
      effectivePageSize: {
        title: "Efficace dimensione pagina",
      },
      totalPages: {
        title: "Totale pagine",
      },
      parameters: {
        title: "Parametri",
      },
      aliases: {
        title: "Aliasi",
      },
      openTool: {
        label: "Strumento aperto",
      },
      platform: {
        label: "Piattaforma",
        description:
          "Filtra gli strumenti per piattaforma (solo admin). Mostra gli strumenti disponibili sulla piattaforma selezionata. Utilizzare 'all' per vedere gli strumenti su tutte le piattaforme.",
      },
      includeProdOnly: {
        label: "Includere gli strumenti di produzione",
        description:
          "Quando è vero, include strumenti contrassegnati come solo produzione (solo admin). Utilizzare 'all' filtro della piattaforma per visualizzare gli strumenti su tutte le piattaforme.",
      },
      platforms: {
        title: "Piattaforme disponibili",
      },
      viewAsRole: {
        label: "Visualizza come Role",
        description:
          "Vedere quali strumenti sono visibili a un ruolo utente specifico (solo admin)",
        options: {
          admin: "Amministratore",
          customer: "Cliente",
          public: "Pubblico",
        },
      },
      instanceId: {
        label: "Articolo ID",
        description:
          "Facoltativo. Filtra gli strumenti da un'istanza remota specifica. Omettere di cercare strumenti locali.",
      },
      pinnedToolIds: {
        label: "ID utensili Pinned",
        description:
          "Elenco facoltativo di ID strumento che l'utente ha pinned. Quando viene fornito, il server filtra solo a questi strumenti, ma restituisce ancora la totalCount completa.",
      },
      statsFilter: {
        label: "Filtro di utensile",
        description:
          "Mostra tutti gli strumenti, solo strumenti pinned, o solo strumenti consentiti",
      },
    },
    hints: {
      noCapabilitySnapshot:
        'Nessuna snapshot di funzionalità per esempio " {{instanceId}} ". Collegare l\'istanza e attendere un impulso di sincronizzazione.',
      remoteFullSchema:
        'Schema completo per gli strumenti {{count}} da " {{instanceId}} ". Chiamare via: esegui-tool toolName =" {{instanceId}} __ <name> " input= {...}.',
      remoteList:
        '{{matched}} di strumenti {{total}} da istanza remota " {{instanceId}} ". Ricerca stretta a ≤{{detailThreshold}} risultati per schemi completi, o passare toolName= per uno strumento specifico.{{pagination}}',
      toolNotFound:
        'Strumento " {{name}} " non trovato. Utilizzare la query per cercare per parola chiave.',
      detailMode:
        'Chiamare come: esegui-tool toolName =" {{name}} " {{aliases}}. CLI: vibe {{name}} [--field=value].',
      detailModeAliases: " (aliasi: {{aliases}})",
      noToolsMatched:
        "Non ci sono strumenti abbinati. Prova una domanda più ampia o chiama senza params per vedere tutte le categorie.",
      compactFullSchema:
        'Schema completo per lo strumento {{count}} (s). Chiamare via: esegui-tool toolName =" <name> " input= {...}.',
      compactCategoryOnly:
        'Strumenti {{matched}} attraverso le categorie {{categories}}. Utilizzare la categoria=" <name> " per ottenere risultati ristretti (accetta la categoria madre o sottocategoria). Sotto i risultati {{listThreshold}} mostra i nomi degli strumenti; sotto {{detailThreshold}} mostra gli schemi completi.',
      compactList:
        'Strumenti {{matched}}. Passaggio a ≤ {{detailThreshold}} per gli schemi completi, o passare toolName =" <name> " per i dettagli. Chiama qualsiasi strumento: esegui-tool toolName =" <name> ". {{pagination}}',
      cliFullDetail:
        "Mostrare il dettaglio completo per gli strumenti {{count}}. CLI: vibe <name> [--field=value].",
      cliList:
        "Page {{page}} / {{total}} - Gli strumenti {{matched}} corrispondono. Utilizzare l'aiuto di vibrazione <name> per i dettagli completi.",
      cliListSingle:
        "Gli strumenti {{matched}} sono abbinati. Utilizzare l'aiuto di vibrazione <name> per i dettagli completi.",
      pagination:
        " Pagina {{page}} / {{total}} - pagina di passaggio= {{next}} per continuare.",
      paginationCli: " - aiuto vibrazione --pagina= {{next}}",
    },
    success: {
      title: "Strumenti catturati con successo",
      description: "Strumenti disponibili recuperati",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Parametri della richiesta non validi",
      },
      network: {
        title: "Errore di rete",
        description: "Impossibile connettersi al server",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per continuare",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di accedere agli strumenti",
      },
      notFound: {
        title: "Non trovato",
        description: "Strumenti endpoint non trovato",
      },
      server: {
        title: "Errore del server",
        description: "Non riuscito a prendere gli strumenti",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore imprevisto",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
      conflict: {
        title: "Conflitto",
        description:
          "Un conflitto si è verificato durante l'ottenimento di strumenti",
      },
    },
  },
  interactive: {
    post: {
      title: "Modalità interattiva",
      description:
        "Avviare la modalità interattiva di file explorer per navigare e eseguire le rotte",
      category: "Aiuto di sistema",
      tags: {
        system: "sistema",
        help: "aiuto",
      },
      summary: "Avviare la modalità interattiva",
    },
    ui: {
      title: "Esploratore API interattivo",
      description: "Sfoglia ed esegui tutti",
      availableEndpoints: "endpoint disponibili",
      endpointsLabel: "Punti di fine",
      aliasesLabel: "Aliasi:",
      selectEndpoint: "Selezionare un endpoint dall'elenco per iniziare",
    },
    response: {
      started: "Modalità interattiva iniziata con successo",
    },
    errors: {
      cliOnly: {
        title: "CLI Solo",
        description: "La modalità interattiva è disponibile solo da CLI",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Autenticazione necessaria per la modalità interattiva",
      },
      server: {
        title: "Errore del server",
        description: "Non è possibile avviare la modalità interattiva",
      },
    },
    success: {
      title: "Operazione riuscita",
      description: "Modalità interattiva iniziata con successo",
    },
    grouping: {
      category: "Categoria",
      tags: "Tags",
      path: "Sentiero",
    },
  },
  post: {
    title: "Mostra informazioni sui servizi",
    description: "Visualizza le informazioni di aiuto sui comandi CLI",
    form: {
      title: "Opzioni di aiuto",
      description: "Ottieni aiuto per comandi specifici o per l'uso generale",
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Parametri di comando dell'aiuto non valido",
      },
      network: {
        title: "Errore di rete",
        description: "Non riuscito a recuperare informazioni di aiuto",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Non sei autorizzato a visualizzare aiuto",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di visualizzare l'aiuto",
      },
      notFound: {
        title: "Comando Non Trovato",
        description: "Il comando specificato non è stato trovato",
      },
      server: {
        title: "Errore del server",
        description: "Non è riuscito a generare informazioni di aiuto",
      },
      unknown: {
        title: "Errore sconosciuto",
        description:
          "Un errore inaspettato si è verificato durante la generazione di aiuto",
      },
      conflict: {
        title: "Conflitto",
        description: "Rilevamento del conflitto di generazione di aiuto",
      },
    },
    success: {
      title: "Aiuto generato",
      description: "Informazioni di aiuto generate con successo",
    },
  },
  fields: {
    command: {
      label: "Comando",
      description:
        "Comando specifico per ottenere aiuto per (lasciare vuoto per l'aiuto generale)",
      placeholder: "ad esempio, check, list, db:ping",
    },
    header: {
      title: "Intestazione",
      description: "Descrizione della testa",
    },
    title: {
      label: "Titolo",
    },
    description: {
      label: "Designazione",
    },
    usage: {
      title: "Utilizzo",
      patterns: {
        item: "Modello",
      },
    },
    commonCommands: {
      title: "Comandi comuni",
      items: "Comandi",
      command: "Comando",
      description: "Designazione",
    },
    options: {
      title: "Opzioni",
      items: "Opzioni",
      flag: "Bandiera",
      description: "Designazione",
    },
    examples: {
      title: "Esempi",
      items: "Esempi",
      command: "Comando",
      description: "Designazione",
    },
    details: {
      title: "Dettagli",
      category: {
        content: "Categoria",
      },
      path: {
        content: "Sentiero",
      },
      method: {
        content: "Metodo",
      },
      aliases: {
        content: "Aliasi",
      },
    },
  },
  aiTools: {
    modal: {
      webPinnedLabel: "perni web",
      webPinnedTooltip:
        "Utensili appiattiti alla barra laterale per un rapido accesso",
      pinnedLabel: "a spillo",
      pinnedTooltip:
        "Gli strumenti Pinned sono sempre in contesto - lo AI li vede ogni volta",
      enabledLabel: "AI consentito",
      enabledTooltip:
        "Gli strumenti abilitati AI possono essere chiamati a richiesta quando l'aiuto è abilitato",
      totalLabel: "totale totale",
      totalTooltip:
        "Mostra tutti gli strumenti - clicca per cancellare il filtro",
      searchPlaceholder: "Strumenti di ricerca...",
      chipWeb: "Web",
      chipAiPins: "Perni AI",
      chipAiAllowed: "AI consentito",
      chipAll: "Tutti",
      chipCli: "CLI",
      chipMcpPinned: "MCP vis",
      chipMcpAllowed: "MCP tutti",
      searchNoResults: "Nessun risultato",
      searchResultOne: "1 risultato",
      searchResultMany: "Risultati {{count}}",
      expandAll: "Espandere tutti",
      collapseAll: "Tutti i risultati",
      deselectAll: "Deselect Tutti",
      selectAll: "Seleziona tutto",
      resetToDefault: "Ripristino di default",
      loading: "Caricamento...",
      noToolsFound: "Nessun strumento corrisponde alla tua ricerca",
      noToolsAvailable: "Strumenti AI disponibili",
      legendActive: "Sempre in contesto (arrotolato)",
      legendConfirm: "Chiede prima di correre",
      legendWebPin: "Pinned in barra laterale",
      stats: "{{pinned}} di strumenti {{total}} pinned",
      activeOn: "Sempre in contesto AI. unpin per fare on-demand solo",
      activeOff: "Non in contesto. pin da includere in ogni turno AI",
      confirmOn:
        "AI ti chiede prima di eseguire. fare clic per approvare automaticamente",
      confirmOff:
        "Esegui senza chiedere. clicca per richiedere la tua approvazione",
      closeSidebar: "Chiudi gli strumenti sidebar",
      selectTool: "Seleziona uno strumento",
      selectToolHint: "Scegli uno strumento dalla barra laterale per iniziare",
      allPlatforms: "Tutte le piattaforme",
      prodOnly: "Prod solo",
      adminFilters: "Filtra di Admin",
      resetPins: "Reimpostare i perni sui valori predefiniti",
      aiPinsTitle: "Perni per utensili AI",
      aiPinsDescription:
        "Questi strumenti sono attivi in ogni conversazione AI. Lo AI può chiamarli automaticamente, senza richiedere.",
      resetToDefaults: "Reimpostare i valori predefiniti",
      noPinnedTools: "Non sono ancora stati bloccati gli strumenti",
      noPinnedToolsHint:
        "Sfoglia tutti gli strumenti e pin quelli che si desidera utilizzare AI",
      webPinsDescription:
        "Scorciatoie laterali. Strumenti di avvio rapido per il tuo pannello di amministrazione.",
      aiAllowedDescription:
        "Gli strumenti AI possono richiedere. Tutto qui può essere invocato quando lo AI decide che è necessario.",
      noAllowedTools: "Strumenti non consentiti",
    },

    platformFilter: {
      all: "Tutte le piattaforme",
      cli: "CLI",
      cliPackage: "CLI Pkg",
      mcp: "MCP",
      ai: "IA",
      web: "Web",
      cron: "Cron",
      electron: "Desktop",
      frame: "Frame",
      skill: "Skill",
      nextPage: "Pagina successiva",
      nextApi: "Il prossimo API",
    },
    envFilter: {
      development: "Sviluppo",
      production: "Produzione",
    },
  },
  list: {
    post: {
      title: "Elenco Comandi disponibili",
      description:
        "Mostra tutti i comandi CLI disponibili con le loro descrizioni e alias",
      form: {
        title: "Opzioni dell'elenco dei comandi",
        description: "Configurare come vengono visualizzati i comandi",
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Elenco non valido parametri di comando",
        },
        network: {
          title: "Errore di rete",
          description: "Non è riuscito a recuperare l'elenco dei comandi",
        },
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Non sei autorizzato a elencare i comandi",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Non hai il permesso di elencare i comandi",
        },
        notFound: {
          title: "Non trovato",
          description: "Elenco dei comandi non trovato",
        },
        server: {
          title: "Errore del server",
          description: "Non è riuscito a generare l'elenco dei comandi",
          errorLoading: "Comandi di caricamento degli errori: {{error}}",
        },
        unknown: {
          title: "Errore sconosciuto",
          description:
            "Un errore inaspettato si è verificato durante i comandi di elenco",
        },
        conflict: {
          title: "Conflitto",
          description: "Discussione elenco dei comandi rilevato",
        },
      },
      success: {
        title: "Comandi elencati",
        description: "Elenco di comando recuperato con successo",
      },
    },
    tag: "Aiuto",
    fields: {
      category: {
        label: "Filtra per categoria",
        description: "Mostra solo i comandi in questa categoria",
        placeholder: "ad esempio, sistema, database, utente",
      },
      format: {
        label: "Formato di uscita",
        description: "Come visualizzare l'elenco dei comandi",
        options: {
          tree: "Vista sull'albero (gerarchia scandita)",
          flat: "Lista piana (elenco semplice)",
          json: "Formato JSON (per la parsing)",
        },
      },
      showAliases: {
        label: "Mostra gli alieni",
        description: "Visualizza tutti gli alias di comando disponibili",
      },
      showDescriptions: {
        label: "Mostra descrizioni",
        description: "Includere le descrizioni dei comandi nell'output",
      },
      success: {
        label: "Operazione riuscita",
      },
      totalCommands: {
        label: "Comandi totali",
        description: "Numero di comandi disponibili",
      },
      commandsText: {
        label: "Comandi disponibili",
        description: "Elenco formattato di tutti i comandi disponibili",
      },
      commands: {
        alias: "Comando Alias",
        message: "Messaggio di comando",
        description: "Descrizione del comando",
        category: "Categoria di comando",
        aliases: "Aliasi di comando",
        rule: "Regola di comando",
      },
    },
    response: {
      commands: {
        title: "Comandi disponibili",
        emptyState: {
          description: "Nessun comando trovato",
        },
        alias: "Comando",
        path: "Sentiero API",
        method: "Metodo HTTP",
        category: "Categoria",
        description: "Designazione",
        aliases: "Aliasi",
      },
    },
  },
};
