import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  widgets: {
    errorBoundary: {
      title: "Qualcosa è andato storto",
      defaultMessage: "Si è verificato un errore imprevisto",
      errorDetails: "Dettagli dell’errore",
    },
    error: {
      title: "Errore",
    },
    chart: {
      noDataAvailable: "Nessun dato disponibile",
      noDataToDisplay: "Nessun dato da mostrare",
    },
    codeQualityFiles: {
      affectedFiles: "File interessati",
      andMoreFiles: "... e altri {{count}} file",
    },
    codeQualityList: {
      noIssues: "Nessun problema rilevato",
    },
    codeQualitySummary: {
      errors: "Errori",
      files: "File",
      issues: "Problemi",
      of: "di",
      summary: "Riepilogo",
    },
    container: {
      noContent: "Nessun contenuto",
    },
    endpointRenderer: {
      cancel: "Annulla",
      submit: "Invia",
      submitting: "Invio in corso...",
      showResults: "Mostra risultati",
      saveChanges: "Salva modifiche",
      saving: "Salvataggio...",
      result: "Risultato",
      fixFields: "Controlla i campi evidenziati e riprova.",
      hiddenInvalid:
        "“{{field}}” manca o non è valido. Ricarica la pagina e riprova.",
    },
    toolUnavailable: {
      permissionTitle: "Non hai accesso a questo strumento",
      permissionMessage:
        "Il tuo ruolo non può aprirlo. Chiedi l’accesso a un proprietario dello spazio.",
      instanceTitle: "Questo strumento non è su questa istanza",
      instanceMessage:
        "Funziona su un’altra istanza collegata. Cambia istanza nella barra laterale per aprirlo.",
      setupTitle: "Questo strumento va prima configurato",
      setupMessage:
        "Manca un’impostazione obbligatoria. Completa la configurazione e riapri lo strumento.",
      unknownTitle: "Questo link non porta a nessuno strumento",
      unknownMessage: "Il link potrebbe essere vecchio o scritto male.",
    },
    recordState: {
      loading: "Caricamento",
      notFoundMessage:
        "Potrebbe essere stato eliminato, oppure il link non è più valido.",
      loadFailed: "Impossibile caricare: {{title}}",
      serverError:
        "Qualcosa è andato storto da parte nostra. Riprova tra un momento.",
      technicalDetails: "Dettagli tecnici",
      moreActions: "Altre azioni",
      more: "Altro",
      confirmCancel: "Annulla",
      details: "Dettagli",
      emptyTitle: "Ancora niente qui",
      copy: "Copia",
    },
    formField: {
      requiresContext: "Questo campo richiede un contesto",
    },
    markdown: {
      noContent: "Nessun contenuto",
    },
    pagination: {
      itemsPerPage: "Elementi per pagina",
      page: "Pagina",
      showing: "Visualizzazione",
    },
    rangeSlider: {
      max: "Massimo",
      min: "Minimo",
    },
    toolCall: {
      creditsUsed_one: "{{count}} credito usato",
      creditsUsed_other: "{{count}} crediti usati",
      actions: {
        confirm: "Conferma",
        deny: "Rifiuta",
        runInBackground: "Esegui in background",
        resumeWhenDone: "Riprendi al termine",
      },
      status: {
        complete: "Completato",
        confirmed: "Confermato",
        confirmedWakeUp: "Confermato, riprendi l’agente",
        deferred: "Rinviato",
        denied: "Rifiutato",
        deniedWakeUp: "Rifiutato, riprendi l’agente",
        error: "Errore",
        executing: "In esecuzione",
        pendingCancellation: "In attesa di annullamento",
        pendingConfirmation: "In attesa di conferma",
        sentToBackground: "Inviato in background",
        waitingForConfirmation: "In attesa di conferma",
        waitingForConfirmationWakeUp: "In attesa di conferma per riprendere",
        waitingForRemote: "In attesa dell’istanza remota",
        wakeUpBackground: "Riprendi in background",
      },
      messages: {
        confirmationRequired: "Conferma necessaria",
        confirmationRequiredWakeUp: "Conferma necessaria per riprendere",
        deferredResult: "Risultato rinviato",
        errorLabel: "Errore",
        executingTool: "Esecuzione dello strumento...",
      },
    },
    formFields: {
      common: {
        enterPhoneNumber: "Inserisci il numero di telefono",
        required: "Obbligatorio",
        selectDate: "Seleziona una data",
        openCalendar: "Apri il calendario",
        time: "Ora",
        startDate: "Data di inizio",
        endDate: "Data di fine",
        decreaseValue: "Diminuisci il valore",
        increaseValue: "Aumenta il valore",
        unknownFieldType: "Tipo di campo sconosciuto",
      },
      entityPicker: {
        change: "Cambia",
        loading: "Caricamento...",
        noItems: "Nessun elemento trovato",
        required: "Obbligatorio",
        select: "Seleziona...",
        selectLabel: "Seleziona {{label}}",
        useToFind: "Trova con {{alias}}",
      },
      markdownTextarea: {
        edit: "Modifica",
        preview: "Anteprima",
        toolbar: {
          blockquote: "Citazione",
          bold: "Grassetto",
          bulletList: "Elenco puntato",
          code: "Codice",
          heading1: "Titolo di livello 1",
          heading2: "Titolo di livello 2",
          heading3: "Titolo di livello 3",
          horizontalRule: "Linea orizzontale",
          italic: "Corsivo",
          link: "Link",
          linkPrompt: "Inserisci l’URL",
          orderedList: "Elenco numerato",
          strike: "Barrato",
        },
      },
    },
  },
  formErrors: {
    required: "Inserisci un valore",
    invalid: "Questo valore non è valido",
    minLength: "Usa almeno {{min}} caratteri",
    maxLength: "Usa al massimo {{max}} caratteri",
    minNumber: "Inserisci {{min}} o più",
    maxNumber: "Inserisci {{max}} o meno",
    minItems: "Aggiungine almeno {{min}}",
    email: "Inserisci un indirizzo email valido",
    url: "Inserisci un link completo, ad esempio https://example.com",
    choose: "Scegli una delle opzioni",
  },
  localstorage: {
    noCallback: "Manca la funzione di callback per l’operazione localStorage",
  },
  apiUtils: {
    errors: {
      // Bare labels - kept placeholder-free for generic rendering.
      http_error: "Errore HTTP",
      validation_error: "Errore di convalida",
      internal_error: "Errore interno",
      auth_required: "Autenticazione richiesta",
      missingUrlParam: "Manca il parametro URL «{{param}}» per {{path}}",
      httpStatus: "La richiesta a {{url}} è fallita con stato {{status}}",
      responseValidation: "Risposta del server non valida: {{error}}",
      malformedResponse: "Risposta da {{url}} in formato non valido",
      recordTimeout:
        "Il caricamento di questa scheda richiede troppo tempo. Riprova.",
      requestFailed: "Richiesta a {{path}} fallita: {{error}}",
      /**
       * `reason` is the endpoint's own declared error-type description, already
       * translated in its scope - this frame only adds the where and the cause.
       */
      endpointFailed: "{{reason}} ({{path}}: {{error}})",
    },
  },
  mutationForm: {
    post: {
      errors: {
        mutation_failed: {
          title: "Aggiornamento fallito",
        },
        validation_error: {
          title: "Errore di convalida",
          detail: "Impossibile convalidare il modulo: {{errors}}",
        },
      },
    },
  },
  queryForm: {
    errors: {
      network_failure: "Errore di rete nel modulo {{formId}}: {{error}}",
      validation_failed: "Convalida fallita",
      validationFailedDetail:
        "Convalida del modulo {{formId}} fallita: {{error}}",
    },
  },
  store: {
    errors: {
      validation_failed: "Convalida fallita",
      request_failed: "Richiesta fallita",
      mutation_failed: "Aggiornamento fallito",
      unexpected_failure: "Errore imprevisto",
      refetch_failed: "Impossibile ricaricare i dati",
    },
    status: {
      loading_data: "Caricamento dei dati...",
      cached_data: "Dati dalla cache",
      success: "Operazione riuscita",
      mutation_pending: "Aggiornamento in corso...",
      mutation_success: "Aggiornamento riuscito",
    },
  },
};
