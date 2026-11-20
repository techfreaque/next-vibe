import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Gestione delle campagne",
  tag: "Processore di rimbalzo",
  task: {
    description:
      "Scansione in arrivo IMAP per le notifiche di rimbalzo e aggiornamento dello stato del piombo a BOUNCED",
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
    title: "Processore di rimbalzo",
    titleShort: "Rimbalzi di processo",
    description: "E-mail di processo rimbalzo notifiche da IMAP",
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
        description:
          "Si è verificato un errore durante l'elaborazione dei rimbalzi",
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
      dryRun: {
        label: "Correre a secco",
        description: "Correre senza apportare modifiche",
      },
      batchSize: {
        label: "Dimensione della batch",
        description:
          "Numero massimo di email di rimbalzo da elaborare per eseguire",
      },
    },
    response: {
      bouncesFound: "Bounces Trovato",
      leadsUpdated: "Contatto Aggiornato",
      campaignsCancelled: "Campagne cancellate",
    },
    backButton: {
      label: "Indietro",
    },
    submitButton: {
      label: "Salva impostazioni",
      loadingText: "Salvare...",
    },
    success: {
      title: "Elaborazione di rimbalzo completata",
      description: "Notifiche di rimbalzo elaborate con successo",
    },
  },
  get: {
    title: "Ottenere Bounce Processor Config",
    titleShort: "Configimento di rimbalzo",
    description:
      "Recuperare la configurazione delle attività del processore di rimbalzo",
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
      schedule: "Pianificazione",
      priority: "Priorità",
      timeout: "Timeout",
      retries: "Ritiri",
      retryDelay: "Ritardo del reattore",
    },
    backButton: {
      label: "Indietro",
    },
    success: {
      title: "Configurazione recuperata con successo",
      description:
        "Configurazione del processore Bounce recuperata con successo",
    },
  },
  put: {
    title: "Configurazione del processore di rimbalzo",
    description:
      "Configurazione delle attività di sfondo del processore di rimbalzo",
    enabled: {
      label: "Abilitato",
      description:
        "Abilitare o disabilitare l'attività di sfondo del processore di rimbalzo",
    },
    dryRun: {
      label: "Modalità di funzionamento a secco",
      description:
        "Scansione per i rimbalzi senza aggiornare lo stato del piombo",
    },
    batchSize: {
      label: "Dimensione della batch",
      description:
        "Numero massimo di email di rimbalzo da elaborare per corsa (1–500)",
    },
    schedule: {
      label: "Pianificazione",
      description:
        "Espressione Cron per quando eseguire il processore di rimbalzo",
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
      description: "Configurazione del processore Bounce salvato con successo",
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
    title: "Configurazione del processore di rimbalzo",
    titleSaved: "Configurazione Salvataggio",
    saving: "Salvare...",
    save: "Salva impostazioni",
    guidanceTitle: "Configurare l'attività di sfondo del processore Bounce",
    guidanceDescription:
      "Abilitare o disabilitare l'attività di cron del processore di rimbalzo e configurare le impostazioni di pianificazione e batch.",
    runButton: "Correte!",
    running: "Correre...",
    done: "Fatto",
    sections: {
      general: "Generale",
      generalDescription:
        "Controlli master per consentire il compito del processore di rimbalzo e la modalità di funzionamento a secco.",
      schedule: "Pianificazione",
      scheduleDescription:
        "Impostare il programma di cron per quando i rimbalzi sono elaborati.",
      processing: "Lavorazione",
      processingDescription:
        "Configurare quante e-mail rimbalzante elaborare per eseguire.",
      advanced: "Avanzato",
      advancedDescription:
        "Impostazioni di esecuzione delle attività come priorità, timeout e comportamento di riprovazione.",
    },
  },
};
