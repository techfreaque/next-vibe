import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Gestione delle attività",

  errors: {
    fetchCronTaskStats:
      "Non riuscito a recuperare le statistiche delle attività cron ({{type}}, {{period}}, task {{taskId}}): {{error}}",
  },

  get: {
    title: "Ottenere Cron Task Statistiche",
    titleShort: "Cron Stats",
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
        description: "Autenticazione necessaria per accedere alle statistiche",
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
      description: "Statistiche delle attività Cron recuperate con successo",
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
};
