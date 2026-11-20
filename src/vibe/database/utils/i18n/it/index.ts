import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Operazioni del database",

  dockerOperations: {
    title: "Operazioni Docker",
    description: "Eseguire i comandi Docker e gestire i container",
    category: "Docker",
    tags: {
      docker: "Docker",
      utils: "Utilità",
      dockeroperations: "Operazioni Docker",
    },
    container: {
      title: "Operazioni Docker",
      description:
        "Eseguire i comandi Docker con una corretta gestione degli errori",
    },
    fields: {
      command: {
        label: "Comando Docker",
        description: "Il comando Docker per eseguire",
        placeholder: "docker ps",
      },
      options: {
        label: "Opzioni di esecuzione",
        description: "Opzioni di configurazione per l'esecuzione dei comandi",
        placeholder: "Configurare le opzioni di timeout e registrazione",
      },
    },
    response: {
      success: {
        label: "Successo di comando",
      },
      output: {
        label: "Uscita del comando",
      },
      error: {
        label: "Dettagli di errore",
      },
    },
    errors: {
      validation: {
        title: "Errore di convalida",
        description: "Parametri di comando Invalid Docker",
      },
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Autenticazione richiesta per le operazioni Docker",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Autorizzazioni insufficienti per le operazioni Docker",
      },
      internal: {
        title: "Errore di Docker",
        description: "Esecuzione dei comandi Docker non riuscita",
      },
      timeout: {
        title: "Timeout di comando",
        description: "Il comando Docker supera il limite di timeout",
      },
      executionFailed: {
        title: "Esecuzione non riuscita",
        description: "Esecuzione dei comandi Docker non riuscita",
      },
      composeDownFailed: {
        title: "Compose Down non funziona",
        description: "Docker Compose down operazione guasto",
      },
      composeUpFailed: {
        title: "Compose Up non riuscita",
        description: "Docker Compose up operazione guasto",
      },
    },
    success: {
      title: "Comando Docker Successo",
      description: "comando Docker eseguito con successo",
    },
    messages: {
      executingCommand: "Eseguire il comando Docker: {command}",
      timeoutError:
        "Il comando Docker è in orario dopo {timeout} ms: {command}",
      commandFailed:
        "Il comando Docker non è riuscito con il codice {code}: {command}",
      executionFailed: "Non eseguito il comando Docker: {command}",
      commandError: "Errore di comando Docker: {error}",
    },
  },
  title: "Database Utils",
  titleShort: "DB Utils",
  description: "Funzioni di utilità per le operazioni di database",
  tag: "?",
  includeDetails: {
    title: "Includi dettagli",
    description: "Includere informazioni dettagliate nella risposta",
  },
  checkConnections: {
    title: "Controllare le connessioni",
    description: "Controllare lo stato della connessione del database",
  },
  status: {
    title: "Stato di salute",
  },
  timestamp: {
    title: "Timestamp",
  },
  connections: {
    title: "Stato di connessione",
    primary: "Collegamento primario",
    replica: "Collegamento Replica",
  },
  details: {
    title: "Dettagli del database",
    version: "Version",
    uptime: "Tempo di inattività (secondi)",
    activeConnections: "Connessioni attive",
    maxConnections: "Max connessioni",
  },
  errors: {
    health_check_failed:
      "Controllo della salute del database guasto: {{error}}",
    connection_failed: "La connessione del database non è riuscita: {{error}}",
    stats_failed: "Non recuperato le statistiche del database: {{error}}",
    docker_check_failed:
      "Controllo della disponibilità Docker fallito: {{error}}",
    reset_failed: "Operazione di ripristino del database fallita",
    manage_failed: "Gestione del database",
    reset_operation_failed: "Operazione di ripristino guasto",
    validation: {
      title: "Errore di convalida",
      description: "Parametri di utilità del database non valido",
    },
    unauthorized: {
      title: "Autenticazione richiesta",
      description: "Autenticazione richiesta per le utility di database",
    },
    internal: {
      title: "Errore interno",
      description: "Funzionamento di utilità di database fallito",
    },
  },
  success: {
    title: "Database Utilità Successive",
    description: "Operazioni di utilità di database completate con successo",
  },
  docker: {
    executing_command: "Eseguire il comando Docker: {{command}}",
    command_timeout:
      "Il comando Docker è in orario dopo {{timeout}} ms: {{command}}",
    command_failed:
      "Il comando Docker non è riuscito con il codice {{code}}: {{command}}",
    execution_failed: "Non eseguito il comando Docker: {{command}}",
    command_error: "Errore di comando Docker: {{error}}",
    stopping_containers: "Stoccando contenitori Docker...",
    starting_containers: "Avvio di contenitori Docker...",
  },
};
