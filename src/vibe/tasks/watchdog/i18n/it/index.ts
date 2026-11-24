import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Task Watchdog",
  tags: {
    taskWatchdog: "task-watchdog",
    vibeSense: "vibe-sense",
    budget: "budget",
  },
  enums: {
    incidentType: {
      all: "Tutti gli incidenti",
      timeout: "Timeout",
      loop: "Loop",
      budget: "Economico",
      transientRetryExhausted: "Reti esausti",
      watchdogCancel: "Cancellazione di Watchdog",
    },
    budgetScope: {
      task: "Per l'esecuzione del compito",
      day: "Per giorno (tutte le attività)",
      goal: "Per gol, al giorno",
    },
    spendKind: {
      model: "Modello giro",
      tool: "Servizio",
    },
    healthMetric: {
      started: "Iniziati i compiti",
      completed: "Compiti completati",
      failed: "Compiti falliti",
      watchdogCancelled: "Compiti annullati da watchdog",
      avgDuration: "Durata media (secondi)",
      p95Duration: "Durata del 95esimo per centoile (secondi)",
      creditSpend: "Crediti spesi per compiti",
      incidents: "Incidenti",
    },
  },
  sweep: {
    post: {
      title: "Controllo delle attività bloccate",
      titleShort: "Occhiali da polso",
      description:
        "Trova bloccato, looping e compiti di sfondo orfano, li ferma con una ragione registrata e apre un incidente. Scappa ogni minuto.",
      container: {
        title: "Risultato della febbre",
        description:
          "Che cosa ha trovato e fatto il cane da guardia su questo pass",
      },
      response: {
        checked: "Esecuzione delle attività verificate",
        cancelled: "Annullato (limite)",
        orphaned: "Corre orfane recuperate",
        loops: "Disabilitazioni di operazioni di carico",
        incidents: "Incidenti aperti",
      },
    },
    task: {
      description:
        "Interrompe le attività che durano troppo, entrano in un ciclo o perdono il processo. Registra un incidente per ogni attività interrotta.",
    },
  },
  health: {
    get: {
      title: "Settore",
      titleShort: "Settore",
      description:
        "Esecuzione di compiti con età, giri e spendere, recenti fallimenti e incidenti aperti. Cancellare un compito da qui.",
      response: {
        running: "Esecuzione delle attività",
        failures: "Errori recenti",
        incidents: "Incidenti aperti",
        daySpent: "Crediti spesi oggi",
        dayCap: "Tappo giornaliero",
      },
      widget: {
        title: "Settore sanitario",
        subtitle: "Ogni corsa e' sorvegliata. Quelli stuzzicanti si fermano.",
        refresh: "Aggiorna",
        loading: "Caricamento della salute delle attività...",
        spendToday: "{{spent}} dei crediti {{cap}} spesi oggi dai compiti",
        running: {
          title: "Correre ora",
          empty: "Non c'e' niente che scappi.",
        },
        failures: {
          title: "Errori recenti",
          empty: "Non ci sono fallimenti nelle ultime 24 ore.",
        },
        incidents: {
          title: "Incidenti aperti",
          empty: "Nessun incidente aperto.",
        },
        age: "Età",
        turns: "Turni",
        toolCalls: "Chiamate degli strumenti",
        spend: "Spettacolo",
        goal: "Goal {{goal}}",
        limit: "limite {{limit}}",
        lastError: "Ultimo errore",
        noError: "Nessun errore registrato",
        cancel: "Annulla",
        cancelling: "Cancelliere...",
        resolve: "Risolvere",
        credits: "{{amount}}",
      },
    },
  },
  cancel: {
    post: {
      title: "Annulla attività",
      titleShort: "Annulla attività",
      description:
        "Interrompe un'attività in esecuzione (e il suo loop AI) e registra la cancellazione, o segna un incidente risolto.",
      fields: {
        taskId: {
          label: "Task ID",
          description: "Il compito in esecuzione per fermare",
          placeholder: "id",
        },
        incidentId: {
          label: "Incidente ID",
          description: "L'incidente per segnare risolto",
        },
      },
      response: {
        cancelled: "Compito annullato",
        resolved: "Risolto l'incidenza",
      },
    },
  },
  budgetCaps: {
    get: {
      title: "Compiti di budget Caps",
      titleShort: "Caps di bilancio",
      description:
        "Tappi di credito che fermano le attività di sfondo: per task run, al giorno e per obiettivo.",
      response: {
        rows: "Caps",
        daySpent: "Crediti spesi oggi",
      },
      widget: {
        title: "Tappi di bilancio delle attività",
        subtitle:
          "Un compito che colpisce un tappo si ferma in modo pulito. Il tappo giornaliero è il soffitto duro per tutte le piste incustodite.",
        refresh: "Aggiorna",
        add: "Tappo di fissaggio",
        loading: "Caricamento di tappi...",
        empty: {
          title: "Nessun set di tappi",
          hint: "I default si applicano: 100 crediti per task run, 1000 al giorno, 500 per goal.",
          cta: "Set primo tappo",
        },
        spentToday: "Crediti {{spent}} spesi oggi",
        enabled: "Attivo",
        disabled: "Disattivati",
        credits: "Crediti {{amount}}",
        none: "nessuno",
      },
    },
    post: {
      title: "Set Task Budget Cap",
      titleShort: "Set cap",
      description:
        "Creare o aggiornare un tappo di credito. Un tappo per portata e chiave. Una chiave di compito di * è il default per ogni attività.",
      fields: {
        scope: {
          label: "Ambito",
          description: "Che cosa il cappello limita",
        },
        key: {
          label: "chiave",
          description:
            "Compito: task id o *. Giorno: globale. Goal: nome dell'obiettivo o * (goal: tag <name> sul compito)",
          placeholder: "*",
        },
        maxCredits: {
          label: "Crediti massimi",
          description:
            "Trascorrere a o sopra questo blocca il compito. 0 bloccarlo.",
        },
        enabled: {
          label: "Attivo",
          description: "Non mantiene la riga, ma lo ignora",
        },
        note: {
          label: "Nota",
          description: "Perché questo cappello esiste",
          placeholder: "Agenti di ricerca per la notte",
        },
      },
      response: {
        id: "Cap ID",
      },
      widget: {
        back: "Indietro",
        hint: "Un tappo ferma il compito quando la spesa raggiunge. Il tappo giornaliero si applica sempre.",
      },
    },
  },
  dataSources: {
    fields: {
      resolution: {
        label: "Risoluzione",
        description: "Dimensione del secchio",
      },
      range: {
        label: "Gamma di intervallo",
        description: "Intervallo di tempo per query",
      },
      lookback: {
        label: "Lookback",
        description: "Barre extra prima dell'inizio della gamma",
      },
      meta: { label: "Meta", description: "metadati di esecuzione del nodo" },
      metric: {
        label: "Metrico",
        description:
          "Compiti avviati, completati, falliti, watchdog-cancelled, durata, spesa di credito o incidenti",
      },
      incidentType: {
        label: "Tipo incidente",
        description:
          "Solo per gli incidenti metrici. Tutti i tipi per impostazione predefinita",
      },
    },
    taskHealth: {
      post: {
        title: "Settore",
        titleShort: "Settore",
        description:
          "Funzioni di sfondo, durate, spese di credito e incidenti di watchdog per secchio",
        fields: {
          result: {
            label: "Valore",
            description: "Valore metrico per secchio",
          },
        },
      },
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
        "Gli strumenti del Task Watchdog hanno bisogno del ruolo dell'amministratore",
    },
    notFound: {
      title: "Account o sessione non trovati",
      description: "Questo compito o incidente non esiste",
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
    nothingToDo:
      "Passare un'attività id per annullare o un incidente id per risolvere",
    taskNotRunning: "Task {{taskId}} non è in esecuzione",
    incidentNotFound: "Incident {{incidentId}} non esiste",
    invalidCap:
      "Un tappo ha bisogno di un importo non negativo e di una chiave",
  },
  success: {
    title: "Fatto",
    description: "Salvataggio",
  },
};
