import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  priority: {
    critical: "Critica",
    high: "Alto.",
    medium: "Mezzo medio",
    low: "Basso",
    background: "Sfondo",
  },
  taskCategory: {
    development: "Sviluppo",
    build: "Compilazione",
    watch: "Guarda",
    generator: "Generatore generatore",
    test: "Test",
    maintenance: "Manutenzione",
    database: "Database",
    system: "Sistema",
    monitoring: "Monitoraggio",
    leadManagement: "Gestione contatti",
  },
  status: {
    pending: "Finanziamenti",
    running: "Esecuzione",
    completed: "Completo",
    failed: "Sfigato",
    timeout: "Timeout",
    cancelled: "Annullamento",
    skipped: "Asciugata",
    blocked: "Bloccato",
    scheduled: "Programmato",
    stopped: "Non ci sono.",
    error: "Errore",
  },
  hiddenFilter: {
    visible: "Visibile",
    hidden: "Nascosto",
    all: "Tutti",
  },
  enabledFilter: {
    all: "Tutti",
    enabled: "Abilitato",
    disabled: "Disabili",
  },
  outputMode: {
    storeOnly: "Solo",
    notifyOnFailure: "Informare sul fallimento",
    notifyAlways: "Informare sempre",
  },
  category: "API Endpoint",
  tags: {
    tasks: "Compiti",
    cron: "Cron",
    scheduling: "Scheduling",
  },
  errors: {
    fetchCronTasks: "Non è riuscito a prendere i compiti del cron",
    createCronTask: "Non è riuscito a creare l'attività di cron",
    invalidTaskInput:
      "L'ingresso dell'attività non corrisponde allo schema di richiesta del punto finale",
    endpointNotFound: "Endpoint non trovato per il dato percorso ID",
    targetInstanceForbidden:
      "Solo gli amministratori possono impostare l'istanza di destinazione per le attività",
  },
  list: {
    columns: {
      createdAt: "Creato a",
      updatedAt: "Aggiornato At",
    },
  },
  get: {
    title: "Elenco delle attività Cron",
    titleShort: "Attività cron",
    description:
      "Recuperare un elenco di attività di cron con filtro opzionale",
    container: {
      title: "Elenco delle attività Cron",
      description: "Filtra e visualizza le attività del cron",
    },
    fields: {
      status: {
        label: "Stato",
        description: "Filtra per lo stato dell'attività",
        placeholder: "Selezionare lo stato...",
      },
      priority: {
        label: "Priorità",
        description: "Filtra per priorità di compito",
        placeholder: "Seleziona la priorità...",
      },
      category: {
        label: "Categoria",
        description: "Filtra per categoria di attività",
        placeholder: "Seleziona la categoria...",
      },
      enabled: {
        label: "Stato",
        description: "Filtra per stato abilitato",
        placeholder: "Tutte le attività",
      },
      hidden: {
        label: "Visibilità",
        description: "Filtra per stato nascosto (predefinito: visibile solo)",
        placeholder: "Compiti visibili",
      },
      search: {
        label: "Cerca",
        description:
          "Filtra le attività per nome, percorso, descrizione o categoria",
        placeholder: "Compiti di ricerca...",
      },
      sort: {
        label: "Ordine",
        description: "Ordinare l'ordine per la lista delle attività",
      },
      limit: {
        label: "Limite",
        description: "Numero massimo di compiti da restituire",
      },
      offset: {
        label: "Offset",
        description: "Numero di compiti da saltare",
      },
    },
    response: {
      tasks: {
        title: "Compiti",
      },
      task: {
        title: "Compiti",
        description: "Informazioni sulle singole attivitÃ",
        id: "Task ID",
        shortId: "ID breve",
        routeId: "Route ID",
        name: "Nome del compito",
        displayName: "Nome",
        taskDescription: "Designazione",
        schedule: "Pianificazione",
        enabled: "Abilitato",
        hidden: "Nascosto",
        priority: "Priorità",
        status: "Stato",
        category: "Categoria",
        lastRun: "Ultima corsa",
        nextRun: "Prossima corsa",
        version: "Version",
        timezone: "Luogo di origine",
        timeout: "Timeout (ms)",
        retries: "Ritiri",
        retryDelay: "Rettifica di ritardo (ms)",
        taskInput: "Input di attività",
        runOnce: "Scappare",
        outputMode: "Modalità di uscita",
        owner: "Proprietario",
        notificationTargets: "Obiettivi di notifica",
        lastExecutedAt: "Ultimo esecuzione a",
        lastExecutionStatus: "Ultimo stato di esecuzione",
        lastExecutionError: "Ultimo errore di esecuzione",
        lastExecutionDuration: "Durata dell'esecuzione (ms)",
        nextExecutionAt: "Prossima esecuzione alla",
        executionCount: "Contatore di esecuzione",
        consecutiveFailures: "Fallimenti consecutivi",
        successCount: "Contesto di successo",
        errorCount: "Contatore di errore",
        averageExecutionTime: "Tempo medio di esecuzione (ms)",
        targetInstance: "Destinazione",
        tags: "Tags",
        createdAt: "Creato a",
        updatedAt: "Aggiornato At",
      },
      totalTasks: "Compiti totali",
    },
    errors: {
      internal: {
        title:
          "Errore del server interno si è verificato durante il recupero delle attività",
        description:
          "Un errore inaspettato si è verificato durante la ricerca della lista delle attività",
      },
      unauthorized: {
        title: "Accesso non autorizzato all'elenco delle attività",
        description:
          "Non hai il permesso di visualizzare l'elenco delle attività",
      },
      validation: {
        title: "Parametri della richiesta non validi",
        description: "I parametri di richiesta forniti non sono validi",
      },
      forbidden: {
        title: "Accesso non consentito",
        description: "L'accesso a questa risorsa è vietato",
      },
      notFound: {
        title: "Compiti non trovati",
        description: "Non sono stati trovati compiti corrispondenti ai criteri",
      },
      network: {
        title: "Errore di rete",
        description:
          "Si è verificato un errore di rete durante il recupero delle attività",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore sconosciuto",
      },
      unsaved: {
        title: "Modifiche non salvate",
        description:
          "Ci sono cambiamenti non salvati che devono essere affrontati",
      },
      conflict: {
        title: "Errore di conflitto",
        description:
          "Si è verificato un conflitto durante l'elaborazione della richiesta",
      },
    },
    success: {
      retrieved: {
        title: "Compiti recuperati con successo",
        description: "L'elenco delle attività è stato recuperato con successo",
      },
    },
  },
  post: {
    title: "Creare attività Cron",
    titleShort: "Creare attività",
    description: "Creare un nuovo compito di cron",
    container: {
      title: "Creare attività",
      description: "Configurare un nuovo compito di cron",
    },
    fields: {
      id: {
        label: "Chiave dell’attività",
        description:
          "Unico e stabile identificatore per questo compito (ad esempio 'db-health')",
        placeholder: "Inserire l'attività ID...",
      },
      routeId: {
        label: "Alias dell’endpoint",
        description:
          "Identificazione del manubrio: nome dell'attività, alias endpoint o 'cron-steps'",
        placeholder: "Inserire il percorso ID...",
      },
      displayName: {
        label: "Nome visualizzato",
        description: "Etichetta leggibile umana per questo compito",
        placeholder: "Inserisci il nome del display...",
      },
      outputMode: {
        label: "Modalità di uscita",
        description: "Quando inviare notifiche dopo l'esecuzione",
        placeholder: "Selezionare la modalità di uscita...",
      },
      description: {
        label: "Designazione",
        description: "Descrizione dell'attività",
        placeholder: "Inserisci la descrizione...",
      },
      schedule: {
        label: "Pianificazione",
        description: "Cron pianificazione espressione",
        placeholder: "*/5 * * * *",
      },
      priority: {
        label: "Priorità",
        description: "Livello prioritario delle attività",
      },
      category: {
        label: "Categoria",
        description: "Categoria di attività",
      },
      enabled: {
        label: "Abilitato",
        description: "Abilitare o disabilitare l'attività",
      },
      hidden: {
        label: "Nascosto",
        description:
          "Nascondi questa attività dai prompt del sistema AI e dagli elenchi delle attività predefinite",
      },
      timeout: {
        label: "Timeout (ms)",
        description: "Tempo massimo di esecuzione in millisecondi",
      },
      retries: {
        label: "Ritiri",
        description: "Numero di tentativi di riprova",
      },
      retryDelay: {
        label: "Rettifica di ritardo (ms)",
        description: "Ritardo tra i ripetitori in millisecondi",
      },
      taskInput: {
        label: "Input di attività",
        description: "Dati di input JSON per l'attività",
        placeholder: '{ "dryRun": false }',
        invalidJson:
          "Non valido JSON. Controllare le citazioni, le virgole e le parentesi.",
        notObject:
          'L\'ingresso del compito deve essere un oggetto JSON, come { "chiave": "valore" }.',
      },
      runOnce: {
        label: "Scappare",
        description:
          "Eseguire questo compito solo una volta e poi disabilitarlo",
      },
      targetInstance: {
        label: "Destinazione",
        description:
          "Tribunale di primo grado ID questo compito dovrebbe funzionare (ad esempio 'erme', 'thea-prod'). Lasciare vuoto per funzionare solo sull'istanza host.",
        placeholder: "Lasciare vuoto solo per l'host",
      },
    },
    response: {
      task: {
        title: "Attività creata",
        id: "Task ID",
        shortId: "ID breve",
        routeId: "Route ID",
        displayName: "Nome",
        taskDescription: "Designazione",
        version: "Version",
        category: "Categoria",
        schedule: "Pianificazione",
        timezone: "Luogo di origine",
        enabled: "Abilitato",
        hidden: "Nascosto",
        priority: "Priorità",
        timeout: "Timeout (ms)",
        retries: "Ritiri",
        retryDelay: "Rettifica di ritardo (ms)",
        taskInput: "Input di attività",
        runOnce: "Scappare",
        outputMode: "Modalità di uscita",
        notificationTargets: "Obiettivi di notifica",
        lastExecutedAt: "Ultimo esecuzione a",
        lastExecutionStatus: "Ultimo stato di esecuzione",
        lastExecutionError: "Ultimo errore di esecuzione",
        lastExecutionDuration: "Durata dell'esecuzione (ms)",
        nextExecutionAt: "Prossima esecuzione alla",
        executionCount: "Contatore di esecuzione",
        successCount: "Contesto di successo",
        errorCount: "Contatore di errore",
        averageExecutionTime: "Tempo medio di esecuzione (ms)",
        consecutiveFailures: "Fallimenti consecutivi",
        targetInstance: "Destinazione",
        tags: "Tags",
        owner: "Proprietario",
        createdAt: "Creato a",
        updatedAt: "Aggiornato At",
      },
    },
    errors: {
      validation: {
        title: "Convalida fallita",
        description: "I dati dell'attività forniti sono invalidi",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Non hai il permesso di creare attività",
      },
      internal: {
        title: "Errore interno",
        description:
          "Si è verificato un errore durante la creazione dell'attività",
      },
      forbidden: {
        title: "Accesso negato",
        description: "L'accesso a questa risorsa è vietato",
      },
      conflict: {
        title: "Conflitto",
        description: "Un compito con questo nome esiste già",
      },
      network: {
        title: "Errore di rete",
        description: "Si è verificato un errore di rete",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore sconosciuto",
      },
      notFound: {
        title: "Account o sessione non trovati",
        description: "La risorsa richiesta non è stata trovata",
      },
      unsaved: {
        title: "Modifiche non salvate",
        description: "Ci sono cambiamenti non rilevati",
      },
    },
    success: {
      created: {
        title: "Compito creato",
        description: "Il compito è stato creato con successo",
      },
    },
  },
  widget: {
    pagination: {
      info: "Pagina {{page}} di {{totalPages}}",
      prev: "Precedente",
      next: "Avanti",
    },
    title: "Attività cron",
    loading: "Caricamento in corso...",
    header: {
      stats: "Stat",
      graphs: "Grafi",
      history: "Storia",
      queue: "Coda",
      refresh: "Aggiorna",
      create: "Nuovo compito",
    },
    filter: {
      all: "Tutti",
      running: "Esecuzione",
      completed: "Completo",
      failed: "Sfigato",
      pending: "Finanziamenti",
      disabled: "Disabili",
      allPriorities: "Tutte le priorità",
      allCategories: "Tutte le categorie",
      visible: "Visibile",
      hiddenOnly: "Nascosto",
      allTasks: "Tutte le attività",
    },
    search: {
      placeholder: "Compiti di ricerca...",
    },
    sort: {
      nameAsc: "Nome A-Z",
      nameDesc: "Nome Z-A",
      schedule: "Pianificazione",
      lastRunNewest: "Ultima corsa (newest)",
      executionsMost: "La maggior parte delle esecuzioni",
    },
    task: {
      runCount: "Esecuzioni: {{count}}",
      successCount: "Esecuzioni riuscite: {{count}}",
      failureCount: "{{count}} ha fallito",
      executions: "Esecuzioni:",
      lastRun: "Ultima corsa:",
      never: "Mai.",
      nextRun: "Prossima corsa:",
      notScheduled: "Non programmato",
      routeId: "Route ID",
      hiddenBadge: "Nascosto",
      owner: {
        system: "Sistema",
        user: "Utente",
      },
      outputMode: {
        storeOnly: "Solo",
        notifyOnFailure: "Informare sul fallimento",
        notifyAlways: "Informare sempre",
      },
    },
    action: {
      select: "Seleziona {{task}}",
      view: "Visualizza dettagli",
      history: "Visualizza la storia",
      edit: "Modifica dell'attività",
      delete: "Eliminare l'attività",
      runNow: "Correte!",
    },
    bulk: {
      selected: "{count} selezionato",
      selectAll: "Seleziona questa pagina",
      clearSelection: "Selezione chiara",
      enable: "Abilita'",
      disable: "Disattivare",
      runNow: "Avvia ora",
      delete: "Elimina",
      confirmDeleteTitle: "Eliminare le attività?",
      confirmDelete:
        "Eliminare le attività di {count}(s)? Questo non può essere annullato.",
      cancel: "Annulla",
      success: "Esecuzioni riuscite: {{succeeded}}. Non riuscite: {{failed}}.",
    },
    empty: {
      noTasks: "Nessun compito di cron",
      noTasksDesc: "Crea il tuo primo compito di cron per iniziare",
      noMatches: "Nessun compito corrisponde ai tuoi filtri",
      noMatchesDesc: "Prova a regolare i criteri di ricerca o filtro",
      clearFilters: "Filtri trasparenti",
    },
    create: {
      created: "Compito creato",
      route: "Route",
      schedule: "Pianificazione",
      nextRun: "Prossima corsa",
      notScheduled: "Non programmato",
      owner: "Proprietario",
      ownerSystem: "Sistema",
      ownerYou: "Tu sei",
      ownerUser: "Utente {{id}}",
      enabled: "Abilitato",
      disabled: "Disabili",
      taskInput: "Inserimento delle attività",
      noInput: "Nessun input - il percorso viene eseguito con i suoi default.",
      openTask: "Attività aperte",
    },
  },
};
