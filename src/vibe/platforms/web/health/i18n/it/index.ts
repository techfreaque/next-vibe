import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Gestione server",

  tag: "Salute",
  get: {
    title: "Controllo della salute",
    titleShort: "Controllo della salute",
    description: "Ottieni lo stato di salute del server e la diagnostica",
    form: {
      title: "Opzioni di controllo della salute",
      description: "Configurare i parametri di controllo della salute",
    },
    fields: {
      detailed: {
        title: "Relazione dettagliata",
        description: "Includi informazioni dettagliate sul sistema",
      },
      includeDatabase: {
        title: "Includere il database",
        description: "Includi i controlli sulla salute del database",
      },
      includeTasks: {
        title: "Includere le attività",
        description: "Includi i controlli sanitari del task runner",
      },
      includeSystem: {
        title: "Includere il sistema",
        description: "Includere le informazioni sulle risorse del sistema",
      },
    },
    response: {
      status: {
        title: "Stato",
        description: "Stato della salute generale",
      },
      timestamp: {
        title: "Timestamp",
        description: "Tempo di controllo della salute",
      },
      uptime: {
        title: "Tempo di percorrenza",
        description: "Server uptime in pochi secondi",
      },
      revision: {
        title: "Commit della build",
      },
      environment: {
        title: "Ambiente",
        description: "Informazioni sull'ambiente server",
        name: {
          title: "Nome dell'ambiente",
        },
        nodeEnv: {
          title: "Node Ambiente",
        },
        platform: {
          title: "Piattaforma",
        },
        supportsTaskRunners: {
          title: "Supporti Task Runners",
        },
      },
      database: {
        title: "Stato della banca dati",
        description: "Stato di connessione del database",
        status: {
          title: "Stato di connessione",
        },
        responseTime: {
          title: "Tempo di risposta (ms)",
        },
        error: {
          title: "Messaggio di errore",
        },
      },
      tasks: {
        title: "Stato dell'attività",
        description: "Stato del corridore",
        runnerStatus: {
          title: "Stato di Runner",
        },
        activeTasks: {
          title: "Attività attive",
        },
        totalTasks: {
          title: "Compiti totali",
        },
        errors: {
          title: "Contatore di errore",
        },
        lastError: {
          title: "Ultimo errore",
        },
      },
      system: {
        title: "Informazioni sul sistema",
        description: "Informazioni sulle risorse di sistema",
        memory: {
          title: "Utilizzo della memoria",
          description: "Informazioni sulla memoria di sistema",
          used: {
            title: "Memoria usata",
          },
          total: {
            title: "Memoria totale",
          },
          percentage: {
            title: "Utilizzo della memoria %",
          },
        },
        cpu: {
          title: "Utilizzo di CPU",
          description: "Informazioni sul sistema CPU",
          usage: {
            title: "Utilizzo di CPU %",
          },
          loadAverage: {
            title: "Media del carico",
          },
        },
        disk: {
          title: "Utilizzo del disco",
          description: "Informazioni sul disco di sistema",
          available: {
            title: "Spazio disponibile",
          },
          total: {
            title: "Totale spazio",
          },
          percentage: {
            title: "Utilizzo del disco %",
          },
        },
      },
      checks: {
        title: "Controllo della salute",
        description: "Controllo sanitario dei componenti individuali",
        item: {
          title: "Controllo della salute",
          description: "Risultato del controllo sanitario individuale",
          name: {
            title: "Nome di controllo",
          },
          status: {
            title: "Controllare lo stato",
          },
          message: {
            title: "Controllare il messaggio",
          },
          duration: {
            title: "Durata (m)",
          },
        },
      },
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
      server: {
        title: "Errore del server",
        description: "Si è verificato un errore interno del server",
        checkFailed: "Controllo sanitario fallito: {{error}}",
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
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Ci sono cambiamenti non rilevati",
      },
    },
    success: {
      title: "Operazione riuscita",
      description: "Controllo della salute completato con successo",
    },
  },
};
