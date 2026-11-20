import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Gestione delle attività",
  errors: {
    cronTaskNotFound: "Attività Cron non trovata",
    repositoryInternalError: "Si è verificato un errore interno",
    fetchCronTaskHistoryDetail: "Non è possibile caricare la cronologia del compito {{taskId}} (limit {{limit}}): {{error}}",
    fetchCronTaskHistoryAllDetail: "Non è possibile caricare la cronologia delle attività (limit {{limit}}): {{error}}"
  },
  get: {
    tags: {
      tasks: "Compiti",
      monitoring: "Monitoraggio"
    },
    title: "Storia dell'esecuzione del compito",
    titleShort: "Storia del lavoro",
    description: "Visualizza i record di esecuzione storici per le attività di cron",
    fields: {
      taskId: {
        label: "Task ID",
        description: "Filtra per attività specifica ID",
        placeholder: "Inserire l'attività ID"
      },
      taskName: {
        label: "Nome del compito",
        description: "Filtra per nome dell'attività (campagna parziale)",
        placeholder: "Inserisci il nome dell'attività"
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
          BLOCKED: "Bloccato"
        }
      },
      priority: {
        label: "Priorità delle attività",
        description: "Filtra per livello prioritario compito",
        placeholder: "Seleziona le priorità",
        options: {
          LOW: "Basso",
          MEDIUM: "Mezzo medio",
          HIGH: "Alto.",
          CRITICAL: "Critica"
        }
      },
      startDate: {
        label: "Data di inizio",
        description: "Filtra le esecuzioni dopo questa data"
      },
      endDate: {
        label: "Data di fine",
        description: "Filtra le esecuzioni prima di questa data"
      },
      limit: {
        label: "Limiti di risultato",
        description: "Numero massimo di risultati da restituire",
        placeholder: "50"
      },
      offset: {
        label: "Risultati Offset",
        description: "Numero di risultati per saltare per paginazione",
        placeholder: "0"
      }
    },
    response: {
      title: "Risposta della cronologia delle attività",
      description: "Dati di esecuzione storici per le attività cron",
      executions: {
        title: "Execution Records"
      },
      totalCount: {
        title: "Totale conteggio"
      },
      hasMore: {
        title: "Ha più risultati"
      },
      statusCounts: {
        title: "Contatori di stato"
      },
      summary: {
        title: "Riepilogo delle procedure"
      }
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Parametri di richiesta non valida forniti"
      },
      internal: {
        title: "Errore del server interno",
        description: "Non riuscito a recuperare la cronologia delle attività"
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Non hai il permesso di visualizzare la cronologia delle attività"
      },
      notFound: {
        title: "Non trovato",
        description: "Registrazione delle attività o dell'esecuzione non trovata"
      },
      network: {
        title: "Errore di rete",
        description: "Errore di rete si è verificato durante l'acquisizione della cronologia delle attività"
      },
      forbidden: {
        title: "Accesso negato",
        description: "L'accesso alla cronologia delle attività è vietato"
      },
      server: {
        title: "Errore del server",
        description: "Si è verificato un errore interno del server"
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore sconosciuto"
      },
      unsavedChanges: {
        titleChanges: "Modifiche non salvate",
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate"
      },
      conflict: {
        title: "Conflitto",
        description: "I dati sono in conflitto"
      }
    },
    success: {
      title: "Storia recuperata",
      description: "Storia dell'esecuzione delle attività recuperata con successo"
    },
    log: {
      fetchSuccess: "Registrati di esecuzione {{count}}",
      fetchError: "Non riuscito a recuperare la cronologia dell'esecuzione del compito"
    },
    request: {
      title: "Richiesta di parametri",
      description: "Filtro della cronologia dell'esecuzione del compito"
    },
    unknownTask: "Attività sconosciute"
  },
  widget: {
    title: "Storia dell'esecuzione del compito",
    loading: "Caricamento della storia...",
    header: {
      tasks: "Compiti",
      stats: "Stat",
      pulse: "Pulse",
      refresh: "Aggiorna"
    },
    summary: {
      total: "Esecuzioni corrispondenti",
      successful: "Successo",
      failed: "Sfigato",
      successRate: "Tasso di successo",
      avgDuration: "Durata di Avg"
    },
    search: {
      placeholder: "Compiti di ricerca..."
    },
    filter: {
      all: "Tutti",
      running: "Esecuzione",
      completed: "Completo",
      failed: "Sfigato",
      timeout: "Timeout",
      cancelled: "Annullamento"
    },
    col: {
      taskName: "Nome del compito",
      status: "Stato",
      duration: "Durata",
      started: "Iniziato",
      completed: "Completo",
      environment: "Ambiente",
      error: "Errore"
    },
    empty: "Nessuna cronologia dell'esecuzione trovata",
    result: "Risultato",
    error: {
      collapse: "Errore di ricaduta",
      label: "Errore"
    },
    pagination: {
      info: "Pagina {{page}} di {{totalPages}} (totale {{total}})",
      prev: "Precedente",
      next: "Avanti"
    }
  }
};
