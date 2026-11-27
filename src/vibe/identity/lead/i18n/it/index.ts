import { regionalCountryNames } from "next-vibe/core/i18n/core/regions";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Contatti",
  tags: {
    leads: "Contatti",
    batch: "Batch.",
    campaigns: "Campagne",
    management: "Gestione",
    create: "Creare",
    search: "Cerca",
    export: "Esportazione",
    import: "Importazione",
    csv: "CSV",
    jobs: "Lavoro",
    list: "Elenco",
  },
  admin: {
    title: "Gestione dei lead",
    tabs: {
      overview: "Guida di navigazione",
      stats: "Panoramica",
      stats_description: "Visualizza statistiche dei lead e analisi",
      leads: "Contatti",
      leads_description: "Sfoglia e gestisci tutti i cavi",
      emails: "Campagne e-mail",
      emails_description: "Gestire campagne e-mail e modelli",
      abTesting: "Test A/B",
      abTesting_description: "Configurare le varianti di prova A/B",
      campaignStarter: "Avviamento della campagna",
      campaignStarter_description: "Configurare e avviare campagne di lead",
    },
    import: {
      label: "Importazione",
      description: "Importa i cavi dai file CSV",
    },
    emails: {
      preview: {
        error: "Non è riuscito a rendere l'anteprima email",
        live: "Anteprima dal vivo",
        actions: {
          title: "Anteprima del email",
          description: "Anteprima come l'e-mail guarderà ai destinatari",
        },
      },
      preview_title: "Anteprima del email",
      testEmail: {
        button: "Inviare la prova",
      },
      from: "Da",
      recipient: "Recipiente",
      subject: "Oggetto",
      email_preview: "Anteprima del email",
      stage_of: "di",
      stages: "fasi delle fasi",
      journey: "Viaggio",
      back: "Indietro",
      previous: "Precedente",
      next: "Avanti",
    },
  },
  auth: {
    public: {
      validCookie: "Concorso cookie valido trovato",
      invalidCookie: "Guida di cookie non valido",
      created: "Anonimo contatto creato",
      error: "Errore in pubblico auth",
    },
    authenticated: {
      primaryFound: "Guida primaria trovata per utente",
      noPrimary: "Nessun contatto primario trovato per l'utente",
      error: "Errore nel contatto autenticato auth",
    },
    link: {
      alreadyExists: "Il link di contatto esiste già",
      created: "Link di contatto creato",
      error: "Guida di collegamento degli errori",
    },
    validate: {
      error: "Guida di convalida degli errori",
    },
    getOrCreate: {
      invalid: "Contatto non valido ID",
      error: "Errore di ottenere o creare contatto",
    },
    create: {
      existingFound: "Esiste un contatto anonimo trovato",
      success: "Lead creato con successo",
      error: "Guida alla creazione di errori",
    },
    createForUser: {
      success: "Contatto creato per l'utente",
      error: "Guida alla creazione di errori per l'utente",
    },
    cookie: {
      set: "Set cookie di contatto",
      error: "Impostazione errore cookie di contatto",
    },
    getUserLeads: {
      error: "Errore di ottenere i contatti utente",
    },
    linkLeads: {
      sameId: "Il collegamento non può portare a se stesso",
      alreadyExists: "Il link di contatto esiste già",
      created: "Contatto collegati con successo",
      error: "Guida di collegamento degli errori",
    },
    getLinkedLeads: {
      error: "Errori di ottenere cavi collegati",
    },
    getAllLinkedLeads: {
      error: "Errore di ottenere tutti i cavi collegati",
    },
  },
  errors: {
    cannotLinkLeadToItself: "Il collegamento non può portare a se stesso",
    linkFailed: "Non è riuscito a collegare i cavi",
  },
  filters: {
    search: {
      label: "Cerca",
      description: "Ricerca conduce per e-mail o nome commerciale",
      placeholder: "Inserisci e-mail o nome di affari...",
    },
    status: {
      label: "Stato",
      description: "Filtra per stato di contatto",
      placeholder: "Tutti gli stati",
    },
    currentCampaignStage: {
      label: "Fase di campagna",
      description: "Filtra per la fase della campagna email",
      placeholder: "Tutte le fasi",
    },
    source: {
      label: "Fonte",
      description: "Filtra per fonte di contatto",
      placeholder: "Tutte le fonti",
    },
    country: {
      label: "Regione della lingua",
      description: "Filtra per la regione della lingua scelta sul sito",
      placeholder: "Tutte le regioni",
    },
    language: {
      label: "Lingua",
      description: "Filtra per lingua",
      placeholder: "Tutte le lingue",
    },
    sortBy: {
      label: "Ordina per",
      description: "Scegli il campo da ordinare",
      placeholder: "Ordinare il campo",
    },
    sortOrder: {
      label: "Ordinare",
      description: "Ordinare ascendente o discesa",
      placeholder: "Ordine ordinario",
    },
    statusFilters: {
      title: "Stato e filtri per la campagna",
      description: "Filtra per stato, fase di campagna e fonte",
    },
    locationFilters: {
      title: "Filtri di posizione",
      description: "Filtra per paese e lingua",
    },
    sortingOptions: {
      title: "Opzioni di selezione",
      description: "Configurare l'ordine ordinario",
    },
  },
  batch: {
    category: "Contatti",
    tags: {
      leads: "Contatti",
      batch: "Batch.",
    },

    patch: {
      title: "Aggiornamento Batch",
      description: "L'aggiornamento di Batch si basa sui criteri di filtro",
      form: {
        title: "Configurazione di aggiornamento batch",
        description: "Configurare i parametri di aggiornamento batch",
      },
      search: {
        label: "Cerca",
        description: "Ricerca conduce per e-mail o nome commerciale",
        placeholder: "Inserisci e-mail o nome commerciale",
      },
      status: {
        label: "Filtro di stato",
        description: "Filtra i cavi per lo stato corrente",
      },
      currentCampaignStage: {
        label: "Filtro della fase di campagna",
        description: "Filtro conduce dalla fase di campagna corrente",
      },
      source: {
        label: "Filtro sorgente",
        description: "Filtro conduce per fonte",
      },
      scope: {
        label: "Campo d'azione",
        description: "Definire la portata dell'operazione batch",
      },
      dryRun: {
        label: "Correre a secco",
        description: "Anteprima modifiche senza applicarle",
      },
      maxRecords: {
        label: "Max Records",
        description: "Numero massimo di record da elaborare",
      },
      updates: {
        title: "Campi di aggiornamento",
        description: "Specificare quali campi da aggiornare",
        status: {
          label: "Nuovo stato",
          description: "Aggiornare lo stato di contatto a questo valore",
        },
        currentCampaignStage: {
          label: "Nuova fase della campagna",
          description: "Aggiornare la fase della campagna a questo valore",
        },
        source: {
          label: "Nuova fonte",
          description: "Aggiornare la fonte di contatto a questo valore",
        },
        notes: {
          label: "Osservazioni",
          description: "Aggiungi o aggiorna le note per il contatto",
        },
      },
      response: {
        title: "Risposta dell'aggiornamento",
        description: "Dati di risposta di aggiornamento Batch",
        success: "Operazione riuscita",
        totalMatched: "Totale abbinato",
        totalProcessed: "Totale processato",
        totalUpdated: "Totale aggiornato",
        preview: "Anteprima",
        errors: "Errori",
      },
      errors: {
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Autenticazione richiesta per operazioni batch",
        },
        validation: {
          title: "Errore di convalida",
          description:
            "Parametri di richiesta non validi per l'aggiornamento batch",
        },
        server: {
          title: "Errore del server",
          description:
            "Errore del server interno si è verificato durante l'aggiornamento batch",
        },
        unknown: {
          title: "Errore sconosciuto",
          description:
            "Un errore sconosciuto si è verificato durante l'aggiornamento batch",
        },
        network: {
          title: "Errore di rete",
          description:
            "Errore di rete si è verificato durante l'aggiornamento batch",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Accesso vietato per operazioni batch",
        },
        notFound: {
          title: "Non trovato",
          description: "Risorse non trovate per l'aggiornamento batch",
        },
        conflict: {
          title: "Conflitto",
          description:
            "Il conflitto di dati si è verificato durante l'aggiornamento batch",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Ci sono modifiche non salvate nell'aggiornamento batch",
        },
      },
      success: {
        title: "Aggiornamento del successo",
        description:
          "Funzionamento di aggiornamento batch completato con successo",
      },
    },
    delete: {
      title: "Batch Elimina",
      description: "Batch elimina i cavi in base ai criteri di filtro",
      form: {
        title: "Batch Elimina configurazione",
        description: "Configurare i parametri di eliminazione batch",
      },
      search: {
        label: "Cerca",
        description: "Ricerca conduce per e-mail o nome commerciale",
      },
      status: {
        label: "Filtro di stato",
        description: "Filtra i cavi per lo stato corrente",
      },
      confirmDelete: {
        label: "Conferma Cancella",
        description: "Confermare che si desidera eliminare i lead selezionati",
      },
      dryRun: {
        label: "Correre a secco",
        description:
          "Cancellazioni di anteprima senza effettivamente rimuovere i record",
      },
      maxRecords: {
        label: "Max Records",
        description: "Numero massimo di record da eliminare",
      },
      response: {
        title: "Eliminare la risposta",
        description: "Batch cancellare i dati di risposta",
        success: "Operazione riuscita",
        totalMatched: "Totale abbinato",
        totalProcessed: "Totale processato",
        totalDeleted: "Totale cancellato",
        preview: "Anteprima",
        errors: "Errori",
      },
      errors: {
        unauthorized: {
          title: "Autenticazione richiesta",
          description:
            "Autenticazione richiesta per operazioni di eliminazione batch",
        },
        validation: {
          title: "Errore di convalida",
          description:
            "Parametri di richiesta non validi per la cancellazione del lotto",
        },
        server: {
          title: "Errore del server",
          description:
            "Errore del server interno si è verificato durante l'eliminazione batch",
        },
        unknown: {
          title: "Errore sconosciuto",
          description:
            "Un errore sconosciuto si è verificato durante l'eliminazione del lotto",
        },
        network: {
          title: "Errore di rete",
          description:
            "Errore di rete si è verificato durante l'eliminazione batch",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Accesso vietato per operazioni di eliminazione batch",
        },
        notFound: {
          title: "Non trovato",
          description: "Risorse non trovata per lotto cancellare",
        },
        conflict: {
          title: "Conflitto",
          description:
            "Il conflitto di dati si è verificato durante l'eliminazione batch",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Ci sono modifiche non salvate nel lotto eliminare",
        },
      },
      success: {
        title: "Eliminare il successo",
        description:
          "operazione di cancellazione Batch completata con successo",
      },
    },
    widget: {
      update: {
        headerTitle: "Aggiornamento batch",
        emptyStateTitle: "Aggiornamento batch",
        emptyStateDescription:
          "Applicare un aggiornamento del campo a molti lead in una volta basato su criteri di filtro. Uso",
        emptyStateDescriptionStrong: "Correre a secco",
        emptyStateDescriptionSuffix:
          "a anteprima che conduce sarà influenzato prima di commettere modifiche.",
        emptyStateTip1:
          "Impostare filtri e fare clic su Invia per eseguire un'anteprima a secco prima",
        emptyStateTip2:
          "Deseleziona Dry Run per applicare le modifiche per reale",
        highVolumeTitle: "Grande lotto: {{count}} porta abbinati",
        highVolumeDescription:
          "Ciò influenzerà un gran numero di record. Verificare attentamente l'anteprima prima di disabilitare Dry Run e presentarsi per reale.",
        partialBatchTitle: "lotto parziale elaborato",
        partialBatchDescription:
          "{{processed}} di {{matched}} sono stati elaborati i cavi corrispondenti. Aumentare Max Records o eseguire di nuovo per elaborare di più.",
        successTitle: "Operazione di Batch completata",
        failureTitle: "operazione di Batch fallito",
        statMatched: "Corrispondenza",
        statProcessed: "Elaborazione",
        statUpdated: "Aggiornato",
        btnRunAgain: "Correre di nuovo",
        btnViewAllAffected: "Visualizza tutti i Contatti interessati",
        btnViewInList: "Visualizza in Lista",
        dryRunPreviewTitle:
          "Anteprima di corsa a secco (i cavi {{count}} sarebbero colpiti)",
        leadFallback: "Contatto {{number}}",
        errorsTitle: "Errore(i) {{count}}",
        errorRow: "Contatto {{leadId}}: {{error}}",
        sectionFilter: "Criteri di filtro",
        sectionUpdates: "Campi di aggiornamento",
        sectionSettings: "Impostazioni di funzionamento",
        activeFiltersLabel: "Filtri attivi dall'elenco (preriempiti)",
        filterSearch: "Cerca",
        submitButton: "Applicare aggiornamenti",
        submitButtonLoading: "Applicare...",
      },
      delete: {
        headerTitle: "Batch Elimina Contatto",
        warningTitle:
          "Avvertenza: {{count}} lead verrà cancellato definitivamente",
        warningTitlePlural:
          "Avvertenza: i cavi {{count}} verranno eliminati in modo permanente",
        warningDescription:
          "Questa azione non può essere annullata. Tutti i dati per i cavi corrispondenti verranno rimossi in modo permanente. Disabilita Dry Run e conferma di procedere.",
        successTitle: "Cancellazione completata",
        failureTitle: "Il fallimento della cancellazione",
        statMatched: "Corrispondenza",
        statDeleted: "Cancellato",
        btnRunAgain: "Correre di nuovo",
        btnViewRemainingLeads: "Visualizzare i comandi rimanenti",
        previewTitle: "I cavi {{count}} verranno eliminati in modo permanente",
        leadFallback: "Contatto {{number}}",
        errorRow: "Contatto {{leadId}}: {{error}}",
        sectionFilter: "Criteri di filtro",
        sectionSettings: "Elimina impostazioni",
        activeFiltersLabel: "Filtri attivi dall'elenco (preriempiti)",
        filterSearch: "Cerca",
        submitButton: "Eliminare i lead",
        submitButtonLoading: "Deleting...",
      },
    },
    enums: {
      batchOperationScope: {
        currentPage: "Pagina corrente",
        allPages: "Tutte le pagine",
      },
      leadStatus: {
        new: "Nuovo",
        pending: "Finanziamenti",
        campaignRunning: "Campagna in corso",
        websiteUser: "Utente del Sito",
        newsletterSubscriber: "Iscriviti alla newsletter",
        inContact: "In contatto",
        signedUp: "Firmato",
        subscriptionConfirmed: "Abbonamento Confermato",
        unsubscribed: "Iscrizione annullata",
        bounced: "Bounce",
        invalid: "Non valido",
      },
      emailCampaignStage: {
        notStarted: "Non iniziato",
        initial: "Contatto iniziale",
        followup1: "Seguito 1",
        followup2: "Seguito 2",
        followup3: "Seguito 3",
        nurture: "Nurture",
        reactivation: "Riattivazione",
      },
      leadSource: {
        website: "Sito web",
        socialMedia: "Social Media",
        emailCampaign: "Campagna di email",
        referral: "Inviti",
        csvImport: "Importazione di CSV",
      },
    },
    email: {
      admin: {
        batchUpdate: {
          title: "Aggiornamento batch completo",
          subject: "Risultati di aggiornamento Batch",
          preview: "I cavi {{totalProcessed}} sono stati elaborati",
          message:
            "L'operazione di aggiornamento batch è completata con {{totalProcessed}} conduce elaborati.",
          operationSummary: "Riepilogo delle operazioni",
          totalMatched: "Totale abbinato",
          totalProcessed: "Totale processato",
          totalUpdated: "Totale aggiornato",
          errors: "Errori",
          dryRunNote:
            "Questa era una corsa a secco - non sono state apportate modifiche effettive.",
          viewLeads: "Visualizza Contatto Aggiornato",
          error: {
            noData: "Nessun dato di aggiornamento batch disponibile",
          },
        },
        batchDelete: {
          title: "Batch Eliminare Completa",
          subject: "Eliminare i risultati",
          preview:
            "I cavi {{totalProcessed}} sono stati elaborati per la cancellazione",
          message:
            "L'operazione di eliminazione batch è completata con {{totalProcessed}} conduce elaborati.",
          operationSummary: "Riepilogo delle operazioni",
          totalMatched: "Totale abbinato",
          totalProcessed: "Totale processato",
          totalDeleted: "Totale cancellato",
          errors: "Errori",
          dryRunNote:
            "Questa era una pista asciutta - non sono state fatte delle cancellazioni reali.",
          viewLeads: "Visualizza Contatto",
          error: {
            noData: "Nessun lotto elimina i dati disponibili",
          },
        },
      },
      error: {
        general: {
          internal_server_error: "Si è verificato un errore del server interno",
        },
      },
    },
  },
  campaigns: {
    category: "Gestione delle campagne",
    tags: {
      campaigns: "Campagne",
      management: "Gestione",
    },
    campaignStarter: {
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
            description:
              "Si è verificato un errore durante le campagne di avvio",
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
          leadsProcessed: "Contatto lavorati",
          leadsStarted: "Contatto Iniziato",
          leadsSkipped: "Contatto saltato",
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
          leadsPerWeek: "Contatto per settimana",
          schedule: "Pianificazione",
          enabled: "Abilitato",
          priority: "Priorità",
          timeout: "Timeout",
          retries: "Ritiri",
          retryDelay: "Ritardo del reattore",
        },
        success: {
          title: "Configurazione recuperata con successo",
          description:
            "Configurazione starter campagna recuperata con successo",
        },
      },
      put: {
        title: "Configurazione di avvio della campagna",
        description: "Configurazione di avvio della campagna di aggiornamento",
        dryRun: {
          label: "Modalità di funzionamento a secco",
          description:
            "Abilitare la modalità di funzionamento a secco per il test",
        },
        minAgeHours: {
          label: "Orario minimo di età",
          description: "Età minima nelle ore prima dell'elaborazione",
        },
        enabledDays: {
          label: "Giorni di abilitazione",
          description:
            "Giorni della settimana in cui le campagne sono abilitate",
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
          label: "Contatto per settimana",
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
    },
    emailCampaigns: {
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
          leadsProcessed: "Contatto lavorati",
        },
        success: {
          title: "Operazione riuscita",
          description: "Operazione completata",
        },
      },
      get: {
        title: "Configurazione campagne e-mail",
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
          description:
            "Configurazione delle campagne e-mail salvata con successo",
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
    },
    emails: {
      common: {
        logoPart1: "Avanti",
        logoPart2: "Vibe",
      },
      email: {
        template: {
          tagline: "Costruisci prodotti migliori più velocemente",
        },
      },
      emailJourneys: {
        components: {
          footer: {
            copyright: "© 2024 {{appName}}. Tutti i diritti riservati.",
            helpText:
              "Se avete domande, si prega di contattarci a {{config.emails.support}}",
            unsubscribeText: "Preferisci non ricevere queste email?",
            unsubscribeLink: "Disiscriviti",
          },
          socialProof: {
            quotePrefix: "201C",
            quoteSuffix: "201D",
            attribution: ",  Nome del cliente, Azienda",
          },
        },
      },
      journeys: {
        emailJourneys: {
          components: {
            defaults: {
              signatureName: "Un altro utente unbottled.ai",
              previewLeadId: "anteprima-lead-id",
              previewEmail: "preview@example.com",
              previewBusinessName: "Corda d'acme",
              previewContactName: "Anteprima utente",
              previewPhone: "+1234567890",
              previewCampaignId: "anteprima-campaign-id",
            },
            footer: {
              unsubscribeText:
                "Lo stai ricevendo perche' hai optato per l'ingresso.",
              unsubscribeLink: "Disiscriviti",
            },
            journeyInfo: {
              uncensoredConvert: {
                name: "Conversione ai modelli senza censura",
                description:
                  "Un appassionato che condivide la loro scoperta di unbottled.ai",
                longDescription:
                  "Persona Enthusiast che condivide una vera scoperta con la trasparenza della filiale",
                characteristics: {
                  tone: "Tono casuale, cospiratorio",
                  story: "Storia personale genuina",
                  transparency: "Trasparenza dell'affiliazione",
                  angle: "Angolazione anti-censura",
                  energy: "Energia coinvolgente",
                },
              },
              sideHustle: {
                name: "Hustle laterali",
                description:
                  "Un trasparente affiliazione condivisione casi di uso reale",
                longDescription:
                  "Trasparente affiliazione marketer condivisione reali casi di uso settimanale",
                characteristics: {
                  disclosure:
                    "La divulgazione completa di affiliazione in anticipo",
                  updates: "Aggiornamenti settimanali del caso di utilizzo",
                  income: "Storia del reddito passivo",
                  proof: "Prova pratica, non hype",
                  energy: "Onesta energia",
                },
              },
              quietRecommendation: {
                name: "Raccomandazioni silenziose",
                description:
                  "Un professionista di basso livello che passa lungo uno strumento testato",
                longDescription:
                  "Professionista di basso livello che passa lungo uno strumento testato per settimane",
                characteristics: {
                  signal: "Breve, alto segnale a rumore",
                  specifics: "Niente hype, solo specifiche",
                  testing: "Backstory di test di 3 settimane",
                  comparison: "Confronto onesto con ChatGPT",
                  affiliate: "Minimal affiliato menzione",
                },
              },
              signupNurture: {
                name: "Nurture di iscrizione",
                description: "Sequenza di bordo per gli utenti appena firmati",
                longDescription:
                  "E-mail di benvenuto e onboarding che aiutano i nuovi utenti a iniziare con la piattaforma",
              },
              retention: {
                name: "Retenzione",
                description: "Re-engagement per gli abbonati esistenti",
                longDescription:
                  "E-mail basate sul valore per mantenere gli abbonati attivi impegnati ed esplorare le funzionalità",
              },
              winback: {
                name: "Winback",
                description: "Vinci utenti inattivi o ridacchiati",
                longDescription:
                  "Campagna di riattivazione che mira gli utenti che sono andati in silenzio o annullati",
              },
              newsletterMay2026: {
                name: "Newsletter maggio 2026",
                description:
                  "Una newsletter su Cortex, Dreamer, Autopilota e generazione media",
                longDescription:
                  "Maggio 2026 prodotto aggiornamento newsletter inviato a tutti gli utenti firmati con onesto bug ammissione e caratteristiche evidenzia",
              },
              newsletterNov2026: {
                name: "Newsletter Novembre 2026",
                description:
                  "newsletter di riattivazione one-off: un compagno dalla tua parte, il tuo filtro e un default più economico",
                longDescription:
                  "Novembre 2026 newsletter di conversione inviata a newsletter consentita opt-ins, che conduce con il compagno ethos e il modello predefinito più economico",
              },
            },
          },
        },
      },
      services: {
        scheduler: {
          cancelledBySystem: "Cancellato da sistema",
        },
        abTesting: {
          invalidWeights: "Totale dei pesi varianti deve essere uguale al 100%",
          negativeWeight: "Il peso variabile deve essere positivo",
        },
        post: {
          title: "Servizi",
          description: "Servizi endpoint",
          form: {
            title: "Configurazione dei servizi",
            description: "Configurare i parametri dei servizi",
          },
          response: {
            title: "Risposta",
            description: "Dati di risposta dei servizi",
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
          },
          success: {
            title: "Operazione riuscita",
            description: "Operazione completata",
          },
        },
      },
      testMail: {
        category: "Contatti",
        tags: {
          campaigns: "Campagne",
          leads: "Contatti",
        },
        post: {
          title: "Test Mail",
          description: "Invia email di prova con dati personalizzati di piombo",
          form: {
            title: "Configurazione di posta di prova",
            description:
              "Configurare i parametri della posta di prova e i dati di piombo",
          },
          campaignType: {
            label: "Tipo di campagna",
            description: "Tipo di campagna email",
            placeholder: "Inserisci il tipo di campagna",
          },
          emailJourneyVariant: {
            label: "Variante di viaggio email",
            description: "A/B variante di prova per il viaggio e-mail",
            placeholder: "Selezionare la variante del viaggio",
          },
          emailCampaignStage: {
            label: "Fase della campagna e-mail",
            description: "La fase attuale della campagna email",
            placeholder: "Selezionare la fase della campagna",
          },
          testEmail: {
            label: "Test Indirizzo e-mail",
            description: "Indirizzo e-mail per inviare la posta di prova a",
            placeholder: "test@example.com",
          },
          leadData: {
            title: "Dati di piombo",
            description: "Informazioni di piombo per il rendering dei modelli",
            businessName: {
              label: "Nome di affari",
              description: "Nome del business",
              placeholder: "Acme Corporation",
            },
            contactName: {
              label: "Nome di contatto",
              description: "Nome della persona di contatto",
              placeholder: "John Doe",
            },
            website: {
              label: "Sito web",
              description: "Sito web della Società URL",
              placeholder: "https://example.com",
            },
            country: {
              label: "Paese",
              description: "Codice paese",
              placeholder: "GLOBAL",
            },
            language: {
              label: "Lingua",
              description: "Preferito codice di lingua",
              placeholder: "E' un piacere.",
            },
            status: {
              label: "Stato",
              description: "Stato di piombo",
              placeholder: "NEW",
            },
            source: {
              label: "Fonte",
              description: "Fonte di piombo",
              placeholder: "WEBSITE",
            },
            notes: {
              label: "Osservazioni",
              description: "Note aggiuntive sul piombo",
              placeholder: "Inserire eventuali note aggiuntive",
            },
          },
          response: {
            title: "Risultato email di prova",
            description: "Risultato dell'invio di email di prova",
            success: {
              content: "Operazione riuscita",
            },
            messageId: {
              content: "Messaggio ID",
            },
            testEmail: {
              content: "Test Email",
            },
            subject: {
              content: "Oggetto e-mail",
            },
            sentAt: {
              content: "Inviato a",
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
            unsavedChanges: {
              title: "Modifiche non salvate",
              description: "Ci sono cambiamenti non rilevati",
            },
            conflict: {
              title: "Conflitto",
              description: "I dati sono in conflitto",
            },
            templateNotFound: {
              title: "Template Non trovato",
              description:
                "Modello di e-mail non trovato per parametri specificati",
            },
            sendingFailed: {
              title: "Invio non corretto",
              description: "Non ha inviato email di prova",
            },
          },
          success: {
            title: "Operazione riuscita",
            description: "E-mail di prova inviata con successo",
          },
          selectionCriteria: "Criteri di selezione SMTP",
          widget: {
            title: "Inviare la prova",
            send: "Inviare la prova",
            sending: "Invio in corso…",
            successMessage: "E-mail di prova inviata con successo",
            sentTo: "Inviato a: ",
            subject: "Oggetto: ",
            sentAt: "Inviato a: ",
            campaignConfig: "Configurazione della campagna",
            sendAnother: "Invia un'altra",
          },
        },
      },
    },
  },
  create: {
    category: "Contatti",
    tags: {
      leads: "Contatti",
      create: "Creare",
    },

    enums: {
      leadSource: {
        website: "Sito web",
        socialMedia: "Social Media",
        emailCampaign: "Campagna di email",
        referral: "Inviti",
        csvImport: "Importazione di CSV",
      },
    },
    widget: {
      headerLeadCreated: "Contatto creato",
      headerCreateLead: "Crea contatto",
      subheaderFillDetails: "Compila i dettagli qui sotto",
      fallbackLeadName: "Contatto",
      buttonCopyId: "Copia ID",
      buttonViewLead: "Visualizza contatto",
      buttonEditLead: "Modifica contatto",
      buttonBackToList: "Torna alla lista",
    },
    post: {
      title: "Crea contatto",
      description: "Creare un nuovo vantaggio nel sistema",
      backButton: {
        label: "Ritorno a Contatto",
      },
      submitButton: {
        label: "Crea contatto",
        loadingText: "Creazione di contatto...",
      },
      form: {
        title: "Nuovo modulo di contatto",
        description:
          "Inserire le informazioni di contatto per creare un nuovo lead",
      },
      contactInfo: {
        title: "Informazioni di contatto",
        description: "Dettagli di contatto primario per il contatto",
      },
      email: {
        label: "Indirizzo email",
        description: "Indirizzo email primario per la comunicazione",
        placeholder: "john@example.com",
      },
      businessName: {
        label: "Nome di affari",
        description: "Nome dell'azienda o del business",
        placeholder: "Esempio Corp",
      },
      phone: {
        label: "Numero di telefono",
        description: "Contatto numero di telefono con codice paese",
        placeholder: "+1234567890",
      },
      website: {
        label: "Sito web",
        description: "Sito web della Società URL",
        placeholder: "https://example.com",
      },
      locationPreferences: {
        title: "Location & Preferences",
        description: "Preferenze geografiche e linguistiche",
      },
      country: {
        label: "Paese",
        description: "Localizzazione aziendale o mercato target",
        placeholder: "Seleziona un paese",
      },
      language: {
        label: "Lingua",
        description: "Lingua di comunicazione preferenziale",
        placeholder: "Seleziona una lingua",
      },
      leadDetails: {
        title: "Dettagli del contatto",
        description: "Ulteriori informazioni sul contatto",
      },
      source: {
        label: "Origine del contatto",
        description: "Come è stato acquisito il contatto",
        placeholder: "Selezionare la sorgente",
      },
      notes: {
        label: "Osservazioni",
        description: "Note o commenti aggiuntivi",
        placeholder: "Inserisci qualsiasi informazione aggiuntiva...",
      },
      response: {
        title: "Creato Contatto",
        description: "Dettagli del contatto appena creato",
        summary: {
          title: "Sommario del contatto",
          id: "ID del contatto",
          businessName: "Nome di affari",
          email: "Indirizzo email",
          status: "Stato del contatto",
        },
        contactDetails: {
          title: "Dettagli di contatto",
          phone: "Numero di telefono",
          website: "Sito web URL",
          country: "Paese",
          language: "Lingua",
        },
        trackingInfo: {
          title: "Informazioni di tracciamento",
          source: "Origine del contatto",
          emailsSent: "Contatore di posta elettronica",
          currentCampaignStage: "Fase di campagna",
        },
        metadata: {
          title: "Metadati",
          notes: "Osservazioni",
          createdAt: "Data di creazione",
          updatedAt: "Ultimo aggiornamento",
        },
      },
      errors: {
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Autenticazione necessaria per creare cavi",
        },
        validation: {
          title: "Errore di convalida",
          description: "Informazioni di contatto non valide fornite",
        },
        server: {
          title: "Errore del server",
          description:
            "Errore del server interno si è verificato durante la creazione di contatto",
        },
        unknown: {
          title: "Errore sconosciuto",
          description:
            "Un errore sconosciuto si è verificato durante la creazione di contatto",
        },
        network: {
          title: "Errore di rete",
          description:
            "Errore di rete si è verificato durante la creazione di contatto",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Accesso vietato per la creazione di contatto",
        },
        notFound: {
          title: "Non trovato",
          description:
            "risorsa necessaria non trovata per la creazione di contatto",
        },
        conflict: {
          title: "Conflitto",
          description:
            "Contatto già esiste o conflitto di dati si è verificato",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Ci sono cambiamenti non salvati nel modulo di contatto",
        },
      },
      success: {
        title: "Contatto creato",
        description: "Lead creato con successo",
      },
    },
    email: {
      welcome: {
        subject: "Benvenuti a {{companyName}}",
        title: "Benvenuto a {{companyName}}, {{businessName}}!",
        preview: "Benvenuto. Ecco come iniziare.",
        greeting:
          "Benvenuto a {{companyName}}, {{businessName}}! E' bello averti.",
        defaultName: "là.",
        introduction:
          "Grazie per il vostro interesse. I tuoi dati ci hanno contattato, e una persona reale li legge.",
        nextSteps: {
          title: "Cosa succede dopo?",
          step1Number: "1.",
          step1:
            "Inizia a chattare subito. Niente installazione, niente carta.",
          step2Number: "2.",
          step2: "Domande? Rispondi a questa email. Un umano lo legge.",
          step3Number: "3.",
          step3: "Rispondiamo appena possibile.",
        },
        cta: {
          getStarted: "Iniziare a chattare",
        },
        support:
          "Hai delle domande? Rispondi a questa e-mail o contattaci a {{supportEmail}}",
        error: {
          noEmail:
            "Non può inviare email di benvenuto - nessun indirizzo email fornito",
        },
      },
      admin: {
        newLead: {
          subject: "Nuovo Contatto: {{businessName}}",
          title: "Nuovo contatto creato",
          preview: "Nuovo vantaggio da {{businessName}} richiede il follow-up",
          message:
            "Un nuovo vantaggio è stato creato nel sistema da {{businessName}} e richiede la vostra attenzione.",
          leadDetails: "Dettagli del contatto",
          businessName: "Nome di affari",
          email: "Email",
          phone: "Telefono",
          website: "Sito web",
          source: "Fonte",
          status: "Stato",
          notes: "Osservazioni",
          notProvided: "Non fornito",
          viewLead: "Visualizza dettagli di contatto",
          viewAllLeads: "Visualizza tutti i Contatti",
          error: {
            noData:
              "Non può inviare la notifica di amministratore - nessun dato di contatto fornito",
          },
          defaultName: "Nuovo contatto",
        },
      },
      error: {
        general: {
          internal_server_error: "Si è verificato un errore del server interno",
        },
      },
    },
  },
  export: {
    category: "Contatti",
    tags: {
      leads: "Contatti",
      export: "Esportazione",
    },

    get: {
      title: "Esportazione Contatto",
      description: "L'esportazione porta i dati a file",
      form: {
        title: "Configurazione dell'esportazione",
        description:
          "Configurare i parametri di esportazione del contatto e i filtri",
      },
      format: {
        label: "Formato dell'esportazione",
        description: "Formato file per l'esportazione",
      },
      status: {
        label: "Stato del contatto",
        description: "Filtra per stato di contatto",
      },
      country: {
        label: "Paese",
        description: "Filtra per paese",
        placeholder: "Seleziona il paese",
      },
      language: {
        label: "Lingua",
        description: "Filtra per lingua",
        placeholder: "Seleziona la lingua",
      },
      source: {
        label: "Origine del contatto",
        description: "Filtra per fonte di contatto",
        placeholder: "Selezionare la sorgente",
      },
      search: {
        label: "Cerca",
        description: "La ricerca porta per testo",
        placeholder: "La ricerca porta...",
      },
      dateFrom: {
        label: "Data di inizio",
        description: "Esportazioni di cavi creati da questa data",
      },
      dateTo: {
        label: "Data di fine",
        description: "Export lead creati fino a questa data",
      },
      includeMetadata: {
        label: "Includere i metadati",
        description: "Includere la creazione e aggiornare i timestamp",
      },
      includeEngagementData: {
        label: "Includi i dati di coinvolgimento",
        description: "Includi il tracciamento e-mail e i dati della campagna",
      },
      response: {
        title: "Esporta file",
        description: "File di esportazione generato con i dati di contatto",
        fileName: "Nome del file",
        fileContent: "Contenuti file (Base64)",
        mimeType: "Tipo MIME",
        totalRecords: "Totale record",
        exportedAt: "Esportato a",
      },
      errors: {
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Autenticazione necessaria per esportare i cavi",
        },
        validation: {
          title: "Errore di convalida",
          description: "Parametri o filtri di esportazione non validi",
        },
        server: {
          title: "Errore del server",
          description:
            "Errore del server interno è avvenuto durante l'esportazione",
        },
        unknown: {
          title: "Errore sconosciuto",
          description:
            "Un errore sconosciuto si è verificato durante l'esportazione",
        },
        network: {
          title: "Errore di rete",
          description: "Errore di rete si è verificato durante l'esportazione",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Accesso vietato all'esportazione di contatto",
        },
        notFound: {
          title: "Nessun dato",
          description:
            "Nessun indizio trovato corrispondenti criteri di esportazione",
        },
        conflict: {
          title: "Conflitto",
          description:
            "Il conflitto di dati si è verificato durante l'esportazione",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description:
            "Ci sono cambiamenti non rilevati nel modulo di esportazione",
        },
      },
      success: {
        title: "Esportazione completa",
        description: "Esportazione di contatto completata con successo",
      },
    },
    widget: {
      exportLeads: "Esportazione Contatto",
      import: "Importazione",
      viewList: "Visualizza elenco",
      importLeadsTitle: "Importazione Contatto",
      viewLeadsListTitle: "Visualizza elenco dei lead",
      copyCsvTitle: "Copiare il contenuto CSV per la clipboard",
      generatingExport: "Generando esportazione...",
      generatingExportHint:
        "Ciò può richiedere un momento per grandi set di dati",
      exportReady: "Esportazione",
      fileReadyToDownload: "Il tuo file è pronto per il download",
      records: "Records",
      format: "Format",
      fileSize: "Dimensione del file",
      copied: "Copiato!",
      copy: "Copia",
      download: "Scarica",
      exportedAt: "Esportato a:",
      nextSteps: "Prossimo passo:",
      viewLeads: "Visualizza Contatto",
      importLeads: "Importazione Contatto",
      configureExport: "Configurare l'esportazione",
      configureExportHint:
        "Seleziona il formato e i filtri qui sotto, quindi fai clic su Esporta per generare il tuo file",
      formatLabel: "Format",
      formatHint: "Scegliere CSV o Excel (XLSX)",
      statusFilter: "Filtro di stato",
      statusFilterHint:
        "L'esportazione porta solo a corrispondere uno stato specifico",
      dateRange: "Gamma di date",
      dateRangeHint: "Esportazione stretta in una finestra di tempo specifica",
      metadataEngagement: "Metadati e impegno",
      metadataEngagementHint:
        "Includere opzionalmente colonne extra per analisi avanzate",
      viewLeadsList: "Visualizza elenco dei lead",
      excelSpreadsheet: "Foglio di calcolo Excel",
      csvFile: "File CSV",
    },
    enums: {
      exportFormat: {
        csv: "CSV",
        xlsx: "Excel",
      },
      leadStatus: {
        new: "Nuovo",
        pending: "Finanziamenti",
        campaignRunning: "Campagna in corso",
        websiteUser: "Utente del Sito",
        newsletterSubscriber: "Iscriviti alla newsletter",
        inContact: "In contatto",
        signedUp: "Firmato",
        subscriptionConfirmed: "Abbonamento Confermato",
        unsubscribed: "Iscrizione annullata",
        bounced: "Bounce",
        invalid: "Non valido",
      },
      leadSource: {
        website: "Sito web",
        socialMedia: "Social Media",
        emailCampaign: "Campagna di email",
        referral: "Inviti",
        csvImport: "Importazione di CSV",
      },
    },
    headers: {
      email: "Email",
      businessName: "Nome di affari",
      contactName: "Nome di contatto",
      phone: "Telefono",
      country: "Paese",
      language: "Lingua",
      status: "Stato",
      source: "Fonte",
      website: "Sito web",
      notes: "Osservazioni",
      campaignStage: "Fase di campagna",
      emailsSent: "Inviare email",
      emailsOpened: "E-mail aperte",
      emailsClicked: "E-mail cliccate",
      lastEmailSent: "Ultimo messaggio",
      lastEngagement: "Ultimo coinvolgimento",
      unsubscribedAt: "Non sottoscritto a",
      createdAt: "Creato a",
      updatedAt: "Aggiornato At",
      lastEngagementAt: "Ultimo coinvolgimento",
      metadata: "Metadati",
      ipAddress: "IP Indirizzo",
      userAgent: "Agente Utente",
      deviceType: "Tipo di dispositivo",
      browser: "Browser",
      os: "OS",
      referralCode: "Codice invito",
    },
  },
  import: {
    tags: {
      import: "Importazione",
      leads: "Contatti",
      csv: "CSV",
    },

    category: "Importazione dei dati",
    post: {
      title: "Importazione Contatto",
      description: "Importa conduce dal file CSV",
      form: {
        title: "Configurazione dell'importazione",
        description: "Configurare i parametri di importazione del contatto",
      },
      file: {
        label: "File CSV",
        description: "Contenuto del file CSV (base64 codificato)",
        placeholder: "Paste base64 codificato contenuto CSV",
        helpText: "Caricare un file CSV con i dati di contatto",
      },
      fileName: {
        label: "Nome del file",
        description: "Nome del file CSV",
        placeholder: "leads.csv",
        helpText: "Fornire un nome di file descrittivo",
      },
      skipDuplicates: {
        label: "Skip Duplicas",
        description: "Skip lead con indirizzi e-mail duplicati",
        helpText:
          "Abilitare automaticamente saltare gli indirizzi email esistenti",
      },
      updateExisting: {
        label: "Aggiornamento esistente",
        description: "Aggiornare i cavi esistenti con nuovi dati",
        helpText:
          "Abilitare l'aggiornamento dei cavi esistenti invece di saltare",
      },
      defaultCountry: {
        label: "Paese di default",
        description:
          "Paese di default per i conducenti senza paese specificato",
        helpText: "Selezionare il codice paese predefinito",
      },
      defaultLanguage: {
        label: "Lingua di default",
        description: "Lingua predefinita per i cavi senza lingua specificata",
        helpText: "Selezionare il codice di lingua predefinito",
      },
      defaultStatus: {
        label: "Stato di default",
        description: "Stato di default per i cavi importati",
        helpText: "Selezionare lo stato iniziale per nuovi lead",
      },
      defaultCampaignStage: {
        label: "Fase della campagna di default",
        description: "Fase di campagna e-mail predefinita per i lead importati",
        helpText: "Selezionare la fase iniziale della campagna",
      },
      defaultSource: {
        label: "Sorgente di default",
        description: "Attribuzione di origine predefinita per i cavi importati",
        helpText: "Selezionare la fonte di contatto per il monitoraggio",
      },
      useChunkedProcessing: {
        label: "Utilizzare l'elaborazione a righe",
        description: "Elaborare grandi importazioni in blocchi di sfondo",
        helpText: "Abilitare per file con più di 1000 righe",
      },
      batchSize: {
        label: "Dimensione della batch",
        description: "Numero di righe da elaborare per lotto",
        helpText: "Consigliato: 2000 righe per lotto",
      },
      response: {
        batchId: "Batch ID",
        totalRows: "Totale righe",
        successfulImports: "Importazioni di successo",
        failedImports: "Importazioni fallite",
        duplicateEmails: "Duplicare le email",
        errors: "Importa errori",
        summary: "Importazione sommaria",
        isChunkedProcessing: "Utilizzo di Elaborazione Coperta",
        jobId: "Lavoro di fondo ID",
      },
      errors: {
        validation: {
          title: "Errore di convalida",
          description: "Parametri di importazione non validi o formato CSV",
        },
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Autenticazione necessaria per importare i cavi",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Accesso vietato all'importazione di contatto",
        },
        notFound: {
          title: "Non trovato",
          description: "Il file CSV non trovato o non valido",
        },
        conflict: {
          title: "Conflitto",
          description: "conflitto di dati durante l'importazione",
        },
        server: {
          title: "Errore del server",
          description: "Errore del server interno durante l'importazione",
        },
        unknown: {
          title: "Errore sconosciuto",
          description:
            "Un errore sconosciuto si è verificato durante l'importazione",
        },
        network: {
          title: "Errore di rete",
          description: "Errore di rete durante l'importazione",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description:
            "Ci sono cambiamenti non rilevati nel modulo di importazione",
        },
      },
      success: {
        title: "Importazione Iniziata",
        description: "L'importazione di contatto è stata avviata con successo",
      },
      widget: {
        headerTitle: "Importa i lead da CSV",
        exportTemplateButton: "Modello di esportazione",
        importGuideTitle: "Guida all'importazione",
        importGuideSubtitle: "Caricare un file CSV con le seguenti colonne:",
        importGuideNote:
          "Solo {{email}} è richiesto. Tutte le altre colonne sono facoltative e rientreranno alle impostazioni predefinite configurate di seguito.",
        fileRequirementsTitle: "Requisiti di file",
        fileRequirementFormat:
          "Formato: CSV (valori separati da matricola, codificato UTF-8)",
        fileRequirementHeader:
          "La prima riga deve essere la riga dell'intestazione con i nomi delle colonne",
        fileRequirementSize: "Dimensione massima consigliata: 50 MB per upload",
        fileRequirementChunked:
          "Per i file più grandi di ~5 000 righe, abilitare {{chunkedProcessing}} per evitare timeout",
        chunkedProcessingLabel: "Elaborazione cotto",
        downloadTemplateLink: "Scarica il modello CSV",
        loadingText: "Importazione di cavi...",
        backgroundProcessingTitle: "Lavorazione dello sfondo",
        backgroundProcessingNote:
          "Grande importazione in coda come lavoro: {{jobId}}. Elaborazione delle righe {{totalRows}} sullo sfondo.",
        checkJobStatusButton: "Controllare lo stato di lavoro",
        stopJobButton: "Fermati.",
        retryFailedButton: "Retribuzione non riuscita",
        statTotalRows: "Totale righe",
        statImported: "Importato",
        statDuplicates: "Duplicazioni",
        statFailed: "Sfigato",
        viewImportedLeadsButton: "Visualizza Contatto importato",
        retryFailedWithCountButton: "Retry Failed ({{count}})",
        summaryTitle: "Riepilogo",
        summaryNewLeads: "Nuovi Contatto",
        summaryUpdated: "Aggiornato",
        summarySkipped: "Asciugata",
        successRateLabel: "Tasso di successo",
        importErrorsTitle: "Errori di importazione {{count}}",
        errorRowLabel: "Voce {{row}}",
        findLeadButton: "Trova il contatto",
      },
    },
    process: {
      tag: "Processo di importazione",
      post: {
        title: "Process Importa lavori",
        titleShort: "Importazione dei processi",
        description: "Processi in attesa di CSV",
        container: {
          title: "Configurazione dei processi di importazione",
          description: "Configurare i parametri del processo di importazione",
        },
        fields: {
          maxJobsPerRun: {
            label: "Max posti di lavoro per eseguire",
            description:
              "Numero massimo di posti di lavoro da elaborare per ogni esecuzione",
          },
          maxRetriesPerJob: {
            label: "Max Retries per lavoro",
            description: "Numero massimo di ripetizioni per lavoro",
          },
          dryRun: {
            label: "Correre a secco",
            description: "Correre senza apportare modifiche",
          },
          selfTaskId: {
            label: "Compito di auto ID",
            description:
              "Compito interno ID per autopulizia dopo l'elaborazione",
          },
        },
        response: {
          jobsProcessed: "Lavori elaborati",
          totalRowsProcessed: "Totale righe processate",
          successfulImports: "Importazioni di successo",
          failedImports: "Importazioni fallite",
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
          server: {
            title: "Errore del server",
            description:
              "Si è verificato un errore durante l'elaborazione delle importazioni",
          },
          unknown: {
            title: "Errore sconosciuto",
            description: "Si è verificato un errore sconosciuto",
          },
          validation: {
            title: "Errore di convalida",
            description: "Parametri della richiesta non validi",
          },
        },
        success: {
          title: "Elaborazione delle importazioni Completa",
          description: "Importa i lavori trattati con successo",
        },
      },
    },
    widget: {
      header: {
        title: "Importa posti di lavoro",
        newImport: "Nuova Importazione",
      },
      filter: {
        all: "Tutti",
        completed: "Completo",
        failed: "Sfigato",
        pending: "Finanziamenti",
        running: "Esecuzione",
      },
      loading: "Caricamento dei lavori di importazione...",
      empty: {
        title: "Nessun lavoro di importazione trovato",
        withFilter:
          "Provare un filtro diverso o avviare una nuova importazione.",
        withoutFilter: "Inizia la tua prima importazione per vederlo qui.",
        newImport: "Nuova Importazione",
      },
    },
    jobs: {
      jobId: {
        category: "Importazione dei dati",
        tags: {
          leads: "Contatti",
          management: "Gestione",
        },

        get: {
          title: "Ottenere Importa lavoro",
          description:
            "Ottenere i dettagli di un lavoro di importazione specifico",
          actions: {
            retry: "Recuperare",
            stop: "Fermati.",
            viewLeads: "Visualizza Contatto",
          },
          jobId: {
            label: "Lavoro ID",
            description: "Identificatore unico per il lavoro di importazione",
          },
          form: {
            title: "Importa lo stato di lavoro",
            description:
              "Situazione attuale e progresso del lavoro di importazione",
          },
          response: {
            title: "Informazioni sul lavoro",
            description: "Dettagli del lavoro di importazione attuale",
            info: {
              title: "Informazioni sul lavoro",
              description: "Informazioni di base sul lavoro",
            },
            id: {
              content: "Lavoro ID",
            },
            fileName: {
              content: "Nome del file",
            },
            status: {
              content: "Stato di lavoro",
            },
            progress: {
              title: "Importazione dei progressi",
              description: "Progressi attuali dell'importazione e statistiche",
            },
            totalRows: {
              content: "Totale righe",
            },
            processedRows: {
              content: "Righe lavorate",
            },
            successfulImports: {
              content: "Importazioni di successo",
            },
            failedImports: {
              content: "Importazioni fallite",
            },
            duplicateEmails: {
              content: "Duplicare le email",
            },
            configuration: {
              title: "Configurazione del lavoro",
              description: "Impostazioni di configurazione del lavoro attuali",
            },
            currentBatchStart: {
              content: "Inizio Batch attuale",
            },
            batchSize: {
              content: "Dimensione della batch",
            },
            retryCount: {
              content: "Conte di Retry",
            },
            maxRetries: {
              content: "Max Rettori",
            },
            error: {
              content: "Messaggio di errore",
            },
            timestamps: {
              title: "Orari di lavoro",
              description: "Tempi del ciclo di vita del lavoro",
            },
            createdAt: {
              content: "Creato a",
            },
            updatedAt: {
              content: "Aggiornato At",
            },
            startedAt: {
              content: "Iniziato a",
            },
            completedAt: {
              content: "Completo a",
            },
          },
          errors: {
            validation: {
              title: "Errore di convalida",
              description: "Il lavoro fornito ID è invalido",
            },
            unauthorized: {
              title: "Autenticazione richiesta",
              description:
                "Autenticazione necessaria per visualizzare i lavori",
            },
            forbidden: {
              title: "Accesso negato",
              description: "Non hai il permesso di vedere questo lavoro",
            },
            notFound: {
              title: "Lavoro non trovato",
              description:
                "Nessun lavoro di importazione trovato con il fornito ID",
            },
            server: {
              title: "Errore del server",
              description:
                "Si è verificato un errore durante il recupero del lavoro",
            },
            unknown: {
              title: "Errore sconosciuto",
              description: "Si è verificato un errore imprevisto",
            },
            network: {
              title: "Errore di rete",
              description: "Non è possibile connettersi al server",
            },
            unsavedChanges: {
              title: "Modifiche non salvate",
              description: "Hai modifiche non salvate",
            },
            conflict: {
              title: "Conflitto",
              description:
                "Un conflitto si è verificato durante il recupero del lavoro",
            },
          },
          success: {
            title: "Operazione riuscita",
            description: "Importa il lavoro recuperato con successo",
          },
        },
        patch: {
          title: "Aggiornare Importa lavoro",
          description:
            "Aggiornare le impostazioni di configurazione del lavoro di importazione",
          jobId: {
            label: "Lavoro ID",
            description: "Identificatore unico per il lavoro di importazione",
          },
          form: {
            title: "Aggiornare le impostazioni del lavoro",
            description:
              "Modificare la configurazione del lavoro di importazione",
          },
          settings: {
            title: "Impostazioni di lavoro",
            description:
              "Impostazioni di configurazione per il lavoro di importazione",
          },
          batchSize: {
            label: "Dimensione della batch",
            description: "Numero di righe da elaborare in ogni lotto",
            placeholder: "100",
          },
          maxRetries: {
            label: "Max Rettori",
            description:
              "Numero massimo di tentativi di retry per le righe fallite",
            placeholder: "3",
          },
          response: {
            title: "Informazioni sul lavoro aggiornate",
            description: "Dettagli del lavoro di importazione aggiornati",
            info: {
              title: "Informazioni sul lavoro",
              description: "Informazioni di base sul lavoro",
            },
            id: {
              content: "Lavoro ID",
            },
            fileName: {
              content: "Nome del file",
            },
            status: {
              content: "Stato di lavoro",
            },
            progress: {
              title: "Importazione dei progressi",
              description: "Progressi attuali dell'importazione e statistiche",
            },
            totalRows: {
              content: "Totale righe",
            },
            processedRows: {
              content: "Righe lavorate",
            },
            successfulImports: {
              content: "Importazioni di successo",
            },
            failedImports: {
              content: "Importazioni fallite",
            },
            duplicateEmails: {
              content: "Duplicare le email",
            },
            configuration: {
              title: "Configurazione del lavoro",
              description: "Impostazioni di configurazione del lavoro attuali",
            },
            currentBatchStart: {
              content: "Inizio Batch attuale",
            },
            batchSize: {
              content: "Dimensione della batch",
            },
            retryCount: {
              content: "Conte di Retry",
            },
            maxRetries: {
              content: "Max Rettori",
            },
            error: {
              content: "Messaggio di errore",
            },
            timestamps: {
              title: "Orari di lavoro",
              description: "Tempi del ciclo di vita del lavoro",
            },
            createdAt: {
              content: "Creato a",
            },
            updatedAt: {
              content: "Aggiornato At",
            },
            startedAt: {
              content: "Iniziato a",
            },
            completedAt: {
              content: "Completo a",
            },
          },
          errors: {
            validation: {
              title: "Errore di convalida",
              description: "I dati forniti sono invalidi",
            },
            unauthorized: {
              title: "Autenticazione richiesta",
              description: "Autenticazione necessaria per aggiornare i lavori",
            },
            forbidden: {
              title: "Accesso negato",
              description: "Non hai il permesso di aggiornare questo lavoro",
            },
            notFound: {
              title: "Lavoro non trovato",
              description:
                "Nessun lavoro di importazione trovato con il fornito ID",
            },
            server: {
              title: "Errore del server",
              description:
                "Si è verificato un errore durante l'aggiornamento del lavoro",
            },
            unknown: {
              title: "Errore sconosciuto",
              description: "Si è verificato un errore imprevisto",
            },
            network: {
              title: "Errore di rete",
              description: "Non è possibile connettersi al server",
            },
            unsavedChanges: {
              title: "Modifiche non salvate",
              description: "Hai modifiche non salvate",
            },
            conflict: {
              title: "Aggiornamento Conflict",
              description: "Il lavoro è stato modificato da un altro utente",
            },
          },
          success: {
            title: "Operazione riuscita",
            description: "Importare il lavoro aggiornato con successo",
          },
        },
        delete: {
          title: "Eliminare Importa lavoro",
          description: "Eliminare un lavoro di importazione specifico",
          jobId: {
            label: "Lavoro ID",
            description:
              "Identificatore unico per il lavoro di importazione da eliminare",
          },
          form: {
            title: "Eliminare Importa lavoro",
            description:
              "Confermare la cancellazione del lavoro di importazione",
          },
          response: {
            title: "Risultato di cancellazione",
            description: "Risultato dell'operazione di cancellazione",
            success: {
              content: "Stato di successo",
            },
            message: {
              content: "Messaggio di cancellazione",
            },
          },
          errors: {
            validation: {
              title: "Errore di convalida",
              description: "Il lavoro fornito ID è invalido",
            },
            unauthorized: {
              title: "Autenticazione richiesta",
              description: "Autenticazione necessaria per eliminare i lavori",
            },
            forbidden: {
              title: "Accesso negato",
              description: "Non hai il permesso di eliminare questo lavoro",
            },
            notFound: {
              title: "Lavoro non trovato",
              description:
                "Nessun lavoro di importazione trovato con il fornito ID",
            },
            server: {
              title: "Errore del server",
              description:
                "Si è verificato un errore durante la cancellazione del lavoro",
            },
            unknown: {
              title: "Errore sconosciuto",
              description: "Si è verificato un errore imprevisto",
            },
            network: {
              title: "Errore di rete",
              description: "Non è possibile connettersi al server",
            },
            unsavedChanges: {
              title: "Modifiche non salvate",
              description: "Hai modifiche non salvate",
            },
            conflict: {
              title: "Conflitto di cancellazione",
              description:
                "Non è possibile eliminare il lavoro attualmente in fase di elaborazione",
            },
          },
          success: {
            title: "Operazione riuscita",
            description: "Importare il lavoro cancellato con successo",
          },
        },
        retry: {
          category: "Importazione dei dati",
          tags: {
            leads: "Contatti",
            management: "Gestione",
          },

          post: {
            title: "Retry Importa lavoro",
            description: "Recuperare un lavoro di importazione fallito",
            jobId: {
              label: "Lavoro ID",
              description:
                "Identificatore unico per il lavoro di importazione da riprovare",
            },
            form: {
              title: "Retry Importa lavoro",
              description: "Recuperare il lavoro di importazione fallito",
            },
            response: {
              title: "Risultato della ricerca",
              description: "Risultato dell'operazione di riprovazione",
              success: {
                content: "Stato di successo",
              },
              message: {
                content: "Messaggio di riprovazione",
              },
            },
            errors: {
              validation: {
                title: "Errore di convalida",
                description: "Il lavoro fornito ID è invalido",
              },
              unauthorized: {
                title: "Autenticazione richiesta",
                description: "Autenticazione richiesta per riprovare i lavori",
              },
              forbidden: {
                title: "Accesso negato",
                description: "Non hai il permesso di riprovare questo lavoro.",
              },
              notFound: {
                title: "Lavoro non trovato",
                description:
                  "Nessun lavoro di importazione trovato con il fornito ID",
              },
              server: {
                title: "Errore del server",
                description:
                  "Si è verificato un errore durante la riprova del lavoro",
              },
              unknown: {
                title: "Errore sconosciuto",
                description: "Si è verificato un errore imprevisto",
              },
              network: {
                title: "Errore di rete",
                description: "Non è possibile connettersi al server",
              },
              unsavedChanges: {
                title: "Modifiche non salvate",
                description: "Hai modifiche non salvate",
              },
              conflict: {
                title: "Conflitto di riprovazione",
                description:
                  "Non si può riprovare il lavoro che attualmente sta elaborando",
              },
            },
            success: {
              title: "Operazione riuscita",
              description: "Importare il lavoro retribuito con successo",
            },
          },
          widget: {
            title: "Retry Importa lavoro",
            successMessage: "Ricerca di lavoro avviata con successo",
          },
        },
        stop: {
          category: "Importazione dei dati",
          tags: {
            leads: "Contatti",
            management: "Gestione",
          },

          post: {
            title: "Stop Importa lavoro",
            description: "Smettere un lavoro di importazione in esecuzione",
            jobId: {
              label: "Lavoro ID",
              description:
                "Identificatore unico per il lavoro di importazione per arrestare",
            },
            form: {
              title: "Stop Importa lavoro",
              description: "Fermare il lavoro di importazione in esecuzione",
            },
            response: {
              title: "Stop Risultato",
              description: "Risultato dell'operazione di arresto",
              success: {
                content: "Stato di successo",
              },
              message: {
                content: "Stop al messaggio",
              },
            },
            errors: {
              validation: {
                title: "Errore di convalida",
                description: "Il lavoro fornito ID è invalido",
              },
              unauthorized: {
                title: "Autenticazione richiesta",
                description: "Autenticazione necessaria per fermare i lavori",
              },
              forbidden: {
                title: "Accesso negato",
                description: "Non hai il permesso di fermare questo lavoro.",
              },
              notFound: {
                title: "Lavoro non trovato",
                description:
                  "Nessun lavoro di importazione trovato con il fornito ID",
              },
              server: {
                title: "Errore del server",
                description:
                  "Si è verificato un errore durante l'arresto del lavoro",
              },
              unknown: {
                title: "Errore sconosciuto",
                description: "Si è verificato un errore imprevisto",
              },
              network: {
                title: "Errore di rete",
                description: "Non è possibile connettersi al server",
              },
              unsavedChanges: {
                title: "Modifiche non salvate",
                description: "Hai modifiche non salvate",
              },
              conflict: {
                title: "Smettere di Conflitto",
                description:
                  "Non può fermare il lavoro che non è attualmente elaborazione",
              },
            },
            success: {
              title: "Operazione riuscita",
              description:
                "Il lavoro di importazione si è fermato con successo",
            },
          },
          widget: {
            title: "Stop Importa lavoro",
            successMessage: "Lavoro interrotto con successo",
          },
        },
        widget: {
          status: {
            title: "Importa lo stato di lavoro",
            loadingJobStatus: "Caricamento dello stato del lavoro...",
            totalRows: "Totale righe",
            processed: "Elaborazione",
            imported: "Importato",
            failed: "Sfigato",
            duplicates: "Duplicazioni",
            progress: "Progressi",
            configurationTitle: "Configurazione",
            batchSize: "Dimensione della batch",
            batchStart: "Batch Start",
            retries: "Ritiri",
            timestampsTitle: "Lampade da terra",
            created: "Creato",
            started: "Iniziato",
            completed: "Completo",
            jobStatus: {
              enums: {
                csvImportJobStatus: {
                  pending: "Finanziamenti",
                  processing: "Lavorazione",
                  completed: "Completo",
                  failed: "Sfigato",
                },
              },
            },
          },
          retry: {
            title: "Retry Importa lavoro",
            loadingRetrying: "Ripristino del lavoro...",
            successMessage: "Lavoro Retribuito con successo",
            failureMessage: "Retribuzione non riuscita",
            viewJobStatus: "Visualizza lo stato di lavoro",
            viewLeads: "Visualizza Contatto",
          },
          stop: {
            title: "Stop Importa lavoro",
            loadingStopping: "Sto cercando lavoro...",
            successMessage: "Lavoro bloccato con successo",
            failureMessage: "Fermati, fallo.",
            viewLeads: "Visualizza Contatto",
            startNewImport: "Avviare la nuova Importazione",
          },
        },
      },
    },
    status: {
      category: "Importazione dei dati",
      tags: {
        import: "Importazione",
        jobs: "Lavoro",
        list: "Elenco",
      },

      get: {
        title: "Importa lo stato dei lavori",
        description: "Elenca e monitora i lavori di importazione CSV",
        form: {
          title: "Filtri di lavoro",
          description:
            "Filtra i lavori di importazione per stato e impaginazione",
        },
        filters: {
          title: "Filtri",
          description: "Filtra le opzioni per i lavori di importazione",
        },
        status: {
          label: "Stato di lavoro",
          description: "Filtra per lo stato del lavoro",
          placeholder: "Selezionare lo stato",
        },
        limit: {
          label: "Risultati per Pagina",
          description: "Numero di posti di lavoro da restituire",
          placeholder: "50",
        },
        offset: {
          label: "Pagina non trovata",
          description: "Numero di posti di lavoro per saltare",
          placeholder: "0",
        },
        response: {
          title: "Importa posti di lavoro",
          description:
            "Elenco dei lavori di importazione con il loro stato attuale",
          items: {
            title: "Elenco lavori",
          },
        },
        errors: {
          validation: {
            title: "Errore di convalida",
            description: "Parametri del filtro non valido",
          },
          unauthorized: {
            title: "Autenticazione richiesta",
            description:
              "Autenticazione necessaria per visualizzare i lavori di importazione",
          },
          forbidden: {
            title: "Accesso negato",
            description: "Accesso vietato ai lavori di importazione",
          },
          notFound: {
            title: "Non trovato",
            description: "Nessun lavoro di importazione trovato",
          },
          server: {
            title: "Errore del server",
            description:
              "Errore del server interno durante l'acquisizione di lavori",
          },
          unknown: {
            title: "Errore sconosciuto",
            description: "Si è verificato un errore sconosciuto",
          },
          network: {
            title: "Errore di rete",
            description: "Errore di rete durante l'ottenimento di lavori",
          },
          unsavedChanges: {
            title: "Modifiche non salvate",
            description: "Ci sono cambiamenti non rilevati",
          },
          conflict: {
            title: "Conflitto",
            description: "I dati sono in conflitto",
          },
        },
        success: {
          title: "Lavori recuperati",
          description: "Importa l'elenco dei lavori recuperati con successo",
        },
      },
      widget: {
        status: {
          pending: "Finanziamenti",
          running: "Esecuzione",
          completed: "Completo",
          failed: "Sfigato",
          stopped: "Non ci sono.",
        },
        filter: {
          all: "Tutti",
          pending: "Finanziamenti",
          running: "Esecuzione",
          completed: "Completo",
          failed: "Sfigato",
        },
        progress: {
          rows: "righe",
        },
        job: {
          total: "Totale:",
          processed: "Elaborato:",
          ok: "OK:",
          fail: "Fail:",
          created: "Creato:",
          done: "Fatto:",
        },
        header: {
          title: "Importa posti di lavoro",
          newImport: "Nuova Importazione",
        },
        loading: "Caricamento dei lavori di importazione...",
        empty: {
          title: "Nessun lavoro di importazione trovato",
          withFilter:
            "Provare un filtro diverso o avviare una nuova importazione.",
          withoutFilter: "Inizia la tua prima importazione per vederlo qui.",
          newImport: "Nuova Importazione",
        },
      },
    },
    csv: {
      post: {
        title: "Importazione dei dati CSV",
        description:
          "Importa i dati dai file CSV con elaborazione intelligente e validazione",
        form: {
          title: "Configurazione dell'importazione di CSV",
          description:
            "Configurare le impostazioni di importazione CSV per ottenere risultati ottimali",
        },
        fileSection: {
          title: "Caricamento file",
          description:
            "Selezionare il file CSV e specificare il dominio di destinazione",
        },
        file: {
          label: "File CSV",
          description: "Selezionare un file CSV da caricare (max 10MB)",
          placeholder: "Scegliere il file CSV...",
          helpText:
            "Formato supportato: CSV con valori separati da virgola. La prima riga dovrebbe contenere intestazioni di colonna.",
        },
        fileName: {
          label: "Nome del file",
          description:
            "Nome per questa importazione (per il vostro riferimento)",
          placeholder: "ad esempio, gennaio 2024 Leads Import",
        },
        domain: {
          label: "Dominio di importazione",
          description: "Che tipo di dati stai importando?",
          placeholder: "Selezionare il tipo di dati...",
        },
        processingSection: {
          title: "Opzioni di elaborazione",
          description:
            "Configurare il modo in cui i dati devono essere trattati",
        },
        skipDuplicates: {
          label: "Skip Duplicas",
          description: "Salta i record con gli indirizzi e-mail duplicati",
          helpText:
            "Consigliato: Previene importare lo stesso contatto due volte",
        },
        updateExisting: {
          label: "Aggiornamento esistente",
          description: "Aggiorna i record esistenti con nuovi dati da CSV",
          helpText:
            "In caso di incontrollato, i record esistenti saranno lasciati invariati",
        },
        useChunkedProcessing: {
          label: "Lavorazione dello sfondo",
          description: "Elaborare grandi file sullo sfondo",
          helpText: "Consigliato per i file con oltre 500 record",
        },
        batchSize: {
          label: "Dimensione della batch",
          description: "Numero di record da elaborare subito",
          placeholder: "100",
          helpText:
            "I lotti più piccoli sono più stabili, i lotti più grandi sono più veloci",
        },
        defaultsSection: {
          title: "Valori di default (opzionale)",
          description:
            "Impostare i valori di default per i record mancanti queste informazioni",
        },
        defaultCountry: {
          label: "Paese di default",
          description: "Paese per record senza posizione",
          placeholder: "Seleziona il paese...",
        },
        defaultLanguage: {
          label: "Lingua di default",
          description: "Linguaggio per i record senza preferenze linguistiche",
          placeholder: "Seleziona la lingua...",
        },
        response: {
          title: "Risultati dell'importazione",
          description: "Riepilogo dell'operazione di importazione CSV",
          basicResults: {
            title: "Risultati di base",
            description: "Statistiche principali dell'importazione",
          },
          batchId: {
            label: "Batch ID",
          },
          totalRows: {
            label: "Totale righe",
          },
          isChunkedProcessing: {
            label: "Lavorazione dello sfondo",
          },
          jobId: {
            label: "Lavoro ID",
          },
          statistics: {
            title: "Statistiche dell'importazione",
            description:
              "Ripartizione dettagliata dell'operazione di importazione",
          },
          successfulImports: {
            label: "Importazioni di successo",
          },
          failedImports: {
            label: "Importazioni fallite",
          },
          duplicateEmails: {
            label: "Duplicare le email",
          },
          processingTimeMs: {
            label: "Tempo di elaborazione (ms)",
          },
          summary: {
            title: "Importazione sommaria",
            description: "Panoramica dei risultati delle importazioni",
          },
          newRecords: {
            label: "Nuova registrazione",
          },
          updatedRecords: {
            label: "Registrazioni aggiornate",
          },
          skippedDuplicates: {
            label: "Duplica saltata",
          },
          errors: {
            title: "Dettagli di errore",
            row: {
              label: "Voce",
            },
            email: {
              label: "Email",
            },
            error: {
              label: "Errore",
            },
          },
          nextSteps: {
            title: "Prossimo passo",
            item: {
              label: "Prossimo passo",
            },
          },
        },
        errors: {
          validation: {
            title: "Dati di importazione non validi",
            description: "Controlla il tuo file e le impostazioni CSV",
            emptyFile: "Il contenuto del file CSV è richiesto",
            emptyFileName:
              "Si prega di fornire un nome per questa importazione",
            invalidDomain: "Seleziona un dominio di importazione valido",
            invalidBatchSize:
              "La dimensione del batch deve essere compresa tra 10 e 1000",
            fileTooLarge:
              "La dimensione del file supera il limite di 10MB. Considerare l'utilizzo di elaborazione di sfondo.",
          },
          unauthorized: {
            title: "Accesso negato",
            description: "Non hai il permesso di importare i dati",
          },
          fileTooLarge: {
            title: "File Troppo grande",
            description: "Il file selezionato supera il limite massimo di 10MB",
          },
          server: {
            title: "Importazione non riuscita",
            description:
              "Si è verificato un errore durante l'elaborazione della vostra importazione. Per favore, riprovate.",
          },
          network: {
            title: "Errore di rete",
            description:
              "La connessione di rete è fallita durante l'importazione",
          },
          forbidden: {
            title: "Accesso negato",
            description: "Non hai il permesso di eseguire questa importazione",
          },
          notFound: {
            title: "Non trovato",
            description: "Importazione delle risorse non trovate",
          },
          unknown: {
            title: "Errore sconosciuto",
            description: "Si è verificato un errore imprevisto",
          },
          unsavedChanges: {
            title: "Modifiche non salvate",
            description: "Hai modifiche non salvate",
          },
          conflict: {
            title: "Conflitto dei dati",
            description: "Un conflitto si è verificato con i dati esistenti",
          },
        },
        success: {
          title: "Importazione di successo",
          description: "I dati CSV sono stati importati con successo",
        },
      },
    },
    enum: {
      status: {
        pending: {
          label: "Finanziamenti",
          description: "Il lavoro è in attesa di essere elaborato",
        },
        processing: {
          label: "Lavorazione",
          description: "Lavoro attualmente in fase di elaborazione",
        },
        completed: {
          label: "Completo",
          description: "Lavoro finito con successo",
        },
        failed: {
          label: "Sfigato",
          description: "Lavoro incontrato un errore",
        },
        cancelled: {
          label: "Annullamento",
          description: "Il lavoro è stato cancellato dall'utente",
        },
        paused: {
          label: "Paused",
          description: "L'elaborazione del lavoro è temporaneamente sospesa",
        },
      },
      domain: {
        leads: {
          label: "Contatti",
          description: "Potenziali clienti e contatti commerciali",
        },
        contacts: {
          label: "Contatti",
          description: "Informazioni generali di contatto e rubrica",
        },
        businessData: {
          label: "Dati aziendali",
          description: "Informazioni aziendali e profili aziendali",
        },
        emails: {
          label: "Elenchi delle email",
          description: "Liste e campagne di email marketing",
        },
        users: {
          label: "Utenti",
          description: "Utenti di sistema e informazioni sugli account",
        },
        templates: {
          label: "Modelli",
          description: "Modelli e contenuti di posta elettronica",
        },
      },
      format: {
        csv: {
          label: "File CSV",
          description: "Valori separati (più comuni)",
        },
        xlsx: {
          label: "File di Excel",
          description: "Foglio di calcolo di Excel Microsoft",
        },
        json: {
          label: "File JSON",
          description: "Dati della Notazione oggetto",
        },
        tsv: {
          label: "File TSV",
          description: "Valori separati dalla scheda",
        },
      },
      processing: {
        immediate: {
          label: "Elaborazione ora",
          description: "Elaborare il file immediatamente (più veloce)",
        },
        background: {
          label: "Sfondo",
          description: "Processo in background (per grandi file)",
        },
        scheduled: {
          label: "Orari più tardi",
          description: "Pianificare l'elaborazione per un determinato momento",
        },
      },
      errorType: {
        validation: {
          label: "Errore di convalida",
          description: "I dati non soddisfano il formato o le regole richieste",
        },
        duplicate: {
          label: "Duplicare i dati",
          description: "Il record esiste già nel sistema",
        },
        format: {
          label: "Formato errore",
          description: "Il formato del file è errato o danneggiato",
        },
        processing: {
          label: "Errore di elaborazione",
          description: "Errore avvenuto durante il trattamento dei dati",
        },
        system: {
          label: "Errore di sistema",
          description: "Errore del sistema interno",
        },
      },
      batchSize: {
        small: {
          label: "Piccolo (50)",
          description: "Migliore per la prova o piccole importazioni",
        },
        medium: {
          label: "Mezzo (100)",
          description: "Raccomandato per la maggior parte delle importazioni",
        },
        large: {
          label: "Grande (250)",
          description: "Buono per file di grandi dimensioni con dati semplici",
        },
        xlarge: {
          label: "Extra Large (500)",
          description: "Per file molto grandi (utenti avanzati)",
        },
      },
    },
    nextSteps: {
      reviewErrors:
        "Verificare i dettagli dell'errore per capire cosa è andato storto",
      checkDuplicates:
        "Considerare la regolazione delle impostazioni di gestione duplicate",
      reviewLeads:
        "Rivedere i tuoi cavi importati nella sezione gestione dei lead",
      startCampaign:
        "Considera di iniziare una campagna e-mail con i tuoi nuovi lead",
      reviewContacts: "Rivedere i contatti importati nella sezione contatti",
      organizeContacts: "Organizza i tuoi contatti in gruppi o tag",
      reviewImported: "Rivedere i dati importati nella sezione pertinente",
      monitorProgress: "Monitorare i progressi nella storia del lavoro",
      checkJobsList:
        "Controllare l'elenco dei lavori per gli aggiornamenti di stato dettagliati",
    },
    errors: {
      cancel: {
        server: "Non ha annullato il lavoro di importazione",
      },
      retry: {
        server: "Non ha riprovato il lavoro di importazione",
      },
      delete: {
        server: "Non è riuscito a eliminare il lavoro di importazione",
      },
      status: {
        server: "Non è riuscito a ottenere lo stato di lavoro",
      },
    },
    error: {
      default: "Si è verificato un errore",
    },
    enums: {
      csvImportJobStatus: {
        pending: "Finanziamenti",
        processing: "Lavorazione",
        completed: "Completo",
        failed: "Sfigato",
      },
      csvImportJobAction: {
        retry: "Recuperare",
        delete: "Elimina",
        stop: "Fermati.",
      },
      importMode: {
        createOnly: "Creare Solo",
        updateOnly: "Aggiornamento Solo",
        createOrUpdate: "Creare o aggiornare",
        skipDuplicates: "Skip Duplicas",
      },
      importFormat: {
        csv: "CSV",
        tsv: "TSV",
        json: "JSON",
      },
      importProcessingType: {
        immediate: "Immediato",
        chunked: "Coperto",
        scheduled: "Programmato",
      },
      importErrorType: {
        validationError: "Errore di convalida",
        duplicateEmail: "Duplicare Email",
        invalidFormat: "Formato non valido",
        missingRequiredField: "Campo richiesto mancante",
        processingError: "Errore di elaborazione",
        systemError: "Errore di sistema",
      },
      batchProcessingStatus: {
        pending: "Finanziamenti",
        processing: "Lavorazione",
        completed: "Completo",
        failed: "Sfigato",
        retrying: "Ripensare",
      },
      importPriority: {
        low: "Basso",
        normal: "Normale",
        high: "Alto.",
        urgent: "Urgente",
      },
      importSource: {
        webUpload: "Caricamento web",
        apiUpload: "Caricamento API",
        scheduledImport: "Importazione pianificata",
        bulkOperation: "Funzionamento della lampadina",
      },
      csvDelimiter: {
        comma: "Comma",
        semicolon: "Semicolon",
        tab: "Scheda",
        pipe: "Pipe",
      },
      importValidationLevel: {
        strict: "Strict",
        moderate: "Moderatore",
        lenient: "Leniente",
      },
      importNotificationType: {
        email: "Email",
        inApp: "L'applicazione",
        webhook: "Webhook",
        none: "Nessuno",
      },
      leadStatus: {
        new: "Nuovo",
        pending: "Finanziamenti",
        campaignRunning: "Campagna in corso",
        websiteUser: "Utente del Sito",
        newsletterSubscriber: "Iscriviti alla newsletter",
        inContact: "In contatto",
        signedUp: "Firmato",
        subscriptionConfirmed: "Abbonamento Confermato",
        unsubscribed: "Iscrizione annullata",
        bounced: "Bounce",
        invalid: "Non valido",
      },
      emailCampaignStage: {
        notStarted: "Non iniziato",
        initial: "Contatto iniziale",
        followup1: "Seguito 1",
        followup2: "Seguito 2",
        followup3: "Seguito 3",
        nurture: "Nurture",
        reactivation: "Riattivazione",
      },
      leadSource: {
        website: "Sito web",
        socialMedia: "Social Media",
        emailCampaign: "Campagna di email",
        referral: "Inviti",
        csvImport: "Importazione di CSV",
      },
    },
  },
  lead: {
    id: {
      category: "Contatti",
      tags: {
        leads: "Contatti",
        management: "Gestione",
      },

      get: {
        title: "Ottieni dettagli di piombo",
        description:
          "Recuperare informazioni dettagliate su un piombo specifico",
        backButton: {
          label: "Ritorno a Contatto",
        },
        editButton: {
          label: "Modifica contatto",
        },
        deleteButton: {
          label: "Eliminare il piombo",
        },
        id: {
          label: "ID del contatto",
          description: "Identificatore unico per il contatto",
        },
        form: {
          title: "Dettagli di piombo Richiesta",
          description:
            "Richiedi i parametri per il recupero delle informazioni sul piombo",
        },
        response: {
          title: "Informazioni di piombo",
          description: "Dettagli completi di piombo e storia",
          basicInfo: {
            title: "Informazioni di base",
            description: "Identificazione e stato del piombo core",
          },
          id: {
            content: "ID del contatto",
          },
          email: {
            content: "Indirizzo email",
          },
          businessName: {
            content: "Nome di affari",
          },
          contactName: {
            content: "Nome di contatto",
          },
          status: {
            content: "Stato del contatto",
          },
          contactDetails: {
            title: "Dettagli di contatto",
            description: "Informazioni e preferenze di contatto",
          },
          phone: {
            content: "Numero di telefono",
          },
          website: {
            content: "Sito web URL",
          },
          country: {
            content: "Paese",
          },
          language: {
            content: "Lingua",
          },
          campaignTracking: {
            title: "Tracciamento della campagna",
            description: "Campagna e-mail e informazioni di tracciamento",
          },
          source: {
            content: "Origine del contatto",
          },
          currentCampaignStage: {
            content: "Fase della campagna attuale",
          },
          emailJourneyVariant: {
            content: "Variante di viaggio email",
          },
          emailsSent: {
            content: "Inviare email",
          },
          lastEmailSentAt: {
            content: "Ultimo messaggio",
          },
          engagement: {
            title: "Metriche dell'engagement",
            description: "Dati di coinvolgimento e interazione e-mail",
          },
          emailsOpened: {
            content: "E-mail aperte",
          },
          emailsClicked: {
            content: "E-mail cliccate",
          },
          lastEngagementAt: {
            content: "Ultimo coinvolgimento",
          },
          unsubscribedAt: {
            content: "Non sottoscritto a",
          },
          conversion: {
            title: "Conversion Tracking",
            description: "Conversione di piombo e tracciamento pietre miliari",
          },
          convertedUserId: {
            content: "Utente convertito ID",
          },
          convertedAt: {
            content: "Convertito in",
          },
          signedUpAt: {
            content: "Iscritti a",
          },
          subscriptionConfirmedAt: {
            content: "Abbonamento confermato",
          },
          metadata: {
            title: "Informazioni aggiuntive",
            description: "Note e metadati",
            content: "Metadati",
          },
          notes: {
            content: "Osservazioni",
          },
          createdAt: {
            content: "Creato a",
          },
          updatedAt: {
            content: "Aggiornato At",
          },
          identity: {
            title: "Dispositivi e identità",
            description:
              "Monitoraggio dell'identità e delle informazioni sui dispositivi",
          },
          ipAddress: {
            content: "IP Indirizzo",
          },
          userAgent: {
            content: "Agente Utente",
          },
          deviceType: {
            content: "Tipo di dispositivo",
          },
          browser: {
            content: "Browser",
          },
          os: {
            content: "Sistema operativo",
          },
          referralCode: {
            content: "Codice invito",
          },
          lifecycle: {
            title: "Ciclo di vita",
            description: "Ulteriori timestamp del ciclo di vita",
          },
          bouncedAt: {
            content: "Bounced At",
          },
          invalidAt: {
            content: "Invalid At",
          },
          campaignStartedAt: {
            content: "La campagna è iniziata",
          },
          linkedLeads: {
            title: "Piombo collegato",
            description: "Piombo identificati come la stessa persona",
            linkedLeadId: {
              content: "Piombo collegato ID",
            },
            linkReason: {
              content: "Motivo di collegamento",
            },
            linkedAt: {
              content: "Linked At",
            },
            email: {
              content: "Email",
            },
            businessName: {
              content: "Nome di affari",
            },
            status: {
              content: "Stato",
            },
            ipAddress: {
              content: "IP Indirizzo",
            },
            userAgent: {
              content: "Agente Utente",
            },
            createdAt: {
              content: "Creato a",
            },
          },
          linkedUsers: {
            title: "Account utente collegato",
            description: "Conti utente associati a questo lead",
            userId: {
              content: "Utente ID",
            },
            linkReason: {
              content: "Motivo di collegamento",
            },
            linkedAt: {
              content: "Linked At",
            },
            email: {
              content: "Email",
            },
            publicName: {
              content: "Nome dell'esposizione",
            },
          },
          referralHistory: {
            title: "Storia del referral",
            description:
              "Codici di riferimento questo piombo cliccato prima di iscriversi",
            code: {
              content: "Codice invito",
            },
            ownerUserId: {
              content: "Titolare del Codice",
            },
            clickedAt: {
              content: "Cliccato su",
            },
          },
        },
        errors: {
          validation: {
            title: "Errore di convalida",
            description: "Il piombo fornito ID è invalido",
          },
          unauthorized: {
            title: "Autenticazione richiesta",
            description:
              "Autenticazione necessaria per accedere ai dettagli del piombo",
          },
          forbidden: {
            title: "Accesso negato",
            description: "Non hai il permesso di vedere questa pista",
          },
          notFound: {
            title: "Piombo non trovato",
            description: "Nessun piombo trovato con il fornito ID",
          },
          server: {
            title: "Errore del server",
            description:
              "Si è verificato un errore durante il recupero dei dettagli del piombo",
          },
          unknown: {
            title: "Errore sconosciuto",
            description: "Si è verificato un errore imprevisto",
          },
          network: {
            title: "Errore di rete",
            description: "Non è possibile connettersi al server",
          },
          unsavedChanges: {
            title: "Modifiche non salvate",
            description: "Hai modifiche non salvate",
          },
          conflict: {
            title: "Conflitto dei dati",
            description: "I dati di piombo sono stati modificati",
          },
        },
        success: {
          title: "Operazione riuscita",
          description: "Dettagli di piombo recuperati con successo",
        },
      },
      patch: {
        title: "Aggiornamento del piombo",
        description: "Aggiornare le informazioni e lo stato di piombo",
        backButton: {
          label: "Torna a Piombo",
        },
        deleteButton: {
          label: "Eliminare il piombo",
        },
        submitButton: {
          label: "Aggiornamento del piombo",
          loadingText: "Aggiornamento di piombo...",
        },
        id: {
          label: "ID del contatto",
          description: "Identificatore unico per il piombo per l'aggiornamento",
        },
        form: {
          title: "Aggiornamento del piombo",
          description: "Modificare le informazioni di piombo",
        },
        updates: {
          title: "Aggiornamenti di piombo",
          description: "Campi da aggiornare",
        },
        basicInfo: {
          title: "Informazioni di base",
          description: "Aggiornare le informazioni sul core lead",
        },
        email: {
          label: "Indirizzo email",
          description: "Indirizzo e-mail di Lead",
          placeholder: "email@example.com",
        },
        businessName: {
          label: "Nome di affari",
          description: "Nome del business",
          placeholder: "Acme Corporation",
        },
        contactName: {
          label: "Nome di contatto",
          description: "Persona di contatto primaria",
          placeholder: "John Doe",
        },
        status: {
          label: "Stato del contatto",
          description: "Situazione attuale del piombo",
          placeholder: "Selezionare lo stato",
        },
        contactDetails: {
          title: "Dettagli di contatto",
          description: "Aggiornare le informazioni di contatto",
        },
        phone: {
          label: "Numero di telefono",
          description: "Numero di telefono di contatto",
          placeholder: "+1234567890",
        },
        website: {
          label: "Sito web",
          description: "Sito web commerciale URL",
          placeholder: "https://example.com",
        },
        country: {
          label: "Paese",
          description: "Paese d'affari",
          placeholder: "Seleziona il paese",
        },
        language: {
          label: "Lingua",
          description: "Lingua preferenziale",
          placeholder: "Seleziona la lingua",
        },
        campaignManagement: {
          title: "Gestione delle campagne",
          description: "Gestire le impostazioni della campagna",
        },
        source: {
          label: "Origine del contatto",
          description: "Origine del piombo",
          placeholder: "Selezionare la sorgente",
        },
        currentCampaignStage: {
          label: "Fase di campagna",
          description: "La fase attuale della campagna email",
          placeholder: "Selezionare la fase",
        },
        additionalDetails: {
          title: "Ulteriori dettagli",
          description: "Note e metadati",
        },
        notes: {
          label: "Osservazioni",
          description: "Note interne sul piombo",
          placeholder: "Aggiungi note qui",
        },
        metadata: {
          label: "Metadati",
          description: "Altri metadati (JSON)",
          placeholder: '{"key": "value"}',
        },
        convertedUserId: {
          label: "Utente convertito ID",
          description: "ID dell'account utente convertito",
          placeholder: "Utente ID",
        },
        subscriptionConfirmedAt: {
          label: "Abbonamento confermato",
          description: "Data in cui l'abbonamento è stato confermato",
          placeholder: "Seleziona una data",
        },
        response: {
          title: "Piombo aggiornato",
          description: "Aggiornamento delle informazioni di piombo",
          basicInfo: {
            title: "Informazioni di base",
            description: "Informazioni di base aggiornate",
          },
          id: {
            content: "ID del contatto",
          },
          email: {
            content: "Indirizzo email",
          },
          businessName: {
            content: "Nome di affari",
          },
          contactName: {
            content: "Nome di contatto",
          },
          status: {
            content: "Stato del contatto",
          },
          contactDetails: {
            title: "Dettagli di contatto",
            description: "Informazioni di contatto aggiornate",
          },
          phone: {
            content: "Numero di telefono",
          },
          website: {
            content: "Sito web URL",
          },
          country: {
            content: "Paese",
          },
          language: {
            content: "Lingua",
          },
          campaignTracking: {
            title: "Tracciamento della campagna",
            description: "Informazioni sulla campagna aggiornate",
          },
          source: {
            content: "Origine del contatto",
          },
          currentCampaignStage: {
            content: "Fase della campagna attuale",
          },
          emailJourneyVariant: {
            content: "Variante di viaggio email",
          },
          emailsSent: {
            content: "Inviare email",
          },
          lastEmailSentAt: {
            content: "Ultimo messaggio",
          },
          engagement: {
            title: "Metriche dell'engagement",
            description: "Dati di impegno e-mail",
          },
          emailsOpened: {
            content: "E-mail aperte",
          },
          emailsClicked: {
            content: "E-mail cliccate",
          },
          lastEngagementAt: {
            content: "Ultimo coinvolgimento",
          },
          unsubscribedAt: {
            content: "Non sottoscritto a",
          },
          conversion: {
            title: "Conversion Tracking",
            description: "Conversion Milestone tracking",
          },
          convertedUserId: {
            content: "Utente convertito ID",
          },
          convertedAt: {
            content: "Convertito in",
          },
          signedUpAt: {
            content: "Iscritti a",
          },
          subscriptionConfirmedAt: {
            content: "Abbonamento confermato",
          },
          metadata: {
            title: "Informazioni aggiuntive",
            description: "Note e metadati",
            content: "Metadati",
          },
          notes: {
            content: "Osservazioni",
          },
          createdAt: {
            content: "Creato a",
          },
          updatedAt: {
            content: "Aggiornato At",
          },
        },
        errors: {
          validation: {
            title: "Errore di convalida",
            description: "I dati forniti sono invalidi",
          },
          unauthorized: {
            title: "Autenticazione richiesta",
            description: "Autenticazione necessaria per aggiornare i cavi",
          },
          forbidden: {
            title: "Accesso negato",
            description: "Non hai il permesso di aggiornare questo comando",
          },
          notFound: {
            title: "Piombo non trovato",
            description: "Nessun piombo trovato con il fornito ID",
          },
          conflict: {
            title: "Aggiornamento Conflict",
            description: "Il comando è stato modificato da un altro utente",
          },
          server: {
            title: "Errore del server",
            description:
              "Si è verificato un errore durante l'aggiornamento del piombo",
          },
          unknown: {
            title: "Errore sconosciuto",
            description: "Si è verificato un errore imprevisto",
          },
          network: {
            title: "Errore di rete",
            description: "Non è possibile connettersi al server",
          },
          unsavedChanges: {
            title: "Modifiche non salvate",
            description: "Hai modifiche non salvate",
          },
        },
        success: {
          title: "Operazione riuscita",
          description: "Piombo aggiornato con successo",
        },
      },
      post: {
        title: "[id]",
        description: "[id] endpoint",
        form: {
          title: "Configurazione",
          description: "Configurare i parametri [id]",
        },
        response: {
          title: "Risposta",
          description: "[id] dati di risposta",
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
        },
        success: {
          title: "Operazione riuscita",
          description: "Operazione completata",
        },
      },
      enums: {
        leadStatus: {
          new: "Nuovo",
          pending: "Finanziamenti",
          campaignRunning: "Campagna in corso",
          websiteUser: "Utente del Sito",
          newsletterSubscriber: "Iscriviti alla newsletter",
          inContact: "In contatto",
          signedUp: "Firmato",
          subscriptionConfirmed: "Abbonamento Confermato",
          unsubscribed: "Iscrizione annullata",
          bounced: "Bounce",
          invalid: "Non valido",
        },
        leadSource: {
          website: "Sito web",
          referral: "Inviti",
          socialMedia: "Social Media",
          emailCampaign: "Campagna di email",
          csvImport: "Importazione di CSV",
          api: "API",
          manual: "Manuale",
          other: "Altro",
        },
        emailCampaignStage: {
          notStarted: "Non iniziato",
          initial: "Contatto iniziale",
          followup1: "Seguito 1",
          followup2: "Seguito 2",
          followup3: "Seguito 3",
          nurture: "Nurture",
          reactivation: "Riattivazione",
        },
        emailJourneyVariant: {
          uncensoredConvert: "Conversione ai modelli senza censura",
          sideHustle: "Hustle laterali",
          quietRecommendation: "Raccomandazioni silenziose",
        },
      },
      widget: {
        loading: "Caricamento in corso...",
        notFound: "Piombo non trovato.",
        back: "Indietro",
        leadFallbackTitle: "Contatto",
        edit: "Modifica",
        delete: "Elimina",
        converted: "Convertito",
        quickActions: "Azioni rapide",
        editLead: "Modifica contatto",
        sendTestEmail: "Inviare la prova",
        viewInSearch: "Vedi in Ricerca",
        userProfile: "Profilo utente",
        userDetail: "Dettaglio utente",
        creditHistory: "Storia del credito",
        campaignFunnel: "Imbuto di campagna",
        sourceLabel: "Fonte:",
        lastEmailLabel: "Ultimo messaggio:",
        campaignPerformance: "Prestazioni della campagna",
        emailsSent: "Inviare email",
        opened: "Aperto",
        clicked: "Cliccato",
        openRate: "Tasso aperto",
        clickRate: "Cliccare sulla tariffa",
        clickToOpenRate: "Tariffa Click to-Open",
        contactDetails: "Dettagli di contatto",
        country: "Paese",
        language: "Lingua",
        engagement: "Engagement",
        emailsOpened: "E-mail aperte",
        emailsClicked: "E-mail cliccate",
        lastEngagement: "Ultimo coinvolgimento",
        unsubscribed: "Iscrizione annullata",
        conversion: "Conversione",
        signedUp: "Firmato",
        convertedAt: "Convertito in",
        subscriptionConfirmed: "Abbonamento Confermato",
        convertedUserId: "Utente convertito ID",
        activeSubscriberSince: "Abbonato attivo da",
        viewUserProfile: "Visualizza profilo utente",
        viewUserDetail: "Visualizza il dettaglio dell'utente",
        notesAndMetadata: "Note e Metadati",
        notes: "Osservazioni",
        metadata: "Metadati",
        created: "Creato",
        lastUpdated: "Ultimo aggiornamento",
        daysOld: "giorni vecchi",
        lastEngaged: "Ultimo fidanzato",
        ago: "fa",
        variant: "Variante:",
        copyEmail: "e-mail",
        copyId: "ID",
        copyPhone: "telefono",
        copyUserId: "utente ID",
        stageNotStarted: "Non iniziato",
        stageInitial: "Iniziativa",
        stageFollowup1: "Seguito 1",
        stageFollowup2: "Seguito 2",
        stageFollowup3: "Seguito 3",
        stageNurture: "Nurture",
        stageReactivation: "Riattivazione",
        tabOverview: "Panoramica",
        tabDetails: "Dettagli",
        tabIdentity: "Identità",
        tabBasic: "Base di base",
        tabCampaign: "Campagna",
        tabAdvanced: "Avanzato",
        deviceIdentity: "Dispositivi e identità",
        ipAddress: "IP Indirizzo",
        userAgent: "Agente Utente",
        deviceType: "Tipo di dispositivo",
        browser: "Browser",
        os: "Sistema operativo",
        referralCode: "Codice invito",
        lifecycleTimestamps: "Ciclo di vita",
        bouncedAt: "Bounced At",
        invalidAt: "Invalid At",
        campaignStartedAt: "La campagna è iniziata",
        linkedLeadsSection: "Piombo collegato",
        linkedLeadsEmpty: "Nessun cavo collegato",
        linkedUsersSection: "Account utente collegato",
        linkedUsersEmpty: "Nessun account utente collegato",
        linkReason: "Motivo di collegamento:",
        linkedAt: "Collegato a:",
        copyIp: "IP",
        copyLinkedLeadId: "piombo ID",
        copyUserId2: "utente ID",
      },
      delete: {
        title: "Eliminare il piombo",
        description: "Eliminare un piombo dal sistema",
        container: {
          title: "Eliminare il piombo",
          description:
            "Sei sicuro di voler eliminare definitivamente questa pista?",
        },
        backButton: {
          label: "Torna a Piombo",
        },
        submitButton: {
          label: "Eliminare il piombo",
          loadingText: "Deleting Lead...",
        },
        actions: {
          delete: "Eliminare il piombo",
          deleting: "Deleting Lead...",
        },
        id: {
          label: "ID del contatto",
          description: "Identificatore unico per il piombo per eliminare",
        },
        errors: {
          validation: {
            title: "Errore di convalida",
            description: "Il piombo fornito ID è invalido",
          },
          unauthorized: {
            title: "Autenticazione richiesta",
            description: "Autenticazione necessaria per eliminare i cavi",
          },
          forbidden: {
            title: "Accesso negato",
            description: "Non hai il permesso di eliminare questo comando",
          },
          notFound: {
            title: "Piombo non trovato",
            description: "Nessun piombo trovato con il fornito ID",
          },
          conflict: {
            title: "Eliminare i conflitti",
            description:
              "Il piombo non può essere cancellato a causa delle dipendenze esistenti",
          },
          server: {
            title: "Errore del server",
            description:
              "Si è verificato un errore durante l'eliminazione del piombo",
          },
          unknown: {
            title: "Errore sconosciuto",
            description: "Si è verificato un errore imprevisto",
          },
          network: {
            title: "Errore di rete",
            description: "Non è possibile connettersi al server",
          },
          unsavedChanges: {
            title: "Modifiche non salvate",
            description: "Hai modifiche non salvate",
          },
        },
        success: {
          title: "Piombo cancellato",
          description: "Il piombo è stato eliminato con successo",
        },
      },
    },
  },
  list: {
    category: "Contatti",
    tags: {
      leads: "Contatti",
      management: "Gestione",
    },

    get: {
      title: "Lista Piombo",
      description: "Recuperare un elenco impaginato di cavi con filtraggio",
      createButton: {
        label: "Crea contatto",
      },
      form: {
        title: "Filtro della lista di contatto",
        description: "Configurare i filtri per l'elenco dei lead",
      },
      actions: {
        refresh: "Aggiorna",
        refreshing: "Raffreddamento...",
      },
      page: {
        label: "Numero della pagina",
        description: "Numero di pagina per paginazione",
        placeholder: "Inserisci il numero di pagina",
      },
      limit: {
        label: "Risultati per Pagina",
        description: "Numero di risultati da mostrare per pagina",
        placeholder: "Limiti di ingresso",
      },
      status: {
        label: "Stato del contatto",
        description: "Filtra per stato di contatto",
        placeholder: "Selezionare lo stato",
      },
      currentCampaignStage: {
        label: "Fase di campagna",
        description: "Filtra per la fase attuale della campagna",
        placeholder: "Selezionare la fase della campagna",
      },
      source: {
        label: "Origine del contatto",
        description: "Filtra per fonte di contatto",
        placeholder: "Selezionare la sorgente",
      },
      country: {
        label: "Paese",
        description: "Filtra per paese",
        placeholder: "Seleziona i paesi",
      },
      language: {
        label: "Lingua",
        description: "Filtra per lingua",
        placeholder: "Seleziona le lingue",
      },
      search: {
        label: "Cerca",
        description: "Ricerca conduce per nome, e-mail o business",
        placeholder: "Inserisci il termine di ricerca",
      },
      searchPagination: {
        title: "Ricerca &amp; Paginazione",
        description: "Controlli di ricerca e impaginazione",
      },
      statusFilters: {
        title: "Stato e filtri per la campagna",
        description: "Filtra per stato, fase di campagna e fonte",
      },
      locationFilters: {
        title: "Filtri di posizione",
        description: "Filtra per paese e lingua",
      },
      sortingOptions: {
        title: "Opzioni di selezione",
        description: "Configurare la selezione dei risultati",
      },
      sortBy: {
        label: "Ordina per",
        description: "Campo per ordinare i risultati da",
        placeholder: "Seleziona il campo di selezione",
      },
      sortOrder: {
        label: "Ordinare",
        description: "Ordinare i risultati",
        placeholder: "Selezionare ordine ordinario",
      },
      response: {
        title: "Guida alla lista di risposta",
        description: "Elenco delle piste con metadati",
        leads: {
          title: "Dettagli del contatto",
          description: "Informazioni individuali sul contatto",
          id: "ID del contatto",
          email: "Indirizzo email",
          businessName: "Nome di affari",
          contactName: "Nome di contatto",
          phone: "Numero di telefono",
          website: "Sito web",
          country: "Paese",
          language: "Lingua",
          status: "Stato",
          source: "Fonte",
          notes: "Osservazioni",
          convertedUserId: "Utente convertito ID",
          convertedAt: "Convertito in",
          signedUpAt: "Iscritti a",
          subscriptionConfirmedAt: "Abbonamento confermato",
          currentCampaignStage: "Fase della campagna attuale",
          emailsSent: "Inviare email",
          lastEmailSentAt: "Ultimo messaggio email inviato",
          unsubscribedAt: "Non sottoscritto a",
          emailsOpened: "E-mail aperte",
          emailsClicked: "E-mail cliccate",
          lastEngagementAt: "L'ultimo incoraggiamento",
          metadata: "Metadati",
          createdAt: "Creato a",
          updatedAt: "Aggiornato At",
        },
        total: "Totale Contatto",
        page: "Pagina corrente",
        limit: "Dimensione della pagina",
        totalPages: "Pagine totali",
      },
      errors: {
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Autenticazione necessaria per elencare i cavi",
        },
        validation: {
          title: "Errore di convalida",
          description: "Parametri del filtro non valido",
        },
        server: {
          title: "Errore del server",
          description:
            "Errore del server interno si è verificato durante l'acquisizione dei cavi",
        },
        unknown: {
          title: "Errore sconosciuto",
          description:
            "Un errore sconosciuto si è verificato durante la cattura di cavi",
        },
        network: {
          title: "Errore di rete",
          description:
            "Errore di rete si è verificato durante l'ottenimento di cavi",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Accesso vietato alla lista di contatto",
        },
        notFound: {
          title: "Non trovato",
          description: "Contatto non trovato",
        },
        conflict: {
          title: "Conflitto",
          description:
            "Il conflitto di dati si è verificato mentre la cattura conduce",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Ci sono modifiche non salvate nella lista di contatto",
        },
      },
      success: {
        title: "Operazione riuscita",
        description: "Elenco di contatto recuperato con successo",
      },
      emptySearch: "Nessun cavo corrisponde ai tuoi filtri",
      emptyState: "Non ci sono ancora piste",
    },
    widget: {
      converted: "Convertito",
      emailsSent: "E-mail {{count}} inviate",
      openRate: "{{percent}} % tasso aperto",
      clicks: "click {{count}}",
      stats: "Stat",
      graphs: "Grafi",
      search: "Cerca",
      export: "Esportazione",
      import: "Importazione",
      batch: "Batch.",
      refresh: "Aggiorna",
      view: "Vista",
      edit: "Modifica",
      delete: "Elimina",
      allSources: "Tutte le fonti",
      clearSearch: "Cancella la ricerca",
      clearStatusFilter: "Filtro di stato trasparente",
      clearSourceFilter: "Filtro sorgente trasparente",
      addLead: "Aggiungi il comando",
      importCsv: "Importazione di CSV",
      pagination: "Pagina {{page}} di {{totalPages}} · {{total}} conduce",
      tabAll: "Tutti",
      tabNew: "Nuovo",
      tabCampaign: "Campagna",
      tabConfirmed: "Confermato",
      tabUnsubscribed: "Iscrizione annullata",
      tabBounced: "Bounce",
      sortNewest: "Nuovo primo",
      sortOldest: "Il primo più vecchio",
      sortEmailsSentHigh: "Email inviate (alto)",
      sortEmailsSentLow: "Email inviate (basso)",
      sortBusinessNameAZ: "Nome di azienda (A-Z)",
      sortBusinessNameZA: "Nome di azienda (Z-A)",
      linkedCount: "{{count}} collegato",
      hasLinkedUser: "Utente",
      referralCode: "Codice di rif.",
    },
  },
  search: {
    category: "Gestione contatti",
    tags: {
      leads: "Contatti",
      search: "Cerca",
    },
    get: {
      title: "Contatto di ricerca",
      description: "Ricerca con filtro e impaginazione",
      form: {
        title: "Modulo di ricerca del piombo",
        description: "Inserisci i criteri di ricerca per trovare i lead",
      },
      search: {
        label: "Ricerca di Query",
        description:
          "Termine di ricerca per filtrare i cavi via e-mail, nome commerciale o note",
        placeholder: "Inserisci il termine di ricerca...",
      },
      status: {
        label: "Filtro di stato",
        description: "Filtro conduce per stato",
      },
      limit: {
        label: "Limiti di risultato",
        description: "Numero massimo di risultati da restituire (1-100)",
      },
      offset: {
        label: "Risultati Offset",
        description: "Numero di risultati per saltare per paginazione",
      },
      response: {
        title: "Risultati della ricerca",
        description: "Risultati di ricerca con i dati di piombo",
        leads: {
          title: "Contatti",
          item: "Contatto",
        },
        total: "Risultati totali",
        hasMore: "Ha più risultati",
      },
      errors: {
        unauthorized: {
          title: "Autenticazione richiesta",
          description: "Autenticazione necessaria per la ricerca dei cavi",
        },
        validation: {
          title: "Errore di convalida",
          description: "Parametri di ricerca non validi forniti",
        },
        server: {
          title: "Errore del server",
          description:
            "Errore del server interno si è verificato durante la ricerca di cavi",
        },
        unknown: {
          title: "Errore sconosciuto",
          description:
            "Un errore sconosciuto si è verificato durante la ricerca conduce",
        },
        network: {
          title: "Errore di rete",
          description:
            "Errore di rete si è verificato durante la ricerca conduce",
        },
        forbidden: {
          title: "Accesso negato",
          description: "Accesso vietato per la ricerca di piombo",
        },
        notFound: {
          title: "Nessun risultato",
          description:
            "Nessun indizi trovato corrispondenti ai criteri di ricerca",
        },
        unsavedChanges: {
          title: "Modifiche non salvate",
          description: "Ci sono modifiche non salvate nel modulo di ricerca",
        },
        conflict: {
          title: "Conflitto",
          description:
            "Il conflitto di dati si è verificato durante la ricerca conduce",
        },
      },
      success: {
        title: "Ricerca completa",
        description: "Ricerca di piombo completata con successo",
      },
    },
    widget: {
      title: "Contatto di ricerca",
      filterLabel: "Filtro:",
      clearFilter: "Azzera",
      noResultsTitle: "Nessun risultato",
      noResultsSubtitle: "Ricerca per e-mail, nome commerciale o telefono",
      createLead: "Crea contatto",
      noLeadsMatchFilter: "Nessun cavo corrisponde ai filtri selezionati.",
      clearFilters: "Cancella filtri",
      loadMore: "Caricare più",
      openRateSuffix: "% aperto",
      noEmails: "nessuna email",
      converted: "Convertito",
      emailsSentSuffix: "inviato",
      copyEmailTitle: "Copia e-mail",
      editLeadTitle: "Modificare il comando",
      deleteLeadTitle: "Eliminare il piombo",
      statusNew: "Nuovo",
      statusPending: "Finanziamenti",
      statusCampaign: "Campagna",
      statusWebUser: "Utente web",
      statusNewsletter: "Newsletter",
      statusInContact: "In contatto",
      statusSignedUp: "Firmato",
      statusSubscribed: "Iscritto",
      statusUnsub: "Soggetto",
      statusBounced: "Bounce",
      statusInvalid: "Non valido",
    },
  },
  stats: {
    title: "Statistiche di contatto",
    description: "Comprehensive conduce statistiche e analisi con dati storici",
    category: "Gestione contatti",
    tags: {
      leads: "Contatti",
      statistics: "Statistiche",
      analytics: "Analisi",
    },
    container: {
      title: "Statistiche Filtri",
      description:
        "Configura i filtri delle statistiche di contatto e visualizza le opzioni",
    },
    refresh: "Aggiorna",
    sections: {
      timeFilters: "Periodo di tempo &amp; data Range",
      comparison: "Impostazioni di confronto",
      leadFilters: "Filtri dei contatti",
      engagement: "Filtri di inserimento",
      conversion: "Filtri di conversione",
      dataCompleteness: "Completamento dei dati",
      additional: "Filtri aggiuntivi",
      searchSort: "Ricerca &amp; Ordinazione",
    },
    timePeriod: {
      label: "Periodo di tempo",
      description:
        "Selezionare il periodo di tempo per aggregare le statistiche",
      hour: "Orario",
      day: "Giorno",
      week: "Rassegna",
      month: "Mese",
      quarter: "Quartiere",
      year: "Anno",
    },
    dateRangePreset: {
      label: "Preset della gamma di data",
      description: "Scegliere un intervallo di date predefinito",
    },
    dateRange: {
      today: "Oggi",
      yesterday:
        "Ieri, ieri, ieri, ieri sera, ieri, ieri, ieri, ieri, ieri, ieri, ieri, ieri, ieri, ieri, ieri, ieri, ieri",
      last7Days: "Ultimi 7 giorni",
      last30Days: "Ultimi 30 giorni",
      last90Days: "Ultimi 90 giorni",
      thisWeek: "Rassegna",
      lastWeek: "Rassegna",
      thisMonth: "Questo mese",
      lastMonth: "Ultimo mese",
      thisQuarter: "Questo quartiere",
      lastQuarter: "Ultimo trimestre",
      thisYear: "Quest'anno",
      lastYear: "Ultimo anno",
      custom: "Gamma personalizzata",
    },
    dateFrom: {
      label: "Data di inizio",
      description: "Data di inizio per le statistiche",
    },
    dateTo: {
      label: "Data di fine",
      description: "Data di scadenza per le statistiche",
    },
    chartType: {
      label: "Tipo di grafico",
      description:
        "Selezionare il tipo di grafico per la visualizzazione dei dati",
      line: "Grafico della linea",
      bar: "Grafico della barra",
      area: "Grafico dell'area",
      pie: "Grafico della torta",
      donut: "Grafico della ciambella",
    },
    includeComparison: {
      label: "Includere il confronto",
      description: "Confrontare con un periodo precedente",
    },
    comparisonPeriod: {
      label: "Periodo di confronto",
      description: "Selezionare il periodo da confrontare",
    },
    status: {
      label: "Stato del contatto",
      description: "Filtra per stato di contatto",
    },
    source: {
      label: "Origine del contatto",
      description: "Filtra per fonte di contatto",
    },
    country: {
      ...regionalCountryNames("it"),
      label: "Paese",
      description: "Filtra per paese",
      all: "Tutti i paesi",
      de: "Germania",
      pl: "Polonia",
      fr: "Francia",
      global: "Globale",
    },
    language: {
      it: "Italiano",
      es: "Spagnolo",
      sk: "Slovacco",
      label: "Lingua",
      description: "Filtra per preferenza di lingua",
      all: "Tutte le lingue",
      en: "Inglese",
      de: "Tedesco",
      pl: "Polacco",
      fr: "Francese",
    },
    campaignStage: {
      label: "Fase di campagna",
      description: "Filtra per la fase della campagna email",
    },
    hasEngagement: {
      label: "Ha l'ingaggio",
      description: "Filtro conduce con qualsiasi impegno e-mail",
    },
    minEmailsOpened: {
      label: "E-mail minime aperte",
      description: "Numero minimo di email aperte",
    },
    minEmailsClicked: {
      label: "E-mail minime cliccate",
      description: "Numero minimo di e-mail cliccate",
    },
    isConverted: {
      label: "È convertita",
      description: "Filtro cavi convertiti",
    },
    hasSignedUp: {
      label: "Ha firmato",
      description: "Filtro porta che hanno firmato",
    },
    hasConfirmedSubscription: {
      label: "Ha confermato l'iscrizione",
      description: "Filtro porta con abbonamento confermato",
    },
    hasBusinessName: {
      label: "Ha il nome di affari",
      description: "Filtro porta con nome commerciale",
    },
    hasContactName: {
      label: "Ha il nome di contatto",
      description: "Filtro porta con nome di contatto",
    },
    hasPhone: {
      label: "Ha il telefono",
      description: "Filtro porta con numero di telefono",
    },
    hasWebsite: {
      label: "Ha il sito",
      description: "Filtro porta con sito web",
    },
    hasNotes: {
      label: "Ha note",
      description: "Filtro porta con note",
    },
    sortBy: {
      label: "Ordina per",
      description: "Campo per ordinare i risultati da",
    },
    sortOrder: {
      label: "Ordinare",
      description: "Ordine di attesa o discendente",
    },
    limit: {
      label: "Limite di Risultato",
      description: "Numero massimo di risultati",
    },
    hasUserId: {
      label: "Ha Utente ID",
      description: "Filtro conduce con utente associato ID",
    },
    emailVerified: {
      label: "E-mail verificato",
      description: "Filtra per e-mail stato di verifica",
    },
    journeyVariant: {
      label: "Variante di viaggio",
      description: "Filtra per e-mail variante del viaggio",
    },
    minEmailsSent: {
      label: "E-mail minime Invia",
      description: "Numero minimo di e-mail inviate al comando",
    },
    createdAfter: {
      label: "Creato dopo",
      description: "Filtro porte create dopo questa data",
    },
    createdBefore: {
      label: "Creato prima",
      description: "Filtro porte create prima di questa data",
    },
    updatedAfter: {
      label: "Aggiornato dopo",
      description: "Filtro porte aggiornate dopo questa data",
    },
    updatedBefore: {
      label: "Aggiornato prima",
      description: "Filtro porte aggiornate prima di questa data",
    },
    search: {
      label: "Cerca",
      description: "Ricerca conduce per e-mail, nome o nome commerciale",
      placeholder: "La ricerca porta...",
    },
    engagementLevel: {
      high: "Engagement alto",
      medium: "Engagement medio",
      low: "Basso coinvolgimento",
      none: "Nessun coinvolgimento",
    },
    response: {
      overview: "Panoramica",
      emailPerformance: "Prestazioni e-mail",
      conversionRates: "Tassi di conversione",
      activityTimeline: "Attività Timeline",
      campaignDistribution: "Distribuzione delle campagne",
      geographicDistribution: "Distribuzione geografica e sorgente",
      dataQuality: "Qualità dei dati",
      performanceMetrics: "Misurazioni di prestazione",
      engagementLevels: "Livelli di inserimento",
      conversionFunnel: "Conversione Funnel",
      totalLeads: "Totale Contatto",
      newLeads: "Nuovi Contatto",
      activeLeads: "Contatto attivo",
      inactiveLeads: "Contatto inattivi",
      leadsByStatus: "Contatto per Stato",
      leadsBySource: "Contatto da fonte",
      leadsByCountry: "Contatto per Paese",
      leadsByLanguage: "Guida per lingua",
      websiteUserLeads: "Utenti del sito web",
      newsletterSubscriberLeads: "Iscriviti alla newsletter",
      convertedLeads: "Contatto convertiti",
      consultationBookedLeads: "Consultazione Prenotazione",
      signedUpLeads: "Registrati Leads",
      subscriptionConfirmedLeads: "Abbonamento Confermato",
      unsubscribedLeads: "Contatto non sottoscritto",
      bounces: "Bounce",
      qualifiedLeads: "Contatto qualificate",
      nonQualifiedLeads: "Contatto non Qualificato",
      nurturingLeads: "Contatto di coccolatura",
      engagedLeads: "Contatto Impegnato",
      leadsWithEmailEngagement: "Con Engagement Email",
      leadsWithoutEmailEngagement: "Senza Engagement Email",
      averageEmailEngagementScore: "Avg Email Engagement",
      totalEmailEngagements: "Totale Engagements Email",
      signupRate: "Tasso di iscrizione",
      subscriptionConfirmationRate: "Tasso di conferma dell'iscrizione",
      dataCompletenessRate: "Completamento dei dati",
      leadsWithBusinessName: "Con il nome di affari",
      leadsWithContactName: "Con il nome di contatto",
      leadsWithPhone: "Con il telefono",
      leadsWithWebsite: "Con il sito web",
      leadsWithNotes: "Con le note",
      averageBusinessDataCompleteness: "Completamento dei dati aziendali Avg",
      leadsByCampaignStage: "Contatto per fase di campagna",
      leadsInActiveCampaigns: "In Campagne attive",
      leadsNotInCampaigns: "Non in Campagne",
      recentLeads: "Contatto recenti",
      topLeadsByEngagement: "Top Leads by Engagement",
      mostActiveLeads: "La maggior parte dei lead attivi",
      recentConversions: "Conversioni recenti",
      recentSignups: "Recenti iscrizioni",
      timeSeriesData: "Dati della serie temporale",
      comparisonData: "Dati di confronto",
      averageTimeToConversion: "Avg Tempo di conversione",
      averageTimeToConsultation: "Avg Tempo di consultazione",
      averageTimeToSignup: "Avg tempo per l'iscrizione",
      topPerformingCampaigns: "Le migliori campagne di informazione",
      topPerformingSources: "Principali fonti di informazione",
      topPerformingCountries: "Paesi in via di sviluppo",
      conversionRate: "Tasso di conversione",
      consultationBookingRate: "Consultazione Prenotazione Tasso",
      averageOpenRate: "Tasso medio aperto",
      averageClickRate: "Tasso medio di clic",
      campaignRunningLeads: "In Corsa Campagne",
      bouncedLeads: "Contatto rimbalzato",
      invalidLeads: "Contatto non valido",
      totalEmailsSent: "Totale messaggi di posta elettronica",
      totalEmailsOpened: "E-mail Totale Aperto",
      totalEmailsClicked: "E-mail totali cliccate",
      averageEmailsPerLead: "E-mail medie per contatto",
      leadVelocity: "Velocita' del contatto",
      leadsCreatedToday: "Contatto creati oggi",
      leadsCreatedThisWeek: "Contatto Creato questa settimana",
      leadsCreatedThisMonth: "Contatto Creato Questo Mese",
      leadsUpdatedToday: "Contatto Aggiornato Oggi",
      leadsUpdatedThisWeek: "Contatto Aggiornato Questa settimana",
      leadsUpdatedThisMonth: "Contatto Aggiornato Questo mese",
      leadsByJourneyVariant: "Contatto da viaggio Variant",
      historicalData: "Dati storici",
      groupedStats: "Statistiche raggruppate",
      recentActivity: "Attività recenti",
      metadata: "Relazione informativa",
      generatedAt: "Generato a",
      dataRange: "Gamma di dati",
      data: "Dati statistici",
      campaignName: "Campagna",
      leadsGenerated: "Contatti",
      openRate: "Tasso aperto",
      clickRate: "Cliccare sulla tariffa",
      source: "Fonte",
      qualityScore: "Punteggio di qualità",
      activityType: "Attività",
      email: "Email",
      businessName: "Affari",
      timestamp: "Tempo",
      status: "Stato",
    },
    errors: {
      unauthorized: {
        title: "Accesso non autorizzato",
        description:
          "Autenticazione necessaria per visualizzare le statistiche dei lead",
      },
      validation: {
        title: "Errore di convalida",
        description: "Statistiche non valide richiedono parametri",
      },
      server: {
        title: "Errore del server",
        description:
          "Errore del server interno si è verificato durante il recupero delle statistiche dei lead",
      },
      unknown: {
        title: "Errore sconosciuto",
        description:
          "Un errore inaspettato si è verificato durante l'ottenimento di statistiche",
      },
      network: {
        title: "Errore di rete",
        description:
          "Errore di rete si è verificato durante l'acquisizione delle statistiche",
      },
      forbidden: {
        title: "Accesso negato",
        description: "Accesso vietato per le statistiche dei conducenti",
      },
      notFound: {
        title: "Nessun dato",
        description: "Nessun dato statistico trovato per i criteri specificati",
      },
      conflict: {
        title: "Conflitto",
        description:
          "Il conflitto di dati si è verificato durante la generazione di statistiche",
      },
      unsavedChanges: {
        title: "Modifiche non salvate",
        description: "Ci sono cambiamenti non rilevati nei filtri statistiche",
      },
    },
    success: {
      title: "Statistiche Generazione",
      description: "Statistiche di contatto recuperate con successo",
    },
    widget: {
      title: "Contatto Statistiche",
      refresh: "Aggiorna",
      viewAllLeads: "Visualizza tutti i Contatti",
      searchLeads: "Contatto di ricerca",
      export: "Esportazione",
      import: "Importazione",
      batchUpdate: "Aggiornamento Batch",
      totalLeads: "Totale Contatto",
      activeLeads: "Contatto attivo",
      converted: "Convertito",
      conversionRate: "Tasso di conversione",
      openRate: "Tasso aperto",
      clickRate: "Cliccare sulla tariffa",
      unsubscribeRate: "Tasso di cancellazione",
      newThisMonth: "Nuovo (30d)",
      newLeadsTimeline: "Nuovi lead timeline",
      today: "Oggi",
      thisWeek: "Rassegna",
      thisMonth: "Questo mese",
      conversionFunnel: "Conversione Funnel",
      funnelTotalLeads: "Totale Contatto",
      funnelCampaignRunning: "Campagna in corso",
      funnelSignedUp: "Firmato",
      funnelSubscriptionConfirmed: "Abbonamento Confermato",
      byStatus: "Per Stato",
      clickToFilter: "(clicca per filtrare)",
      bySource: "Per la fonte",
      byCountry: "Per Paese",
      byCampaignStage: "Per la fase della campagna",
      topPerformingCampaigns: "Le migliori campagne di informazione",
      topSources: "Fonti principali",
      viewAll: "Vedi tutto",
      recentActivity: "Attività recenti",
      filters: "Filtri",
      applyFilters: "Applicare filtri",
      openRateSuffix: "% aperto",
      conversionRateSuffix: "%",
      emDash: ", ",
      dateSeparator: "–",
    },
    enums: {
      sortOrder: {
        asc: "Assunzione",
        desc: "Discussione",
      },
      leadSortField: {
        email: "Email",
        businessName: "Nome di affari",
        createdAt: "Data creata",
        updatedAt: "Data aggiornata",
        lastEngagementAt: "Ultimo coinvolgimento",
      },
      leadStatusFilter: {
        all: "Tutti",
        new: "Nuovo",
        pending: "Finanziamenti",
        campaignRunning: "Campagna in corso",
        websiteUser: "Utente del Sito",
        newsletterSubscriber: "Iscriviti alla newsletter",
        inContact: "In contatto",
        signedUp: "Firmato",
        subscriptionConfirmed: "Abbonamento Confermato",
        unsubscribed: "Iscrizione annullata",
        bounced: "Bounce",
        invalid: "Non valido",
      },
      emailCampaignStageFilter: {
        all: "Tutti",
        notStarted: "Non iniziato",
        initial: "Contatto iniziale",
        followup1: "Seguito 1",
        followup2: "Seguito 2",
        followup3: "Seguito 3",
        nurture: "Nurture",
        reactivation: "Riattivazione",
      },
      leadSourceFilter: {
        all: "Tutti",
        website: "Sito web",
        socialMedia: "Social Media",
        emailCampaign: "Campagna di email",
        referral: "Inviti",
        csvImport: "Importazione di CSV",
      },
    },
  },
  tracking: {
    engagement: {
      category: "Tracciamento del piombo",
      tags: {
        tracking: "Tracciamento",
        engagement: "Engagement",
      },
      post: {
        title: "Engagement dei lead record",
        description: "Registra un nuovo evento di fidanzamento per un lead",
        form: {
          title: "Modulo di inserimento del piombo",
          description: "Dettagli di fidanzamento record",
        },
        leadId: {
          label: "ID del contatto",
          description: "Identificatore unico per il contatto",
          placeholder: "Inserisci il comando ID",
          helpText: "UUID del piombo per tracciare il fidanzamento per",
        },
        engagementType: {
          label: "Tipo di inserimento",
          description: "Tipo di evento di fidanzamento",
          placeholder: "Selezionare il tipo di fidanzamento",
          helpText: "Il tipo di interazione o impegno",
        },
        campaignId: {
          label: "Campagna ID",
          description: "Identificatore di campagna associato",
          placeholder: "Entra nella campagna ID",
          helpText: "Campagna opzionale questo impegno fa parte di",
        },
        metadata: {
          label: "Metadati",
          description: "Altri metadati di impegno",
          placeholder: "Inserisci i metadati come JSON",
          helpText: "Dati personalizzati su questo impegno",
        },
        userId: {
          label: "Utente ID",
          description: "Identificatore utente associato",
          placeholder: "Inserisci utente ID",
          helpText: "utente opzionale ID se il piombo è associato a un utente",
        },
        response: {
          id: "Engagement ID",
          leadId: "ID del contatto",
          engagementType: "Tipo di inserimento",
          campaignId: "Campagna ID",
          metadata: "Metadati",
          timestamp: "Timestamp",
          ipAddress: "IP Indirizzo",
          userAgent: "Agente Utente",
          createdAt: "Creato a",
          leadCreated: "Contatto creato",
          relationshipEstablished: "Relazioni Istituite",
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
          },
          unknown: {
            title: "Errore sconosciuto",
            description: "Si è verificato un errore sconosciuto",
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
          network: {
            title: "Errore di rete",
            description: "Si è verificato un errore di rete",
          },
          unsavedChanges: {
            title: "Modifiche non salvate",
            description: "Hai modifiche non salvate",
          },
        },
        success: {
          title: "Engagement registrato",
          description: "Il coinvolgimento dei lead registrato con successo",
        },
      },
      get: {
        title: "Track Lead Click",
        description: "Tracciare il clic del cavo e reindirizzare al target URL",
        form: {
          title: "Fare clic sui parametri di tracciamento",
          description: "Parametri per il tracciamento del clic e reindirizzare",
        },
        id: {
          label: "ID del contatto",
          description: "Identificatore unico per il contatto",
          placeholder: "Inserisci il comando ID",
          helpText: "UUID del cavo per tracciare clicca per",
        },
        stage: {
          label: "Fase di campagna",
          description: "Fase della campagna e-mail",
          placeholder: "Selezionare la fase della campagna",
          helpText: "Fase di campagna opzionale questo clic fa parte di",
        },
        source: {
          label: "Origine del contatto",
          description: "Fonte del piombo",
          placeholder: "Selezionare la sorgente di piombo",
          helpText: "Fonte da cui proviene il piombo",
        },
        url: {
          label: "Obiettivo URL",
          description: "URL per reindirizzare dopo il tracciamento",
          placeholder: "Inserisci il target URL",
          helpText: "La destinazione URL per la redirect",
        },
        ref: {
          label: "Riferimento ID",
          description: "Identificatore di riferimento per il tracciamento",
          placeholder: "Inserisci il riferimento ID",
          helpText:
            "Riferimento opzionale ID per un contesto di tracciamento aggiuntivo",
        },
        response: {
          success: "Operazione riuscita",
          redirectUrl: "Redirect URL",
          leadId: "ID del contatto",
          campaignId: "Campagna ID",
          engagementRecorded: "Engagement registrato",
          leadStatusUpdated: "Stato di piombo aggiornato",
          isLoggedIn: "è in ritardo",
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
          },
          unknown: {
            title: "Errore sconosciuto",
            description: "Si è verificato un errore sconosciuto",
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
          network: {
            title: "Errore di rete",
            description: "Si è verificato un errore di rete",
          },
          unsavedChanges: {
            title: "Modifiche non salvate",
            description: "Hai modifiche non salvate",
          },
        },
        success: {
          title: "Fare clic su Tracciato",
          description: "Piombo click tracciato con successo",
        },
      },
      widget: {
        post: {
          headerTitle: "Registrazione",
          viewStatsTitle: "Visualizza le statistiche di piombo",
          statsButton: "Stat",
          loading: "Registrazione di impegno...",
          successTitle: "Engagement registrato",
          successSubtitle: "tracciato con successo",
          event: "Evento",
          labels: {
            engagementId: "Engagement ID",
            type: "Tipologia",
            leadId: "ID del contatto",
            campaignId: "Campagna ID",
            ipAddress: "IP Indirizzo",
            recordedAt: "Registrato a",
            leadCreated: "Contatto creato",
            leadCreatedYes: "Sì (nuovo comando)",
            leadCreatedNo: "No (esistente)",
            relationshipEst: "Rapporto Est.",
            relationshipYes: "Sì.",
            relationshipNo: "No.",
            metadata: "Metadati",
          },
          nextSteps: "Prossimo passo:",
          viewLeadButton: "Visualizza contatto",
          leadStatsButton: "Statistiche dei contatti",
          emptyTitle: "Tracciare un evento di coinvolgimento",
          emptyDescription:
            "Compila il modulo sottostante e invia per registrare un nuovo evento di fidanzamento per un lead",
          viewLeadStatsButton: "Visualizza le statistiche di piombo",
        },
        get: {
          headerTitle: "Fare clic su Tracciamento",
          viewStatsTitle: "Visualizza le statistiche di piombo",
          statsButton: "Stat",
          loading: "Elaborazione click tracking...",
          successTitle: "Fare clic su Tracciato",
          successSubtitle: "Engagement registrato e reindirizzare URL pronto",
          failTitle: "Rilevamento non corretto",
          failSubtitle: "Non è possibile registrare l'evento click",
          labels: {
            engagementLabel: "Engagement",
            recorded: "Registrato",
            notRecorded: "Non registrato",
            leadStatusLabel: "Stato del contatto",
            updated: "Aggiornato",
            unchanged: "Scambio",
            userLabel: "Utente",
            loggedIn: "Mi sono intrufolato.",
            anonymous: "Anonimo",
            leadId: "ID del contatto",
            campaignId: "Campagna ID",
            redirectUrl: "Redirect URL",
          },
          nextSteps: "Prossimo passo:",
          openUrlButton: "Aprire URL",
          viewLeadButton: "Visualizza contatto",
          leadStatsButton: "Statistiche dei contatti",
          emptyTitle: "Tracciare un evento di clic",
          emptyDescription:
            "Inserisci i parametri di tracciamento qui sotto per registrare un clic e recuperare il reindirizzamento URL",
          viewLeadStatsButton: "Visualizza le statistiche di piombo",
        },
      },
      enums: {
        engagementLevel: {
          high: "Alto.",
          medium: "Mezzo medio",
          low: "Basso",
          none: "Nessuno",
        },
      },
      error: {
        default:
          "Si è verificato un errore durante l'elaborazione del fidanzamento",
      },
    },
    pixel: {
      category: "API Endpoint",
      tags: {
        pixel: "Pixel",
      },
      // Add endpoint-specific translations here
    },
    existing: {
      found: "Trovato il tracciamento di piombo esistente",
    },
    component: {
      initialized: "Componente di tracciamento del piombo inizializzato",
    },
    error: "Errore nel tracciamento del piombo",
    errors: {
      default: "Si è verificato un errore",
      missingId: "Mancanza di tracciamento ID",
      invalidUrl: "Invalid URL",
    },
    data: {
      captured: "Dati di monitoraggio dei lead catturati",
      capture: {
        error: "Catturazione di errore dei dati di tracciamento del piombo",
      },
      retrieve: {
        error: "Recuperare i dati di monitoraggio dei lead",
      },
      loaded: {
        signup: "Dati di tracciamento del piombo caricati per la registrazione",
      },
      load: {
        error: {
          noncritical:
            "Dati di tracciamento del piombo di carico di errore (non critici)",
        },
      },
      stored: "Dati di tracciamento dei lead memorizzati",
      store: {
        error: "Memorizzazione di errore dei dati di tracciamento del piombo",
      },
      cleared: "Dati di tracciamento dei lead cancellati",
      clear: {
        error: "Cancellazione di errore dei dati di tracciamento dei lead",
      },
      format: {
        error: "Formattazione di errore dati di tracciamento",
      },
    },
    params: {
      validate: {
        error: "Param di monitoraggio di errore",
      },
    },
  },
  enums: {
    engagementTypes: {
      emailOpen: "E-mail aperta",
      emailClick: "E-mail cliccata",
      websiteVisit: "Visita del sito web",
      formSubmit: "Sottomissione del modulo",
      leadAttribution: "Attribuzione del lead",
      creditWall: "Crediti esauriti",
      consentDeclined: "Consenso 18+ rifiutato",
    },
    leadStatus: {
      new: "Nuovo",
      pending: "Finanziamenti",
      campaignRunning: "Campagna in corso",
      websiteUser: "Utente del Sito",
      newsletterSubscriber: "Iscriviti alla newsletter",
      inContact: "In contatto",
      signedUp: "Firmato",
      subscriptionConfirmed: "Abbonamento Confermato",
      unsubscribed: "Iscrizione annullata",
      bounced: "Bounce",
      invalid: "Non valido",
    },
    emailCampaignStage: {
      notStarted: "Non iniziato",
      initial: "Contatto iniziale",
      followup1: "Seguito 1",
      followup2: "Seguito 2",
      followup3: "Seguito 3",
      nurture: "Nurture",
      reactivation: "Riattivazione",
    },
    emailStatus: {
      pending: "Finanziamenti",
      sent: "Inviato",
      delivered: "Consegnato",
      opened: "Aperto",
      clicked: "Cliccato",
      bounced: "Bounce",
      failed: "Sfigato",
      unsubscribed: "Iscrizione annullata",
    },
    emailJourneyVariant: {
      uncensoredConvert: "Conversione ai modelli senza censura",
      sideHustle: "Hustle laterali",
      quietRecommendation: "Raccomandazioni silenziose",
      signupNurture: "Nurture di iscrizione",
      retention: "Retenzione",
      winback: "Winback",
      newsletterMay2026: "Newsletter maggio 2026",
      newsletterNov2026: "Newsletter Novembre 2026",
    },
    emailJourneyVariantFilter: {
      all: "Tutti",
      uncensoredConvert: "Conversione ai modelli senza censura",
      sideHustle: "Hustle laterali",
      quietRecommendation: "Raccomandazioni silenziose",
      signupNurture: "Nurture di iscrizione",
      retention: "Retenzione",
      winback: "Winback",
      newsletterMay2026: "Newsletter maggio 2026",
      newsletterNov2026: "Newsletter Novembre 2026",
    },
    sortOrder: {
      asc: "Assunzione",
      desc: "Discussione",
    },
    leadSortField: {
      email: "Email",
      businessName: "Nome di affari",
      createdAt: "Data creata",
      updatedAt: "Data aggiornata",
      lastEngagementAt: "Ultimo coinvolgimento",
    },
    exportFormat: {
      csv: "CSV",
      xlsx: "Excel",
    },
    mimeType: {
      csv: "text/csv",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
    activityType: {
      leadCreated: "Contatto creato",
      leadUpdated: "Aggiornamento del piombo",
      emailSent: "Invia un'email",
      emailOpened: "E-mail aperta",
      emailClicked: "Email Cliccato",
      leadConverted: "Piombo Convertito",
      leadUnsubscribed: "Piombo non soggetto",
    },
    userAssociation: {
      withUser: "Con l'utente",
      withLead: "Con contatto",
      standalone: "Standalone",
      withBoth: "Con entrambi",
    },
    deviceType: {
      desktop: "Desktop",
      mobile: "Mobile",
      tablet: "Tabella",
      bot: "Bot",
      unknown: "Sconosciuto",
    },
    leadSource: {
      website: "Sito web",
      socialMedia: "Social Media",
      emailCampaign: "Campagna di email",
      referral: "Inviti",
      csvImport: "Importazione di CSV",
    },
    leadStatusFilter: {
      all: "Tutti",
      new: "Nuovo",
      pending: "Finanziamenti",
      campaignRunning: "Campagna in corso",
      websiteUser: "Utente del Sito",
      newsletterSubscriber: "Iscriviti alla newsletter",
      inContact: "In contatto",
      signedUp: "Firmato",
      subscriptionConfirmed: "Abbonamento Confermato",
      unsubscribed: "Iscrizione annullata",
      bounced: "Bounce",
      invalid: "Non valido",
    },
    emailCampaignStageFilter: {
      all: "Tutti",
      notStarted: "Non iniziato",
      initial: "Contatto iniziale",
      followup1: "Seguito 1",
      followup2: "Seguito 2",
      followup3: "Seguito 3",
      nurture: "Nurture",
      reactivation: "Riattivazione",
    },
    leadSourceFilter: {
      all: "Tutti",
      website: "Sito web",
      socialMedia: "Social Media",
      emailCampaign: "Campagna di email",
      referral: "Inviti",
      csvImport: "Importazione di CSV",
    },
    batchOperationScope: {
      currentPage: "Pagina corrente",
      allPages: "Tutte le pagine",
    },
    country: {
      ...regionalCountryNames("it"),
      de: "Germania",
      pl: "Polonia",
      fr: "Francia",
      global: "Globale",
    },
    language: {
      it: "Italiano",
      es: "Spagnolo",
      sk: "Slovacco",
      de: "Tedesco",
      pl: "Polacco",
      fr: "Francese",
      en: "Inglese",
    },
    emailProvider: {
      resend: "Resend",
      sendgrid: "SendGrid",
      mailgun: "Mailgun",
      ses: "Amazon SES",
      smtp: "SMTP",
      mailjet: "Mailjet",
      postmark: "Postmark",
      other: "Altro",
    },
  },
  error: {
    general: {
      internal_server_error: "Errore del server interno",
      not_found: "Account o sessione non trovati",
      unauthorized: "Autenticazione richiesta",
      forbidden: "Accesso negato",
      bad_request: "Cattiva richiesta",
      validation_error: "Errore di convalida",
    },
  },
  leadsErrors: {
    batch: {
      update: {
        error: {
          validation: {
            title: "Richiesta di aggiornamento lotto non valido",
          },
          server: {
            title: "Aggiornamento degli errori del server in batch",
          },
          default: "L'aggiornamento degli errori porta in batch",
        },
      },
    },
    leads: {
      get: {
        error: {
          server: {
            title: "Guida per il recupero di errori del server",
            detail: "I cavi di recupero dell'errore del server: {{error}}",
          },
          not_found: {
            title: "Contatto non trovato",
          },
        },
      },
      post: {
        error: {
          duplicate: {
            title: "Piombo con questa e-mail già esiste",
          },
          server: {
            title: "Errore del server che crea piombo",
          },
        },
      },
      patch: {
        error: {
          not_found: {
            title: "Piombo non trovato",
          },
          server: {
            title: "Aggiornamento dell'errore server",
          },
        },
      },
    },
    leadsUnsubscribe: {
      post: {
        success: {
          description: "Con successo non sottoscritta",
        },
        error: {
          validation: {
            title: "Richiesta non valida di cancellazione",
          },
          server: {
            title:
              "L'elaborazione degli errori del server cancella l'iscrizione",
          },
        },
      },
    },
    leadsEngagement: {
      post: {
        error: {
          validation: {
            title: "Dati di fidanzamento non validi",
          },
          server: {
            title: "Registrazione di errore del server",
          },
        },
      },
    },
    leadsExport: {
      get: {
        error: {
          server: {
            title: "Guida all'esportazione di errori del server",
          },
        },
      },
    },
    campaigns: {
      common: {
        error: {
          server: {
            title: "Campagna di elaborazione degli errori del server",
          },
        },
      },
    },
  },
  countries: {
    ...regionalCountryNames("it"),
    global: "Globale",
    de: "Germania",
    pl: "Polonia",
    fr: "Francia",
    us: "Stati Uniti",
  },
  languages: {
    it: "Italiano",
    es: "Spagnolo",
    sk: "Slovacco",
    hi: "Hindi",
    en: "Inglese",
    de: "Tedesco",
    pl: "Polacco",
    fr: "Francese",
  },
};
