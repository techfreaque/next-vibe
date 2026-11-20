import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Gestione delle campagne",
  tag: "Avviamento della campagna",
  task: {
    description:
      "Avviare campagne per nuovi lead passandoli allo stato PENDING",
  },
  errors: {
    server: {
      title: "Errore del server",
      description:
        "Si è verificato un errore durante l'elaborazione della richiesta di avvio della campagna",
    },
    invalidTransition:
      "Transizione di stato non valido per l'inizio della campagna",
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
    unsavedChanges: {
      title: "Modifiche non salvate",
      description: "Hai modifiche non salvate",
    },
    conflict: {
      title: "Conflitto",
      description: "I dati sono in conflitto",
    },
  },
  post: {
    title: "Avviamento della campagna",
    titleShort: "Iniziare la campagna",
    description: "Iniziare campagne per nuovi lead",
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
        description: "Si è verificato un errore durante le campagne di avvio",
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
      timezone: {
        label: "Luogo di origine",
        description: "Timezone del browser per la conversione dell'ora",
      },
      dryRun: {
        label: "Correre a secco",
        description: "Correre senza apportare modifiche",
      },
      force: {
        label: "Forza",
        description: "Bypass giorno / orario restrizioni di pianificazione",
      },
    },
    response: {
      leadsProcessed: "Contatti elaborati",
      leadsStarted: "Contatti avviati",
      leadsSkipped: "Contatti saltati",
      executionTimeMs: "Tempo di esecuzione (ms)",
      errors: "Errori",
      quotaDetails: "Quota Dettagli",
    },
    success: {
      title: "Avviamento della campagna completata",
      description: "Avviamento della campagna ha funzionato con successo",
    },
  },
  get: {
    title: "Ottieni la campagna Starter Config",
    titleShort: "Configurazione della campagna",
    description: "Recuperare la configurazione di avvio della campagna",
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
      timezone: {
        label: "Luogo di origine",
        description: "Timezone del browser per la conversione dell'ora",
      },
    },
    response: {
      dryRun: "Modalità di funzionamento a secco",
      minAgeHours: "Orario minimo di età",
      enabledDays: "Giorni di abilitazione",
      enabledHours: "Ore abilitate",
      localeConfig: "Configurazione locale",
      leadsPerWeek: "Contatti a settimana",
      schedule: "Pianificazione",
      enabled: "Abilitato",
      priority: "Priorità",
      timeout: "Timeout",
      retries: "Ritiri",
      retryDelay: "Ritardo del reattore",
    },
    success: {
      title: "Configurazione recuperata con successo",
      description: "Configurazione starter campagna recuperata con successo",
    },
  },
  put: {
    title: "Configurazione di avvio della campagna",
    description: "Configurazione di avvio della campagna di aggiornamento",
    dryRun: {
      label: "Modalità di funzionamento a secco",
      description: "Abilitare la modalità di funzionamento a secco per il test",
    },
    minAgeHours: {
      label: "Orario minimo di età",
      description: "Età minima nelle ore prima dell'elaborazione",
    },
    enabledDays: {
      label: "Giorni di abilitazione",
      description: "Giorni della settimana in cui le campagne sono abilitate",
      monday: "Lunedì",
      tuesday: "Martedì",
      wednesday: "Mercoledì",
      thursday: "Giovedì",
      friday: "Venerdì",
      saturday: "Sabato",
      sunday: "Domenica",
    },
    enabledHours: {
      label: "Ore abilitate",
      description: "Ore del giorno in cui le campagne sono abilitate",
      start: {
        label: "Orario di inizio",
        description: "Ora del giorno in cui le campagne iniziano (0-23)",
      },
      end: {
        label: "Fine dell'orario",
        description: "Ora del giorno in cui le campagne terminano (0-23)",
      },
    },
    localeConfig: {
      label: "Configurazione locale",
      description:
        "Impostazioni per-locale: conduce a settimana, giorni attivi e ore attive",
    },
    leadsPerWeek: {
      label: "Contatti a settimana",
      description: "Numero massimo di contatti a settimana",
    },
    schedule: {
      label: "Pianificazione",
      description: "Orari di esecuzione della campagna",
    },
    enabled: {
      label: "Abilitato",
      description: "Abilitare o disabilitare l'avviamento della campagna",
    },
    priority: {
      label: "Priorità",
      description: "Livello prioritario per l'esecuzione della campagna",
    },
    timeout: {
      label: "Timeout",
      description: "Valore di timeout in millisecondi",
    },
    retries: {
      label: "Ritiri",
      description: "Numero di tentativi di riprova",
    },
    retryDelay: {
      label: "Ritardo del reattore",
      description: "Ritardo tra tentativi di retry in millisecondi",
    },
    success: {
      title: "Configurazione salvata",
      description:
        "Configurazione di avvio della campagna salvata con successo",
    },
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
  widget: {
    title: "Avviamento della campagna",
    titleSaved: "Configurazione Salvataggio",
    description:
      "Avviare campagne per nuovi lead che sono pronti per essere contattati.",
    saving: "Salvare...",
    save: "Salva impostazioni",
    addLocale: "+ Aggiungi locale",
    guidanceTitle: "Configurare il Starter della campagna",
    guidanceDescription:
      "Impostare l'orario, giorni / ore attive, obiettivi di lead-per-week e le impostazioni delle attività cron.",
    runButton: "Avviare le campagne",
    running: "Correre...",
    done: "Fatto",
    perRunBudget:
      "~ {{perRunBudget}} conduce/correre · {{totalRunsPerWeek}} corre/settimana",
    perRunBudgetFractional:
      "{{exactBudget}} /run · {{totalRunsPerWeek}} corre/settimana (fractional - si accumula attraverso le piste)",
    perRunBudgetZeroHint:
      ",  aumentare i lead/settimana o ridurre la frequenza di pianificazione",
    sections: {
      general: "Generale",
      generalDescription:
        "Controlli master per consentire l'avviamento della campagna e la modalità di corsa a secco.",
      schedule: "Pianificazione",
      scheduleDescription:
        "Quando dovrebbero correre le campagne? Impostare il programma cron, giorni attivi e ore.",
      hoursTimezoneNote:
        "Ore nel vostro fuso orario del browser ({{offset}}). Conservato come UTC sul server.",
      quotas: "Quota",
      quotasDescription:
        "Quanti portano a processo a settimana, suddivisi per locale.",
      advanced: "Avanzato",
      advancedDescription:
        "Impostazioni di esecuzione delle attività come priorità, timeout e comportamento di riprovazione.",
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
  },
};
