import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Sistema",
  tags: {
    cron: "Cron",
    scheduling: "Scheduling",
  },
  get: {
    title: "Ottenere Cron Task",
    titleShort: "Compito Cron",
    description: "Recuperare un singolo compito di cron da ID",
    container: {
      title: "Cron Task Details",
      description: "Visualizza i dettagli di un compito specifico di cron",
    },
    fields: {
      id: {
        label: "Task ID",
        description: "Identificatore unico dell'attività",
      },
    },
    response: {
      task: {
        title: "Compiti",
        id: "Task ID",
        shortId: "ID breve",
        routeId: "Route ID",
        displayName: "Nome dell'esposizione",
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
        title: "Errore di convalida",
        description: "L'attività fornita ID è invalida",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Non sei autorizzato a visualizzare questo compito",
      },
      notFound: {
        title: "Compito non trovato",
        description: "L'attività richiesta non è stata trovata",
      },
      internal: {
        title: "Errore del server interno",
        description:
          "Si è verificato un errore durante il recupero dell'attività",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di accedere a questa attività",
      },
      network: {
        title: "Errore di rete",
        description: "Si è verificato un errore di rete",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore sconosciuto",
      },
      unsaved: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
      conflict: {
        title: "Conflitto",
        description: "Si è verificato un conflitto",
      },
    },
    success: {
      retrieved: {
        title: "Recuperare le attività",
        description: "Task recuperato con successo",
      },
    },
  },
  put: {
    title: "Aggiornamento Cron Task",
    titleShort: "Attività di aggiornamento",
    description: "Aggiornare un'attività cron esistente",
    container: {
      title: "Aggiornamento Cron Task",
      description: "Modificare le impostazioni delle attività",
    },
    fields: {
      id: {
        label: "Task ID",
        description: "Identificatore unico dell'attività",
      },
      displayName: {
        label: "Nome dell'esposizione",
        description: "Etichetta leggibile umana per questo compito",
        placeholder: "Inserisci il nome del display",
      },
      outputMode: {
        label: "Modalità di uscita",
        description: "Quando inviare notifiche dopo l'esecuzione",
        placeholder: "Selezionare la modalità di uscita",
      },
      description: {
        label: "Designazione",
        description: "Descrizione dell'attività",
        placeholder: "Inserisci la descrizione dell'attività",
      },
      schedule: {
        label: "Pianificazione",
        description: "Cron pianificazione espressione",
        placeholder: "*/5 * * * *",
      },
      enabled: {
        label: "Abilitato",
        description: "Se l'attività è abilitata",
      },
      priority: {
        label: "Priorità",
        description: "Livello prioritario delle attività",
        placeholder: "Selezionare la priorità",
      },
      category: {
        label: "Categoria",
        description: "Categoria di attività",
        placeholder: "Seleziona la categoria",
      },
      timeout: {
        label: "Timeout (ms)",
        description:
          "Tempo di esecuzione massimo in millisecondi (ad esempio 300000 = 5 minuti)",
        placeholder: "300000",
      },
      retries: {
        label: "Ritiri",
        description: "Numero di tentativi di riprova del fallimento",
        placeholder: "3",
      },
      retryAttempts: {
        label: "Proteggi i tentativi",
        description: "Numero di tentativi di riprova del fallimento",
      },
      retryDelay: {
        label: "Rettifica di ritardo (ms)",
        description:
          "Ritardo tra i ripetitori in millisecondi (ad esempio 5000 = 5 secondi)",
        placeholder: "5000",
      },
      taskInput: {
        label: "Input di attività",
        description: "Dati di input JSON per l'attività",
        invalidJson:
          "Non valido JSON. Controllare le citazioni, le virgole e le parentesi.",
        notObject:
          'L\'ingresso del compito deve essere un oggetto JSON, come { "chiave": "valore" }.',
      },
      hidden: {
        label: "Nascosto",
        description:
          "Nascondi questa attività dai prompt del sistema AI e dagli elenchi delle attività predefinite",
      },
      runOnce: {
        label: "Scappare",
        description:
          "Eseguire questo compito solo una volta e poi disabilitarlo",
      },
      targetInstance: {
        label: "Destinazione",
        description:
          "Tribunale di primo grado ID questo compito dovrebbe funzionare. Lasciare vuoto per funzionare solo sull'istanza host.",
        placeholder: "ad esempio hermes, thea-prod",
      },
      lastExecutionStatus: {
        label: "Stato di esecuzione",
        description:
          "Superare l'ultimo stato di esecuzione. Utilizzare per resettare un'attività \"in esecuzione\" bloccata.",
        placeholder: "Selezionare lo stato",
      },
    },
    response: {
      task: {
        title: "Attività aggiornata",
        id: "Task ID",
        shortId: "ID breve",
        routeId: "Route ID",
        displayName: "Nome dell'esposizione",
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
      success: {
        title: "Operazione riuscita",
      },
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "I dati forniti sono invalidi",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Non sei autorizzato ad aggiornare questa attività",
      },
      notFound: {
        title: "Compito non trovato",
        description: "L'attività di aggiornamento non è stata trovata",
      },
      internal: {
        title: "Errore del server interno",
        description:
          "Si è verificato un errore durante l'aggiornamento dell'attività",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di aggiornare questa attività",
      },
      network: {
        title: "Errore di rete",
        description: "Si è verificato un errore di rete",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore sconosciuto",
      },
      unsaved: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
      conflict: {
        title: "Conflitto",
        description:
          "Si è verificato un conflitto durante l'aggiornamento del compito",
      },
    },
    submitButton: {
      label: "Salvare attività",
      loadingText: "Salvare...",
    },
    success: {
      updated: {
        title: "Attività aggiornata",
        description: "Compito aggiornato con successo",
      },
    },
  },
  delete: {
    title: "Eliminare l'attività Cron",
    titleShort: "Eliminare l'attività",
    description: "Eliminare un compito di cron",
    container: {
      title: "Eliminare l'attività Cron",
      description: "Rimuovere un'attività dal sistema",
    },
    fields: {
      id: {
        label: "Chiave dell’attività",
        description: "Identificatore unico dell'attività da eliminare",
      },
    },
    response: {
      success: {
        title: "Operazione riuscita",
      },
      message: {
        title: "Messaggio",
      },
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "L'attività fornita ID è invalida",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Non sei autorizzato a cancellare questa attività",
      },
      notFound: {
        title: "Compito non trovato",
        description: "L'attività di cancellazione non potrebbe essere trovata",
      },
      internal: {
        title: "Errore del server interno",
        description:
          "Si è verificato un errore durante l'eliminazione dell'attività",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Non hai il permesso di eliminare questa attività",
      },
      network: {
        title: "Errore di rete",
        description: "Si è verificato un errore di rete",
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore sconosciuto",
      },
      unsaved: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
      conflict: {
        title: "Conflitto",
        description:
          "Non è possibile eliminare l'attività a causa di un conflitto",
      },
    },
    success: {
      deleted: {
        title: "Attività eliminata",
        description: "Compito cancellato con successo",
      },
    },
  },
  priority: {
    critical: "Critica",
    high: "Alto.",
    medium: "Mezzo medio",
    low: "Basso",
    background: "Cron",
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
  enabledFilter: {
    all: "Tutti",
    enabled: "Abilitato",
    disabled: "Disabili",
  },
  hiddenFilter: {
    visible: "Visibile",
    hidden: "Nascosto",
    all: "Tutti",
  },
  outputMode: {
    storeOnly: "Solo",
    notifyOnFailure: "Informare sul fallimento",
    notifyAlways: "Informare sempre",
  },
  widget: {
    notFound: "Compito non trovato",
    never: "Mai.",
    history: "Storia",
    edit: "Modifica",
    delete: "Elimina",
    enabled: "Abilitato",
    disabled: "Disabili",
    identity: "Identità",
    id: "Task ID",
    routeId: "Route ID",
    displayName: "Nome dell'esposizione",
    version: "Version",
    category: "Categoria",
    priority: "Priorità",
    annualSchedule: "Ogni anno il {{date}} alle {{time}}",
    schedule: "Pianificazione",
    timezone: "Luogo di origine",
    createdAt: "Creato",
    updatedAt: "Aggiornato",
    owner: "Proprietario",
    ownerSystem: "Sistema",
    ownerUser: "Utente",
    outputMode: "Modalità di uscita",
    outputModes: {
      storeOnly: "Solo",
      notifyOnFailure: "Informare sul fallimento",
      notifyAlways: "Informare sempre",
    },
    stats: {
      totalExecutions: "Esecuzioni totali",
      successful: "Successo",
      errors: "Errori",
      successRate: "Tasso di successo",
    },
    timingSection: "Timing",
    timing: {
      avgDuration: "Durata di Avg",
      lastDuration: "Ultima durata",
      lastRun: "Ultima corsa",
      nextRun: "Prossima corsa",
      timeout: "Timeout",
      retries: "Ritiri",
      retryDelay: "Ritardo del reattore",
    },
    lastExecutionError: "Ultimo errore",
    schedulePaused: "Pianificazione in pausa",
    runManually: "Esegui manualmente",
    run: "Correte!",
    runSuccess: "Compito eseguito con successo",
    running: "Correre...",
    refreshing: "Aggiornamento dell’attività…",
    refreshSucceeded: "Attività aggiornata.",
    refreshFailed: "Aggiornamento non riuscito. Riprova.",
    refresh: "Aggiorna",
    taskInput: {
      title: "Input di attività",
      loading: "Definizione di endpoint di caricamento...",
      notFound: "Definizione endpoint non trovata per questo compito",
      empty: "Nessun parametro di input configurato",
      editTitle: "Parametri di ingresso delle attività",
      editDescription: "Configurare i parametri di input per questo endpoint",
    },
    scheduleAutocomplete: {
      customBadge: "Personalizzato",
      noSchedulesFound: "Nessun programma trovato",
      useCustomSchedule: "Utilizzare la pianificazione personalizzata",
      commonSchedules: "Orari comuni",
    },
    schedulePicker: {
      selectPlaceholder: "Seleziona l'orario...",
      customOption: "Personalizzato...",
      presets: {
        title: "Preimpostazioni rapide",
        everyMinute: "Ogni minuto",
        every5m: "Ogni 5 minuti",
        every15m: "Ogni 15 minuti",
        every30m: "Ogni 30 minuti",
        everyHour: "Ogni ora",
        every2h: "Ogni 2 ore",
        every4h: "Ogni 4 ore",
        every6h: "Ogni 6 ore",
        every12h: "Ogni 12 ore",
        dailyMidnight: "Quotidiano a mezzanotte",
        daily6am: "Quotidiano a 6 AM",
        dailyNoon: "Quotidiano a mezzogiorno",
        daily6pm: "Quotidiano a 6 PM",
        weeklyMon: "Settimanale di lunedì",
        weeklySun: "Settimanale di domenica",
        monthlyFirst: "1° di ogni mese",
      },
      custom: {
        title: "Programma personalizzato",
        repeatEvery: "Corri ogni",
        at: "Attorno",
        onDays: "Attivi",
        preview: "→ {{description}}",
        nextRun: "Il prossimo: {{time}}",
        nextRunMultiple: "Successivo: {{first}}, poi {{second}}",
        unit: {
          minutes: "minuti",
          hours: "ore",
          days: "giorni",
          weeks: "settimane",
          months: "mesi",
        },
        days: {
          mon: "L'anno",
          tue: "Tue",
          wed: "Wed",
          thu: "Giorgia",
          fri: "Frigo.",
          sat: "Rasoio",
          sun: "Sole",
        },
        advanced: "Espressione avanzata",
        advancedPlaceholder: "es. 0 9 * 1-5",
        advancedInvalid: "Espressione cron non valida",
      },
    },
  },
};
