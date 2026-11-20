import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Sistema",
  errors: {
    repositoryInternalError: "Si è verificato un errore interno",
    fetchErrorLogs: "Non riuscito a recuperare i log di errore: {{error}}",
    updateErrorLog: "Non è possibile aggiornare lo stato del registro di errore: {{error}}",
    missingTarget: "Passare le impronte o id.",
    idNotUnique: "Id prefix {{id}} corrisponde alle righe {{count}}. Usa l'impronta digitale o l'id completo."
  },
  statusFilter: {
    all: "Tutti",
    active: "Attivo",
    resolved: "Risolto"
  },
  get: {
    title: "Log di errore",
    titleShort: "Log di errore",
    description: "Sfoglia i log degli errori backend con filtraggio e impaginazione",
    tags: {
      monitoring: "Monitoraggio"
    },
    fields: {
      status: {
        label: "Stato",
        description: "Filtra per stato risolto"
      },
      search: {
        label: "Cerca errori",
        description: "Cerca messaggi, impronte o ID di log",
        placeholder: "Cerca messaggi, impronte o ID di log"
      },
      errorType: {
        label: "Tipo di errore",
        description: "Filtra per classificazione di tipo di errore",
        placeholder: "ad es. INTERNAL_ERROR"
      },
      startDate: {
        label: "Da",
        description: "Mostra gli errori dopo questa data"
      },
      endDate: {
        label: "A",
        description: "Mostra gli errori prima di questa data"
      },
      limit: {
        label: "Limite",
        description: "Numero di risultati da restituire",
        placeholder: "50"
      },
      offset: {
        label: "Offset",
        description: "Numero di risultati per saltare",
        placeholder: "0"
      }
    },
    response: {
      logs: {
        title: "Voci di registro degli errori"
      },
      totalCount: {
        title: "Totale conteggio"
      },
      hasMore: {
        title: "Ha di più"
      },
      unresolvedCount: {
        title: "Contatore irrisolto"
      }
    },
    success: {
      title: "Log recuperati",
      description: "log di errore recuperati con successo"
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Parametri della richiesta non validi"
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per continuare"
      },
      forbidden: {
        title: "Accesso negato",
        description: "Accesso negato"
      },
      notFound: {
        title: "Non trovato",
        description: "Nessun registro trovato"
      },
      network: {
        title: "Errore di rete",
        description: "Si è verificato un errore di rete"
      },
      server: {
        title: "Errore del server",
        description: "Non riuscito a recuperare i log di errore"
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
    }
  },
  patch: {
    title: "Aggiorna il registro degli errori",
    titleShort: "Aggiorna il log",
    description: "Risolvere o riaprire un registro di errore con le impronte digitali",
    tags: {
      monitoring: "Monitoraggio"
    },
    fields: {
      fingerprint: {
        label: "Impronte per la stampa",
        description: "L'impronta del registro di errore (colonna `fingerprint` nella lista). Passa questo o id.",
        placeholder: "Inserire l'impronta digitale"
      },
      id: {
        label: "Log ID",
        description: "Il file id dalla lista (full uuid o i suoi primi 8+ caratteri). Utilizzare invece di impronte digitali.",
        placeholder: "ad es. c21bd4c7"
      },
      resolved: {
        label: "Risolto",
        description: "Impostare a vero per risolvere, falso da riaprire"
      }
    },
    response: {
      fingerprint: {
        title: "Impronte per la stampa"
      },
      resolved: {
        title: "Risolto"
      },
      affectedRows: {
        title: "Righe colpite"
      }
    },
    success: {
      title: "Aggiornamento del registro",
      description: "Stato del registro di errore aggiornato con successo"
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Parametri della richiesta non validi"
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per continuare"
      },
      forbidden: {
        title: "Accesso negato",
        description: "Accesso negato"
      },
      notFound: {
        title: "Non trovato",
        description: "Tronchi di errore non trovati"
      },
      network: {
        title: "Errore di rete",
        description: "Si è verificato un errore di rete"
      },
      server: {
        title: "Errore del server",
        description: "Non è stato possibile aggiornare il registro degli errori"
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
    }
  },
  post: {
    title: "Eseguire la scansione del monitoraggio degli errori",
    description: "Scansione di messaggi di chat e log backend per i modelli di errore",
    tags: {
      monitoring: "Monitoraggio"
    },
    response: {
      errorsFound: "Errori trovati",
      threadsScanned: "Filetti analizzati",
      scanWindowFrom: "Finestra di scansione da",
      scanWindowTo: "Scansione della finestra",
      patterns: "Modelli di errore"
    },
    success: {
      title: "Scansione completa",
      description: "Controllo di errore completato con successo"
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Richiesta non valida"
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per continuare"
      },
      forbidden: {
        title: "Accesso negato",
        description: "Accesso negato"
      },
      notFound: {
        title: "Non trovato",
        description: "Risorsa non trovata"
      },
      network: {
        title: "Errore di rete",
        description: "Si è verificato un errore di rete"
      },
      server: {
        title: "Errore del server",
        description: "Non è possibile eseguire la scansione del monitor di errore"
      },
      unknown: {
        title: "Errore sconosciuto",
        description: "Si è verificato un errore sconosciuto"
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate"
      },
      conflict: {
        title: "Conflitto",
        description: "I dati sono in conflitto"
      }
    }
  },
  errorMonitor: {
    name: "Monitor di errore",
    description: "Scansioni per modelli di errore ogni 3 ore"
  },
  widget: {
    title: "Log di errore",
    loading: "Caricamento dei registri...",
    empty: "Nessun registro di errore trovato",
    header: {
      refresh: "Aggiorna",
      runScan: "Esegui la scansione",
      back: "Indietro",
      activeCount: "attivi"
    },
    col: {
      message: "Messaggio",
      errorType: "Tipo di errore",
      occurrences: "Occurrence",
      firstSeen: "Primo Segreto",
      createdAt: "Ultimo accesso"
    },
    status: {
      active: "Attivo",
      resolved: "Risolto"
    },
    action: {
      resolve: "Risolvere",
      reopen: "Riaprire"
    },
    detail: {
      stackTrace: "Traccia di stack",
      metadata: "Metadati",
      collapse: "Colpo",
      resolved: "Risolto"
    },
    pagination: {
      info: "Pagina {{page}} di {{totalPages}} (totale {{total}})",
      prev: "Precedente",
      next: "Avanti"
    }
  }
};
