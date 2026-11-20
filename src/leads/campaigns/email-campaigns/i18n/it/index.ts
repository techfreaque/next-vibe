import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Gestione delle campagne",
  tag: "Campagne e-mail",
  task: {
    description:
      "Inviare campagne e-mail automatizzate per i conducenti in base alla loro fase e tempi",
  },
  errors: {
    unauthorized: {
      title: "Autenticazione richiesta",
      description: "Accedi per continuare",
    },
    forbidden: {
      title: "Accesso negato",
      description: "Accesso non consentito",
    },
    validation: {
      title: "Errore di convalida",
      description: "Parametri della richiesta non validi",
    },
    server: {
      title: "Errore del server",
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
      description: "Hai modifiche non salvate",
    },
  },
  post: {
    title: "Campagne e-mail",
    titleShort: "Inviare campagne",
    description: "Elaborare campagne e-mail per i lead",
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per continuare",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Accesso non consentito",
      },
      validation: {
        title: "Errore di convalida",
        description: "Parametri della richiesta non validi",
      },
      server: {
        title: "Errore del server",
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
      notFound: { title: "Non trovato", description: "Risorsa non trovata" },
      conflict: { title: "Conflitto", description: "I dati sono in conflitto" },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
    },
    fields: {
      batchSize: {
        label: "Dimensione della batch",
        description: "Numero di contatti per lotto",
      },
      maxEmailsPerRun: {
        label: "Max Emails Per Run",
        description: "Numero massimo di e-mail da inviare per corsa",
      },
      dryRun: {
        label: "Correre a secco",
        description: "Esegui senza inviare email",
      },
    },
    response: {
      emailsScheduled: "E-mail programmate",
      emailsSent: "Inviare email",
      emailsFailed: "E-mail non accettate",
      leadsProcessed: "Contatti elaborati",
    },
    success: {
      title: "Operazione riuscita",
      description: "Operazione completata",
    },
  },
  get: {
    title: "Configurazione campagne e-mail",
    titleShort: "Configurazione della campagna email",
    description:
      "Recuperare le campagne di posta elettronica configurazione delle attività di sfondo",
    errors: {
      unauthorized: {
        title: "Autenticazione richiesta",
        description: "Accedi per continuare",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Accesso non consentito",
      },
      validation: {
        title: "Errore di convalida",
        description: "Parametri della richiesta non validi",
      },
      server: {
        title: "Errore del server",
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
      notFound: { title: "Non trovato", description: "Risorsa non trovata" },
      conflict: { title: "Conflitto", description: "I dati sono in conflitto" },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Hai modifiche non salvate",
      },
    },
    response: {
      enabled: "Abilitato",
      dryRun: "Modalità di funzionamento a secco",
      batchSize: "Dimensione della batch",
      maxEmailsPerRun: "Max Emails Per Run",
      schedule: "Pianificazione",
      priority: "Priorità",
      timeout: "Timeout",
      retries: "Ritiri",
      retryDelay: "Ritardo del reattore",
    },
    success: {
      title: "Configurazione recuperata con successo",
      description: "Configurazione campagne e-mail recuperata con successo",
    },
  },
  put: {
    title: "Configurazione delle campagne email",
    description:
      "Aggiornare la configurazione delle attività di sfondo delle campagne email",
    enabled: {
      label: "Abilitato",
      description:
        "Abilitare o disabilitare l'attività di sfondo delle campagne e-mail",
    },
    dryRun: {
      label: "Modalità di funzionamento a secco",
      description: "E-mail di processo senza inviarli",
    },
    batchSize: {
      label: "Dimensione della batch",
      description: "Numero di cavi per processo per lotto (1–100)",
    },
    maxEmailsPerRun: {
      label: "Max Emails Per Run",
      description:
        "Numero massimo di e-mail da inviare per sessione di sfondo (1–1000)",
    },
    schedule: {
      label: "Pianificazione",
      description: "Cron espressione per quando eseguire campagne e-mail",
    },
    priority: {
      label: "Priorità",
      description: "Livello prioritario per l'esecuzione delle attività",
    },
    timeout: {
      label: "Timeout (ms)",
      description: "Tempo massimo di esecuzione in millisecondi",
    },
    retries: {
      label: "Ritiri",
      description: "Numero di tentativi di riprova del fallimento",
    },
    retryDelay: {
      label: "Rettifica di ritardo (ms)",
      description: "Ritardo tra tentativi di retry in millisecondi",
    },
    success: {
      title: "Configurazione salvata",
      description: "Configurazione delle campagne e-mail salvata con successo",
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
    title: "Configurazione campagne e-mail",
    titleSaved: "Configurazione Salvataggio",
    saving: "Salvare...",
    save: "Salva impostazioni",
    guidanceTitle: "Configurare l'attività di sfondo delle campagne e-mail",
    guidanceDescription:
      "Abilitare o disabilitare l'attività e-mail campagne cron e configurare le impostazioni di pianificazione, dimensione del lotto e esecuzione.",
    runButton: "Correte!",
    running: "Correre...",
    done: "Fatto",
    sections: {
      general: "Generale",
      generalDescription:
        "Controlli master per consentire l'attività delle campagne e-mail e la modalità di esecuzione a secco.",
      schedule: "Pianificazione",
      scheduleDescription:
        "Impostare il programma cron per quando le e-mail vengono inviate.",
      processing: "Lavorazione",
      processingDescription:
        "Configurare quanti lead e-mail elaborare per ogni esecuzione.",
      advanced: "Avanzato",
      advancedDescription:
        "Impostazioni di esecuzione delle attività come priorità, timeout e comportamento di riprovazione.",
    },
  },
};
