import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Gestione delle attività",
  tags: {
    tasks: "Compiti",
  },
  type: {
    cron: "Compito Cron",
    side: "Compito laterale",
    task_runner: "Funzionalità Runner",
  },
  priority: {
    critical: "Critica",
    high: "Alto.",
    medium: "Mezzo medio",
    low: "Basso",
    background: "Sfondo",
    filter: {
      all: "Tutte le priorità",
      highAndAbove: "Alto e sopra",
      mediumAndAbove: "Medio e Sopra",
    },
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
    filter: {
      all: "Tutti gli stati",
      active: "Attivo",
      error: "Stati di errore",
    },
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
  sort: {
    asc: "Assunzione",
    desc: "Discussione",
  },
  pulse: {
    health: {
      healthy: "Salute",
      warning: "Avvertenza",
      critical: "Critica",
      unknown: "Sconosciuto",
    },
    execution: {
      success: "Operazione riuscita",
      failure: "Fallimento",
      timeout: "Timeout",
      cancelled: "Annullamento",
      pending: "Finanziamenti",
    },
  },
  cron: {
    frequency: {
      everyMinute: "ogni minuto",
      everyHour: "ogni ora",
      everyDays: "ogni giorno",
      hourly: "oraria",
    },
    days: {
      sunday: "Domenica",
      monday: "Lunedì",
      tuesday: "Martedì",
      wednesday: "Mercoledì",
      thursday: "Giovedì",
      friday: "Venerdì",
      saturday: "Sabato",
    },
    common: {
      dailyAtMidnight: "tutti i giorni a mezzanotte",
      dailyAtNoon: "tutti i giorni a mezzogiorno",
      weeklyOnSunday: "settimanale di domenica",
      monthlyOnFirst: "mensile al 1°",
      everyFiveMinutes: "ogni 5 minuti",
      everyThreeMinutes: "ogni 3 minuti",
      everyOneMinutes: "ogni minuto",
      everyTenMinutes: "ogni 10 minuti",
      everyFifteenMinutes: "ogni 15 minuti",
      everyThirtyMinutes: "ogni 30 minuti",
    },
    patterns: {
      everyIntervalMinutes: "ogni minuto {{interval}}",
      everyIntervalMinutesStarting:
        "ogni {{interval}} minuti a partire dal minuto {{start}}",
      atMinutes: "a minuti {{minutes}}",
      fromMinuteToMinute: "dal minuto {{from}} a {{to}}",
      atMinute: "al minuto {{minute}}",
      everyIntervalHours: "ogni ora {{interval}}",
      everyIntervalHoursStarting:
        "ogni {{interval}} ore a partire dall'ora {{start}}",
      atHours: "ore {{hours}}",
      fromHourToHour: "da ora {{from}} a {{to}}",
      atHour: "all'ora {{hour}}",
    },
    calendar: {
      onDays: "nei giorni {{days}}",
      onDay: "il giorno {{day}}",
      inMonths: "in {{months}}",
      inMonth: "in {{month}}",
      onWeekdays: "su {{days}}",
      fromWeekdayToWeekday: "da {{start}} a {{end}}",
      onWeekday: "su {{day}}",
    },
    timezone: "in {{timezone}}",
    time: {
      midnight: "mezzanotte",
      noon: "mezzogiorno.",
      hourAm: "{{hour}} AM",
      hourPm: "{{hour}} PM",
      hourMinuteAm: "{{hour}}:{{minute}} AM",
      hourMinutePm: "{{hour}}:{{minute}} PM",
    },
    weekdays: {
      sunday: "Domenica",
      monday: "Lunedì",
      tuesday: "Martedì",
      wednesday: "Mercoledì",
      thursday: "Giovedì",
      friday: "Venerdì",
      saturday: "Sabato",
    },
    months: {
      january: "Gennaio",
      february: "Febbraio",
      march: "Marzo",
      april: "Aprile",
      may: "Maggio",
      june: "Giugno",
      july: "Luglio",
      august: "Agosto",
      september: "Settembre",
      october: "Ottobre",
      november: "Novembre",
      december: "Dicembre",
    },
  },
  errors: {
    // Cron Tasks errors
    fetchCronTasks: "Non riuscito a prendere i compiti dei cron: {{error}}",
    createCronTask: "Non è riuscito a creare l'attività di cron",
    updateCronTask: "Non è riuscito ad aggiornare l'attività di cron",
    deleteCronTask: "Non è riuscito a eliminare l'attività di cron",
    fetchCronTaskHistory:
      "Non riuscito a recuperare la cronologia delle attività di cron",
    fetchCronTaskStats:
      "Non riuscito a recuperare le statistiche delle attività di cron",
    fetchCronStatus: "Non riuscito a recuperare lo stato del sistema di cron",
    cronTaskNotFound: "Attività Cron non trovata",

    // Unified Runner errors
    startTaskRunner: "Non ha avviato il task runner: {{error}}",
    stopTaskRunner: "Non riuscito a fermare il task runner",
    getTaskRunnerStatus:
      'Non riuscito a ottenere stato del task runner: azione sconosciuta " {{action}} "',
    executeCronTask: "Non è riuscito a eseguire l'attività di cron",

    // Pulse errors
    executePulse: "Non ha eseguito il polso",
    fetchPulseStatus: "Non è riuscito a recuperare lo stato del polso",
    pulseExecutionFailed: "Esecuzione del polso guasto",
    pulseInternalError: "Errore interno nel sistema di impulso",

    // Validation errors
    invalidTaskInput:
      "L'ingresso dell'attività non corrisponde allo schema di richiesta del punto finale",
    endpointNotFound: "Endpoint non trovato per il dato percorso ID",

    // Repository errors
    repositoryNotFound: "Risorsa non trovata",
    repositoryNotFoundDetail: "Nessun compito trovato per ID {{taskId}}",
    repositoryInternalError: "Si è verificato un errore interno",
    repositoryInternalErrorDetail:
      "Si è verificato un errore interno: {{error}}",
    repositoryGetTaskForbidden:
      "Non hai il permesso di visualizzare l'attività {{taskId}}",
    repositoryUpdateTaskForbidden:
      "Non hai il permesso di aggiornare questa attività",
    repositoryUpdateTaskForbiddenDetail:
      "Non hai il permesso di aggiornare l'attività {{taskId}}",
    repositoryDeleteTaskForbidden:
      "Non hai il permesso di eliminare l'attività {{taskId}}",
  },
  common: {
    cronRepositoryTaskUpdateFailed:
      "Non è stato possibile aggiornare l'attività di cron {{taskId}}: {{error}}",
    cronRepositoryTaskDeleteFailed:
      "Non è stato possibile eliminare l'attività di cron {{taskId}}: {{error}}",
    cronRepositoryExecutionCreateFailed:
      "Non è riuscito a creare l'esecuzione per il compito di cron {{taskId}}: {{error}}",
    cronRepositoryExecutionUpdateFailed:
      "Non è riuscito ad aggiornare l'esecuzione dell'attività di cron",
    cronRepositoryExecutionsFetchFailed:
      "Non riuscito a prendere le esecuzioni di compito di cron",
    cronRepositoryRecentExecutionsFetchFailed:
      "Non riuscito a prendere le recenti esecuzioni di compito del cron",
    cronRepositorySchedulesFetchFailed:
      "Non è riuscito a prendere gli orari dei compiti di cron",
    cronRepositoryScheduleUpdateFailed:
      "Non è riuscito ad aggiornare l'orario delle attività di cron",
    cronRepositoryStatisticsFetchFailed:
      "Non riuscito a recuperare le statistiche delle attività di cron",
  },
  outputMode: {
    storeOnly: "Solo",
    notifyOnFailure: "Informare sul fallimento",
    notifyAlways: "Informare sempre",
  },
  dbHealthCheck: {
    name: "Controllo dello stato del database",
    description:
      "Controlla ogni minuto lo stato della connessione al database.",
  },
  pulseRunner: {
    name: "pulse-runner",
    description:
      "Chiama il repository di impulsi una volta al minuto per attivare le attività programmate",
  },
  devWatcher: {
    name: "dev-file-watcher",
    description:
      "Orologi per i cambiamenti di file e innesca generatori in modalità sviluppo",
  },
  dbHealth: {
    tag: "Database",
    post: {
      title: "Controllo della salute del sistema",
      titleShort: "Salute di DB",
      description: "Controlla database, memoria e salute del disco",
      container: {
        title: "Salute del sistema",
        description:
          "ConnettivitÃ DB, utilizzo della memoria e utilizzo del disco",
      },
      response: {
        healthy: "Salute",
        status: "Stato",
        dbResponseMs: "Risposta DB (ms)",
        memoryUsedPct: "Memoria utilizzata (%)",
        heapUsedMb: "Heap Usato (MB)",
        rssMb: "RSS (MB)",
        diskUsedPct: "Disco usato (%)",
        uptimeHours: "Tempo di percorrenza (ore)",
        warnings: "Avvertenze",
      },
      errors: {
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Accedi per continuare",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Accesso negato",
        },
        server: {
          title: "Errore del server",
          description: "Controllo della salute del database",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore imprevisto",
        },
        validation: {
          title: "Errore di convalida",
          description: "Parametri della richiesta non validi",
        },
        systemAlert: "Sistema {{status}}: {{warnings}}",
      },
      success: {
        title: "DB Healthy",
        description: "Il collegamento del database è sano",
      },
    },
  },
  completeTask: {
    post: {
      title: "Compito completo",
      titleShort: "Compito completo",
      description:
        "Segnare un compito di sfondo come completato. Chiamato dall'agente di codifica quando il lavoro asincastro è fatto. Il framework rilancia il flusso AI in attesa con il risultato.",
      fields: {
        taskId: {
          title: "Task ID",
          description:
            "Il database delle attività di cron ID per contrassegnare come completo.",
        },
        status: {
          title: "Stato",
          description:
            'Stato finale: "completo" per il successo, "fallito" per il fallimento, \'cancelled\' per annullare.',
        },
        summary: {
          title: "Riepilogo",
          description:
            "Breve descrizione di ciò che è stato compiuto o perché ha fallito.",
        },
        output: {
          title: "Portata di uscita",
          description:
            "Carico di dati strutturato facoltativo (coppie di valore chiave) da collegare al risultato dell'esecuzione.",
        },
        completed: {
          title: "Completo",
          description:
            "Se il compito è stato contrassegnato con successo come fatto.",
        },
        updatedAt: {
          title: "Aggiornato At",
          description:
            "Timestamp quando lo stato dell'attività è stato aggiornato.",
        },
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Attività non valida ID o valore di stato",
        },
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Accedi per continuare",
        },
        internal: {
          title: "Complemento non corretto",
          description: "Non contrassegnato l'attività come completo",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Accesso negato",
        },
        notFound: {
          title: "Compito non trovato",
          description: "Nessun compito trovato con il dato ID",
        },
        network: {
          title: "Errore di rete",
          description:
            "Non è riuscito a spingere il completamento all'istanza remota",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore imprevisto",
        },
        unsaved: {
          title: "Modifiche non salvate",
          description: "Rilevamento delle modifiche non rilevate",
        },
        conflict: {
          title: "Conflitto",
          description: "Il compito non è in uno stato completabile",
        },
      },
      success: {
        title: "Compito completato",
        description:
          "Compito contrassegnato come fatto e flusso AI rianimato con il risultato",
      },
    },
  },
  waitForTask: {
    post: {
      title: "Attendere il compito",
      titleShort: "Attendere il compito",
      description:
        "Attendere su un compito di sfondo in sospeso. Restituisce il risultato immediatamente se già completato, o interrompe il flusso AI fino al termine dell'attività (meccanismo wakeUp).",
      fields: {
        taskId: {
          title: "Task ID",
          description: "La ID del compito di aspettare.",
        },
        status: {
          title: "Stato",
          description: "Situazione attuale delle attività.",
        },
        result: {
          title: "Risultato",
          description:
            "Carico utile del risultato (presente quando completato).",
        },
        waiting: {
          title: "Aspettare",
          description:
            "È vero quando il flusso viene sospeso in attesa che il compito venga completato.",
        },
        originalToolName: {
          title: "Strumento",
          description: "Lo strumento originale che è stato eseguito.",
        },
        originalArgs: {
          title: "Argomenti",
          description: "Gli argomenti di input dello strumento originale.",
        },
      },
      widget: {
        noToolName: "Nessun nome di strumento disponibile.",
        resolving: "Risolvere lo strumento...",
        unknownTool: "Strumento sconosciuto: {{toolName}}",
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Invalid taskId",
        },
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Accedi per continuare",
        },
        internal: {
          title: "Errore interno",
          description: "Non è riuscito a registrare cameriere sul compito",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Accesso negato",
        },
        notFound: {
          title: "Compito non trovato",
          description: "Nessun compito trovato con quel ID",
        },
        network: {
          title: "Errore di rete",
          description: "Si è verificato un errore di rete",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore imprevisto",
        },
        unsaved: {
          title: "Modifiche non salvate",
          description: "Rilevamento delle modifiche non rilevate",
        },
        conflict: {
          title: "Conflitto",
          description: "Si è verificato un conflitto",
        },
      },
      success: {
        title: "Risultato di attività pronto",
        description: "Compito completato o registratore di cameriere",
      },
      status: {
        waiting: "Aspettando il compito...",
        complete: "Compito completo",
      },
    },
  },
  errorMonitor: {
    name: "error-monitor",
    description:
      "Scansiona i thread di chat per i modelli di errore ogni 3 ore",
    tag: "Monitoraggio",
    post: {
      title: "Monitor di errore",
      description:
        "Monitoraggio degli errori Privacy-first - esegue la scansione dei messaggi per i modelli di errore senza leggere il contenuto",
      container: {
        title: "Risultati della scansione degli errori",
        description: "Modelli di errore aggregati da messaggi di chat",
      },
      response: {
        errorsFound: "Errori trovati",
        threadsScanned: "Filetti analizzati",
        scanWindowFrom: "Avvio finestra di scansione",
        scanWindowTo: "Fine finestra di scansione",
        patternType: "Tipo di errore",
        patternCount: "Conte",
        patternThreadIds: "ID filettati",
        patternModel: "Modello",
        patternTool: "Strumento",
        patternFirstSeen: "Primo Segreto",
        patternLastSeen: "Ultimo accesso",
      },
      errors: {
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Accedi per continuare",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Accesso negato",
        },
        server: {
          title: "Errore del server",
          description: "La scansione di errore non è riuscita",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore imprevisto",
        },
        validation: {
          title: "Errore di convalida",
          description: "Parametri della richiesta non validi",
        },
      },
      success: {
        title: "Scansione completa",
        description: "Controllo degli errori completato con successo",
      },
    },
    cleanup: {
      name: "Pulizia del registro degli errori",
      description:
        "Elimina i registri degli errori con più di sei mesi e conserva al massimo 100.000 voci.",
      post: {
        title: "Ripulire i registri di errore",
        titleShort: "Ripulire il registro",
        description:
          "Eliminare le vecchie voci di registro di errore (basate a tempo + conte-based) per mantenere il database magra",
        container: {
          title: "Risultati di pulizia",
          description: "Numero di log di errore cancellati",
        },
        response: {
          deletedCount: "Contatore cancellato",
          deletedByTime: "Cancellato dal tempo",
          deletedByCount: "Cancellato dal Conte Cap",
          retentionDays: "Giorni di detenzione",
          maxRows: "Max righe",
        },
        success: {
          title: "Pulizia completa",
          description: "Tronchi di errore vecchi potati con successo",
        },
      },
    },
  },
  csvProcessor: {
    description: "Processi CSV lavori di importazione in blocchi",
  },
  imapSync: {
    description:
      "Sincronizza automaticamente account, cartelle e messaggi IMAP",
  },
  newsletterUnsubscribeSync: {
    description:
      "Sincronizza gli stati di piombo per le cancellazioni delle newsletter",
  },
  cronSystem: {
    history: {
      category: "Gestione delle attività",

      errors: {
        cronTaskNotFound: "Attività Cron non trovata",
        repositoryInternalError: "Si è verificato un errore interno",
        fetchCronTaskHistory:
          "Non riuscito a recuperare la cronologia delle attività di cron",
      },

      get: {
        tags: {
          tasks: "Compiti",
          monitoring: "Monitoraggio",
        },
        title: "Storia dell'esecuzione del compito",
        description:
          "Visualizza i record di esecuzione storici per le attività di cron",
        fields: {
          taskId: {
            label: "Task ID",
            description: "Filtra per attività specifica ID",
            placeholder: "Inserire l'attività ID",
          },
          taskName: {
            label: "Nome del compito",
            description: "Filtra per nome dell'attività (campagna parziale)",
            placeholder: "Inserisci il nome dell'attività",
          },
          status: {
            label: "Stato di esecuzione",
            description: "Filtra per stato di esecuzione",
            placeholder: "Selezionare gli stati",
            options: {
              PENDING: "Finanziamenti",
              SCHEDULED: "Programmato",
              RUNNING: "Esecuzione",
              COMPLETED: "Completo",
              FAILED: "Sfigato",
              ERROR: "Errore",
              TIMEOUT: "Timeout",
              SKIPPED: "Asciugata",
              CANCELLED: "Annullamento",
              STOPPED: "Non ci sono.",
              BLOCKED: "Bloccato",
            },
          },
          priority: {
            label: "Priorità delle attività",
            description: "Filtra per livello prioritario compito",
            placeholder: "Seleziona le priorità",
            options: {
              LOW: "Basso",
              MEDIUM: "Mezzo medio",
              HIGH: "Alto.",
              CRITICAL: "Critica",
            },
          },
          startDate: {
            label: "Data di inizio",
            description: "Filtra le esecuzioni dopo questa data",
          },
          endDate: {
            label: "Data di fine",
            description: "Filtra le esecuzioni prima di questa data",
          },
          limit: {
            label: "Limiti di risultato",
            description: "Numero massimo di risultati da restituire",
            placeholder: "50",
          },
          offset: {
            label: "Risultati Offset",
            description: "Numero di risultati per saltare per paginazione",
            placeholder: "0",
          },
        },
        response: {
          title: "Risposta della cronologia delle attività",
          description: "Dati di esecuzione storici per le attività cron",
          executions: {
            title: "Execution Records",
          },
          totalCount: {
            title: "Totale conteggio",
          },
          hasMore: {
            title: "Ha più risultati",
          },
          statusCounts: {
            title: "Contatori di stato",
          },
          summary: {
            title: "Riepilogo delle procedure",
          },
        },
        errors: {
          validation: {
            title: "Errore di convalida",
            description: "Parametri di richiesta non valida forniti",
          },
          internal: {
            title: "Errore del server interno",
            description:
              "Non riuscito a recuperare la cronologia delle attività",
          },
          unauthorized: {
            title: "Autenticazione richiesta",
            description:
              "Non hai il permesso di visualizzare la cronologia delle attività",
          },
          notFound: {
            title: "Non trovato",
            description:
              "Registrazione delle attività o dell'esecuzione non trovata",
          },
          network: {
            title: "Errore di rete",
            description:
              "Errore di rete si è verificato durante l'acquisizione della cronologia delle attività",
          },
          forbidden: {
            title: "Accesso negato",
            description: "L'accesso alla cronologia delle attività è vietato",
          },
          server: {
            title: "Errore del server",
            description: "Si è verificato un errore interno del server",
          },
          unknown: {
            title: "Errore sconosciuto",
            description: "Si è verificato un errore sconosciuto",
          },
          unsavedChanges: {
            titleChanges: "Modifiche non salvate",
            title: "Modifiche non salvate",
            description: "Hai modifiche non salvate",
          },
          conflict: {
            title: "Conflitto",
            description: "I dati sono in conflitto",
          },
        },
        success: {
          title: "Storia recuperata",
          description:
            "Storia dell'esecuzione delle attività recuperata con successo",
        },
        log: {
          fetchSuccess: "Registrati di esecuzione {{count}}",
          fetchError:
            "Non riuscito a recuperare la cronologia dell'esecuzione del compito",
        },
        request: {
          title: "Richiesta di parametri",
          description: "Filtro della cronologia dell'esecuzione del compito",
        },
        unknownTask: "Attività sconosciute",
      },
      widget: {
        title: "Storia dell'esecuzione del compito",
        loading: "Caricamento della storia...",
        header: {
          tasks: "Compiti",
          stats: "Stat",
          pulse: "Pulse",
          refresh: "Aggiorna",
        },
        summary: {
          total: "Totale",
          successful: "Successo",
          failed: "Sfigato",
          successRate: "Tasso di successo",
          avgDuration: "Durata di Avg",
        },
        search: {
          placeholder: "Compiti di ricerca...",
        },
        filter: {
          all: "Tutti",
          running: "Esecuzione",
          completed: "Completo",
          failed: "Sfigato",
          timeout: "Timeout",
          cancelled: "Annullamento",
        },
        col: {
          taskName: "Nome del compito",
          status: "Stato",
          duration: "Durata",
          started: "Iniziato",
          completed: "Completo",
          environment: "Ambiente",
          error: "Errore",
        },
        empty: "Nessuna cronologia dell'esecuzione trovata",
        result: "Risultato",
        error: {
          collapse: "Errore di ricaduta",
          label: "Errore",
        },
        pagination: {
          info: "Pagina {{page}} di {{totalPages}} (totale {{total}})",
          prev: "Precedente",
          next: "Avanti",
        },
      },
    },
    stats: {
      category: "Gestione delle attività",

      errors: {
        fetchCronTaskStats:
          "Non riuscito a recuperare le statistiche delle attività di cron",
      },

      get: {
        title: "Ottenere Cron Task Statistiche",
        description:
          "Recuperare statistiche e metriche complete per le attività di cron",
        tag: "Statistiche di Cron",
        form: {
          title: "Cron Statistiche richiesta",
          description:
            "Configurare i parametri per recuperare le statistiche delle attività del cron",
        },
        fields: {
          period: {
            title: "Periodo di tempo",
            description: "Periodo di tempo per l'aggregazione statistica",
          },
          type: {
            title: "Tipo di statistica",
            description: "Tipo di statistiche da recuperare",
          },
          taskId: {
            title: "Task ID",
            description:
              "Compito specifico opzionale ID per filtrare le statistiche",
          },
          limit: {
            title: "Limite di Risultato",
            description: "Numero massimo di risultati da restituire",
          },
          timePeriod: {
            title: "Periodo di tempo",
          },
          dateRangePreset: {
            title: "Preset della gamma di data",
          },
          taskName: {
            title: "Nome del compito",
          },
          taskStatus: {
            title: "Stato dell'attività",
          },
          taskPriority: {
            title: "Priorità delle attività",
          },
          healthStatus: {
            title: "Stato di salute",
          },
          minDuration: {
            title: "Durata minima",
          },
          maxDuration: {
            title: "Durata massima",
          },
          includeDisabled: {
            title: "Includere i disabili",
          },
          includeSystemTasks: {
            title: "Includere le attività di sistema",
          },
          hasRecentFailures: {
            title: "Ha recenti fallimenti",
          },
          hasTimeout: {
            title: "Ha il timeout",
          },
          search: {
            title: "Cerca",
          },
        },
        period: {
          hour: "Ore",
          day: "Quotidiano",
          week: "Settimanale",
          month: "Mensile",
        },
        type: {
          overview: "Panoramica",
          performance: "Prestazioni",
          errors: "Analisi degli errori",
          trends: "Analisi delle tendenze",
        },
        response: {
          totalTasks: { title: "Compiti totali" },
          executedTasks: { title: "Compiti esecutivi" },
          successfulTasks: { title: "Compiti di successo" },
          failedTasks: { title: "Compiti falliti" },
          averageExecutionTime: { title: "Avg Tempo di esecuzione (ms)" },
          totalExecutions: { title: "Esecuzioni totali" },
          executionsLast24h: { title: "Esecuzioni Ultimi 24h" },
          successRate: { title: "Tasso di successo (%)" },
          successfulExecutions: { title: "Esecuzioni di successo" },
          failedExecutions: { title: "Esecuzioni fallite" },
          failureRate: { title: "Tasso di inadempimento (%)" },
          avgExecutionTime: { title: "Avg Tempo di esecuzione (ms)" },
          minExecutionTime: { title: "Tempo minimo di esecuzione (ms)" },
          maxExecutionTime: { title: "Tempo massimo di esecuzione (ms)" },
          medianExecutionTime: { title: "Tempo di esecuzione mediana (ms)" },
          pendingExecutions: { title: "Esecuzioni in sospeso" },
          runningExecutions: { title: "Esecuzioni in esecuzione" },
          activeTasks: { title: "Attività attive" },
          systemStatus: { title: "Stato di sistema" },
          uptime: { title: "Tempo di percorrenza" },
          healthyTasks: { title: "Compiti sani" },
          degradedTasks: { title: "Compiti degradati" },
          systemLoad: { title: "Carico di sistema (%)" },
          queueSize: { title: "Dimensione del queue" },
        },
        errors: {
          server: {
            title: "Errore del server",
            description:
              "Si è verificato un errore del server interno durante il recupero delle statistiche",
          },
          validation: {
            title: "Errore di convalida",
            description: "I parametri previsti sono invalidi",
          },
          unauthorized: {
            title: "Autenticazione richiesta",
            description:
              "Autenticazione necessaria per accedere alle statistiche",
          },
          forbidden: {
            title: "Accesso negato",
            description:
              "Autorizzazioni insufficienti per accedere alle statistiche",
          },
          notFound: {
            title: "Non trovato",
            description: "Le statistiche richieste non sono state trovate",
          },
          conflict: {
            title: "Conflitto",
            description:
              "Si è verificato un conflitto durante l'elaborazione della richiesta",
          },
          network: {
            title: "Errore di rete",
            description:
              "Si è verificato un errore di rete durante il recupero delle statistiche",
          },
          unknown: {
            title: "Errore sconosciuto",
            description: "Si è verificato un errore sconosciuto",
          },
          unsavedChanges: {
            title: "Modifiche non salvate",
            description:
              "Ci sono cambiamenti non salvati che devono essere affrontati",
          },
        },
        success: {
          title: "Statistiche recuperate",
          description:
            "Statistiche delle attività Cron recuperate con successo",
        },
      },
      priority: {
        critical: "Critica",
        high: "Alto.",
        medium: "Mezzo medio",
        low: "Basso",
        background: "Sfondo",
      },
      widget: {
        title: "Statistiche di Cron",
        loading: "Caricamento delle statistiche...",
        viewTasks: "Compiti",
        viewHistory: "Storia",
        viewPulse: "Pulse",
        refresh: "Aggiorna",
        totalTasks: "Compiti totali",
        executedTasks: "Compiti esecutivi",
        successfulTasks: "Successo",
        failedTasks: "Sfigato",
        successRate: "Tasso di successo",
        avgDuration: "Durata di Avg",
        overallSuccessRate: "Tasso di successo complessivo",
        activeTasks: "Attività attive",
        runningExecutions: "Esecuzione",
        pendingExecutions: "Finanziamenti",
        healthyTasks: "Compiti sani",
        degradedTasks: "Compiti degradati",
        systemLoad: "Caricamento del sistema",
        queueSize: "Dimensione del queue",
        executionsLast24h: "Ultimo 24h",
        tasksByStatus: "Compiti per Stato",
        tasksByPriority: "Compiti della Priorità",
        topPerforming: "Compiti di formazione superiore",
        problemTasks: "Compiti dei problemi",
        recentActivity: "Attività recenti",
        dailyStats: "Statistiche giornaliere",
        systemStatus: {
          healthy: "Salute",
          warning: "Avvertenza",
          critical: "Critica",
          unknown: "Sconosciuto",
        },
        uptime: "Tempo di percorrenza",
        col: {
          rank: "#",
          taskName: "Nome del compito",
          executions: "Esecuzioni",
          avgDuration: "Durata di Avg",
          failures: "Inadempimento",
          failureRate: "Tasso di inadempimento",
          date: "Data",
          successes: "Successi",
          uniqueTasks: "Compiti unici",
        },
      },
    },
    task: {
      category: "Sistema",
      tags: {
        cron: "Cron",
        scheduling: "Scheduling",
      },
      get: {
        title: "Ottenere Cron Task",
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
        description: "Eliminare un compito di cron",
        container: {
          title: "Eliminare l'attività Cron",
          description: "Rimuovere un'attività dal sistema",
        },
        fields: {
          id: {
            label: "Task ID",
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
            description:
              "L'attività di cancellazione non potrebbe essere trovata",
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
        run: "Correte!",
        runSuccess: "Compito eseguito con successo",
        running: "Correre...",
        refresh: "Aggiorna",
        taskInput: {
          title: "Input di attività",
          loading: "Definizione di endpoint di caricamento...",
          notFound: "Definizione endpoint non trovata per questo compito",
          empty: "Nessun parametro di input configurato",
          editTitle: "Parametri di ingresso delle attività",
          editDescription:
            "Configurare i parametri di input per questo endpoint",
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
    },
    tasks: {
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
            description:
              "Filtra per stato nascosto (predefinito: visibile solo)",
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
            name: "Nome del compito",
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
            lastExecutedAt: "Ultimo esecuzione a",
            lastExecutionStatus: "Ultimo stato di esecuzione",
            lastExecutionError: "Ultimo errore di esecuzione",
            lastExecutionDuration: "Durata dell'esecuzione (ms)",
            nextExecutionAt: "Prossima esecuzione alla",
            executionCount: "Contatore di esecuzione",
            successCount: "Contesto di successo",
            errorCount: "Contatore di errore",
            averageExecutionTime: "Tempo medio di esecuzione (ms)",
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
            description:
              "Non sono stati trovati compiti corrispondenti ai criteri",
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
            description:
              "L'elenco delle attività è stato recuperato con successo",
          },
        },
      },
      post: {
        title: "Creare attività Cron",
        description: "Creare un nuovo compito di cron",
        container: {
          title: "Creare attività",
          description: "Configurare un nuovo compito di cron",
        },
        fields: {
          id: {
            label: "Task ID",
            description:
              "Unico e stabile identificatore per questo compito (ad esempio 'db-health')",
            placeholder: "Inserire l'attività ID...",
          },
          routeId: {
            label: "Route ID",
            description:
              "Identificazione del manubrio: nome dell'attività, alias endpoint o 'cron-steps'",
            placeholder: "Inserire il percorso ID...",
          },
          displayName: {
            label: "Nome dell'esposizione",
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
          view: "Visualizza dettagli",
          history: "Visualizza la storia",
          edit: "Modifica dell'attività",
          delete: "Eliminare l'attività",
          runNow: "Correte!",
        },
        bulk: {
          selected: "{count} selezionato",
          selectAll: "Seleziona tutto",
          clearSelection: "Selezione chiara",
          enable: "Abilita'",
          disable: "Disattivare",
          runNow: "Avvia ora",
          delete: "Elimina",
          confirmDeleteTitle: "Eliminare le attività?",
          confirmDelete:
            "Eliminare le attività di {count}(s)? Questo non può essere annullato.",
          cancel: "Annulla",
          success: "{succeeded} è riuscito, {failed} ha fallito",
        },
        empty: {
          noTasks: "Nessun compito di cron",
          noTasksDesc: "Crea il tuo primo compito di cron per iniziare",
          noMatches: "Nessun compito corrisponde ai tuoi filtri",
          noMatchesDesc: "Prova a regolare i criteri di ricerca o filtro",
          clearFilters: "Filtri trasparenti",
        },
      },
    },
    errors: {
      fetch_all_failed: "Non è riuscito a prendere i compiti del cron",
      fetch_by_id_failed: "Non riuscito a prendere il compito di cron da ID",
      fetch_by_name_failed:
        "Non riuscito a prendere il compito di cron per nome",
      create_failed: "Non è riuscito a creare l'attività di cron",
      update_failed: "Non è riuscito ad aggiornare l'attività di cron",
      delete_failed: "Non è riuscito a eliminare l'attività di cron",
      not_found: "Attività Cron non trovata",
      execution_create_failed:
        "Non è riuscito a creare l'esecuzione dell'attività di cron",
      execution_update_failed:
        "Non è riuscito ad aggiornare l'esecuzione dell'attività di cron",
      execution_not_found: "Esecuzione dell'attività Cron non trovata",
      executions_fetch_failed:
        "Non riuscito a prendere le esecuzioni di compito di cron",
      recent_executions_fetch_failed:
        "Non riuscito a prendere recenti esecuzioni di cron",
      schedules_fetch_failed:
        "Non è riuscito a prendere gli orari dei compiti di cron",
      schedule_update_failed:
        "Non è riuscito ad aggiornare l'orario delle attività di cron",
      schedule_not_found: "Calendario delle attività Cron non trovato",
      statistics_fetch_failed:
        "Non riuscito a recuperare le statistiche delle attività di cron",
    },
  },
  pulseSystem: {
    execute: {
      category: "Esecuzione del polso",
      tags: {
        execute: "Esecuzione",
      },
      post: {
        title: "Esegui il polso",
        description:
          "Eseguire il monitoraggio della salute del polso e l'esecuzione delle attività",
        container: {
          title: "Esecuzione del polso",
          description:
            "Eseguire il monitoraggio delle pulsazioni e eseguire le attività programmate",
        },
        fields: {
          dryRun: {
            label: "Correre a secco",
            description:
              "Eseguire una corsa asciutta senza fare cambiamenti effettivi",
          },
          taskNames: {
            label: "Nomi delle attività",
            description: "Nomi specifici per l'esecuzione (opzionale)",
          },
          force: {
            label: "Esecuzione della Forza",
            description: "Esecuzione forza anche se i compiti non sono dovuti",
          },
          success: {
            title: "Operazione riuscita",
          },
          message: {
            title: "Messaggio",
          },
        },
        response: {
          pulseId: "Pulsante ID",
          executedAt: "Esecuzione",
          totalTasksDiscovered: "Totale Compiti Scoperti",
          tasksDue: "Compiti Due",
          tasksExecuted: "Compiti esecuti",
          tasksSucceeded: "Compiti",
          tasksFailed: "Compiti falliti",
          tasksSkipped: "Compiti saltati",
          totalExecutionTimeMs: "Tempo di esecuzione totale (ms)",
          errors: "Errori",
          summary: "Riepilogo delle procedure",
          results: "Risultati",
          resultsDescription: "Risultati dell'esecuzione",
          taskName: "Nome del compito",
          success: "Operazione riuscita",
          duration: "Durata",
          message: "Messaggio",
          executionFailed: "Esecuzione fallita",
          dryRunSuccess: "Corsa a secco completata con successo",
          executionSuccess: "Esecuzione completata con successo",
        },
        examples: {
          basic: {
            title: "Esecuzione di base del polso",
          },
          dryRun: {
            title: "Esecuzione a secco",
          },
          success: {
            title: "Esecuzione riuscita",
          },
        },
        errors: {
          unauthorized: {
            title: "Autenticazione richiesta",
            description: "Accedi per continuare",
          },
          internal: {
            title: "Errore interno",
            description: "Si è verificato un errore interno del server",
          },
          unknown: {
            title: "Errore sconosciuto",
            description: "Si è verificato un errore sconosciuto",
          },
          network: {
            title: "Errore di rete",
            description: "Si è verificato un errore di rete",
          },
          forbidden: {
            title: "Accesso negato",
            description: "Accesso non consentito",
          },
          notFound: {
            title: "Non trovato",
            description: "Risorsa non trovata",
          },
          conflict: {
            title: "Conflitto",
            description: "I dati sono in conflitto",
          },
          unsaved: {
            title: "Modifiche non salvate",
            description: "Ci sono cambiamenti non rilevati",
          },
          validation: {
            title: "Errore di convalida",
            description: "Parametri della richiesta non validi",
          },
        },
        success: {
          title: "Operazione riuscita",
          description: "Operazione completata",
        },
      },
    },
    status: {
      category: "Stato di impulso",
      tags: {
        status: "Stato",
      },
      get: {
        title: "Stato di impulso",
        description: "Ottieni lo stato di monitoraggio della salute del polso",
        container: {
          title: "Stato di salute del polso",
          description:
            "Monitorare la salute e le statistiche dell'esecuzione del polso",
        },
        fields: {
          status: {
            title: "Stato",
            label: "Stato di impulso",
            description: "Situazione attuale della salute del polso",
          },
          lastPulseAt: {
            title: "L'ultimo impulso",
            label: "Ultimo impulso",
            description: "Timestamp dell'ultima esecuzione del polso",
          },
          successRate: {
            title: "Tasso di successo",
            label: "Tasso di successo",
            description: "Percentuale delle esecuzioni di polso di successo",
          },
          totalExecutions: {
            title: "Esecuzioni totali",
            label: "Esecuzioni totali",
            description: "Numero totale di esecuzioni del polso",
          },
        },
        examples: {
          basic: {
            title: "Richiesta di stato fondamentale",
          },
          success: {
            title: "Risposta dello stato di successo",
          },
        },
        errors: {
          unauthorized: {
            title: "Autenticazione richiesta",
            description: "Accedi per continuare",
          },
          internal: {
            title: "Errore interno",
            description: "Si è verificato un errore interno del server",
          },
          unknown: {
            title: "Errore sconosciuto",
            description: "Si è verificato un errore sconosciuto",
          },
          network: {
            title: "Errore di rete",
            description: "Si è verificato un errore di rete",
          },
          forbidden: {
            title: "Accesso negato",
            description: "Accesso non consentito",
          },
          notFound: {
            title: "Non trovato",
            description: "Risorsa non trovata",
          },
          conflict: {
            title: "Conflitto",
            description: "I dati sono in conflitto",
          },
          unsaved: {
            title: "Modifiche non salvate",
            description: "Ci sono cambiamenti non rilevati",
          },
          validation: {
            title: "Errore di convalida",
            description: "Parametri della richiesta non validi",
          },
        },
        success: {
          title: "Operazione riuscita",
          description: "Operazione completata",
        },
      },
    },
    history: {
      category: "Gestione delle attività",

      tags: {
        pulse: "Pulse",
        monitoring: "Monitoraggio",
      },

      errors: {
        fetchCronTaskHistory:
          "Non riuscito a recuperare la cronologia dell'esecuzione del polso",
      },

      get: {
        title: "Storia dell'esecuzione del polso",
        description: "Visualizza i cicli storici di esecuzione del polso",
        fields: {
          startDate: {
            label: "Data di inizio",
            description: "Filtra i cicli di impulso dopo questa data",
          },
          endDate: {
            label: "Data di fine",
            description: "Filtra i cicli di impulso prima di questa data",
          },
          status: {
            label: "Stato",
            description: "Filtra per stato di esecuzione",
            placeholder: "Tutti gli stati",
          },
          limit: {
            label: "Limiti di risultato",
            description: "Numero massimo di risultati da restituire",
            placeholder: "50",
          },
          offset: {
            label: "Risultati Offset",
            description: "Numero di risultati per saltare per paginazione",
            placeholder: "0",
          },
        },
        response: {
          executions: { title: "Esecuzioni di impulso" },
          totalCount: { title: "Totale conteggio" },
          hasMore: { title: "Ha più risultati" },
          summary: { title: "Riepilogo delle procedure" },
        },
        errors: {
          validation: {
            title: "Errore di convalida",
            description: "Parametri di richiesta non valida forniti",
          },
          network: {
            title: "Errore di rete",
            description:
              "Errore di rete si è verificato durante l'acquisizione della cronologia del polso",
          },
          unauthorized: {
            title: "Autenticazione richiesta",
            description:
              "Non hai il permesso di visualizzare la cronologia delle pulsazioni",
          },
          forbidden: {
            title: "Accesso negato",
            description: "L'accesso alla cronologia delle pulsazioni è vietato",
          },
          notFound: {
            title: "Non trovato",
            description: "Registrazione dell'esecuzione del polso non trovata",
          },
          server: {
            title: "Errore del server",
            description: "Si è verificato un errore interno del server",
          },
          unknown: {
            title: "Errore sconosciuto",
            description: "Si è verificato un errore sconosciuto",
          },
          unsavedChanges: {
            title: "Modifiche non salvate",
          },
          conflict: {
            title: "Conflitto",
            description: "I dati sono in conflitto",
          },
        },
        success: {
          title: "Storia recuperata",
          description:
            "Storia dell'esecuzione di impulso recuperato con successo",
        },
      },
      pulse: {
        execution: {
          success: "Operazione riuscita",
          failure: "Fallimento",
          timeout: "Timeout",
          cancelled: "Annullamento",
          pending: "Finanziamenti",
        },
      },
      widget: {
        title: "Storia del polso",
        empty: "Nessuna esecuzione del polso trovata",
        details: "Dettagli",
        discovered: "{{count}} scoperto",
        due: "{{count}} due",
        succeeded: "{{count}} ok",
        failed: "{{count}} ha fallito",
        tasksExecuted: "Esecuzione",
        tasksSucceeded: "Accadenze",
        tasksFailed: "Sfigato",
        tasksSkipped: "Asciugata",
        header: {
          cronHistory: "Cron Storia",
          stats: "Stat",
          refresh: "Aggiorna",
        },
        summary: {
          total: "Totale",
          successful: "Successo",
          failed: "Sfigato",
          successRate: "Tasso di successo",
          avgDuration: "Durata di Avg",
        },
        filter: {
          all: "Tutti",
          success: "Operazione riuscita",
          failure: "Sfigato",
          timeout: "Timeout",
        },
        pagination: {
          info: "Pagina {{page}} di {{totalPages}} (totale {{total}})",
          prev: "Precedente",
          next: "Avanti",
        },
      },
    },
    success: {
      title: "Operazione riuscita",
      description: "Pulsante eseguito con successo",
      content: "Operazione riuscita",
    },
    container: {
      title: "Contenitore di impulso",
      description: "Descrizione del contenitore di impulso",
    },
  },
  unifiedRunner: {
    category: "Gestione delle attività",

    description: "Esegui i compiti di sfondo e gestisce le attività laterali",
    common: {
      taskName: "Nome del compito",
      taskNamesDescription: "Nomi delle attività da filtrare",
      detailed: "Dettagli dettagli",
      detailedDescription: "Includi informazioni dettagliate",
      active: "Attivo",
      total: "Totale",
      uptime: "Tempo di percorrenza",
      id: "ID",
      status: "Stato",
      lastRun: "Ultima corsa",
      nextRun: "Prossima corsa",
      schedule: "Pianificazione",
    },
    post: {
      title: "Eseguitore di attività unificato",
      description:
        "Gestire il task runner unificato per le attività di sfondo e le attività laterali",
      container: {
        title: "Gestione del runner di attività unificata",
        description:
          "Controllare il task runner unificato che gestisce sia le attività di sfondo che le attività laterali",
      },
      fields: {
        action: {
          label: "Azione",
          description: "Azione da eseguire sul task runner",
          options: {
            start: "Avviare Runner",
            stop: "Stop Runner",
            status: "Ottieni lo stato",
            restart: "Riavviare Runner",
          },
        },
        taskFilter: {
          label: "Filtro di attività",
          description: "Filtra le attività per tipo",
          options: {
            all: "Tutte le attività",
            cron: "Solo le attività Cron",
            side: "Solo le attività laterali",
          },
        },
        dryRun: {
          label: "Correre a secco",
          description:
            "Eseguire una corsa asciutta senza fare cambiamenti effettivi",
        },
      },
      response: {
        success: "Successo dell'operazione",
        actionResult: "Risultato d'azione",
        message: "Messaggio di risposta",
        timestamp: "Timestamp",
      },
      reasons: {
        previousInstanceRunning: "L'istanza precedente è ancora in esecuzione",
      },
      messages: {
        taskSkipped: "Il compito era saltato",
        taskCompleted: "Compito completato con successo",
      },
      errors: {
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Accedi per continuare",
        },
        validation: {
          title: "Errore di convalida",
          description: "Parametri della richiesta non validi",
        },
        internal: {
          title: "Errore interno",
          description: "Si è verificato un errore interno del server",
        },
        unknown: {
          title: "Errore sconosciuto",
          description: "Si è verificato un errore sconosciuto",
        },
        network: {
          title: "Errore di rete",
          description: "Si è verificato un errore di rete",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Accesso non consentito",
        },
        notFound: {
          title: "Non trovato",
          description: "Risorsa non trovata",
        },
        conflict: {
          title: "Conflitto",
          description: "I dati sono in conflitto",
        },
        unsaved: {
          title: "Modifiche non salvate",
          description: "Ci sono cambiamenti non rilevati",
        },
        execution: {
          title: "Errore di esecuzione delle attività",
          description: "Non riuscita a eseguire l'attività",
        },
        taskAlreadyRunning: {
          title: "Compito già in esecuzione",
          description: "L'attività specificata è già in esecuzione",
        },
        sideTaskExecution: {
          title: "Errore di esecuzione delle attività laterali",
          description: "Non riuscita a eseguire un'attività laterale",
        },
      },
      success: {
        title: "Operazione riuscita",
        description: "Operazione completata",
      },
    },
  },
};
