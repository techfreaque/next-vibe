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
  hiddenFilter: {
    visible: "Visibile",
    hidden: "Nascosto",
    all: "Tutti",
  },
  category: "API Endpoint",
  tags: {
    tasks: "Compiti",
    cron: "Cron",
    scheduling: "Scheduling",
    queue: "Coda",
  },
  errors: {
    fetchQueue: "Non è riuscito a recuperare la coda delle attività",
  },
  get: {
    title: "Compiti",
    titleShort: "Compiti",
    description:
      "Visualizzare la coda di esecuzione delle attività in arrivo ordinati per il prossimo tempo di esecuzione",
    fields: {
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
      hidden: {
        label: "Visibilità",
        description:
          "Includere attività nascoste (default: tutte le attività incluse nascoste)",
        placeholder: "Tutte le attività",
      },
      search: {
        label: "Cerca",
        description: "Filtra le attività per nome, percorso o categoria",
        placeholder: "Cercate la coda...",
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
        title: "Compiti selezionati",
      },
      task: {
        title: "Compiti",
        description: "Informazioni sulle singole attivitÃ",
        id: "Task ID",
        routeId: "Route ID",
        displayName: "Nome",
        taskDescription: "Designazione",
        schedule: "Pianificazione",
        enabled: "Abilitato",
        hidden: "Nascosto",
        priority: "Priorità",
        status: "Stato",
        category: "Categoria",
        version: "Version",
        timezone: "Luogo di origine",
        timeout: "Timeout (ms)",
        retries: "Ritiri",
        retryDelay: "Rettifica di ritardo (ms)",
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
        createdAt: "Creato a",
        updatedAt: "Aggiornato At",
        userId: "Utente ID",
        outputMode: "Modalità di uscita",
        owner: "Proprietario",
        shortId: "ID breve",
        taskInput: "Input di attività",
        runOnce: "Scappare",
        notificationTargets: "Obiettivi di notifica",
        targetInstance: "Destinazione",
        tags: "Tags",
      },
      totalTasks: "Compiti totali",
    },
    errors: {
      internal: {
        title: "Errore del server interno durante il recupero della coda",
        description:
          "Si è verificato un errore inaspettato durante la presa della coda dell'attività",
      },
      unauthorized: {
        title: "Accesso non autorizzato alla coda delle attività",
        description:
          "Non hai il permesso di visualizzare la coda dell'attività",
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
        title: "Non trovato",
        description: "Non sono stati trovati compiti nella coda",
      },
      network: {
        title: "Errore di rete",
        description:
          "Si è verificato un errore di rete durante il recupero della coda",
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
        title: "Queue recuperato con successo",
        description: "La coda delle attività è stata recuperata con successo",
      },
    },
  },
  widget: {
    title: "Compiti",
    loading: "Caricamento della coda...",
    header: {
      tasks: "Tutte le attività",
      history: "Storia",
      stats: "Stat",
      create: "Nuovo compito",
      refresh: "Aggiorna",
    },
    filter: {
      visible: "Visibile",
      hiddenOnly: "Nascosto",
      allTasks: "Tutte le attività",
      allPriorities: "Tutte le priorità",
      allCategories: "Tutte le categorie",
    },
    search: {
      placeholder: "Cercate la coda...",
    },
    queue: {
      position: "#",
      nextRun: "Prossima corsa",
      lastRun: "Ultimo giro",
      never: "Mai.",
      notScheduled: "Non programmato",
      in: "in",
      ago: "fa",
      justNow: "solo ora",
      overdue: "in ritardo",
      hiddenBadge: "Nascosto",
      owner: {
        system: "Sistema",
        user: "Utente",
      },
    },
    action: {
      view: "Visualizza dettagli",
      history: "Visualizza la storia",
      edit: "Modifica dell'attività",
      run: "Avvia ora",
    },
    bulk: {
      selected: "{count} selezionato",
      selectAll: "Seleziona tutto",
      selectTask: "Seleziona {{name}}",
      clearSelection: "Selezione chiara",
      enable: "Abilita'",
      disable: "Disattivare",
      runNow: "Avvia ora",
      delete: "Elimina",
      confirmDeleteTitle: "Eliminare le attività?",
      confirmDelete:
        "Eliminare le attività di {count}(s)? Questo non può essere annullato.",
      cancel: "Annulla",
      success: "{{succeeded}} è riuscito, {{failed}} ha fallito",
    },
    empty: {
      noTasks: "La coda è vuota",
      noTasksDesc: "Nessuna attività abilitata con le rune programmate",
      noMatches: "Nessun compito corrisponde ai tuoi filtri",
      noMatchesDesc: "Prova a regolare i criteri di ricerca o filtro",
      clearFilters: "Filtri trasparenti",
    },
  },
};
